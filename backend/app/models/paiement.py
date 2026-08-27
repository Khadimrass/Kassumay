from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Paiement(Base):
    __tablename__ = "paiements"

    id = Column(Integer, primary_key=True, index=True)
    enfant_id = Column(Integer, ForeignKey("enfants.id"), nullable=False)
    annee_scolaire = Column(String, nullable=False)
    tranche = Column(String, nullable=False)
    montant = Column(Float, nullable=False)
    date_paiement = Column(Date, nullable=True)

    enfant = relationship("Enfant")