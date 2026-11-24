// Todas las llamadas al backend pasan por aquí (gateway en 8080)
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080'

export const leerTokens = () => JSON.parse(localStorage.getItem('tokens'))
export const guardarTokens = (t) => localStorage.setItem('tokens', JSON.stringify(t))
export const borrarTokens = () => localStorage.removeItem('tokens')

// Pide un token nuevo usando el refresh token (rotación)
async function pedirRenovacion() {
  const t = leerTokens()
  if (!t?.refreshToken) return false
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: t.refreshToken }),
  })
  if (!res.ok) {
    borrarTokens()
    return false
  }
  const data = await res.json()
  guardarTokens({ token: data.token, refreshToken: data.refreshToken })
  return true
}

// Si ya hay una renovación en curso, todos esperan la misma
let renovando = null
function renovar() {
  if (!renovando) renovando = pedirRenovacion().finally(() => { renovando = null })
  return renovando
}

export async function api(ruta, { method = 'GET', body, reintento = true } = {}) {
  const t = leerTokens()
  const headers = { 'Content-Type': 'application/json' }
  if (t?.token) headers.Authorization = `Bearer ${t.token}`

  const res = await fetch(`${API_URL}${ruta}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Token vencido: se renueva una vez y se repite la petición
  if (res.status === 401 && reintento && !ruta.startsWith('/auth/') && (await renovar())) {
    return api(ruta, { method, body, reintento: false })
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Error ${res.status}`)
  return data
}