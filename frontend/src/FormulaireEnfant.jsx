import { useState } from 'react'

function FormulaireEnfant({ onEnfantCree }) {
  const [nom, setNom] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [typeScolarite, setTypeScolarite] = useState('privee')

  function handleSubmit() {
    const token = localStorage.getItem('token')

    fetch('http://127.0.0.1:8000/enfants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        nom: nom,
        date_naissance: dateNaissance,
        type_scolarite: typeScolarite
      })
    })
      .then(response => response.json())
      .then(data => {
        onEnfantCree(data)
        setNom('')
        setDateNaissance('')
      })
  }

  return (
    <div>
      <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
      <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} />
      <select value={typeScolarite} onChange={(e) => setTypeScolarite(e.target.value)}>
        <option value="privee">Privée</option>
        <option value="publique">Publique</option>
      </select>
      <button onClick={handleSubmit}>Ajouter l'enfant</button>
    </div>
  )
}

export default FormulaireEnfant