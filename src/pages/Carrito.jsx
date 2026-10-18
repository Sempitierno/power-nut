// Estructura de carrito.html. El Integrante 2 le agrega la lógica con useCart()
function Carrito() {
  return (
    <main className="minimal-container">
      <h2 className="cart-title">Tu carrito de compras</h2>

      <div className="cart-layout">
        <div className="cart-items">
          <p style={{ color: '#888', padding: '20px' }}>Tu carrito está vacío.</p>
        </div>

        <div className="cart-summary">
          <h3>Resumen del pedido</h3>
          <div className="total-row">
            <span>TOTAL:</span>
            <span id="cart-total">$0</span>
          </div>
          <button className="btn btn-primary full-width">Proceder al pago</button>
        </div>
      </div>
    </main>
  )
}

export default Carrito
