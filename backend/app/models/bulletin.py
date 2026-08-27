from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Bulletin(Base):
    __tablename__ = "bulletins"

    id = Column(Integer, primary_key=True, index=True)
    enfant_id = Column(Integer, ForeignKey("enfants.id"), nullable=False)
    annee_scolaire = Column(String, nullable=False)
    classe = Column(String, nullable=False)
    fichier_bulletin_url = Column(String, nullable=True)
    commentaire = Column(String, nullable=True)

    enfant = relationship("Enfant")