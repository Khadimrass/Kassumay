from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, LargeBinary, DateTime
from app.core.database import Base


class Fichier(Base):
    """Photos et bulletins stockés dans la base (le disque des hébergeurs gratuits est temporaire)."""
    __tablename__ = "fichiers"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    type_mime = Column(String, nullable=False)
    contenu = Column(LargeBinary, nullable=False)
    cree_le = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
