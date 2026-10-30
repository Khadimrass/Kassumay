import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const IMAGE_SECOURS = 'https://cdn.pixabay.com/photo/2016/12/03/15/13/gambia-1880005_640.jpg'

const slides = [
  {
    image: '/img/carousel-1.jpg',
    titre: "Ensemble pour l'avenir de nos enfants",
    texte: "Chez Kassumay, nous croyons que chaque enfant mérite amour, soutien et les moyens de réussir. Toute la famille se réunit pour financer et suivre sa scolarité, année après année."
  },
  {
    image: '/img/carousel-2.jpg',
    titre: 'Un soutien qui change des vies',
    texte: 'Chaque tranche versée, chaque bulletin archivé : tout est suivi avec transparence.'
  },
  {
    image: '/img/carousel-3.jpg',
    titre: 'Des sourires pour toute la famille',
    texte: "Ensemble, nous construisons un avenir plus lumineux pour nos enfants, cousins et cousines."
  }
]

function Carousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const minuteur = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(minuteur)
  }, [])

  function precedent() {
    setIndex((index - 1 + slides.length) % slides.length)
  }

  function suivant() {
    setIndex((index + 1) % slides.length)
  }

  const slide = slides[index]

  return (
    <div className="carousel">
      <div className="container-fluid">
        <div className="carousel-item fondu" key={index}>
          <div className="carousel-img">
            <img
              src={slide.image}
              alt={slide.titre}
              onError={(e) => { e.target.onerror = null; e.target.src = IMAGE_SECOURS }}
            />
          </div>
          <div className="carousel-text">
            <h1>{slide.titre}</h1>
            <p>{slide.texte}</p>
            <div className="carousel-btn">
              <Link className="btn btn-custom" to="/enfants">Nos enfants</Link>
              <Link className="btn btn-custom" to="/login">Connexion</Link>
            </div>
          </div>
        </div>
        <div className="owl-nav">
          <div className="owl-prev" onClick={precedent}><i className="fa fa-angle-left"></i></div>
          <div className="owl-next" onClick={suivant}><i className="fa fa-angle-right"></i></div>
        </div>
      </div>
    </div>
  )
}

export default Carousel
