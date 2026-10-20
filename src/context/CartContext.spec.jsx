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
