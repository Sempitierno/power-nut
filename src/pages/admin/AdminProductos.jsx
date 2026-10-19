// TEMPORAL: aquí va el CRUD de productos (Integrante 3)
import { useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto, validarProducto } from '../../data/productos.js'

const VACIO = { nombre: '', precio: '', categoria: '', img: ''  }
const clp = (n) => Number(n).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

function AdminProductos() {
  // Inicializador perezoso: lee localStorage una sola vez al montar
  const [productos, setProductos] = useState(obtenerProductos)
  const [datos, setDatos] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [errores, setErrores] = useState({})

  const refrescar = () => setProductos(obtenerProductos())
  const limpiar = () => { setDatos(VACIO); setEditandoId(null); setErrores({}) }
  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const guardarForm = (e) => {
    e.preventDefault()
    const encontrados = validarProducto(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return
    if (editandoId === null) crearProducto(datos)
    else actualizarProducto(editandoId, datos)
    refrescar()
    limpiar()
  }

  const editar = (p) => {
    setEditandoId(p.id)
    setDatos({ nombre: p.nombre, precio: String(p.precio), categoria: p.categoria, img: p.img || ''  })
    setErrores({})
  }

  const borrar = (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return
    eliminarProducto(p.id)
    if (p.id === editandoId) limpiar() // evita editar un producto que ya no existe
    refrescar()
  }

  return (
    <main className="minimal-container">
      <h2 className="cart-title">Administrar productos</h2>

      <Form onSubmit={guardarForm} noValidate className="mb-4">
        <Form.Group className="mb-2" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-2" controlId="precio">
          <Form.Label>Precio</Form.Label>
          <Form.Control name="precio" type="number" value={datos.precio} onChange={cambiar} isInvalid={!!errores.precio} />
          <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="categoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Control name="categoria" value={datos.categoria} onChange={cambiar} isInvalid={!!errores.categoria} />
          <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="img">
        <Form.Label>URL de la imagen (opcional)</Form.Label>
        <Form.Control name="img" value={datos.img} onChange={cambiar} isInvalid={!!errores.img} placeholder="https://..." />
        <Form.Control.Feedback type="invalid">{errores.img}</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">{editandoId === null ? 'Crear' : 'Guardar cambios'}</Button>
        {editandoId !== null && <Button variant="secondary" className="ms-2" onClick={limpiar}>Cancelar</Button>}
      </Form>

      <Table responsive striped bordered>
        <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td><td>{p.categoria}</td><td>{clp(p.precio)}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => editar(p)}>Editar</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => borrar(p)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  )
}

export default AdminProductos