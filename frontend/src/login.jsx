import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErreur('')
    try {
      const reponse = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, mot_de_passe: motDePasse }),
      })
      if (!reponse.ok) {
        setErreur('Email ou mot de passe incorrect.')
        return
      }
      const data = await reponse.json()
      localStorage.setItem('token', data.access_token)
      navigate('/enfants')
    } catch (err) {
      setErreur('Impossible de joindre le serveur.')
    }
  }

  return (
    <div className="formulaire">
      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={motDePasse}
        onChange={e => setMotDePasse(e.target.value)} />
      {erreur && <p className="message-erreur">{erreur}</p>}
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  )
}

export default Login
