import { useState, useEffect } from 'react'
import Login from './Login'
import FormulaireEnfant from './FormulaireEnfant'

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

  return (
    <div>
      <Login />
      <FormulaireEnfant onEnfantCree={handleNouvelEnfant} />
      <h1>Liste des enfants</h1>
      <ul>
        {enfants.map(enfant => (
          <li key={enfant.id}>
            {enfant.nom}
            <button onClick={() => setEnfantSelectionne(enfant)}>Voir détails</button>
          </li>
        ))}
      </ul>
    {enfantSelectionne && (
  <div>
    <h2>Détails de {enfantSelectionne.nom}</h2>

    <h3>Bulletins</h3>
    <ul>
      {bulletins.filter(b => b.enfant_id === enfantSelectionne.id).map(b => (
        <li key={b.id}>{b.annee_scolaire} - {b.classe}</li>
      ))}
    </ul>

    <h3>Paiements</h3>
    <ul>
      {paiements.filter(p => p.enfant_id === enfantSelectionne.id).map(p => (
        <li key={p.id}>{p.annee_scolaire} - {p.tranche} - {p.montant} FCFA</li>
      ))}
    </ul>
  </div>
)}
    </div>
  )
}

export default App