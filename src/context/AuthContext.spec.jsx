import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import { respuesta, esperarPromesas } from '../test/mockFetch.js'

// Componente de prueba que muestra la sesión y permite cerrarla
function BancoDePruebas() {
  const { usuario, logout } = useAuth()
  return (
    <div>
      <span data-testid="usuario">{usuario ? `${usuario.nombre} (${usuario.rol})` : 'sin sesión'}</span>
      <button onClick={logout}>Salir</button>
    </div>
  )
}

const dibujar = () =>
  render(
    <AuthProvider>
      <BancoDePruebas />
    </AuthProvider>,
  )

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear())

  it('al recargar recupera la sesión desde /users/me y pasa el rol a minúsculas', async () => {
    localStorage.setItem('tokens', JSON.stringify({ token: 't', refreshToken: 'r' }))
    spyOn(window, 'fetch').and.returnValue(respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }))
    dibujar()
    expect(await screen.findByText('Ana (cliente)')).toBeTruthy()
  })

  it('logout borra los tokens, cierra la sesión y revoca el refresh token en el backend', async () => {
    localStorage.setItem('tokens', JSON.stringify({ token: 't', refreshToken: 'r1' }))
    spyOn(window, 'fetch').and.returnValues(
      respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }), // /users/me
      respuesta(204, null), // /auth/logout
    )
    dibujar()
    await screen.findByText('Ana (cliente)')

    fireEvent.click(screen.getByText('Salir'))
    await esperarPromesas()

    expect(screen.getByTestId('usuario').textContent).toBe('sin sesión')
    expect(localStorage.getItem('tokens')).toBeNull()
    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url).toContain('/auth/logout')
    expect(JSON.parse(opciones.body)).toEqual({ refreshToken: 'r1' })
  })

  it('logout sin sesión no llama al backend', () => {
    spyOn(window, 'fetch')
    dibujar()
    fireEvent.click(screen.getByText('Salir'))
    expect(window.fetch).not.toHaveBeenCalled()
  })
})
