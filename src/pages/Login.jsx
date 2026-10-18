import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (!correo || !password) {
      setError('Completa correo y contraseña')
      return
    }
    const usuario = login(correo, password)
    if (!usuario) {
      setError('Correo o contraseña incorrectos')
      return
    }
    // El admin va al CRUD; el cliente al inicio
    navigate(usuario.rol === 'admin' ? '/admin/productos' : '/')
  }

  return (
    <main className="minimal-container">
      <div className="form-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={enviar} noValidate>
          <label htmlFor="log-correo">Correo electrónico</label>
          <input type="email" id="log-correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />

          <label htmlFor="log-pass">Contraseña</label>
          <input type="password" id="log-pass" value={password} onChange={(e) => setPassword(e.target.value)} />

          <span className="error-msg">{error}</span>

          <button type="submit" className="btn btn-primary full-width">Entrar</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </main>
  )
}

export default Login
