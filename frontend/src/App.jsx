import { Routes, Route } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import BackToTop from './BackToTop'
import PageAccueil from './PageAccueil'
import PageEnfants from './PageEnfants'
import PageLogin from './PageLogin'
import PageAjouterEnfant from './PageAjouterEnfant'
import PageDetailEnfant from './PageDetailEnfant'

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/enfants" element={<PageEnfants />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/ajouter-enfant" element={<PageAjouterEnfant />} />
        <Route path="/enfant/:id" element={<PageDetailEnfant />} />
      </Routes>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
