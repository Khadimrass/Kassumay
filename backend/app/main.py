from collections import defaultdict
from datetime import date
from time import time
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from fastapi.responses import FileResponse

from app.core.database import get_db
from app.models.enfant import Enfant
from app.models.bulletin import Bulletin
from app.models.paiement import Paiement
from app.models.utilisateur import Utilisateur
from app.schemas.enfant_schema import EnfantCreate, EnfantUpdate
from app.schemas.bulletin_schema import BulletinCreate
from app.schemas.paiement_schema import PaiementCreate, PaiementUpdate
from app.schemas.utilisateur_schema import LoginRequest, UtilisateurCreate
from app.core.securite import hash_mot_de_passe, verifier_mot_de_passe, creer_token, get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


os.makedirs("uploads", exist_ok=True)

@app.get("/fichiers/{nom_fichier}")
def lire_fichier(nom_fichier: str,
                 utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    nom = os.path.basename(nom_fichier)  # empêche ../ dans le nom
    chemin = os.path.join("uploads", nom)
    if not os.path.isfile(chemin):
        raise HTTPException(status_code=404, detail="Fichier introuvable")
    return FileResponse(chemin)

EXTENSIONS_AUTORISEES = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}
TAILLE_MAX = 5 * 1024 * 1024  # 5 Mo

