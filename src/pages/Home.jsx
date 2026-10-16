import { Link } from 'react-router-dom'

const IMG_MANI = 'https://mejorconsalud.as.com/wp-content/uploads/2020/09/frasco-mantequilla-cacahuete.jpg'
const IMG_CACAO = 'https://blog.pizcadesabor.com/wp-content/uploads/2013/12/Crema-5.jpg'

function Home() {
  const enviarContacto = (e) => {
    e.preventDefault()
    alert('Mensaje enviado con éxito')
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

      {/* Catálogo (el Integrante 2 lo cambia por ProductCard + localStorage) */}
      <section id="catalogo" className="products-section">
        <div className="section-header">
          <span className="subtitle">CATÁLOGO</span>
          <h2>Nuestros productos</h2>
          <p>Cremas de maní en distintos formatos y mermeladas artesanales elaboradas con ingredientes de la más alta calidad.</p>
        </div>

        <div className="products-grid">
          <div className="product-card">
            <div className="product-image">
              <span className="product-weight">500 g</span>
              <img src={IMG_MANI} alt="Crema de Maní Natural 500g" />
            </div>
            <div className="product-info">
              <span className="product-category">CREMA DE MANÍ</span>
              <h3 className="product-title">Crema de Maní Natural — 500 g</h3>
              <p className="product-price">$6.990</p>
              <button className="btn btn-primary add-to-cart">Añadir al carrito</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <span className="product-weight">1 kg</span>
              <img src={IMG_MANI} alt="Crema de Maní Natural 1kg" />
            </div>
            <div className="product-info">
              <span className="product-category">CREMA DE MANÍ</span>
              <h3 className="product-title">Crema de Maní Natural — 1 kg</h3>
              <p className="product-price">$11.990</p>
              <button className="btn btn-primary add-to-cart">Añadir al carrito</button>
            </div>
          </div>

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
      </section>

      {/* Contacto */}
      <section className="contact-section">
        <div className="contact-container">
          <h2>¿Tienes alguna duda?</h2>
          <p>Escríbenos y te responderemos lo antes posible.</p>
          <form className="contact-form" onSubmit={enviarContacto}>
            <input type="text" placeholder="Tu nombre" required />
            <input type="email" placeholder="Tu correo electrónico" required />
            <textarea rows="4" placeholder="Tu mensaje..." required></textarea>
            <button type="submit" className="btn btn-primary">Enviar mensaje</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Home
