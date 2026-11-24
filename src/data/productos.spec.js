import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../services/productosService.js'

function mockRespuesta(data, status = 200) {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(data),
  })
}

describe('productosService.js (HTTP simulado)', () => {
  beforeEach(() => localStorage.clear())

  afterEach(() => {
    if (window.fetch && window.fetch.and) {
      window.fetch.and.stub()
    }
  })

  it('obtenerProductos consulta GET /products y devuelve la lista', async () => {
    const lista = [{ id: 1, nombre: 'Crema de Maní', precio: 6990, categoria: 'Crema de maní', stock: 20 }]
    spyOn(window, 'fetch').and.returnValue(mockRespuesta(lista, 200))

    const res = await obtenerProductos()

    // Todo pasa por el gateway (8080); GET /products es público
    expect(window.fetch.calls.mostRecent().args[0]).toBe('http://localhost:8080/products')
    expect(window.fetch.calls.mostRecent().args[1].method).toBe('GET')
    expect(res.length).toBe(1)
    expect(res[0].nombre).toBe('Crema de Maní')
  })

  it('obtenerProductoPorId lanza error cuando la API responde 404', async () => {
    spyOn(window, 'fetch').and.returnValue(mockRespuesta({ error: 'Producto no encontrado' }, 404))

    await expectAsync(obtenerProductoPorId(999)).toBeRejectedWithError('Producto no encontrado')
  })

  it('crearProducto envía POST con el token Bearer (sin X-User-Rol: lo pone el gateway)', async () => {
    const nuevo = { nombre: 'Avena', precio: 2500, categoria: 'Cereales', img: '', stock: 15 }
    localStorage.setItem('tokens', JSON.stringify({ token: 'jwt-demo', refreshToken: 'r' }))
    spyOn(window, 'fetch').and.returnValue(mockRespuesta({ id: 3, ...nuevo }, 201))

    const creado = await crearProducto(nuevo)

    expect(creado.id).toBe(3)
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/products',
      jasmine.objectContaining({
        method: 'POST',
        headers: jasmine.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer jwt-demo',
        }),
      })
    )
    // El front nunca manda el rol: así nadie puede hacerse pasar por ADMIN
    expect(window.fetch.calls.mostRecent().args[1].headers['X-User-Rol']).toBeUndefined()
  })

  it('actualizarProducto envía PUT /products/{id} y rechaza si responde 403', async () => {
    spyOn(window, 'fetch').and.returnValue(mockRespuesta({ error: 'Acceso denegado' }, 403))

    await expectAsync(
      actualizarProducto(1, { nombre: 'X', precio: 1000, categoria: 'Cat', img: '', stock: 5 })
    ).toBeRejectedWithError('Acceso denegado')
  })

  it('eliminarProducto envía DELETE /products/{id} y soporta respuesta 204', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        status: 204,
        ok: true,
        json: () => Promise.resolve({}),
      })
    )

    const res = await eliminarProducto(1)

    expect(res).toBeNull()
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/products/1',
      jasmine.objectContaining({ method: 'DELETE' })
    )
  })
})
