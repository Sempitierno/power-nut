import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from './ProductCard.jsx'

// Imagen por defecto que usa el componente cuando el producto no trae "img"
const IMG_DEFAULT = 'https://mejorconsalud.as.com/wp-content/uploads/2020/09/frasco-mantequilla-cacahuete.jpg'

// Producto de ejemplo con todos los datos que llegan por props
const producto = {
  id: 1,
  nombre: 'Crema de Maní Natural — 500 g',
  precio: 6990,
  categoria: 'Crema de maní',
  img: 'https://ejemplo.com/crema-mani.jpg',
}

describe('ProductCard', () => {
  it('muestra el nombre, la categoría en mayúsculas y el precio en CLP', () => {
    render(<ProductCard producto={producto} onAgregar={() => {}} />)
    // El nombre se muestra tal cual viene por props
    expect(screen.getByText('Crema de Maní Natural — 500 g')).toBeTruthy()
    // La categoría se pinta en mayúsculas
    expect(screen.getByText('CREMA DE MANÍ')).toBeTruthy()
    // El precio se formatea como moneda chilena (6.990 -> $6.990)
    expect(screen.getByText('$6.990')).toBeTruthy()
  })

  it('llama a onAgregar con el producto al hacer clic en "Añadir al carrito"', () => {
    // Spy para comprobar que se invoca el callback con el producto
    const onAgregar = jasmine.createSpy('onAgregar')
    render(<ProductCard producto={producto} onAgregar={onAgregar} />)
    fireEvent.click(screen.getByText('Añadir al carrito'))
    // Se llama una sola vez y con el producto recibido por props
    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar.calls.mostRecent().args[0]).toEqual(producto)
  })

  it('usa una imagen por defecto si el producto no trae img', () => {
    // Producto creado desde el admin: viene sin imagen
    const sinImagen = { id: 2, nombre: 'Avena', precio: 2000, categoria: 'Cereales' }
    const onAgregar = jasmine.createSpy('onAgregar')
    render(<ProductCard producto={sinImagen} onAgregar={onAgregar} />)
    // La img del DOM es la imagen por defecto
    const img = screen.getByAltText('Avena')
    expect(img.getAttribute('src')).toBe(IMG_DEFAULT)
    // Y al agregar se envía el producto con la imagen ya resuelta
    fireEvent.click(screen.getByText('Añadir al carrito'))
    expect(onAgregar.calls.mostRecent().args[0].img).toBe(IMG_DEFAULT)
  })
})
