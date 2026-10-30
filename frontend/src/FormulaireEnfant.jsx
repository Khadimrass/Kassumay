import { useState } from 'react'

function FormulaireEnfant({ onEnfantCree }) {
  const [nom, setNom] = useState('')
  const [classe, setClasse] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [typeScolarite, setTypeScolarite] = useState('privee')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [erreur, setErreur] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    if (!nom.trim()) {
      setErreur('Le nom est obligatoire.')
      return
    }
    const token = localStorage.getItem('token')
    let photoUrl = null
    if (photo) {
      const fd = new FormData()
      fd.append('fichier', photo)
      const r = await fetch('http://127.0.0.1:8000/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd })
      photoUrl = (await r.json()).url
    }
    const reponse = await fetch('http://127.0.0.1:8000/enfants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({
        nom,
        classe: classe || null,
        date_naissance: dateNaissance || null,
        type_scolarite: typeScolarite,
        description: description || null,
        photo_url: photoUrl,
      }),
    })
    if (reponse.status === 401) {
      setErreur("Connecte-toi d'abord.")
      return
    }
    if (!reponse.ok) {
      setErreur('Erreur : vérifie les champs.')
      return
    }
    setNom(''); setClasse(''); setDateNaissance(''); setDescription(''); setPhoto(null)
    if (onEnfantCree) onEnfantCree()
  }

  return (
    <div className="formulaire">
      <input placeholder="Nom complet" value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder="Classe (ex : CE2)" value={classe} onChange={e => setClasse(e.target.value)} />
      <label className="etiquette">Date de naissance (optionnel)</label>
      <input type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} />
      <select value={typeScolarite} onChange={e => setTypeScolarite(e.target.value)}>
        <option value="privee">École privée</option>
        <option value="publique">École publique</option>
      </select>
      <input placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />
      <label className="etiquette">Photo (optionnel)</label>
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
      {erreur && <p className="message-erreur">{erreur}</p>}
      <button onClick={handleSubmit}>Ajouter l'enfant</button>
    </div>
  )
}

export default FormulaireEnfant
