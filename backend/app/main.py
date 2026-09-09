from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.enfant import Enfant
from app.models.bulletin import Bulletin
from app.models.paiement import Paiement
from app.schemas.enfant_schema import EnfantCreate
from app.schemas.bulletin_schema import BulletinCreate
from app.schemas.paiement_schema import PaiementCreate

app = FastAPI()

@app.get("/")
def accueil():
    return {"message": "API Kassumay en ligne"}

@app.get("/enfants")
def lister_enfants(db: Session = Depends(get_db)):
    return db.query(Enfant).all()

@app.post("/enfants")
def creer_enfant(enfant_data: EnfantCreate, db: Session = Depends(get_db)):
    nouvel_enfant = Enfant(**enfant_data.model_dump())
    db.add(nouvel_enfant)
    db.commit()
    db.refresh(nouvel_enfant)
    return nouvel_enfant

@app.get("/bulletins")
def lister_bulletins(db: Session = Depends(get_db)):
    return db.query(Bulletin).all()

@app.post("/bulletins")
def creer_bulletins(enfant_data: BulletinCreate, db: Session = Depends(get_db)):
    nouveau_bulletin = Bulletin(**enfant_data.model_dump())
    db.add(nouveau_bulletin)
    db.commit()
    db.refresh(nouveau_bulletin)
    return nouveau_bulletin
	
	


@app.get("/paiements")
def lister_paiements(db: Session = Depends(get_db)):
    return db.query(Paiement).all()

@app.post("/paiements")
def creer_paiement(enfant_data: PaiementCreate, db: Session = Depends(get_db)):
    nouveau_paiement = Paiement(**enfant_data.model_dump())
    db.add(nouveau_paiement)
    db.commit()
    db.refresh(nouveau_paiement)
    return nouveau_paiement


