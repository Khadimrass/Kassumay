import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './Navigation'
import PageAccueil from './PageAccueil'
import PageLogin from './PageLogin'
import PageAjouterEnfant from './PageAjouterEnfant'
import PageDetailEnfant from './PageDetailEnfant'

function App() {
  return (
    <div className="app">
      <Navigation />
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/ajouter-enfant" element={<PageAjouterEnfant />} />
        <Route path="/enfant/:id" element={<PageDetailEnfant />} />
      </Routes>
    </div>
  )
}

export default App