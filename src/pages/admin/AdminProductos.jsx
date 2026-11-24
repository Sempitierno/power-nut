// CRUD de productos (solo admin): crear, listar, editar y eliminar conectado a API
import { useEffect, useState } from 'react'
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap'
import Notificacion from '../../components/Notificaciones.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../services/productosService.js'

const VACIO = { nombre: '', precio: '', categoria: '', img: '', stock: '' }
const clp = (n) => Number(n || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

function validarFormulario(datos) {
  const errores = {}
  if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
  const precioNum = Number(datos.precio)
  if (datos.precio === '' || Number.isNaN(precioNum) || precioNum <= 0) {
    errores.precio = 'El precio debe ser mayor a 0'
  }
  if (!datos.categoria.trim()) errores.categoria = 'La categoría es obligatoria'
  if (datos.img.trim() && !/^https?:\/\/.+/i.test(datos.img.trim())) {
    errores.img = 'La URL de imagen debe comenzar con http:// o https://'
  }
  const stockNum = Number(datos.stock)
  if (datos.stock === '' || Number.isNaN(stockNum) || stockNum < 0) {
    errores.stock = 'El stock debe ser 0 o mayor'
  }
  return errores
}

function AdminProductos() {
  const { usuario } = useAuth()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorApi, setErrorApi] = useState('')
  const [datos, setDatos] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [errores, setErrores] = useState({})
  const [aEliminar, setAEliminar] = useState(null)
  const [aviso, setAviso] = useState('')

  const refrescar = async () => {
    setCargando(true)
    setErrorApi('')
    try {
      const lista = await obtenerProductos()
      setProductos(Array.isArray(lista) ? lista : [])
    } catch (err) {
      setErrorApi(err.message || 'No se pudieron cargar los productos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    refrescar()
  }, [])

  const limpiar = () => {
    setDatos(VACIO)
    setEditandoId(null)
    setErrores({})
  }

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const guardarForm = async (e) => {
    e.preventDefault()
    setErrorApi('')
    const encontrados = validarFormulario(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    const payload = {
      nombre: datos.nombre.trim(),
      precio: Number(datos.precio),
      categoria: datos.categoria.trim(),
      img: datos.img.trim(),
      stock: Number(datos.stock),
    }

    setGuardando(true)
    try {
      if (editandoId === null) {
        await crearProducto(payload, usuario)
        setAviso(`"${payload.nombre}" fue creado`)
      } else {
        await actualizarProducto(editandoId, payload, usuario)
        setAviso(`"${payload.nombre}" fue actualizado`)
      }
      await refrescar()
      limpiar()
    } catch (err) {
      setErrorApi(err.message || 'Error al guardar el producto')
    } finally {
      setGuardando(false)
    }
  }

  const editar = (p) => {
    setEditandoId(p.id)
    setDatos({
      nombre: p.nombre ?? '',
      precio: String(p.precio ?? ''),
      categoria: p.categoria ?? '',
      img: p.img ?? '',
      stock: String(p.stock ?? 0),
    })
    setErrores({})
    setErrorApi('')
  }

  const confirmarBorrado = async () => {
    if (!aEliminar) return
    setGuardando(true)
    setErrorApi('')
    try {
      await eliminarProducto(aEliminar.id, usuario)
      if (aEliminar.id === editandoId) limpiar()
      await refrescar()
      setAviso(`"${aEliminar.nombre}" fue eliminado`)
      setAEliminar(null)
    } catch (err) {
      setErrorApi(err.message || 'No se pudo eliminar el producto')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="minimal-container">
      <h2 className="cart-title">Administrar productos</h2>

      {errorApi && (
        <Alert variant="danger" role="alert" onClose={() => setErrorApi('')} dismissible>
          {errorApi}
        </Alert>
      )}

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
        <Form.Group className="mb-2" controlId="categoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Control name="categoria" value={datos.categoria} onChange={cambiar} isInvalid={!!errores.categoria} />
          <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-2" controlId="stock">
          <Form.Label>Stock</Form.Label>
          <Form.Control name="stock" type="number" min="0" value={datos.stock} onChange={cambiar} isInvalid={!!errores.stock} />
          <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="img">
          <Form.Label>URL de la imagen (opcional)</Form.Label>
          <Form.Control name="img" value={datos.img} onChange={cambiar} isInvalid={!!errores.img} placeholder="https://..." />
          <Form.Control.Feedback type="invalid">{errores.img}</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary" disabled={guardando}>
          {editandoId === null ? 'Crear' : 'Guardar cambios'}
        </Button>
        {editandoId !== null && (
          <Button variant="secondary" className="ms-2" onClick={limpiar} disabled={guardando}>
            Cancelar
          </Button>
        )}
      </Form>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{clp(p.precio)}</td>
                <td>{p.stock ?? 0}</td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => editar(p)}>Editar</Button>{' '}
                  <Button size="sm" variant="outline-danger" onClick={() => setAEliminar(p)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={aEliminar !== null} onHide={() => setAEliminar(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que quieres eliminar <strong>{aEliminar?.nombre}</strong>? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAEliminar(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarBorrado} disabled={guardando}>Sí, eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Notificacion mensaje={aviso} onClose={() => setAviso('')} />
    </main>
  )
}

export default AdminProductos
