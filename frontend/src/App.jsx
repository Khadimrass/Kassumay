import { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'
import FormulaireEnfant from './FormulaireEnfant'
import FormulairePaiement from './FormulairePaiement'
import FormulaireBulletin from './FormulaireBulletin'

function App() {
  const [enfants, setEnfants] = useState([])
  const [paiements, setPaiements] = useState([])
  const [bulletins, setBulletins] = useState([])
  const [enfantSelectionne, setEnfantSelectionne] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/enfants')
      .then(response => response.json())
      .then(data => setEnfants(data))
  }, [])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/paiements')
      .then(response => response.json())
      .then(data => setPaiements(data))
  }, [])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/bulletins')
      .then(response => response.json())
      .then(data => setBulletins(data))
  }, [])

  function handleNouvelEnfant(nouvelEnfant) {
    setEnfants([...enfants, nouvelEnfant])
  }

  function handleNouveauPaiement(nouveauPaiement) {
    setPaiements([...paiements, nouveauPaiement])
  }

  function handleNouveauBulletin(nouveauBulletin) {
    setBulletins([...bulletins, nouveauBulletin])
  }

  return (
    <div className="app">
      <div className="barre-haut">
        <div className="bloc-login">
          <h4>Connexion</h4>
          <Login />
        </div>
        <div className="bloc-formulaire">
          <h4>Ajouter un enfant</h4>
          <FormulaireEnfant onEnfantCree={handleNouvelEnfant} />
        </div>
      </div>

      <h1>Liste des enfants</h1>
      <ul className="conteneur-enfants">
        {enfants.map(enfant => (
          <li
            key={enfant.id}
            className={
              enfantSelectionne && enfantSelectionne.id === enfant.id
                ? 'carte-enfant selectionnee'
                : 'carte-enfant'
            }
          >
            <h3>{enfant.nom}</h3>
            <button onClick={() => setEnfantSelectionne(enfant)}>Voir détails</button>
          </li>
        ))}
      </ul>

      {enfantSelectionne && (
        <div className="details-enfant">
          <h2>Détails de {enfantSelectionne.nom}</h2>

          <h3>Bulletins</h3>
          <FormulaireBulletin enfantId={enfantSelectionne.id} onBulletinCree={handleNouveauBulletin} />
          <ul className="liste-items">
            {bulletins.filter(b => b.enfant_id === enfantSelectionne.id).map(b => (
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
          <FormulairePaiement enfantId={enfantSelectionne.id} onPaiementCree={handleNouveauPaiement} />
          <ul className="liste-items">
            {paiements.filter(p => p.enfant_id === enfantSelectionne.id).map(p => (
              <li key={p.id} className="item-carte">
                {p.annee_scolaire} - {p.tranche} - {p.montant} FCFA
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App