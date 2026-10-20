import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

function Header() {
  const { usuario, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const cerrarSesion = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">🥜</span>
        <span className="logo-text">PowertNut</span>
      </div>

      <nav className="nav">
        <ul>
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><a href="/#catalogo">Productos</a></li>
          <li><NavLink to="/carrito">Carrito</NavLink></li>
          {usuario?.rol === 'admin' && <li><NavLink to="/admin/productos">Admin</NavLink></li>}
        </ul>
      </nav>

      <div className="header-actions">
        <Link to="/carrito" className="cart-btn"><span className="cart-icon">🛒</span> Cart ({totalItems})</Link>
        {usuario ? (
          <>
            <span>Hola, {usuario.nombre}</span>
            <button className="login-btn" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">Iniciar sesión</Link>
            <Link to="/registro" className="register-btn">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
