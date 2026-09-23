import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function PageAccueil() {
  const [enfants, setEnfants] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/enfants')
      .then(response => response.json())
      .then(data => setEnfants(data))
  }, [])

  return (
    <div className="page">
      <h1>Liste des enfants</h1>
      <ul className="conteneur-enfants">
        {enfants.map((enfant, index) => (
          <li
            key={enfant.id}
            className="carte-enfant carte-animee"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="photo-enfant-cadre">
              {enfant.photo_url ? (
                <img
                  className="photo-enfant"
                  src={"http://127.0.0.1:8000/" + enfant.photo_url}
                  alt={enfant.nom}
                />
              ) : (
                <div className="photo-enfant photo-enfant-vide">
                  {enfant.nom ? enfant.nom.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <h3>{enfant.nom}</h3>
            <Link to={`/enfant/${enfant.id}`}>
              <button>Voir détails</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PageAccueil