# Lancer depuis backend/, venv activé :  python importer_enfants.py
from app.core.database import SessionLocal
from app.models.enfant import Enfant
from app.models.bulletin import Bulletin   # noqa (résolution des relations)
from app.models.paiement import Paiement

ANNEE = "2026-2027"
TOTAL_ATTENDU = 1134000
# (prénom, nom, classe, type, inscription, nov, déc, janv, fév, tenues)
# type = hypothèse : "privee" si mensualités, "publique" sinon -> à corriger si besoin
ENFANTS = [
    ("Aissatou", "Gasssama", "CE1", "publique", 10000, 0, 0, 0, 0, 5000),
    ("Diebou", "Ndiaye", "6e", "publique", 10000, 0, 0, 0, 0, 5000),
    ("Jamal", "Dieye", "CM2", "publique", 10000, 0, 0, 0, 0, 5000),
    ("Engenie Sara", "Bassene", "Seconde", "publique", 35000, 0, 0, 0, 0, 0),
    ("Nicolas", "Malou", "6e", "publique", 10000, 0, 0, 0, 0, 5000),
    ("Adama", "Goudiaby", "CE2", "privee", 17000, 17000, 17000, 17000, 17000, 0),
    ("Matar", "Ndiaye", "CE2", "privee", 20000, 10000, 10000, 10000, 10000, 0),
    ("Dieynaba", "Goudiaby", "3e", "publique", 15000, 0, 0, 0, 0, 10000),
    ("Satou", "Badiene", "CE2", "privee", 20000, 10000, 10000, 10000, 10000, 0),
    ("Ibrahima N.", "Goudiaby", "CE2", "privee", 20000, 15000, 15000, 15000, 15000, 0),
    ("Aida", "Goudiaby", "CI", "privee", 20000, 16000, 16000, 16000, 16000, 0),
    ("Bilal", "Goudiaby", "4e", "privee", 35000, 13000, 13000, 13000, 13000, 0),
    ("Fatima", "Djeyla", "P. Section", "privee", 33000, 14000, 14000, 14000, 14000, 0),
    ("Mohamed", "Diallo", "P. Section", "privee", 33000, 14000, 14000, 14000, 14000, 0),
    ("Mouhamed", "Goudiaby", "Garderie", "privee", 29000, 29000, 29000, 29000, 29000, 0),
    ("Yacine", "Goudiaby", "Formation pharmacie", "privee", 115000, 30000, 30000, 30000, 30000, 0),
]
TRANCHES = ["Inscription", "Novembre", "Décembre", "Janvier", "Février", "Tenues"]


def main():
    db = SessionLocal()
    try:
        existants = db.query(Enfant).all()
        if existants:
            rep = input(f"{len(existants)} enfant(s) déjà en base. Les supprimer d'abord ? (oui/non) ")
            if rep.strip().lower() == "oui":
                for e in existants:
                    db.delete(e)   # cascade : bulletins + paiements
                db.commit()
        noms = {e.nom for e in db.query(Enfant).all()}
        ajoutes, total = 0, 0
        for prenom, nom, classe, type_, *montants in ENFANTS:
            complet = f"{prenom} {nom}"
            if complet in noms:
                print("déjà présent :", complet)
                continue
            enfant = Enfant(nom=complet, classe=classe, type_scolarite=type_)
            db.add(enfant)
            db.flush()
            for tranche, montant in zip(TRANCHES, montants):
                if montant:
                    db.add(Paiement(enfant_id=enfant.id, annee_scolaire=ANNEE,
                                    tranche=tranche, montant=float(montant)))
                    total += montant
            ajoutes += 1
        db.commit()
        print(f"{ajoutes} enfants ajoutés, total {total:,} FCFA (attendu {TOTAL_ATTENDU:,})".replace(",", " "))
    finally:
        db.close()


if __name__ == "__main__":
    main()
