import { useNavigate } from 'react-router-dom'
import PageHeader from './PageHeader'
import FormulaireEnfant from './FormulaireEnfant'

function PageAjouterEnfant() {
  const navigate = useNavigate()

  function handleEnfantCree() {
    navigate('/enfants')
  }

  return (
    <>
      <PageHeader titre="Ajouter un enfant" />
      <div className="container page-contenu">
        <div className="bloc-formulaire bloc-etroit">
          <h4>Nouvel enfant</h4>
          <FormulaireEnfant onEnfantCree={handleEnfantCree} />
        </div>
      </div>
    </>
  )
}

export default PageAjouterEnfant