@app.post("/upload")
def upload_fichier(fichier: UploadFile = File(...),
                   utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    extension = os.path.splitext(fichier.filename or "")[1].lower()
    if extension not in EXTENSIONS_AUTORISEES:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé")
    contenu = fichier.file.read(TAILLE_MAX + 1)
    if len(contenu) > TAILLE_MAX:
        raise HTTPException(status_code=413, detail="Fichier trop volumineux (5 Mo max)")
    chemin = f"uploads/{uuid.uuid4().hex}{extension}"
    with open(chemin, "wb") as f:
        f.write(contenu)
    return {"url": chemin}

@app.get("/")
def accueil():
    return {"message": "API Kassumay en ligne"}

@app.get("/enfants")
def lister_enfants(db: Session = Depends(get_db),
                   utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    return db.query(Enfant).all()

@app.post("/enfants")
def creer_enfant(enfant_data: EnfantCreate, db: Session = Depends(get_db), utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    nouvel_enfant = Enfant(**enfant_data.model_dump())
    db.add(nouvel_enfant)
    db.commit()
    db.refresh(nouvel_enfant)
    return nouvel_enfant

@app.get("/bulletins")
def lister_bulletins(db: Session = Depends(get_db),
                     utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    return db.query(Bulletin).all()

@app.post("/bulletins")
def creer_bulletins(enfant_data: BulletinCreate, db: Session = Depends(get_db),
                    utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    nouveau_bulletin = Bulletin(**enfant_data.model_dump())
    db.add(nouveau_bulletin)
    db.commit()
    db.refresh(nouveau_bulletin)
    return nouveau_bulletin

@app.get("/paiements")
def lister_paiements(db: Session = Depends(get_db),
                     utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    return db.query(Paiement).all()

@app.post("/paiements")
def creer_paiement(enfant_data: PaiementCreate, db: Session = Depends(get_db),
                   utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    nouveau_paiement = Paiement(**enfant_data.model_dump())
    db.add(nouveau_paiement)
    db.commit()
    db.refresh(nouveau_paiement)
    return nouveau_paiement

@app.put("/paiements/{paiement_id}/payer")
def marquer_paiement_paye(paiement_id: int, db: Session = Depends(get_db),
                          utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    paiement = db.query(Paiement).filter(Paiement.id == paiement_id).first()
    if paiement is None:
        raise HTTPException(status_code=404, detail="Paiement introuvable")
    paiement.statut = "paye"
    paiement.date_paiement = date.today()
    db.commit()
    db.refresh(paiement)
    return paiement

@app.put("/paiements/{paiement_id}")
def modifier_paiement(paiement_id: int, donnees: PaiementUpdate, db: Session = Depends(get_db),
                      utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    paiement = db.query(Paiement).filter(Paiement.id == paiement_id).first()
    if paiement is None:
        raise HTTPException(status_code=404, detail="Paiement introuvable")
    for champ, valeur in donnees.model_dump(exclude_unset=True).items():
        setattr(paiement, champ, valeur)
    if paiement.statut == "paye" and paiement.date_paiement is None:
        paiement.date_paiement = date.today()
    db.commit()
    db.refresh(paiement)
    return paiement

@app.delete("/paiements/{paiement_id}")
def supprimer_paiement(paiement_id: int, db: Session = Depends(get_db),
                       utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    paiement = db.query(Paiement).filter(Paiement.id == paiement_id).first()
    if paiement is None:
        raise HTTPException(status_code=404, detail="Paiement introuvable")
    db.delete(paiement)
    db.commit()
    return {"message": "supprimé"}

# --- Limite des tentatives de connexion (en mémoire : repart à zéro si le serveur redémarre) ---
ECHECS_MAX = 5
FENETRE_SECONDES = 15 * 60
echecs_connexion = defaultdict(list)

def verifier_limite(cle: str):
    maintenant = time()
    recents = [t for t in echecs_connexion[cle] if maintenant - t < FENETRE_SECONDES]
    echecs_connexion[cle] = recents
    if len(recents) >= ECHECS_MAX:
        raise HTTPException(status_code=429, detail="Trop de tentatives. Réessaie dans 15 minutes.")

@app.post("/login")
def login(login_data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "inconnue"
    cle = ip + "|" + login_data.email.strip().lower()
    verifier_limite(cle)

    utilisateur = db.query(Utilisateur).filter(Utilisateur.email == login_data.email).first()

    if not utilisateur or not verifier_mot_de_passe(login_data.mot_de_passe, utilisateur.mot_de_passe_hash):
        echecs_connexion[cle].append(time())
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    echecs_connexion.pop(cle, None)  # connexion réussie : on repart de zéro
    token = creer_token({"sub": str(utilisateur.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/register")
def register(data: UtilisateurCreate, db: Session = Depends(get_db),
             utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    if db.query(Utilisateur).filter(Utilisateur.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    nouvel_utilisateur = Utilisateur(
        email=data.email,
        nom=data.nom,
        role="membre",  # le rôle n'est plus choisi par le client
        mot_de_passe_hash=hash_mot_de_passe(data.mot_de_passe)
    )
    db.add(nouvel_utilisateur)
    db.commit()
    db.refresh(nouvel_utilisateur)
    return {"id": nouvel_utilisateur.id, "email": nouvel_utilisateur.email, "nom": nouvel_utilisateur.nom}

@app.delete("/bulletins/{bulletin_id}")
def supprimer_bulletin(bulletin_id: int, db: Session = Depends(get_db),
                       utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    bulletin = db.query(Bulletin).filter(Bulletin.id == bulletin_id).first()
    if not bulletin:
        raise HTTPException(status_code=404, detail="Bulletin introuvable")
    db.delete(bulletin)
    db.commit()

@app.delete("/bulletins")
def supprimer_tous_bulletins(db: Session = Depends(get_db),
                             utilisateur_connecte: Utilisateur = Depends(get_current_user)):
    db.query(Bulletin).delete()
    db.commit()

@app.put("/enfants/{enfant_id}")
def modifier_enfant(enfant_id: int, donnees: EnfantUpdate,
                    db: Session = Depends(get_db),
                    utilisateur=Depends(get_current_user)):
    enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
    if enfant is None:
        raise HTTPException(status_code=404, detail="Enfant introuvable")
    for champ, valeur in donnees.model_dump(exclude_unset=True).items():
        setattr(enfant, champ, valeur)
    db.commit()
    db.refresh(enfant)
    return enfant


@app.delete("/enfants/{enfant_id}")
def supprimer_enfant(enfant_id: int, db: Session = Depends(get_db),
                     utilisateur=Depends(get_current_user)):
    enfant = db.query(Enfant).filter(Enfant.id == enfant_id).first()
    if enfant is None:
        raise HTTPException(status_code=404, detail="Enfant introuvable")
    db.delete(enfant)
    db.commit()
    return {"message": "supprimé"}