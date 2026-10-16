import { Link } from "react-router-dom"

function Footer(){
    return (
    <>
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
                    <li><Link to="/#catalogo">Productos</Link></li>
                    <li><Link to="/carrito">Carrito</Link></li>
                </ul>
            </div>
            <div className="footer-social">
                <h4>Síguenos</h4>
                <div className="social-icons">
                    <Link href="#">IG</Link>
                    <Link href="#">FB</Link>
                    <Link href="#">TK</Link>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2026 PowertNut. Todos los derechos reservados.</p>
        </div>
    </footer>
    </>
    )
}

export default Footer