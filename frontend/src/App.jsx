import { useState, useEffect } from 'react'

function App() {
  const [enfants, setEnfants] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/enfants')
      .then(response => response.json())
      .then(data => setEnfants(data))
  }, [])

  return (
    <div>
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