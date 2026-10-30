# Lancer depuis backend/, venv activé :  python importer_echeances.py
# Enregistre les mensualités restantes (mars-juin 2027) avec le statut "a_payer"
from app.core.database import SessionLocal
from app.models.enfant import Enfant
from app.models.bulletin import Bulletin   # noqa
from app.models.paiement import Paiement

ANNEE = "2026-2027"
TOTAL_ATTENDU = 480000
TRANCHES = ["Mars", "Avril", "Mai", "Juin"]
# (nom complet tel qu'enregistré, mars, avril, mai, juin)
ECHEANCES = [
    ("Dieynaba Goudiaby", 30000, 30000, 0, 0),
    ("Satou Badiene", 10000, 10000, 10000, 10000),
    ("Ibrahima N. Goudiaby", 15000, 15000, 15000, 15000),
    ("Aida Goudiaby", 16000, 16000, 16000, 16000),
    ("Matar Ndiaye", 10000, 10000, 10000, 10000),
    ("Bilal Goudiaby", 13000, 13000, 13000, 13000),
    ("Mouhamed Goudiaby", 13000, 13000, 13000, 13000),
    ("Mohamed Diallo", 14000, 14000, 14000, 14000),
    ("Fatima Djeyla", 14000, 14000, 14000, 14000),
]


def main():
    db = SessionLocal()
    try:
        enfants = {e.nom.strip().lower(): e for e in db.query(Enfant).all()}
        total, ajoutes = 0, 0
        for nom, *montants in ECHEANCES:
            enfant = enfants.get(nom.lower())
            if enfant is None:
                print("INTROUVABLE :", nom)
                continue
            for tranche, montant in zip(TRANCHES, montants):
                if not montant:
                    continue
                existe = db.query(Paiement).filter_by(
                    enfant_id=enfant.id, annee_scolaire=ANNEE,
                    tranche=tranche, statut="a_payer").first()
                if existe:
                    continue
                db.add(Paiement(enfant_id=enfant.id, annee_scolaire=ANNEE, tranche=tranche,
                                montant=float(montant), statut="a_payer"))
                total += montant
                ajoutes += 1
        db.commit()
        print(f"{ajoutes} échéances ajoutées, total {total:,} FCFA (attendu {TOTAL_ATTENDU:,})".replace(",", " "))
    finally:
        db.close()


if __name__ == "__main__":
    main()
