import { useState } from 'react'

function FormulairePaiement({ onPaiementCree, enfantId }) {
  const [anneeScolaire, setAnneeScolaire] = useState('')
  const [tranche, setTranche] = useState('')
  const [montant, setMontant] = useState('')

  function handleSubmit() {
    const token = localStorage.getItem('token')

    fetch('http://127.0.0.1:8000/paiements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        enfant_id: enfantId,
        annee_scolaire: anneeScolaire,
        tranche: tranche,
        montant: montant
      })
    })
      .then(response => response.json())
      .then(data => {
        onPaiementCree(data)
        setAnneeScolaire('')
        setTranche('')
        setMontant('')
      })
  }

  return (
    <div>
      <input type="text" placeholder="Année scolaire" value={anneeScolaire} onChange={(e) => setAnneeScolaire(e.target.value)} />
      <input type="text" placeholder="Tranche" value={tranche} onChange={(e) => setTranche(e.target.value)} />
      <input type="number" placeholder="Montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
      <button onClick={handleSubmit}>Paiement</button>
    </div>
  )
}

export default FormulairePaiement