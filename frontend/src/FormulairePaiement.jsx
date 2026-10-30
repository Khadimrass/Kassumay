import { useState } from 'react'
import { API } from './api'

function FormulairePaiement({ onPaiementCree, enfantId }) {
  const [anneeScolaire, setAnneeScolaire] = useState('')
  const [tranche, setTranche] = useState('')
  const [montant, setMontant] = useState('')

  function handleSubmit() {
    const token = localStorage.getItem('token')

    fetch(API + '/paiements', {
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
    <div className="formulaire">
      <input type="text" placeholder="Année scolaire" value={anneeScolaire} onChange={(e) => setAnneeScolaire(e.target.value)} />
      <input type="text" placeholder="Tranche" value={tranche} onChange={(e) => setTranche(e.target.value)} />
      <input type="number" placeholder="Montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
      <button onClick={handleSubmit}>Paiement</button>
    </div>
  )
}

export default FormulairePaiement