import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderConProviders } from '../test/renderConProviders.jsx'
import { respuesta } from '../test/mockFetch.js'
import RutaProtegida from './RutaProtegida.jsx'

// Contenido que solo puede ver el administrador
const CONTENIDO = 'Contenido protegido'

// Dibuja la ruta protegida y las rutas a las que se redirige
function dibujarRutas() {
  renderConProviders(
    <Routes>
      <Route path="/" element={<h1>Inicio</h1>} />
      <Route path="/login" element={<h1>Página de login</h1>} />
      <Route
        path="/admin/productos"
        element={
          <RutaProtegida rol="admin">
            <h1>{CONTENIDO}</h1>
          </RutaProtegida>
        }
      />
    </Routes>,
    '/admin/productos',
  )
}

// Simula una sesión guardada: hay tokens y /users/me responde con ese usuario
const iniciarSesion = (usuario) => {
  localStorage.setItem('tokens', JSON.stringify({ token: 't', refreshToken: 'r' }))
  spyOn(window, 'fetch').and.returnValue(respuesta(200, usuario))
}

describe('RutaProtegida', () => {
  beforeEach(() => localStorage.clear())

  it('sin sesión redirige a /login', async () => {
    dibujarRutas()
    expect(await screen.findByText('Página de login')).toBeTruthy()
    expect(screen.queryByText(CONTENIDO)).toBeNull()
  })

  it('un usuario con rol CLIENTE redirige al inicio', async () => {
    iniciarSesion({ nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' })
    dibujarRutas()
    expect(await screen.findByText('Inicio')).toBeTruthy()
    expect(screen.queryByText(CONTENIDO)).toBeNull()
  })

  it('el ADMIN ve el contenido protegido (sesión recuperada con /users/me al recargar)', async () => {
    iniciarSesion({ nombre: 'Admin', correo: 'admin@powernut.cl', rol: 'ADMIN' })
    dibujarRutas()
    // Mientras se consulta /users/me se muestra "Cargando..."
    expect(screen.getByText('Cargando...')).toBeTruthy()
    expect(await screen.findByText(CONTENIDO)).toBeTruthy()
    expect(window.fetch.calls.mostRecent().args[0]).toContain('/users/me')
  })

  it('si el token guardado ya no sirve, borra la sesión y manda al login', async () => {
    localStorage.setItem('tokens', JSON.stringify({ token: 'viejo', refreshToken: 'viejo' }))
    spyOn(window, 'fetch').and.returnValue(respuesta(401, { error: 'Token inválido o ausente' }))
    dibujarRutas()
    expect(await screen.findByText('Página de login')).toBeTruthy()
    expect(localStorage.getItem('tokens')).toBeNull()
  })
})
