import { useState } from 'react'
import { apiFetch } from './api'

const fmt = n => Number(n).toLocaleString('fr-FR')

// Une ligne de paiement : affichage, modification, suppression, "marquer payé"
function LignePaiement({ paiement, onChange }) {
  const [edition, setEdition] = useState(false)
  const [annee, setAnnee] = useState(paiement.annee_scolaire)
  const [tranche, setTranche] = useState(paiement.tranche)
  const [montant, setMontant] = useState(paiement.montant)
  const [statut, setStatut] = useState(paiement.statut || 'paye')
  const [erreur, setErreur] = useState('')

  const aPayer = paiement.statut === 'a_payer'

  async function enregistrer() {
    setErreur('')
    if (!annee.trim() || !tranche.trim() || montant === '' || Number(montant) < 0) {
      setErreur('Vérifie les champs.')
      return
    }
    const r = await apiFetch('/paiements/' + paiement.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        annee_scolaire: annee,
        tranche: tranche,
        montant: Number(montant),
        statut: statut,
      }),
    })
    if (!r.ok) {
      setErreur(r.status === 401 ? "Connecte-toi d'abord." : 'Erreur : modification refusée.')
      return
    }
    setEdition(false)
    onChange()
  }

  async function supprimer() {
    if (!window.confirm('Supprimer ce paiement (' + paiement.tranche + ', ' + fmt(paiement.montant) + ' FCFA) ?')) return
    const r = await apiFetch('/paiements/' + paiement.id, { method: 'DELETE' })
    if (r.ok) onChange()
  }

  async function marquerPaye() {
    if (!window.confirm('Confirmer que ce paiement a été reçu ?')) return
    const r = await apiFetch('/paiements/' + paiement.id + '/payer', { method: 'PUT' })
    if (r.ok) onChange()
  }

  function annuler() {
    setAnnee(paiement.annee_scolaire)
    setTranche(paiement.tranche)
    setMontant(paiement.montant)
    setStatut(paiement.statut || 'paye')
    setErreur('')
    setEdition(false)
  }

  if (edition) {
    return (
      <li className="item-carte ligne-edition">
        <input value={annee} onChange={e => setAnnee(e.target.value)} placeholder="Année" />
        <input value={tranche} onChange={e => setTranche(e.target.value)} placeholder="Tranche" />
        <input type="number" value={montant} onChange={e => setMontant(e.target.value)} placeholder="Montant" />
        <select value={statut} onChange={e => setStatut(e.target.value)}>
          <option value="paye">Versé</option>
          <option value="a_payer">À payer</option>
        </select>
        <button onClick={enregistrer}>Enregistrer</button>
        <button className="bouton-secondaire" onClick={annuler}>Annuler</button>
        {erreur && <span className="message-erreur">{erreur}</span>}
      </li>
    )
  }

  return (
    <li className={'item-carte ligne-paiement' + (aPayer ? ' item-a-payer' : '')}>
      <span>{paiement.annee_scolaire} · {paiement.tranche} · {fmt(paiement.montant)} FCFA</span>
      <span className="actions-ligne">
        {aPayer && <button onClick={marquerPaye}>Marquer payé</button>}
        <button className="bouton-secondaire" onClick={() => setEdition(true)}>Modifier</button>
        <button className="bouton-danger" onClick={supprimer}>Supprimer</button>
      </span>
    </li>
  )
}

export default LignePaiement
