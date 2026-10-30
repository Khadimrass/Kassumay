import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-7">
            <div className="footer-contact">
              <h2>Notre famille</h2>
              <p><i className="fa fa-map-marker-alt"></i>Rue 221, Dakar, Sénégal</p>
              <p><i className="fa fa-phone-alt"></i>+221 333 453 3454</p>
              <p><i className="fa fa-envelope"></i>kassumaykep@gmail.com</p>
              <div className="footer-social">
                <a className="btn btn-custom" href="https://www.instagram.com/hadeemrassoul_diey/" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-custom" href="https://www.instagram.com/hadeemrassoul_diey/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                <a className="btn btn-custom" href="https://www.instagram.com/hadeemrassoul_diey/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7">
            <div className="footer-link">
              <h2>Liens utiles</h2>
              <Link to="/">Accueil</Link>
              <Link to="/enfants">Nos enfants</Link>
              <Link to="/ajouter-enfant">Ajouter un enfant</Link>
              <Link to="/login">Connexion</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container copyright">
        <div className="row">
          <div className="col-md-12 text-center">
            <p>&copy; <a href="/">KASSUMAY</a>, tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
