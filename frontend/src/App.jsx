import { useState, useEffect } from 'react'
import Login from './Login'
import FormulaireEnfant from './FormulaireEnfant'

function App() {
  const [enfants, setEnfants] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/enfants')
      .then(response => response.json())
      .then(data => setEnfants(data))
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
          <li key={enfant.id}>{enfant.nom}</li>
        ))}
      </ul>
    </div>
  )
}

export default App