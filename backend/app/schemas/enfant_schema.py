from pydantic import BaseModel
from datetime import date

class EnfantCreate(BaseModel):
    nom: str
    date_naissance: date
    description: str | None = None
    photo_url: str | None = None
    type_scolarite: str