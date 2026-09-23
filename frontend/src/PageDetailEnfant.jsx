import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FormulaireBulletin from './FormulaireBulletin'
import FormulairePaiement from './FormulairePaiement'

function PageDetailEnfant() {
  const { id } = useParams()
  const enfantId = parseInt(id)

  const [enfant, setEnfant] = useState(null)
  const [bulletins, setBulletins] = useState([])
  const [paiements, setPaiements] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/enfants')
      .then(response => response.json())
      .then(data => {
        const trouve = data.find(e => e.id === enfantId)
        setEnfant(trouve)
      })
  }, [enfantId])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/bulletins')
      .then(response => response.json())
      .then(data => setBulletins(data))
  }, [])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/paiements')
      .then(response => response.json())
      .then(data => setPaiements(data))
  }, [])

  function handleNouveauBulletin(nouveauBulletin) {
    setBulletins([...bulletins, nouveauBulletin])
  }

  function handleNouveauPaiement(nouveauPaiement) {
    setPaiements([...paiements, nouveauPaiement])
  }

  if (!enfant) {
    return <div className="page">Chargement...</div>
  }

  return (
    <div className="page">
      <div className="details-enfant">
        <h2>Détails de {enfant.nom}</h2>

        <h3>Bulletins</h3>
        <FormulaireBulletin enfantId={enfantId} onBulletinCree={handleNouveauBulletin} />
        <ul className="liste-items">
          {bulletins.filter(b => b.enfant_id === enfantId).map(b => (
            <li key={b.id} className="item-carte">
              {b.fichier_bulletin_url && (
                <img
                  src={"http://127.0.0.1:8000/" + b.fichier_bulletin_url}
                  width="50"
                  height="50"
                  alt="bulletin"
                />
              )}
              <span>{b.annee_scolaire} - {b.classe}</span>
            </li>
          ))}
        </ul>

        <h3>Paiements</h3>
        <FormulairePaiement enfantId={enfantId} onPaiementCree={handleNouveauPaiement} />
        <ul className="liste-items">
          {paiements.filter(p => p.enfant_id === enfantId).map(p => (
            <li key={p.id} className="item-carte">
              {p.annee_scolaire} - {p.tranche} - {p.montant} FCFA
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PageDetailEnfant