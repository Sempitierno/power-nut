import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext.jsx'

const PRODUCTO = { id: 1, nombre: 'Crema de Maní', precio: 6990 }

// Componente de prueba que consume el contexto del carrito
function BancoDePruebas() {
  const { items, agregar, quitar, total, totalItems } = useCart()
  return (
    <div>
      <span data-testid="total">{total}</span>
      <span data-testid="total-items">{totalItems}</span>
      <ul>
        {items.map((i) => (
          <li key={i.id}>{i.nombre} x{i.cantidad}</li>
        ))}
      </ul>
      <button onClick={() => agregar(PRODUCTO)}>Agregar</button>
      <button onClick={() => quitar(PRODUCTO.id)}>Quitar</button>
    </div>
  )
}

const renderCarrito = () =>
  render(
    <CartProvider>
      <BancoDePruebas />
    </CartProvider>,
  )

describe('CartContext', () => {
  beforeEach(() => localStorage.clear())

  it('agrega el producto con cantidad 1 cuando no existe', () => {
    renderCarrito()
    fireEvent.click(screen.getByText('Agregar'))
    expect(screen.getByText('Crema de Maní x1')).toBeTruthy()
    expect(screen.getByTestId('total-items').textContent).toBe('1')
  })

  it('agregar suma cantidad si el producto ya existe', () => {
    // El producto ya está en el carrito con cantidad 2
    localStorage.setItem('cart', JSON.stringify([{ ...PRODUCTO, cantidad: 2 }]))
    renderCarrito()
    fireEvent.click(screen.getByText('Agregar'))
    // La cantidad sube de 2 a 3 y no se duplica la entrada
    expect(screen.getAllByText('Crema de Maní x3').length).toBe(1)
    expect(screen.getByTestId('total-items').textContent).toBe('3')
  })

  it('quitar elimina el producto del carrito', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...PRODUCTO, cantidad: 2 }, { id: 2, nombre: 'Avena', precio: 2000, cantidad: 1 }]),
    )
    renderCarrito()
    fireEvent.click(screen.getByText('Quitar'))
    // Desaparece el producto quitado y queda el otro
    expect(screen.queryByText('Crema de Maní x2')).toBeNull()
    expect(screen.getByText('Avena x1')).toBeTruthy()
  })

  it('total se calcula como precio por cantidad', () => {
    // 6990 x 2 + 2000 x 3 = 19980
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...PRODUCTO, cantidad: 2 }, { id: 2, nombre: 'Avena', precio: 2000, cantidad: 3 }]),
    )
    renderCarrito()
    expect(screen.getByTestId('total').textContent).toBe('19980')
    expect(screen.getByTestId('total-items').textContent).toBe('5')
  })
})

// ---- Carrito con sesión: vive en el microservicio de pedidos ----
import { act } from '@testing-library/react'
import { AuthProvider } from './AuthContext.jsx'
import { respuesta, esperarPromesas } from '../test/mockFetch.js'

const CARRITO_SERVIDOR = {
  usuarioId: 7,
  items: [{ id: 50, productoId: 1, nombre: 'Crema de Maní', precio: 6990, img: '', cantidad: 2 }],
  total: 13980,
  totalItems: 2,
}

// Responde según la URL, como lo haría el gateway
function backendSimulado(rutas) {
  return spyOn(window, 'fetch').and.callFake((url, opciones) => {
    const clave = `${opciones.method} ${url.replace('http://localhost:8080', '')}`
    const r = rutas[clave]
    return r ? r() : respuesta(404, { error: `sin mock para ${clave}` })
  })
}

const renderConSesion = () =>
  render(
    <AuthProvider>
      <CartProvider>
        <BancoDePruebas />
      </CartProvider>
    </AuthProvider>,
  )

describe('CartContext con sesión (backend de pedidos)', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('tokens', JSON.stringify({ token: 't', refreshToken: 'r' }))
  })

  it('al iniciar sesión carga el carrito desde GET /api/v1/cart', async () => {
    backendSimulado({
      'GET /users/me': () => respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }),
      'GET /api/v1/cart': () => respuesta(200, CARRITO_SERVIDOR),
    })
    renderConSesion()
    expect(await screen.findByText('Crema de Maní x2')).toBeTruthy()
    expect(screen.getByTestId('total').textContent).toBe('13980')
  })

  it('sube al backend el carrito que tenía como invitado', async () => {
    localStorage.setItem('cart', JSON.stringify([{ ...PRODUCTO, cantidad: 3 }]))
    const spy = backendSimulado({
      'GET /users/me': () => respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }),
      'POST /api/v1/cart/items': () => respuesta(201, CARRITO_SERVIDOR),
      'GET /api/v1/cart': () => respuesta(200, CARRITO_SERVIDOR),
    })
    renderConSesion()
    await screen.findByText('Crema de Maní x2')
    const post = spy.calls.all().find((c) => c.args[1].method === 'POST')
    expect(JSON.parse(post.args[1].body)).toEqual({ productoId: 1, cantidad: 3 })
    expect(JSON.parse(localStorage.getItem('cart')) || []).toEqual([]) // ya no queda carrito de invitado
  })

  it('agregar hace POST /api/v1/cart/items y usa la respuesta del backend', async () => {
    const spy = backendSimulado({
      'GET /users/me': () => respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }),
      'GET /api/v1/cart': () => respuesta(200, { ...CARRITO_SERVIDOR, items: [] }),
      'POST /api/v1/cart/items': () => respuesta(201, CARRITO_SERVIDOR),
    })
    renderConSesion()
    await esperarPromesas()
    await act(async () => fireEvent.click(screen.getByText('Agregar')))
    expect(await screen.findByText('Crema de Maní x2')).toBeTruthy()
    const post = spy.calls.all().find((c) => c.args[1].method === 'POST')
    expect(JSON.parse(post.args[1].body)).toEqual({ productoId: 1, cantidad: 1 })
  })

  it('quitar hace DELETE /api/v1/cart/items/{id}', async () => {
    const spy = backendSimulado({
      'GET /users/me': () => respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }),
      'GET /api/v1/cart': () => respuesta(200, CARRITO_SERVIDOR),
      'DELETE /api/v1/cart/items/1': () => respuesta(200, { ...CARRITO_SERVIDOR, items: [] }),
    })
    renderConSesion()
    await screen.findByText('Crema de Maní x2')
    await act(async () => fireEvent.click(screen.getByText('Quitar')))
    await esperarPromesas()
    expect(screen.queryByText('Crema de Maní x2')).toBeNull()
    expect(spy.calls.all().some((c) => c.args[1].method === 'DELETE')).toBeTrue()
  })
})
