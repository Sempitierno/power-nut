import { render, screen, fireEvent } from '@testing-library/react'
import AdminProductos from './AdminProductos.jsx'

const PRODUCTOS_MOCK = [
  { id: 1, nombre: 'Crema de Maní Natural — 500 g', precio: 6990, categoria: 'Crema de maní', stock: 20, img: '' },
  { id: 2, nombre: 'Mermelada de Frutilla — 250 g', precio: 4500, categoria: 'Mermeladas', stock: 15, img: '' },
]

function respuestaJson(body, status = 200) {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

function renderAdmin() {
  // El acceso por rol ya lo controla RutaProtegida; aquí se prueba solo el CRUD
  return render(<AdminProductos />)
}

const escribir = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('AdminProductos (HTTP simulado)', () => {
  beforeEach(() => {
    localStorage.clear()
    // Sesión de admin: solo el token; el rol lo resuelve el backend
    localStorage.setItem('tokens', JSON.stringify({ token: 'token-test', refreshToken: 'r' }))
  })

  it('lista los productos obtenidos desde la API', async () => {
    spyOn(window, 'fetch').and.returnValue(respuestaJson(PRODUCTOS_MOCK, 200))

    renderAdmin()

    expect(await screen.findByText('Crema de Maní Natural — 500 g')).toBeTruthy()
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:8080/products', jasmine.objectContaining({ method: 'GET' }))
  })

  it('muestra errores de validación si se envía vacío y no llama a POST', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(respuestaJson(PRODUCTOS_MOCK, 200))

    renderAdmin()
    await screen.findByText('Crema de Maní Natural — 500 g')

    fireEvent.click(screen.getByText('Crear'))

    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy()
    expect(fetchSpy.calls.count()).toBe(1)
  })

  it('crea un producto vía POST y refresca la tabla', async () => {
    const nuevo = { id: 3, nombre: 'Avena', precio: 2000, categoria: 'Cereales', stock: 10, img: '' }
    let creado = false

    const fetchSpy = spyOn(window, 'fetch').and.callFake((url, options = {}) => {
      if (options.method === 'POST') {
        creado = true
        return respuestaJson(nuevo, 201)
      }
      return respuestaJson(creado ? [...PRODUCTOS_MOCK, nuevo] : PRODUCTOS_MOCK, 200)
    })

    renderAdmin()
    await screen.findByText('Crema de Maní Natural — 500 g')

    escribir('Nombre', 'Avena')
    escribir('Precio', '2000')
    escribir('Categoría', 'Cereales')
    escribir('Stock', '10')
    fireEvent.click(screen.getByText('Crear'))

    expect(await screen.findByText('Avena')).toBeTruthy()
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:8080/products',
      jasmine.objectContaining({ method: 'POST' })
    )
  })

  it('elimina solo después de confirmar en el modal', async () => {
    let borrado = false

    const fetchSpy = spyOn(window, 'fetch').and.callFake((url, options = {}) => {
      if (options.method === 'DELETE') {
        borrado = true
        return Promise.resolve({ status: 204, ok: true, json: () => Promise.resolve({}) })
      }
      return respuestaJson(borrado ? [PRODUCTOS_MOCK[1]] : PRODUCTOS_MOCK, 200)
    })

    renderAdmin()
    await screen.findByText('Crema de Maní Natural — 500 g')

    fireEvent.click(screen.getAllByText('Eliminar')[0])
    expect(screen.getByText('Eliminar producto')).toBeTruthy()

    fireEvent.click(screen.getByText('Sí, eliminar'))

    await screen.findByText(/fue eliminado/i)
    expect(screen.queryByRole('cell', { name: 'Crema de Maní Natural — 500 g' })).toBeNull()
    
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:8080/products/1',
      jasmine.objectContaining({ method: 'DELETE' })
    )
  })

  it('no elimina si se cancela el modal', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(respuestaJson(PRODUCTOS_MOCK, 200))

    renderAdmin()
    await screen.findByText('Crema de Maní Natural — 500 g')

    fireEvent.click(screen.getAllByText('Eliminar')[0])
    fireEvent.click(screen.getByText('Cancelar'))

    expect(screen.getByRole('cell', { name: 'Crema de Maní Natural — 500 g' })).toBeTruthy()
    expect(fetchSpy.calls.count()).toBe(1)
  })
})