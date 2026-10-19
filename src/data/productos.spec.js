import { STORAGE_KEY, obtenerProductos, crearProducto, actualizarProducto, eliminarProducto, validarProducto } from './productos.js'

describe('productos.js', () => {
  beforeEach(() => localStorage.clear())

  it('obtenerProductos carga la semilla y la persiste', () => {
    expect(obtenerProductos().length).toBe(2)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).length).toBe(2)
  })

  it('no muta la semilla original', () => {
    obtenerProductos().push({ id: 99 })
    localStorage.clear()
    expect(obtenerProductos().length).toBe(2) // falla si se devuelve la constante
  })

  it('se recupera de JSON corrupto', () => {
    localStorage.setItem(STORAGE_KEY, '{roto')
    expect(obtenerProductos().length).toBe(2)
  })

  it('crearProducto asigna id secuencial y convierte el precio a número', () => {
    const p = crearProducto({ nombre: ' Avena ', precio: '2000', categoria: 'Cereales' })
    expect(p.id).toBe(3)
    expect(p.precio).toBe(2000)
    expect(p.nombre).toBe('Avena')
    expect(obtenerProductos().length).toBe(3)
  })

  it('actualizarProducto modifica sin cambiar el id', () => {
    const a = actualizarProducto(1, { precio: '7500', id: 500 })
    expect(a.precio).toBe(7500)
    expect(a.id).toBe(1)
  })

  it('actualizarProducto devuelve null si no existe', () => {
    expect(actualizarProducto(999, { precio: 1 })).toBeNull()
  })

  it('eliminarProducto devuelve true al borrar y false si no existe', () => {
    expect(eliminarProducto(1)).toBeTrue()
    expect(obtenerProductos().length).toBe(1)
    expect(eliminarProducto(1)).toBeFalse()
  })

  it('validarProducto detecta campos inválidos y acepta uno válido', () => {
    expect(Object.keys(validarProducto({ nombre: '', precio: 0, categoria: ' ' })).length).toBe(3)
    expect(validarProducto({ nombre: 'A', precio: '10', categoria: 'B' })).toEqual({})
  })
})