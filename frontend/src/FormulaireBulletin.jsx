import { useState } from 'react'

function FormulaireBulletin({ enfantId, onBulletinCree }) {
  const [anneeScolaire, setAnneeScolaire] = useState('')
  const [classe, setClasse] = useState('')
  const [commentaire, setCommentaire] = useState('')
  const [fichier, setFichier] = useState(null)

function handleSubmit() {
  const token = localStorage.getItem('token')
  console.log('Valeurs envoyées:', anneeScolaire, classe, commentaire)

  const formData = new FormData()
  formData.append('fichier', fichier)
  // ... reste inchangé
  fetch('http://127.0.0.1:8000/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(dataUpload => {
      // à ce stade, dataUpload.url contient le chemin du fichier

      fetch('http://127.0.0.1:8000/bulletins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          enfant_id: enfantId,
          annee_scolaire: anneeScolaire,
          classe: classe,
          commentaire: commentaire,
          fichier_bulletin_url: dataUpload.url
        })
      })
        .then(response => response.json())
        .then(data => {
          onBulletinCree(data)
          setAnneeScolaire('')
          setClasse('')
          setCommentaire('')
          setFichier(null)
        })
    })
}

  return (
    <div>
      <input type="text" placeholder="Année scolaire" value={anneeScolaire} onChange={(e) => setAnneeScolaire(e.target.value)} />
      <input type="text" placeholder="classe" value={classe} onChange={(e) => setClasse(e.target.value)} />
      <input type="text" placeholder="commentaire" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
      <input type="file" onChange={(e) => setFichier(e.target.files[0])} />
      <button onClick={handleSubmit}>bulletin</button>
    </div>
  )
}

export default FormulaireBulletin