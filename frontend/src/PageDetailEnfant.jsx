import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from './PageHeader'
import FormulaireModifierEnfant from './FormulaireModifierEnfant'
import FormulairePaiement from './FormulairePaiement'
import FormulaireBulletin from './FormulaireBulletin'
import ImageProtegee from './ImageProtegee'
import LignePaiement from './LignePaiement'
import { apiFetch, estConnecte } from './api'

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
    if (!estConnecte()) return
    apiFetch('/enfants').then(r => (r.ok ? r.json() : []))
      .then(liste => setEnfant(liste.find(e => e.id === Number(id)) || null))
    apiFetch('/bulletins').then(r => (r.ok ? r.json() : []))
      .then(l => setBulletins(l.filter(b => b.enfant_id === Number(id))))
    apiFetch('/paiements').then(r => (r.ok ? r.json() : []))
      .then(l => setPaiements(l.filter(p => p.enfant_id === Number(id))))
  }

  useEffect(charger, [id])

  if (!estConnecte()) {
    return (
      <div className="page">
        <PageHeader titre="Enfant" />
        <div className="contenu text-center" style={{ padding: '60px 15px' }}>
          <p>Cette page est réservée aux membres de la famille.</p>
          <Link className="btn btn-custom" to="/login">Se connecter</Link>
        </div>
      </div>
    )
  }

  if (!enfant) return <div className="page"><PageHeader titre="Enfant" /><p className="contenu">Chargement…</p></div>

  const age = calculerAge(enfant.date_naissance)
  const verses = paiements.filter(p => p.statut !== 'a_payer')
  const aPayer = paiements.filter(p => p.statut === 'a_payer')
  const total = verses.reduce((s, p) => s + (p.montant || 0), 0)
  const reste = aPayer.reduce((s, p) => s + (p.montant || 0), 0)
  const fmt = n => Number(n).toLocaleString('fr-FR')

  return (
    <div className="page">
      <PageHeader titre={enfant.nom} />
      <div className="contenu">
        <div className="details-enfant">
          <div className="profil-enfant">
            <div className="profil-photo">
              {enfant.photo_url
                ? <ImageProtegee chemin={enfant.photo_url} alt={enfant.nom}
                    repli={<div className="profil-initiale">{enfant.nom.charAt(0).toUpperCase()}</div>} />
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
                {b.fichier_bulletin_url && <ImageProtegee chemin={b.fichier_bulletin_url} alt="bulletin" width="60" />}
                <span>{b.annee_scolaire} · {b.classe}{b.commentaire ? ' · ' + b.commentaire : ''}</span>
              </li>
            ))}
          </ul>
          <FormulaireBulletin enfantId={enfant.id} onBulletinCree={charger} />
        </div>

        <div className="details-enfant">
          <h3>Paiements</h3>
          <div className="resume-paiements">
            <div className="resume-case"><span>Versé</span><strong>{fmt(total)} FCFA</strong></div>
            <div className="resume-case reste"><span>Reste à payer</span><strong>{fmt(reste)} FCFA</strong></div>
            <div className="resume-case"><span>Total prévu</span><strong>{fmt(total + reste)} FCFA</strong></div>
          </div>
          <h4 className="sous-titre">Déjà versé</h4>
          <ul className="liste-items">
            {verses.map(p => (
              <LignePaiement key={p.id} paiement={p} onChange={charger} />
            ))}
          </ul>
          {aPayer.length > 0 && (
            <>
              <h4 className="sous-titre">Reste à payer</h4>
              <ul className="liste-items">
                {aPayer.map(p => (
                  <LignePaiement key={p.id} paiement={p} onChange={charger} />
                ))}
              </ul>
            </>
          )}
          <FormulairePaiement enfantId={enfant.id} onPaiementCree={charger} />
        </div>
      </div>
    </div>
  )
}

export default PageDetailEnfant
