import PageHeader from './PageHeader'
import Login from './login'

function PageLogin() {
  return (
    <>
      <PageHeader titre="Connexion" />
      <div className="container page-contenu">
        <div className="bloc-formulaire bloc-etroit">
          <h4>Se connecter</h4>
          <Login />
        </div>
      </div>
    </>
  )
}

export default PageLogin
