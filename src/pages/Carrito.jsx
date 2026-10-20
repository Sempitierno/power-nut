import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const clp = (n) => n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

function Carrito() {
 const { items, quitar, total } = useCart()
 const { usuario } = useAuth()
 const navigate = useNavigate()
 const irAPagar = () => navigate(usuario ? '/pago' : '/login')
 return (
  <main className="minimal-container">
   <h2 className="cart-title">Tu carrito de compras</h2>
   <div className="cart-layout">
    <div className="cart-items">
     {items.length === 0 && <p style={{ color: '#888', padding: '20px' }}>Tu carrito está vacío.</p>}
     {items.map((i) => (
      <div className="cart-item" key={i.id}>
       <div className="cart-item-info">
        <img className="cart-item-img" src={i.img} alt={i.nombre} />
        <div>
         <div className="cart-item-name">{i.nombre}</div>
         <div className="cart-item-price">{clp(i.precio)} × {i.cantidad}</div>
        </div>
       </div>
       <button className="remove-btn" onClick={() => quitar(i.id)}>Quitar</button>
      </div>
     ))}
    </div>
    <div className="cart-summary">
     <h3>Resumen del pedido</h3>
     <div className="total-row"><span>TOTAL:</span><span id="cart-total">{clp(total)}</span></div>
     {/* disabled evita navegar con carrito vacío */}
     <button className="btn btn-primary full-width" disabled={items.length === 0} onClick={irAPagar}>
      Proceder al pago
     </button>
    </div>
   </div>
  </main>
 )
}

export default Carrito
