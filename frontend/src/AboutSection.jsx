import { useState } from 'react'

const onglets = [
  {
    titre: 'À propos',
    texte: "Kassumay est une association familiale née de la volonté de notre grand-père et de son épouse de financer la scolarité de tous les enfants de la famille. Chaque année, les frais sont versés en deux tranches (octobre et février) pour l'école privée, et en une seule fois pour l'école publique."
  },
  {
    titre: 'Mission',
    texte: "Offrir à chaque enfant de la famille l'accès à une scolarité de qualité, et permettre à notre bienfaitrice de suivre l'évolution de chacun ainsi que l'utilisation des fonds versés."
  },
  {
    titre: 'Vision',
    texte: "Que chaque enfant puisse grandir, étudier et réussir, entouré du soutien de toute sa famille, avec des résultats suivis et des investissements transparents."
  }
]

function AboutSection() {
  const [actif, setActif] = useState(0)

  return (
    <div className="about">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="about-img" style={{ backgroundImage: 'url(/img/about.jpg)' }}></div>
          </div>
          <div className="col-lg-6">
            <div className="section-header">
              <p>À propos de nous</p>
              <h2>Une famille unie autour de l'éducation</h2>
            </div>
            <div className="about-tab">
              <ul className="nav nav-pills nav-justified">
                {onglets.map((onglet, i) => (
                  <li className="nav-item" key={onglet.titre}>
                    <a
                      href="#"
                      className={'nav-link' + (actif === i ? ' active' : '')}
                      onClick={(e) => { e.preventDefault(); setActif(i) }}
                    >
                      {onglet.titre}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="tab-content">
                {onglets.map((onglet, i) => (
                  <div key={onglet.titre} className={'container tab-pane' + (actif === i ? ' active' : '')}>
                    {onglet.texte}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
