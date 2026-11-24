import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { obtenerProductos, obtenerProductoPorId } from '../services/productosService.js'
import { Alert, Modal, Button } from 'react-bootstrap'
import Notificacion from '../components/Notificaciones.jsx'

const IMG_MANI = 'https://mejorconsalud.as.com/wp-content/uploads/2020/09/frasco-mantequilla-cacahuete.jpg'
const IMG_CACAO = 'https://blog.pizcadesabor.com/wp-content/uploads/2013/12/Crema-5.jpg'
const clp = (n) => Number(n || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

function Home() {
  const { agregar } = useCart()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCatalogo, setErrorCatalogo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [aviso, setAviso] = useState('')

  // Estado del modal de detalle (GET /products/{id})
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [errorDetalle, setErrorDetalle] = useState('')
  const [detalle, setDetalle] = useState(null)

  useEffect(() => {
    let activo = true
    async function cargarCatalogo() {
      setCargando(true)
      setErrorCatalogo('')
      try {
        const data = await obtenerProductos()
        if (activo) {
          setProductos(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (activo) {
          setErrorCatalogo(err.message || 'No se pudieron cargar los productos')
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }
    cargarCatalogo()
    return () => {
      activo = false
    }
  }, [])

  const abrirDetalle = async (id) => {
    setModalAbierto(true)
    setCargandoDetalle(true)
    setErrorDetalle('')
    setDetalle(null)
    try {
      const data = await obtenerProductoPorId(id)
      setDetalle(data)
    } catch (err) {
      setErrorDetalle(err.message || 'No se pudo cargar el detalle del producto')
    } finally {
      setCargandoDetalle(false)
    }
  }

  const cerrarDetalle = () => {
    setModalAbierto(false)
    setDetalle(null)
    setErrorDetalle('')
  }

  // Agrega al carrito y muestra la notificación
  const agregarAlCarrito = (producto) => {
    agregar(producto)
    setAviso(`${producto.nombre} se agregó al carrito`)
  }

  const enviarContacto = (e) => {
    e.preventDefault()
    setEnviado(true)
    e.target.reset()
  }

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="badge">• 100% NATURAL · SIN CONSERVANTES</span>
          <h1>El sabor natural<span><br />que te da energía</span></h1>
          <p className="parrafo"><strong>PowertNut elabora cremas de maní y mermeladas artesanales con ingredientes cuidadosamente seleccionados. Sin aditivos — solo lo mejor de la naturaleza.</strong></p>
          <div className="hero-buttons">
            <a href="#catalogo" className="btn btn-primary">Ver productos</a>
            <Link to="/registro" className="btn btn-secondary">Registrarse gratis</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={IMG_MANI} alt="Crema de maní artesanal" />
          <div className="customer-badge">
            <span className="bold">+1.200 clientes</span> <span>en todo Chile</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <span className="feature-icon">🌿</span>
          <div className="feature-text"><h3>Ingredientes naturales</h3><p>Sin colorantes ni aditivos</p></div>
        </div>
        <div className="feature">
          <span className="feature-icon">🥜</span>
          <div className="feature-text"><h3>Maní premium</h3><p>Seleccionado y tostado artesanalmente</p></div>
        </div>
        <div className="feature">
          <span className="feature-icon">🍓</span>
          <div className="feature-text"><h3>Frutas de temporada</h3><p>Mermeladas con fruta local fresca</p></div>
        </div>
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <div className="feature-text"><h3>Envío a todo Chile</h3><p>Despacho rápido y seguro</p></div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="products-section">
        <div className="section-header">
          <span className="subtitle">CATÁLOGO</span>
          <h2>Nuestros productos</h2>
          <p>Cremas de maní en distintos formatos y mermeladas artesanales elaboradas con ingredientes de la más alta calidad.</p>
        </div>

        {cargando && <p style={{ textAlign: 'center' }}>Cargando catálogo de productos...</p>}

        {errorCatalogo && (
          <Alert variant="danger" role="alert">
            Error al cargar el catálogo: {errorCatalogo}
          </Alert>
        )}

        {!cargando && !errorCatalogo && (
          <div className="products-grid">
            {productos.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                onAgregar={agregarAlCarrito}
                onVerDetalle={abrirDetalle}
              />
            ))}

            <div className="product-card" style={{ opacity: 0.85 }}>
              <div className="product-image">
                <span className="product-weight" style={{ background: '#3E2723', color: 'white' }}>Novedad</span>
                <img src={IMG_CACAO} alt="Producto próximamente" style={{ filter: 'grayscale(40%)' }} />
              </div>
              <div className="product-info">
                <span className="product-category">PRÓXIMAMENTE</span>
                <h3 className="product-title">Crema de Maní con Cacao</h3>
                <p className="product-price" style={{ color: '#888', fontSize: '1.1rem' }}>Coming Soon</p>
                <button className="btn btn-secondary add-to-cart" disabled style={{ cursor: 'not-allowed', borderColor: '#ccc', color: '#888' }}>No disponible</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Contacto */}
      <section className="contact-section">
        <div className="contact-container">
          <h2>¿Tienes alguna duda?</h2>
          <p>Escríbenos y te responderemos lo antes posible.</p>
          {enviado && (
            <Alert variant="success" dismissible onClose={() => setEnviado(false)} role="status">
              Mensaje enviado con éxito
            </Alert>
          )}
          <form className="contact-form" onSubmit={enviarContacto}>
            <input type="text" placeholder="Tu nombre" required />
            <input type="email" placeholder="Tu correo electrónico" required />
            <textarea rows="4" placeholder="Tu mensaje..." required></textarea>
            <button type="submit" className="btn btn-primary">Enviar mensaje</button>
          </form>
        </div>
      </section>

      {/* Modal de detalle del producto */}
      <Modal show={modalAbierto} onHide={cerrarDetalle} centered>
        <Modal.Header closeButton>
          <Modal.Title>{detalle?.nombre || 'Detalle del producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cargandoDetalle && <p>Cargando detalle...</p>}
          {errorDetalle && <Alert variant="danger">{errorDetalle}</Alert>}
          {!cargandoDetalle && !errorDetalle && detalle && (
            <div>
              <img
                src={detalle.img || IMG_MANI}
                alt={detalle.nombre}
                style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
              />
              <p className="mb-1"><strong>Categoría:</strong> {detalle.categoria}</p>
              <p className="mb-1"><strong>Precio:</strong> {clp(detalle.precio)}</p>
              <p className="mb-1"><strong>Stock disponible:</strong> {detalle.stock ?? 0} unidades</p>
              <p className="mb-0 text-muted"><small>Código de producto: #{detalle.id}</small></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarDetalle}>Cerrar</Button>
          {detalle && (
            <Button
              variant="primary"
              disabled={(detalle.stock ?? 0) <= 0}
              onClick={() => {
                agregarAlCarrito({ ...detalle, img: detalle.img || IMG_MANI })
                cerrarDetalle()
              }}
            >
              {(detalle.stock ?? 0) <= 0 ? 'Sin stock' : 'Añadir al carrito'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Notificacion mensaje={aviso} onClose={() => setAviso('')} />
    </main>
  )
}

export default Home