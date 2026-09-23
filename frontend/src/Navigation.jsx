import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/">Accueil</Link>
      <Link to="/login">Connexion</Link>
      <Link to="/ajouter-enfant">Ajouter un enfant</Link>
    </nav>
  )
}

export default Navigation