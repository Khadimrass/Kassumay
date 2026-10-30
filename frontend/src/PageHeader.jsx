import { Link } from 'react-router-dom'

function PageHeader({ titre }) {
  return (
    <div className="page-header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>{titre}</h2>
          </div>
          <div className="col-12">
            <Link to="/">Accueil</Link>
            <Link to="#">{titre}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
