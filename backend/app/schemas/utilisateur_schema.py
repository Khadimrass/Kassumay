from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    mot_de_passe: str

class UtilisateurCreate(BaseModel):
    email: str
    mot_de_passe: str
    nom: str
    role: str