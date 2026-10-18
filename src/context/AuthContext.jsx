import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

// Usuario administrador que se crea la primera vez
const ADMIN = { nombre: 'Admin', correo: 'admin@powernut.cl', password: 'Admin123!', rol: 'admin' }

function obtenerUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'))
  if (usuarios) return usuarios
  localStorage.setItem('usuarios', JSON.stringify([ADMIN]))
  return [ADMIN]
}

export function AuthProvider({ children }) {
  // Usuario conectado (se guarda en localStorage con la clave "sesion")
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('sesion')))

  // Devuelve el usuario si los datos son correctos, o null si no
  const login = (correo, password) => {
    const encontrado = obtenerUsuarios().find((u) => u.correo === correo && u.password === password)
    if (!encontrado) return null
    const sesion = { nombre: encontrado.nombre, correo: encontrado.correo, rol: encontrado.rol }
    localStorage.setItem('sesion', JSON.stringify(sesion))
    setUsuario(sesion)
    return sesion
  }

  // Devuelve false si el correo ya existe
  const registrar = (nuevo) => {
    const usuarios = obtenerUsuarios()
    if (usuarios.some((u) => u.correo === nuevo.correo)) return false
    localStorage.setItem('usuarios', JSON.stringify([...usuarios, { ...nuevo, rol: 'cliente' }]))
    return true
  }

  const logout = () => {
    localStorage.removeItem('sesion')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
