import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderConProviders } from '../test/renderConProviders.jsx'
import Login from './Login.jsx'

function dibujarLogin() {
  renderConProviders(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/productos" element={<h1>Panel admin</h1>} />
    </Routes>,
    '/login',
  )
}

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })

describe('Login', () => {
  beforeEach(() => localStorage.clear())

  it('muestra error si se envía vacío', () => {
    dibujarLogin()
    fireEvent.click(screen.getByText('Entrar'))
    expect(screen.getByText('Completa correo y contraseña')).toBeTruthy()
  })

  it('muestra error con contraseña incorrecta', () => {
    dibujarLogin()
    escribir('Correo electrónico', 'admin@powernut.cl')
    escribir('Contraseña', 'mala')
    fireEvent.click(screen.getByText('Entrar'))
    expect(screen.getByText('Correo o contraseña incorrectos')).toBeTruthy()
  })

  it('el admin entra al panel de productos', () => {
    dibujarLogin()
    escribir('Correo electrónico', 'admin@powernut.cl')
    escribir('Contraseña', 'Admin123!')
    fireEvent.click(screen.getByText('Entrar'))
    expect(screen.getByText('Panel admin')).toBeTruthy()
  })
})
