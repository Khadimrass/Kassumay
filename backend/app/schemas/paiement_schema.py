from datetime import date
from typing import Literal
from pydantic import BaseModel, Field


class PaiementCreate(BaseModel):
    enfant_id: int
    annee_scolaire: str
    tranche: str
    montant: float
    date_paiement: date | None = None
    statut: str = "paye"


class PaiementUpdate(BaseModel):
    annee_scolaire: str | None = None
    tranche: str | None = None
    montant: float | None = Field(default=None, ge=0)
    date_paiement: date | None = None
    statut: Literal["paye", "a_payer"] | None = None
