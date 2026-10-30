import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, estConnecte } from './api'
import ImageProtegee from './ImageProtegee'

function ListeEnfants({ limite, sousTitre, titre }) {
  const [enfants, setEnfants] = useState([])
  const [connecte, setConnecte] = useState(estConnecte())

  useEffect(() => {
    if (!estConnecte()) {
      setConnecte(false)
      return
    }
    apiFetch('/enfants')
      .then(r => {
        if (!r.ok) {
          setConnecte(false)
          return null
        }
        return r.json()
      })
      .then(data => {
        if (data) setEnfants(data)
      })
      .catch(() => {})
  }, [])

  const affiches = limite ? enfants.slice(0, limite) : enfants

  return (
    <div className="team">
      <div className="container">
        <div className="section-header text-center">
          <p>{sousTitre}</p>
          <h2>{titre}</h2>
        </div>
        {!connecte ? (
          <div className="text-center">
            <p>Cette section est réservée aux membres de la famille.</p>
            <Link className="btn btn-custom" to="/login">Se connecter</Link>
          </div>
        ) : (
          <>
            <div className="row">
              {affiches.map(enfant => (
                <div className="col-lg-3 col-md-6" key={enfant.id}>
                  <div className="team-item">
                    <div className="team-img">
                      {enfant.photo_url && enfant.photo_url !== 'string' ? (
                        <ImageProtegee
                          chemin={enfant.photo_url}
                          alt={enfant.nom}
                          repli={<div className="team-initiale">{enfant.nom ? enfant.nom.charAt(0).toUpperCase() : '?'}</div>}
                        />
                      ) : (
                        <div className="team-initiale">
                          {enfant.nom ? enfant.nom.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div className="team-text">
                      <h2>{enfant.nom}</h2>
                      <p>{enfant.classe ? enfant.classe + ' · ' : ''}{enfant.type_scolarite === 'privee' ? 'École privée' : 'École publique'}</p>
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
          </>
        )}
      </div>
    </div>
  )
}

export default ListeEnfants
