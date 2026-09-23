import { useNavigate } from 'react-router-dom'
import FormulaireEnfant from './FormulaireEnfant'

function PageAjouterEnfant() {
  const navigate = useNavigate()

  function handleEnfantCree() {
    navigate('/')
  }

  return (
    <div className="page">
      <h1>Ajouter un enfant</h1>
      <div className="bloc-formulaire">
        <FormulaireEnfant onEnfantCree={handleEnfantCree} />
      </div>
    </div>
  )
}

export default PageAjouterEnfant