from datetime import date
from pydantic import BaseModel


class EnfantCreate(BaseModel):
    nom: str
    type_scolarite: str
    classe: str | None = None
    date_naissance: date | None = None
    description: str | None = None
    photo_url: str | None = None


class EnfantUpdate(BaseModel):
    nom: str | None = None
    type_scolarite: str | None = None
    classe: str | None = None
    date_naissance: date | None = None
    description: str | None = None
    photo_url: str | None = None
