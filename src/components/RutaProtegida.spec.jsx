import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderConProviders } from '../test/renderConProviders.jsx'
import RutaProtegida from './RutaProtegida.jsx'

// Contenido que solo puede ver el administrador
const CONTENIDO = 'Contenido protegido'

// Dibuja la ruta protegida y la ruta de login a la que se redirige
function dibujarRutas() {
  renderConProviders(
    <Routes>
      <Route path="/login" element={<h1>Página de login</h1>} />
      <Route
        path="/admin/productos"
        element={
          <RutaProtegida>
            <h1>{CONTENIDO}</h1>
          </RutaProtegida>
        }
      />
    </Routes>,
    '/admin/productos',
  )
}

// Simula una sesión iniciada en localStorage
const iniciarSesion = (usuario) => localStorage.setItem('sesion', JSON.stringify(usuario))

describe('RutaProtegida', () => {
  beforeEach(() => localStorage.clear())

  it('sin sesión redirige a /login', () => {
    // No hay nada en localStorage: nadie está conectado
    dibujarRutas()
    expect(screen.getByText('Página de login')).toBeTruthy()
    expect(screen.queryByText(CONTENIDO)).toBeNull()
  })

  it('un usuario con rol "cliente" redirige a /login', () => {
    iniciarSesion({ nombre: 'Ana', correo: 'ana@correo.cl', rol: 'cliente' })
    dibujarRutas()
    expect(screen.getByText('Página de login')).toBeTruthy()
    expect(screen.queryByText(CONTENIDO)).toBeNull()
  })

  it('el rol "admin" ve el contenido protegido', () => {
    iniciarSesion({ nombre: 'Admin', correo: 'admin@powernut.cl', rol: 'admin' })
    dibujarRutas()
    expect(screen.getByText(CONTENIDO)).toBeTruthy()
    expect(screen.queryByText('Página de login')).toBeNull()
  })
})
