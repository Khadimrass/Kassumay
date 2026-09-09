from datetime import date
from pydantic import BaseModel

class PaiementCreate(BaseModel):
    enfant_id: int
    annee_scolaire: str
    tranche: str
    montant: float
    date_paiement: date | None = None