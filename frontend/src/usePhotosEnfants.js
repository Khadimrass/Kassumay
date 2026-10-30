import { useState, useEffect } from 'react'
import { apiFetch, estConnecte } from './api'

// Renvoie la liste des photos des enfants (vide si le visiteur n'est pas connecté)
export default function usePhotosEnfants() {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (!estConnecte()) return
    apiFetch('/enfants')
      .then(r => (r.ok ? r.json() : []))
      .then(liste =>
        setPhotos(liste.map(e => e.photo_url).filter(p => p && p !== 'string'))
      )
      .catch(() => {})
  }, [])

  return photos
}
