from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.utilisateur import Utilisateur


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_mot_de_passe(mot_de_passe: str) -> str:
    return pwd_context.hash(mot_de_passe)


def verifier_mot_de_passe(mot_de_passe: str, mot_de_passe_hash: str) -> bool:
    return pwd_context.verify(mot_de_passe, mot_de_passe_hash)


SECRET_KEY = "change-moi-plus-tard-avec-une-vraie-cle-secrete"
ALGORITHME = "HS256"
DUREE_TOKEN_MINUTES = 1440

def creer_token(donnees: dict) -> str:
    a_encoder = donnees.copy()
    expiration = datetime.now(timezone.utc) + timedelta(minutes=DUREE_TOKEN_MINUTES)
    a_encoder.update({"exp": expiration})
    return jwt.encode(a_encoder, SECRET_KEY, algorithm=ALGORITHME)
	

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHME])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == int(user_id)).first()
    if not utilisateur:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")

    return utilisateur