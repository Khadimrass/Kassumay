export const API = 'http://127.0.0.1:8000'

export function estConnecte() {
  try {
    return !!localStorage.getItem('token')
  } catch (e) {
    return false
  }
}

// fetch qui ajoute automatiquement le token ; si le serveur répond 401, le token est supprimé
export async function apiFetch(chemin, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...(options.headers || {}) }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const reponse = await fetch(API + chemin, { ...options, headers })
  if (reponse.status === 401) localStorage.removeItem('token')
  return reponse
}
