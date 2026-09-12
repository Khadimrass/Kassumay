import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')

  function handleLogin() {
    fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, mot_de_passe: motDePasse })
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('token', data.access_token)
        console.log('Connecté ! Token stocké.')
      })
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  )
}

export default Login