from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.enfant import Enfant
from app.schemas.enfant_schema import EnfantCreate
from app.models.bulletin import Bulletin
from app.models.paiement import Paiement

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