import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const clp = (n) => n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
function Pago() {
 const { items, total, vaciar } = useCart()
 // Foto de la orden al montar: después de vaciar() el carrito queda en 0
 const [orden] = useState(() => ({ items, total, numero: `PN-${Date.now()}` }))
 const [estado, setEstado] = useState('pendiente') // pendiente | procesando | aprobado | anulado
 // Carrito vacío y sin pago en curso: no hay nada que pagar
 if (items.length === 0 && estado === 'pendiente') return <Navigate to="/carrito" replace />
 const pagar = () => {
  setEstado('procesando')
  setTimeout(() => { vaciar(); setEstado('aprobado') }, 1500) // simula latencia de Webpay
 }
 return (
  <main className="minimal-container">
   <div className="form-box">
    <h2>Webpay (simulado)</h2>
    <p style={{ textAlign: 'center' }}>Orden {orden.numero}</p>
    {estado === 'aprobado' ? (
     <>
      <p style={{ textAlign: 'center', margin: '20px 0' }}>✅ Pago aprobado por {clp(orden.total)}</p>
      <Link to="/" className="btn btn-primary full-width">Volver al inicio</Link>
     </>
    ) : estado === 'anulado' ? (
     <>
      <p style={{ textAlign: 'center', margin: '20px 0' }}>❌ Pago anulado. Tu carrito se mantiene.</p>
      <Link to="/carrito" className="btn btn-primary full-width">Volver al carrito</Link>
     </>
    ) : (
     <>
      <ul style={{ margin: '20px 0' }}>
       {orden.items.map((i) => <li key={i.id}>{i.nombre} × {i.cantidad}</li>)}
      </ul>
      <p><strong>Total a pagar: {clp(orden.total)}</strong></p>
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