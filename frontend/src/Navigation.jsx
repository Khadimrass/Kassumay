import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { estConnecte } from './api'

function Navigation() {
  const [ouvert, setOuvert] = useState(false)
  const [sticky, setSticky] = useState(false)
  const navigate = useNavigate()
  useLocation() // fait réafficher le menu après connexion / déconnexion
  const connecte = estConnecte()

  function deconnexion(e) {
    e.preventDefault()
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    function verifierScroll() {
      setSticky(window.scrollY > 0)
    }
    window.addEventListener('scroll', verifierScroll)
    return () => window.removeEventListener('scroll', verifierScroll)
  }, [])

  function classeLien({ isActive }) {
    return 'nav-item nav-link' + (isActive ? ' active' : '')
  }

  return (
    <>
      <div className="top-bar d-none d-md-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="top-bar-left">
                <div className="text">
                  <i className="fa fa-phone-alt"></i>
                  <p>+221 333 453 3454</p>
                </div>
                <div className="text">
                  <i className="fa fa-envelope"></i>
                  <p>kassumaykep@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="top-bar-right">
                <div className="social">
                  <a href="https://www.instagram.com/hadeemrassoul_diey/" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                  <a href="https://www.instagram.com/hadeemrassoul_diey/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                  <a href="https://www.instagram.com/hadeemrassoul_diey/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={'navbar navbar-expand-lg bg-dark navbar-dark' + (sticky ? ' nav-sticky' : '')}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">KASSUMAY</Link>
          <button type="button" className="navbar-toggler" onClick={() => setOuvert(!ouvert)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={'collapse navbar-collapse justify-content-between' + (ouvert ? ' show' : '')}>
            <div className="navbar-nav ml-auto" onClick={() => setOuvert(false)}>
              <NavLink to="/" end className={classeLien}>Accueil</NavLink>
              <NavLink to="/enfants" className={classeLien}>Nos enfants</NavLink>
              <NavLink to="/ajouter-enfant" className={classeLien}>Ajouter un enfant</NavLink>
              {connecte
                ? <a href="/login" className="nav-item nav-link" onClick={deconnexion}>Déconnexion</a>
                : <NavLink to="/login" className={classeLien}>Connexion</NavLink>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
