document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del Carrito Global
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartUI() {
        const cartBtns = document.querySelectorAll('.cart-btn');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtns.forEach(btn => btn.innerHTML = `<span class="cart-icon">🛒</span> Cart (${totalItems})`);
    }
    updateCartUI();

    window.addToCart = function(product) {
        let item = cart.find(i => i.id === product.id);
        if (item) item.quantity++;
        else cart.push({...product, quantity: 1});
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        alert('Producto agregado al carrito');
    };

    // 2. Lógica de la página Carrito
    const listaCarrito = document.getElementById('lista-carrito');
    if (listaCarrito) {
        function renderCart() {
            listaCarrito.innerHTML = '';
            let total = 0;
            
            if (cart.length === 0) {
                listaCarrito.innerHTML = '<p style="color: #888; padding: 20px;">Tu carrito está vacío.</p>';
            } else {
                cart.forEach((item, index) => {
                    total += item.price * item.quantity;
                    // Aquí se estructura la imagen junto al detalle del producto
                    listaCarrito.innerHTML += `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <img src="https://mejorconsalud.as.com/wp-content/uploads/2020/09/frasco-mantequilla-cacahuete.jpg" alt="Crema de maní" class="cart-item-img">
                                <div class="cart-item-details">
                                    <span class="cart-item-name">${item.name}</span>
                                    <span class="cart-item-price">$${item.price.toLocaleString('es-CL')} x ${item.quantity}</span>
                                </div>
                            </div>
                            <button class="remove-btn" onclick="removeItem(${index})" title="Eliminar">X</button>
                        </div>
                    `;
                });
            }
            document.getElementById('cart-total').textContent = `$${total.toLocaleString('es-CL')}`;
        }

        window.removeItem = function(index) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            renderCart();
        };
        renderCart();
    }

    // 3. Lógica de Registro
    // Lógica de Registro (Minimalista)
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const correo = document.getElementById('reg-correo').value;
        const pass = document.getElementById('reg-pass').value;
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ correo, pass });
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registro exitoso');
        window.location.href = 'login.html';
    });
}

// Lógica de Login (Minimalista)
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Sesión iniciada');
        window.location.href = 'index.html';
    });
}
    }
);