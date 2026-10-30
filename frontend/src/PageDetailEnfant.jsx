import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from './PageHeader'
import FormulaireModifierEnfant from './FormulaireModifierEnfant'
import FormulairePaiement from './FormulairePaiement'
import FormulaireBulletin from './FormulaireBulletin'

const API = 'http://127.0.0.1:8000'

function calculerAge(dateNaissance) {
  if (!dateNaissance) return null
  const n = new Date(dateNaissance)
  const a = new Date()
  let age = a.getFullYear() - n.getFullYear()
  const m = a.getMonth() - n.getMonth()
  if (m < 0 || (m === 0 && a.getDate() < n.getDate())) age--
  return age
}

function PageDetailEnfant() {
  const { id } = useParams()
  const [enfant, setEnfant] = useState(null)
  const [bulletins, setBulletins] = useState([])
  const [paiements, setPaiements] = useState([])
  const [edition, setEdition] = useState(false)

  function charger() {
    fetch(API + '/enfants').then(r => r.json())
      .then(liste => setEnfant(liste.find(e => e.id === Number(id)) || null))
    fetch(API + '/bulletins').then(r => r.json())
      .then(l => setBulletins(l.filter(b => b.enfant_id === Number(id))))
    fetch(API + '/paiements').then(r => r.json())
      .then(l => setPaiements(l.filter(p => p.enfant_id === Number(id))))
  }

  useEffect(charger, [id])

  if (!enfant) return <div className="page"><PageHeader titre="Enfant" /><p className="contenu">Chargement…</p></div>

  const age = calculerAge(enfant.date_naissance)
  const total = paiements.reduce((s, p) => s + (p.montant || 0), 0)

  return (
    <div className="page">
      <PageHeader titre={enfant.nom} />
      <div className="contenu">
        <div className="details-enfant">
          <div className="profil-enfant">
            <div className="profil-photo">
              {enfant.photo_url
                ? <img src={API + '/' + enfant.photo_url} alt={enfant.nom} />
                : <div className="profil-initiale">{enfant.nom.charAt(0).toUpperCase()}</div>}
            </div>
            <div>
              <h2>{enfant.nom}</h2>
              <p>{enfant.classe || 'Classe non renseignée'} · {enfant.type_scolarite === 'publique' ? 'École publique' : 'École privée'}</p>
              <p>{age !== null ? age + ' ans' : 'Âge non renseigné'}</p>
              <p>{enfant.description || 'Pas encore de description.'}</p>
              <button onClick={() => setEdition(!edition)}>{edition ? 'Annuler' : 'Modifier le profil'}</button>
            </div>
          </div>
          {edition && (
            <FormulaireModifierEnfant enfant={enfant}
              onEnfantModifie={() => { setEdition(false); charger() }} />
          )}
        </div>

        <div className="details-enfant">
          <h3>Bulletins</h3>
          <ul className="liste-items">
            {bulletins.map(b => (
              <li key={b.id} className="item-carte">
                {b.fichier_bulletin_url && <img src={API + '/' + b.fichier_bulletin_url} alt="bulletin" width="60" />}
                <span>{b.annee_scolaire} · {b.classe}{b.commentaire ? ' · ' + b.commentaire : ''}</span>
              </li>
            ))}
          </ul>
          <FormulaireBulletin enfantId={enfant.id} onBulletinCree={charger} />
        </div>

        <div className="details-enfant">
          <h3>Paiements</h3>
          <ul className="liste-items">
            {paiements.map(p => (
              <li key={p.id} className="item-carte">
                {p.annee_scolaire} · {p.tranche} · {Number(p.montant).toLocaleString('fr-FR')} FCFA
              </li>
            ))}
          </ul>
          <p className="total-paiements">Total versé : {total.toLocaleString('fr-FR')} FCFA</p>
          <FormulairePaiement enfantId={enfant.id} onPaiementCree={charger} />
        </div>
      </div>
    </div>
  )
}

export default PageDetailEnfant
