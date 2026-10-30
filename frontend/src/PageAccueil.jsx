import Carousel from './Carousel'
import AboutSection from './AboutSection'
import ListeEnfants from './ListeEnfants'

function PageAccueil() {
  return (
    <>
      <Carousel />
      <AboutSection />
      <ListeEnfants
        limite={4}
        sousTitre="Notre famille"
        titre="Les enfants que nous accompagnons"
      />
    </>
  )
}

export default PageAccueil
