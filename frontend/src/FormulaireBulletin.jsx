import { useState } from 'react'

function FormulaireBulletin({ enfantId, onBulletinCree }) {
  const [anneeScolaire, setAnneeScolaire] = useState('')
  const [classe, setClasse] = useState('')
  const [commentaire, setCommentaire] = useState('')

  function handleSubmit() {
    const token = localStorage.getItem('token')

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
        commentaire: commentaire
      })
    })
      .then(response => response.json())
      .then(data => {
        onBulletinCree(data)
        setAnneeScolaire('')
        setClasse('')
        setCommentaire('')
      })
  }

  return (
    <div>
      <input type="text" placeholder="Année scolaire" value={anneeScolaire} onChange={(e) => setAnneeScolaire(e.target.value)} />
      <input type="text" placeholder="classe" value={classe} onChange={(e) => setClasse(e.target.value)} />
      <input type="text" placeholder="commentaire" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
      <button onClick={handleSubmit}>bulletin</button>
    </div>
  )
}

export default FormulaireBulletin