const IMG_DEFAULT = 'https://mejorconsalud.as.com/wp-content/uploads/2020/09/frasco-mantequilla-cacahuete.jpg'
const clp = (n) => Number(n).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

function ProductCard({ producto, onAgregar }) {
  // Los productos creados desde el admin no traen imagen: se usa una por defecto
  const img = producto.img || IMG_DEFAULT
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={img} alt={producto.nombre} />
      </div>
      <div className="product-info">
        <span className="product-category">{producto.categoria.toUpperCase()}</span>
        <h3 className="product-title">{producto.nombre}</h3>
        <p className="product-price">{clp(producto.precio)}</p>
        {/* Se envía con img resuelta: Carrito.jsx la necesita para mostrar la foto */}
        <button className="btn btn-primary add-to-cart" onClick={() => onAgregar({ ...producto, img })}>
          Añadir al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard