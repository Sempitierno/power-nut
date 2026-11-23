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
  afterEach(() => {
    if (window.fetch && window.fetch.and) {
      window.fetch.and.stub()
    }
  })

  it('obtenerProductos consulta GET /products y devuelve la lista', async () => {
    const lista = [{ id: 1, nombre: 'Crema de Maní', precio: 6990, categoria: 'Crema de maní', stock: 20 }]
    spyOn(window, 'fetch').and.returnValue(mockRespuesta(lista, 200))

    const res = await obtenerProductos()

    expect(window.fetch).toHaveBeenCalledWith('http://localhost:8082/products')
    expect(res.length).toBe(1)
    expect(res[0].nombre).toBe('Crema de Maní')
  })

  it('obtenerProductoPorId lanza error cuando la API responde 404', async () => {
    spyOn(window, 'fetch').and.returnValue(mockRespuesta({ error: 'Producto no encontrado' }, 404))

    await expectAsync(obtenerProductoPorId(999)).toBeRejectedWithError('Producto no encontrado')
  })

  it('crearProducto envía POST con X-User-Rol ADMIN y devuelve el producto creado', async () => {
    const nuevo = { nombre: 'Avena', precio: 2500, categoria: 'Cereales', img: '', stock: 15 }
    spyOn(window, 'fetch').and.returnValue(mockRespuesta({ id: 3, ...nuevo }, 201))

    const creado = await crearProducto(nuevo, { rol: 'ADMIN', token: 'jwt-demo' })

    expect(creado.id).toBe(3)
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:8082/products',
      jasmine.objectContaining({
        method: 'POST',
        headers: jasmine.objectContaining({
          'Content-Type': 'application/json',
          'X-User-Rol': 'ADMIN',
          Authorization: 'Bearer jwt-demo',
        }),
      })
    )
  })

  it('actualizarProducto envía PUT /products/{id} y rechaza si responde 403', async () => {
    spyOn(window, 'fetch').and.returnValue(mockRespuesta({ error: 'Acceso denegado' }, 403))

    await expectAsync(
      actualizarProducto(1, { nombre: 'X', precio: 1000, categoria: 'Cat', img: '', stock: 5 }, { rol: 'CLIENTE' })
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

    const res = await eliminarProducto(1, { rol: 'ADMIN' })

    expect(res).toBeNull()
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:8082/products/1',
      jasmine.objectContaining({ method: 'DELETE' })
    )
  })
})
