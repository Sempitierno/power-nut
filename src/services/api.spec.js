import { api, guardarTokens, leerTokens } from './api.js'
import { respuesta } from '../test/mockFetch.js'

describe('api (cliente HTTP)', () => {
  beforeEach(() => localStorage.clear())

  it('agrega el token como Authorization: Bearer', async () => {
    guardarTokens({ token: 'abc', refreshToken: 'r1' })
    spyOn(window, 'fetch').and.returnValue(respuesta(200, { nombre: 'Ana' }))
    await api('/users/me')
    const [url, opciones] = window.fetch.calls.mostRecent().args
    expect(url).toContain('/users/me')
    expect(opciones.headers.Authorization).toBe('Bearer abc')
  })

  it('si el token venció, lo renueva con el refresh token y repite la petición', async () => {
    guardarTokens({ token: 'viejo', refreshToken: 'r1' })
    spyOn(window, 'fetch').and.returnValues(
      respuesta(401, { error: 'Token inválido o ausente' }), // 1) /users/me con token vencido
      respuesta(200, { token: 'nuevo', refreshToken: 'r2' }), // 2) /auth/refresh
      respuesta(200, { nombre: 'Ana' }), // 3) /users/me otra vez
    )
    const data = await api('/users/me')
    expect(data.nombre).toBe('Ana')
    expect(window.fetch.calls.argsFor(1)[0]).toContain('/auth/refresh')
    expect(window.fetch.calls.argsFor(2)[1].headers.Authorization).toBe('Bearer nuevo')
    expect(leerTokens()).toEqual({ token: 'nuevo', refreshToken: 'r2' })
  })

  it('si el refresh también venció, borra la sesión y lanza error', async () => {
    guardarTokens({ token: 'viejo', refreshToken: 'r1' })
    spyOn(window, 'fetch').and.returnValues(
      respuesta(401, { error: 'Token inválido o ausente' }),
      respuesta(401, { error: 'Refresh token inválido' }),
    )
    await expectAsync(api('/users/me')).toBeRejectedWithError('Token inválido o ausente')
    expect(leerTokens()).toBeNull()
  })

  it('convierte el error del backend en un Error con su mensaje', async () => {
    spyOn(window, 'fetch').and.returnValue(respuesta(409, { error: 'Ese correo ya está registrado' }))
    await expectAsync(api('/auth/register', { method: 'POST', body: {} })).toBeRejectedWithError(
      'Ese correo ya está registrado',
    )
  })

  it('una respuesta 204 (sin contenido) devuelve null', async () => {
    spyOn(window, 'fetch').and.returnValue(respuesta(204, null))
    expect(await api('/auth/logout', { method: 'POST', body: { refreshToken: 'r' } })).toBeNull()
  })

  it('sin refresh token guardado no intenta renovar', async () => {
    spyOn(window, 'fetch').and.returnValue(respuesta(401, { error: 'Token inválido o ausente' }))
    await expectAsync(api('/users/me')).toBeRejectedWithError('Token inválido o ausente')
    expect(window.fetch).toHaveBeenCalledTimes(1)
  })

  it('si el backend no manda JSON, usa un mensaje genérico con el código', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error('no es JSON')) }),
    )
    await expectAsync(api('/products')).toBeRejectedWithError('Error 500')
  })
})
