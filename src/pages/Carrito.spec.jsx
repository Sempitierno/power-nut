import { screen, fireEvent } from '@testing-library/react'
import { renderConProviders } from '../test/renderConProviders.jsx'
import Carrito from './Carrito.jsx'

// Productos del carrito: cada uno lleva su cantidad y su imagen
const productos = [
  { id: 1, nombre: 'Crema de Maní Natural — 500 g', precio: 6990, cantidad: 2, img: 'https://ejemplo.com/1.jpg' },
  { id: 2, nombre: 'Crema de Maní Natural — 1 kg', precio: 11990, cantidad: 1, img: 'https://ejemplo.com/2.jpg' },
]

// El carrito se persiste en localStorage con la clave "cart"
const guardarCarrito = (items) => localStorage.setItem('cart', JSON.stringify(items))

describe('Carrito', () => {
  beforeEach(() => localStorage.clear())

  it('muestra el mensaje de carrito vacío sin productos', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
  })

  it('muestra los productos precargados y el total correcto', () => {
    // Se guarda el carrito antes de renderizar: el provider lo lee al montar
    guardarCarrito(productos)
    renderConProviders(<Carrito />)
    expect(screen.getByText('Crema de Maní Natural — 500 g')).toBeTruthy()
    expect(screen.getByText('Crema de Maní Natural — 1 kg')).toBeTruthy()
    // Total = 6990 x 2 + 11990 x 1 = 25970
    expect(document.getElementById('cart-total').textContent).toBe('$25.970')
  })

  it('el botón "Quitar" elimina el producto del carrito', () => {
    guardarCarrito(productos)
    renderConProviders(<Carrito />)
    // Hay un botón "Quitar" por producto: se quita el primero
    fireEvent.click(screen.getAllByText('Quitar')[0])
    // El producto quitado desaparece y el otro sigue en el carrito
    expect(screen.queryByText('Crema de Maní Natural — 500 g')).toBeNull()
    expect(screen.getByText('Crema de Maní Natural — 1 kg')).toBeTruthy()
  })
})
