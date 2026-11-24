import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Protege una pantalla:
// - mientras se revisa la sesión (al recargar) muestra "Cargando..."
// - sin sesión → /login
// - con sesión pero sin el rol pedido → inicio
// Uso: <RutaProtegida rol="admin"> ... </RutaProtegida>  (sin rol = basta con estar logueado)
function RutaProtegida({ children, rol }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando...</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (rol && usuario.rol !== rol) return <Navigate to="/" replace />
  return children
}

export default RutaProtegida
