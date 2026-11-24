import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../services/api.js'

const clp = (n) => Number(n).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

// Pago simulado tipo Webpay contra el microservicio de pedidos:
// 1) POST /api/v1/orders   → crea la orden con el carrito del usuario (valida stock)
// 2) POST /api/v1/payments → paga la orden (APROBADO descuenta stock en catálogo)
function Pago() {
  const { items, total, cargando, vaciar } = useCart()
  const [estado, setEstado] = useState('pendiente') // pendiente | procesando | aprobado | anulado
  const [comprobante, setComprobante] = useState(null)
  const [error, setError] = useState('')

  if (cargando) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando...</p>
  // Carrito vacío y sin pago en curso: no hay nada que pagar
  if (items.length === 0 && estado === 'pendiente') return <Navigate to="/carrito" replace />

  const pagar = async () => {
    setEstado('procesando')
    setError('')
    try {
      const orden = await api('/api/v1/orders', { method: 'POST' })
      const pago = await api('/api/v1/payments', {
        method: 'POST',
        body: { ordenId: orden.id, resultado: 'APROBADO' },
      })
      setComprobante(pago)
      setEstado('aprobado')
      vaciar() // el backend ya vació el carrito al crear la orden; esto actualiza la vista
    } catch (err) {
      setError(err.message) // ej: "Stock insuficiente para ..."
      setEstado('pendiente')
    }
  }

  return (
    <main className="minimal-container">
      <div className="form-box">
        <h2>Webpay (simulado)</h2>
        {estado === 'aprobado' ? (
          <>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>✅ Pago aprobado por {clp(comprobante.monto)}</p>
            <p style={{ textAlign: 'center' }}>Orden #{comprobante.ordenId}</p>
            <p style={{ textAlign: 'center' }}>Código de transacción: <strong>{comprobante.codigoTransaccion}</strong></p>
            <Link to="/" className="btn btn-primary full-width">Volver al inicio</Link>
          </>
        ) : estado === 'anulado' ? (
          <>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>❌ Pago anulado. Tu carrito se mantiene.</p>
            <Link to="/carrito" className="btn btn-primary full-width">Volver al carrito</Link>
          </>
        ) : (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            <ul style={{ margin: '20px 0' }}>
              {items.map((i) => <li key={i.id}>{i.nombre} × {i.cantidad}</li>)}
            </ul>
            <p><strong>Total a pagar: {clp(total)}</strong></p>
            <button className="btn btn-primary full-width" disabled={estado === 'procesando'} onClick={pagar}>
              {estado === 'procesando' ? 'Procesando...' : 'Pagar'}
            </button>
            <button className="btn btn-secondary full-width" style={{ marginTop: 10 }}
              disabled={estado === 'procesando'} onClick={() => setEstado('anulado')}>
              Anular
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default Pago
