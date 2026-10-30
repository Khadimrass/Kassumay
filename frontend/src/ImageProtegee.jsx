import { useState, useEffect } from 'react'
import { apiFetch } from './api'

// Les images sont privées : on les télécharge avec le token puis on les affiche
function ImageProtegee({ chemin, alt, className, width, repli }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let url = null
    let annule = false
    const nom = chemin.split('/').pop()
    apiFetch('/fichiers/' + encodeURIComponent(nom))
      .then(r => (r.ok ? r.blob() : null))
      .then(blob => {
        if (blob && !annule) {
          url = URL.createObjectURL(blob)
          setSrc(url)
        }
      })
      .catch(() => {})
    return () => {
      annule = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [chemin])

  if (!src) return repli || null
  return <img src={src} alt={alt} className={className} width={width} />
}

export default ImageProtegee
