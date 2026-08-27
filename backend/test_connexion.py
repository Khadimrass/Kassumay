from app.core.database import Base, engine
from app.models.enfant import Enfant
from app.models.bulletin import Bulletin
from app.models.paiement import Paiement

Base.metadata.create_all(bind=engine)
print("Tables créées avec succès !")