from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class Enfant(Base):
    __tablename__ = "enfants"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    date_naissance = Column(Date, nullable=False)
    description = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    type_scolarite = Column(String, nullable=False)

    bulletins = relationship("Bulletin", cascade="all, delete-orphan")
    paiements = relationship("Paiement", cascade="all, delete-orphan")