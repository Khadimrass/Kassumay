import { useState } from 'react'

function FormulaireModifierEnfant({ enfant, onEnfantModifie }) {
  const [nom, setNom] = useState(enfant.nom || '')
  const [dateNaissance, setDateNaissance] = useState(enfant.date_naissance || '')
  const [classe, setClasse] = useState(enfant.classe || '')
  const [typeScolarite, setTypeScolarite] = useState(enfant.type_scolarite || 'privee')
  const [description, setDescription] = useState(enfant.description || '')
  const [photo, setPhoto] = useState(null)
  const [erreur, setErreur] = useState('')

  async function enregistrer(e) {
    e.preventDefault()
    setErreur('')
    const token = localStorage.getItem('token')
    const corps = {
      nom,
      date_naissance: dateNaissance || null,
      classe: classe || null,
      type_scolarite: typeScolarite,
      description: description || null,
    }
    if (photo) {
      const fd = new FormData()
      fd.append('file', photo)
      const r = await fetch('http://127.0.0.1:8000/upload', { method: 'POST', body: fd })
      corps.photo_url = (await r.json()).url
    }
    const reponse = await fetch('http://127.0.0.1:8000/enfants/' + enfant.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(corps),
    })
    if (reponse.status === 401) { setErreur("Connecte-toi d'abord."); return }
    if (!reponse.ok) { setErreur('Erreur : vérifie les champs.'); return }
    if (onEnfantModifie) onEnfantModifie()
  }

  return (
    <div className="formulaire">
      <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" />
      <label className="etiquette">Date de naissance</label>
      <input type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} />
      <input value={classe} onChange={e => setClasse(e.target.value)} placeholder="Classe" />
      <select value={typeScolarite} onChange={e => setTypeScolarite(e.target.value)}>
        <option value="privee">École privée</option>
        <option value="publique">École publique</option>
      </select>
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <label className="etiquette">Nouvelle photo (optionnel)</label>
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
      {erreur && <p className="message-erreur">{erreur}</p>}
      <button onClick={enregistrer}>Enregistrer</button>
    </div>
  )
}

export default FormulaireModifierEnfant
