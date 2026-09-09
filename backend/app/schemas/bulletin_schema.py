from pydantic import BaseModel

class BulletinCreate(BaseModel):
    enfant_id: int
    annee_scolaire: str
    classe: str
    fichier_bulletin_url: str | None = None
    commentaire: str | None = None