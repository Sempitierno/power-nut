import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Solo deja pasar al administrador; el resto vuelve al login
function RutaProtegida({ children }) {
  const { usuario } = useAuth()
  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/login" />
  }
  return children
}

export default RutaProtegida
