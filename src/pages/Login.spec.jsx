import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderConProviders } from '../test/renderConProviders.jsx'
import { respuesta } from '../test/mockFetch.js'
import Login from './Login.jsx'

function dibujarLogin() {
  renderConProviders(
    <Routes>
      <Route path="/" element={<h1>Inicio</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/productos" element={<h1>Panel admin</h1>} />
    </Routes>,
    '/login',
  )
}

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })

describe('Login', () => {
  beforeEach(() => localStorage.clear())

  it('muestra error si se envía vacío y no llama al backend', () => {
    spyOn(window, 'fetch')
    dibujarLogin()
    fireEvent.click(screen.getByText('Entrar'))
    expect(screen.getByText('Completa correo y contraseña')).toBeTruthy()
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('muestra el error del backend con contraseña incorrecta (401)', async () => {
    spyOn(window, 'fetch').and.returnValue(respuesta(401, { error: 'Correo o contraseña incorrectos' }))
    dibujarLogin()
    escribir('Correo electrónico', 'admin@powernut.cl')
    escribir('Contraseña', 'mala')
    fireEvent.click(screen.getByText('Entrar'))
    expect(await screen.findByText('Correo o contraseña incorrectos')).toBeTruthy()
    expect(localStorage.getItem('tokens')).toBeNull()
  })

  it('el admin entra al panel y se guardan los tokens', async () => {
    spyOn(window, 'fetch').and.returnValue(
      respuesta(200, { token: 't1', refreshToken: 'r1', nombre: 'Admin', correo: 'admin@powernut.cl', rol: 'ADMIN' }),
    )
    dibujarLogin()
    escribir('Correo electrónico', 'admin@powernut.cl')
    escribir('Contraseña', 'Admin123!')
    fireEvent.click(screen.getByText('Entrar'))
    expect(await screen.findByText('Panel admin')).toBeTruthy()
    // Se envió POST /auth/login con las credenciales
    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url).toContain('/auth/login')
    expect(JSON.parse(opciones.body)).toEqual({ correo: 'admin@powernut.cl', password: 'Admin123!' })
    expect(JSON.parse(localStorage.getItem('tokens'))).toEqual({ token: 't1', refreshToken: 'r1' })
  })

  it('el cliente entra al inicio', async () => {
    spyOn(window, 'fetch').and.returnValue(
      respuesta(200, { token: 't2', refreshToken: 'r2', nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }),
    )
    dibujarLogin()
    escribir('Correo electrónico', 'ana@correo.cl')
    escribir('Contraseña', 'Abc12345!')
    fireEvent.click(screen.getByText('Entrar'))
    expect(await screen.findByText('Inicio')).toBeTruthy()
  })
})
