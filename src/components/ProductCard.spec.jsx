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
    expect(screen.getByText('Crema de Maní Natural — 500 g')).toBeTruthy()
    expect(screen.getByText('CREMA DE MANÍ')).toBeTruthy()
    expect(screen.getByText('$6.990')).toBeTruthy()
  })

  it('llama a onAgregar con el producto al hacer clic en "Añadir al carrito"', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    render(<ProductCard producto={producto} onAgregar={onAgregar} />)
    fireEvent.click(screen.getByText('Añadir al carrito'))
    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar.calls.mostRecent().args[0]).toEqual(producto)
  })

  it('usa una imagen por defecto si el producto no trae img', () => {
    const sinImagen = { id: 2, nombre: 'Avena', precio: 2000, categoria: 'Cereales' }
    const onAgregar = jasmine.createSpy('onAgregar')
    render(<ProductCard producto={sinImagen} onAgregar={onAgregar} />)
    const img = screen.getByAltText('Avena')
    expect(img.getAttribute('src')).toBe(IMG_DEFAULT)
    fireEvent.click(screen.getByText('Añadir al carrito'))
    expect(onAgregar.calls.mostRecent().args[0].img).toBe(IMG_DEFAULT)
  })

  it('llama a onVerDetalle con el id al hacer clic en "Ver detalle"', () => {
    const onVerDetalle = jasmine.createSpy('onVerDetalle')
    render(<ProductCard producto={producto} onAgregar={() => {}} onVerDetalle={onVerDetalle} />)
    fireEvent.click(screen.getByText('Ver detalle'))
    expect(onVerDetalle).toHaveBeenCalledWith(1)
  })
})