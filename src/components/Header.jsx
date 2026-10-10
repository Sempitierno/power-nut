function Header(){

    return (

        <>
        <header class="header">
        <div class="logo">
            <span class="logo-icon">🥜</span> 
            <span class="logo-text">PowertNut</span>
        </div>
        
        <nav class="nav">
            <ul>
                <li><a href="index.html" class="active">Inicio</a></li>
                <li><a href="index.html">Productos</a></li>
                <li><a href="carrito.html">Carrito</a></li>
            </ul>
        </nav>

        <div class="header-actions">
            <a href="carrito.html" class="cart-btn"><span class="cart-icon">🛒</span> Cart (0)</a>
            <a href="login.html" class="login-btn">Iniciar sesión</a>
            <a href="registro.html" class="register-btn">Registrarse</a>
        </div>
    </header>
        </>

    )
}

export default Header