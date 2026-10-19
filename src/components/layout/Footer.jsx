import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="logo-icon">🥜</span>
          <span className="logo-text">PowertNut</span>
          <p>El sabor natural que te da energía, sin conservantes ni aditivos.</p>
        </div>
        <div className="footer-links">
          <h4>Enlaces útiles</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><a href="/#catalogo">Productos</a></li>
            <li><Link to="/carrito">Carrito</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/josa_b.m.m?cplk=enQzbGZkcm50Nmgy" target="_blank" rel="noopener noreferrer">JO</a>
            <a href="https://www.instagram.com/eln4ch0_0?cplk=MTRvZWY5Zzl6NjVpNA==" target="_blank" rel="noopener noreferrer">NA</a>
            <a href="https://www.instagram.com/sempitiern0/" target="_blank" rel="noopener noreferrer">TO</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 PowertNut. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
