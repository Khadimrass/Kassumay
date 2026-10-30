import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ImageProtegee from './ImageProtegee'
import usePhotosEnfants from './usePhotosEnfants'

const IMAGE_SECOURS = 'https://cdn.pixabay.com/photo/2016/12/03/15/13/gambia-1880005_640.jpg'

const textes = [
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
  const photos = usePhotosEnfants()
  const [index, setIndex] = useState(0)

  // Connecté : une diapo par photo d'enfant. Visiteur : images neutres.
  const slides = photos.length
    ? photos.map((photo, i) => ({ ...textes[i % textes.length], photo }))
    : textes

  useEffect(() => {
    const minuteur = setInterval(() => {
      setIndex(i => i + 1)
    }, 6000)
    return () => clearInterval(minuteur)
  }, [])

  const position = ((index % slides.length) + slides.length) % slides.length
  const slide = slides[position]

  function precedent() {
    setIndex(position - 1)
  }

  function suivant() {
    setIndex(position + 1)
  }

  return (
    <div className="carousel">
      <div className="container-fluid">
        <div className="carousel-item fondu" key={position + '-' + (slide.photo || '')}>
          <div className="carousel-img">
            {slide.photo ? (
              <ImageProtegee chemin={slide.photo} alt={slide.titre} />
            ) : (
              <img
                src={slide.image}
                alt={slide.titre}
                onError={(e) => { e.target.onerror = null; e.target.src = IMAGE_SECOURS }}
              />
            )}
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
