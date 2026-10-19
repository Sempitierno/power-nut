import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert } from 'react-bootstrap'

const COMUNAS = {
  RM: ['Santiago', 'Providencia', 'Maipú', 'Puente Alto'],
  V: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Casablanca'],
}

const VACIO = { nombre: '', correo: '', correoConf: '', password: '', passwordConf: '', region: '', comuna: '' }

// Reglas de la EP1. Devuelve un objeto con los errores encontrados
function validar(d) {
  const errores = {}
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(d.nombre.trim())) errores.nombre = 'El nombre solo puede tener letras'
  if (!/^\S+@\S+\.\S+$/.test(d.correo)) errores.correo = 'Correo inválido'
  else if (d.correo !== d.correoConf) errores.correo = 'Los correos no coinciden'
  if (d.password.length < 8 || !/\d/.test(d.password) || !/[^A-Za-z0-9]/.test(d.password)) {
    errores.password = 'Mínimo 8 caracteres, 1 número y 1 símbolo'
  } else if (d.password !== d.passwordConf) errores.password = 'Las contraseñas no coinciden'
  if (!d.region || !d.comuna) errores.region = 'Selecciona región y comuna'
  return errores
}

function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(false)

  const cambiar = (e) => {
    const { id, value } = e.target
    // Al cambiar la región se limpia la comuna
    if (id === 'region') setDatos({ ...datos, region: value, comuna: '' })
    else setDatos({ ...datos, [id]: value })
  }

  const enviar = (e) => {
    e.preventDefault()
    const encontrados = validar(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    const ok = registrar({ nombre: datos.nombre.trim(), correo: datos.correo, password: datos.password, region: datos.region, comuna: datos.comuna })
    if (!ok) {
      setErrores({ correo: 'Ese correo ya está registrado' })
      return
    }
    setExito(true)
    setDatos(VACIO)
    setTimeout(() => navigate('/login'), 2000)
    navigate('/login')
  }

  return (
    <main className="minimal-container">
      <div className="form-box">
        <h2>Crear cuenta</h2>
        <form onSubmit={enviar} noValidate>
          <label htmlFor="nombre">Nombre completo</label>
          <input type="text" id="nombre" placeholder="Solo letras" value={datos.nombre} onChange={cambiar} />
          <span className="error-msg">{errores.nombre}</span>

          <label>Correo y Confirmación</label>
          <div className="input-group">
            <input type="email" id="correo" placeholder="Correo" value={datos.correo} onChange={cambiar} />
            <input type="email" id="correoConf" placeholder="Confirmar correo" value={datos.correoConf} onChange={cambiar} />
          </div>
          <span className="error-msg">{errores.correo}</span>

          <label>Contraseña y Confirmación</label>
          <div className="input-group">
            <input type="password" id="password" placeholder="Mín. 8 caracteres, 1 número, 1 símbolo" value={datos.password} onChange={cambiar} />
            <input type="password" id="passwordConf" placeholder="Confirmar contraseña" value={datos.passwordConf} onChange={cambiar} />
          </div>
          <span className="error-msg">{errores.password}</span>

          <label>Región y Comuna</label>
          <div className="input-group">
            <select id="region" value={datos.region} onChange={cambiar}>
              <option value="">Seleccione Región...</option>
              <option value="RM">Metropolitana</option>
              <option value="V">Valparaíso</option>
            </select>
            <select id="comuna" value={datos.comuna} onChange={cambiar} disabled={!datos.region}>
              <option value="">Comuna...</option>
              {(COMUNAS[datos.region] || []).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <span className="error-msg">{errores.region}</span>
          {exito && (
            <Alert variant="success" className="mt-3" role="status">
              ¡Usuario registrado con éxito! Redirigiendo al inicio de sesión…
            </Alert>
          )}<button type="submit" className="btn btn-primary full-width">Registrarse</button>
        </form>
      </div>
    </main>
  )
}

export default Registro
