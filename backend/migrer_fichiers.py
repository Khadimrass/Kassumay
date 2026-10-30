# Lancer depuis backend/, venv activé :  python migrer_fichiers.py
# Copie les photos du dossier uploads/ dans la base et met à jour les liens.
# Peut être relancé sans risque : seuls les liens "uploads/..." sont traités.
import os
from app.core.database import SessionLocal, Base, engine
from app.models.enfant import Enfant
from app.models.bulletin import Bulletin
from app.models.paiement import Paiement   # noqa
from app.models.fichier import Fichier

TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
         ".webp": "image/webp", ".pdf": "application/pdf"}


def deplacer(db, lien):
    nom = os.path.basename(lien)
    chemin = os.path.join("uploads", nom)
    extension = os.path.splitext(nom)[1].lower()
    if not os.path.isfile(chemin) or extension not in TYPES:
        print("  introuvable ou type inconnu :", lien)
        return None
    with open(chemin, "rb") as f:
        contenu = f.read()
    fichier = Fichier(nom=nom, type_mime=TYPES[extension], contenu=contenu)
    db.add(fichier)
    db.flush()
    return f"fichiers/{fichier.id}"


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        n = 0
        for enfant in db.query(Enfant).filter(Enfant.photo_url.like("uploads/%")).all():
            nouveau = deplacer(db, enfant.photo_url)
            if nouveau:
                enfant.photo_url = nouveau
                n += 1
        for b in db.query(Bulletin).filter(Bulletin.fichier_bulletin_url.like("uploads/%")).all():
            nouveau = deplacer(db, b.fichier_bulletin_url)
            if nouveau:
                b.fichier_bulletin_url = nouveau
                n += 1
        db.commit()
        print(f"{n} fichier(s) déplacé(s) dans la base.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
