# Kassumay

Application web de suivi de la scolarité des enfants d'une famille : identité de chaque enfant, bulletins, paiements des frais scolaires (versés et restant à payer), consultables par la famille et par la bienfaitrice qui finance les études.

**Site en ligne :** https://kassumay-z71b.onrender.com
*(l'accès aux données est réservé aux utilisateurs connectés ; le serveur gratuit peut mettre environ une minute à se réveiller)*

## Fonctionnalités

- Profil de chaque enfant : nom, classe, âge, type de scolarité (privée ou publique), description et photo
- Bulletins archivés sous forme de photos
- Paiements par année scolaire et par tranche, avec le total **versé**, le **reste à payer** et le **total prévu**
- Ajout, modification et suppression des paiements ; bouton « Marquer payé » sur les échéances
- Connexion par compte (JWT) ; données et photos visibles uniquement une fois connecté
- Site réactif, avec carousel, section « À propos » et pages séparées (accueil, enfants, détail, connexion, ajout)

## Technologies

| Partie | Outils |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, PostgreSQL |
| Authentification | JWT (python-jose), mots de passe hachés avec bcrypt (passlib) |
| Frontend | React, Vite, React Router, Bootstrap |
| Hébergement | Render (serveur et site), Neon (base PostgreSQL) |

## Structure

```
backend/
  app/
    main.py            routes de l'API
    core/              base de données, sécurité (JWT)
    models/            tables SQLAlchemy
    schemas/           schémas Pydantic
  importer_enfants.py    import de la liste des enfants et des paiements
  importer_echeances.py  import des mensualités restantes
  migrer_fichiers.py     déplace les photos du dossier uploads/ vers la base
  requirements.txt
frontend/
  src/                 pages et composants React
DEPLOIEMENT.md         détail de l'hébergement
```

## Lancer le projet en local

Prérequis : Python 3.12, Node.js 22, Docker.

### 1. Base de données

```bash
docker run --name kassumay-postgres -e POSTGRES_USER=kassumay_user \
  -e POSTGRES_PASSWORD=<mot_de_passe> -e POSTGRES_DB=kassumay_db \
  -p 5432:5432 -d postgres:16
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Linux/macOS : source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # puis remplir les valeurs
uvicorn app.main:app --reload
```

L'API tourne sur http://127.0.0.1:8000 (documentation interactive sur `/docs`). Les tables sont créées au démarrage.

Variables du fichier `backend/.env` (voir `backend/.env.example`) :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | adresse de la base PostgreSQL |
| `SECRET_KEY` | clé secrète des tokens, à générer : `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALLOWED_ORIGINS` | adresses du site autorisées, séparées par des virgules |

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le site est sur http://localhost:5173. La variable `VITE_API_URL` (voir `frontend/.env.example`) indique l'adresse de l'API ; en local, la valeur par défaut est `http://127.0.0.1:8000`.

## Sécurité

- Aucun secret dans le code : `.env` n'est jamais publié (`.gitignore`)
- Toutes les routes de données, les photos et l'envoi de fichiers exigent un token valide
- Création de comptes réservée aux utilisateurs connectés
- Envoi de fichiers limité aux images et PDF, 5 Mo maximum
- Connexion limitée à 5 échecs par 15 minutes (par adresse et par email)

## Déploiement

Voir [DEPLOIEMENT.md](DEPLOIEMENT.md).

## Crédits

Le design s'inspire du modèle gratuit HELPZ de [HTML Codex](https://htmlcodex.com), adapté pour ce projet.

Projet développé par Khadim Dieye.
