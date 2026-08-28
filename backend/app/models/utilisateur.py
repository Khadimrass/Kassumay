from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    mot_de_passe_hash = Column(String, nullable=False)
    nom = Column(String, nullable=False)
    role = Column(String, nullable=False)