# Déploiement de Kassumay

Site : https://kassumay-z71b.onrender.com
API : https://kassumay-api.onrender.com

Tout est gratuit. Aucun secret n'est écrit dans ce fichier : les valeurs sensibles sont dans les variables d'environnement de Render et dans `backend/.env` (jamais publié).

## Architecture

| Élément | Service | Remarque |
|---|---|---|
| Base de données | Neon (PostgreSQL, région Francfort) | 1 Go, se met en veille après 5 min d'inactivité |
| Serveur (FastAPI) | Render, Web Service gratuit, dossier `backend` | s'endort après 15 min ; ~1 min pour se réveiller |
| Site (React/Vite) | Render, Static Site gratuit, dossier `frontend` | |
| Photos et bulletins | Table `fichiers` dans la base | le disque de Render est temporaire |

## Serveur (Web Service `kassumay-api`)

- Branche : `master` — Root Directory : `backend`
- Build : `pip install -r requirements.txt`
- Start : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Variables d'environnement :
  - `DATABASE_URL` : connection string Neon
  - `SECRET_KEY` : clé aléatoire (`python -c "import secrets; print(secrets.token_hex(32))"`)
  - `ALLOWED_ORIGINS` : adresse du site, sans `/` final
  - `PYTHON_VERSION` : `3.12.3`

## Site (Static Site)

- Branche : `master` — Root Directory : `frontend`
- Build : `npm install && npm run build` — Publish Directory : `dist`
- Variables : `VITE_API_URL` (adresse de l'API, sans `/` final) et `NODE_VERSION` = `22`
- Règle Redirects/Rewrites : `/*` -> `/index.html` (Rewrite)

## Mise à jour

Un `git push` sur `master` redéploie automatiquement le serveur et le site.
Si `VITE_API_URL` change, relancer un déploiement du site (la valeur est fixée au moment du build).

## Données

- Copie locale vers Neon (une seule fois) : `pg_dump ... | psql "$NEON"` depuis le conteneur Docker.
- Les photos d'un ancien dossier `uploads/` se déplacent dans la base avec `backend/migrer_fichiers.py`.
- Les modifications faites sur le site en ligne et celles faites en local sont deux bases séparées.

## Variables locales

Voir `backend/.env.example` et `frontend/.env.example`.
