import { useState } from 'react'

function FormulaireEnfant({ onEnfantCree }) {
  const [nom, setNom] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [typeScolarite, setTypeScolarite] = useState('privee')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)

  function handleSubmit() {
    const token = localStorage.getItem('token')

    if (photo) {
      const formData = new FormData()
      formData.append('fichier', photo)

      fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(dataUpload => {
          creerEnfant(token, dataUpload.url)
        })
    } else {
      creerEnfant(token, null)
    }
  }

  function creerEnfant(token, photoUrl) {
    fetch('http://127.0.0.1:8000/enfants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        nom: nom,
        date_naissance: dateNaissance,
        type_scolarite: typeScolarite,
        description: description,
        photo_url: photoUrl
      })
    })
      .then(response => response.json())
      .then(data => {
        onEnfantCree(data)
        setNom('')
        setDateNaissance('')
        setDescription('')
        setPhoto(null)
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
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      <button onClick={handleSubmit}>Ajouter l'enfant</button>
    </div>
  )
}

export default FormulaireEnfant