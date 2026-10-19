import { render, screen, fireEvent } from '@testing-library/react'
import AdminProductos from './AdminProductos.jsx'

const escribir = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('AdminProductos', () => {
  beforeEach(() => localStorage.clear())

  it('lista los productos iniciales', () => {
    render(<AdminProductos />)
    expect(screen.getByText('Crema de Maní Natural — 500 g')).toBeTruthy()
  })

  it('muestra errores si se envía vacío y no crea nada', () => {
    render(<AdminProductos />)
    fireEvent.click(screen.getByText('Crear'))
    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy()
    expect(screen.getAllByText('Eliminar').length).toBe(2)
  })

  it('crea un producto y aparece en la tabla', () => {
    render(<AdminProductos />)
    escribir('Nombre', 'Avena'); escribir('Precio', '2000'); escribir('Categoría', 'Cereales')
    fireEvent.click(screen.getByText('Crear'))
    expect(screen.getByText('Avena')).toBeTruthy()
  })

  it('elimina solo si se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(true) // mock del diálogo nativo
    render(<AdminProductos />)
    fireEvent.click(screen.getAllByText('Eliminar')[0])
    expect(screen.queryByText('Crema de Maní Natural — 500 g')).toBeNull()
  })
})