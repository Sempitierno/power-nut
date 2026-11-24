import { createContext, useContext, useEffect, useState } from 'react'
import { api, leerTokens, guardarTokens, borrarTokens } from '../services/api.js'

const AuthContext = createContext()

// El backend manda "ADMIN"/"CLIENTE"; el resto del front ya compara con 'admin'
const aSesion = (u) => ({ nombre: u.nombre, correo: u.correo, rol: u.rol.toLowerCase() })

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // Solo hay algo que revisar si quedaron tokens guardados
  const [cargando, setCargando] = useState(() => leerTokens() !== null)

  // Al recargar la página: si hay tokens, se le pregunta al backend quién soy
  useEffect(() => {
    if (!leerTokens()) return
    api('/users/me')
      .then((u) => setUsuario(aSesion(u)))
      .catch(() => borrarTokens())
      .finally(() => setCargando(false))
  }, [])

  // Lanza Error("Correo o contraseña incorrectos") si el backend responde 401
  const login = async (correo, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { correo, password } })
    guardarTokens({ token: data.token, refreshToken: data.refreshToken })
    const sesion = aSesion(data)
    setUsuario(sesion)
    return sesion
  }

  // Lanza Error("Ese correo ya está registrado") si el backend responde 409
  const registrar = (nuevo) => api('/auth/register', { method: 'POST', body: nuevo })

  const logout = () => {
    const t = leerTokens()
    borrarTokens()
    setUsuario(null)
    // Se revoca el refresh token en el servidor
    if (t?.refreshToken) {
      api('/auth/logout', { method: 'POST', body: { refreshToken: t.refreshToken } }).catch(() => {})
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
