import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ListeEnfants({ limite, sousTitre, titre }) {
  const [enfants, setEnfants] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/enfants')
      .then(response => response.json())
      .then(data => setEnfants(data))
  }, [])

  const affiches = limite ? enfants.slice(0, limite) : enfants

  return (
    <div className="team">
      <div className="container">
        <div className="section-header text-center">
          <p>{sousTitre}</p>
          <h2>{titre}</h2>
        </div>
        <div className="row">
          {affiches.map(enfant => (
            <div className="col-lg-3 col-md-6" key={enfant.id}>
              <div className="team-item">
                <div className="team-img">
                  {enfant.photo_url && enfant.photo_url !== 'string' ? (
                    <img src={'http://127.0.0.1:8000/' + enfant.photo_url} alt={enfant.nom} />
                  ) : (
                    <div className="team-initiale">
                      {enfant.nom ? enfant.nom.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <div className="team-text">
                  <h2>{enfant.nom}</h2>
                  <p>{enfant.classe ? enfant.classe + " · " : ""}{enfant.type_scolarite === "privee" ? "École privée" : "École publique"}</p>
                  <Link className="btn btn-custom" to={'/enfant/' + enfant.id}>Voir détails</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {limite && enfants.length > limite && (
          <div className="text-center">
            <Link className="btn btn-custom" to="/enfants">Voir tous les enfants</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListeEnfants
