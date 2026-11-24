# 🥜 PowerNut — Tienda online

Tienda online de cremas de maní y mermeladas artesanales, desarrollada como **Evaluación Parcial 2** de *Desarrollo Full Stack II (DSY1104)*, Duoc UC.

Es la migración a **React + Vite** del sitio estático de la Evaluación Parcial 1 (HTML, CSS, JavaScript y Bootstrap). La aplicación funciona 100 % en el navegador: no tiene backend, y los datos se guardan en `localStorage`.

| | |
|---|---|
| **Demo (AWS S3)** | _(completar con el Bucket website endpoint)_ |
| **Repositorio** | https://github.com/Sempitierno/power-nut |
| **Asignatura** | Desarrollo Full Stack II — DSY1104 |
| **Evaluación** | Parcial N° 2: *Implementando frontend y pruebas unitarias a mi tienda online* |

---

## Integrantes

| Integrante | Rama de trabajo | Aportes principales |
|---|---|---|
| Tomás Silva | `dev-tomas` | Estructura base, Header, Footer, formularios y ajustes del Carrito |
| Josafat _(completar apellido)_ | `dev-josafat` | Flujo de Carrito y Pago simulado, alertas con React Bootstrap |
| Ignacio Vera | `feature/ignacio-datos` | CRUD de productos, capa de datos, `ProductCard`, pruebas unitarias y configuración de Karma/Jasmine |

---

## Funcionalidades

### Cliente
- **Inicio y catálogo:** presentación de la marca y productos renderizados desde los datos mediante el componente `ProductCard`. Incluye un producto "Próximamente" no comprable.
- **Registro** con validaciones (ver [Reglas de validación](#reglas-de-validación)). Un mismo correo no puede registrarse dos veces.
- **Login** con sesión persistente. El administrador es redirigido al panel; el cliente, al inicio.
- **Carrito de compras:** agregar productos (al repetir, aumenta la cantidad), quitar, total en pesos chilenos y contador en el encabezado. El carrito se conserva al recargar.
- **Pago simulado** (`/pago`): pantalla tipo Webpay de prueba con número de orden, resumen y estados *procesando*, *aprobado* y *anulado*. **No realiza cobros reales.** Si el cliente no ha iniciado sesión, "Proceder al pago" lo envía al login.
- **Contacto:** formulario con mensaje de confirmación (componente `Alert` de React Bootstrap).

### Administrador
- **CRUD completo de productos** en `/admin/productos`: crear, listar, editar y eliminar, con validación, confirmación antes de eliminar y URL de imagen opcional. Los cambios se reflejan de inmediato en el catálogo del inicio.
- Ruta protegida: solo el rol `admin` puede entrar.

### Transversal
- **Diseño responsivo** con Bootstrap 5, React Bootstrap y CSS propio.
- **Estado global** con Context API (`AuthContext` y `CartContext`).

---

## Tecnologías

| Área | Herramienta |
|---|---|
| Framework | React 19 |
| Empaquetado | Vite |
| Navegación | React Router (`react-router-dom`) |
| Estilos | Bootstrap 5, React Bootstrap y CSS propio |
| Estado global | Context API |
| Persistencia | `localStorage` |
| Pruebas | Jasmine + Karma + Testing Library |
| Calidad de código | ESLint |

---

## Instalación y uso

Requisitos: **Node.js 20 o superior** y npm.

```bash
git clone https://github.com/Sempitierno/power-nut.git
cd power-nut
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Ejecuta las pruebas unitarias (Karma + Jasmine) y genera el reporte de cobertura |

### Usuario administrador de prueba

| Correo | Contraseña |
|---|---|
| `admin@powernut.cl` | `Admin123!` |

> Credenciales de demostración para la evaluación. Se crean automáticamente la primera vez que se usa la aplicación. Los clientes se crean desde `/registro`.

### Probar la aplicación (recorrido sugerido)

1. Entrar a `/login` con el administrador y abrir `/admin/productos` (enlace **Admin** del encabezado).
2. Crear un producto (nombre, precio, categoría y, opcionalmente, URL de imagen), editarlo y eliminarlo.
3. Volver al **Inicio**: el catálogo muestra los cambios.
4. Añadir productos al carrito, abrir **Carrito** y pulsar **Proceder al pago**.
5. En `/pago`, probar **Pagar** y **Anular**.
6. Cerrar sesión y probar `/registro` y `/login` con un cliente nuevo.

---

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio y catálogo | Público |
| `/carrito` | Carrito de compras | Público |
| `/pago` | Pago simulado | Público (el botón del carrito exige sesión) |
| `/login` | Iniciar sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/admin/productos` | CRUD de productos | Solo administrador |

---

## Reglas de validación

### Registro
| Campo | Regla |
|---|---|
| Nombre | Solo letras y espacios |
| Correo | Formato válido y coincidir con su confirmación; no puede estar ya registrado |
| Contraseña | Mínimo 8 caracteres, al menos 1 número y 1 símbolo; debe coincidir con su confirmación |
| Región y comuna | Obligatorias. La comuna depende de la región (Metropolitana: Santiago, Providencia, Maipú, Puente Alto · Valparaíso: Valparaíso, Viña del Mar, Quilpué, Casablanca) |

### Producto (panel de administración)
| Campo | Regla |
|---|---|
| Nombre | Obligatorio (se eliminan espacios sobrantes) |
| Precio | Número mayor a 0 (se guarda como número) |
| Categoría | Obligatoria |
| Imagen | Opcional. Si se ingresa, debe ser una URL `http://` o `https://` válida. Sin imagen se usa una por defecto |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/            # Header, Footer y Layout común
│   ├── ProductCard.jsx    # Tarjeta de producto reutilizable
│   └── RutaProtegida.jsx  # Protege las rutas del administrador
├── context/
│   ├── AuthContext.jsx    # Sesión, login y registro
│   └── CartContext.jsx    # Carrito compartido (agregar, quitar, total)
├── data/
│   └── productos.js       # Capa de datos del CRUD (localStorage) y validación
├── pages/
│   ├── admin/AdminProductos.jsx
│   ├── Home.jsx
│   ├── Carrito.jsx
│   ├── Pago.jsx
│   ├── Login.jsx
│   └── Registro.jsx
├── styles/                # Hojas de estilo
├── App.jsx                # Definición de rutas
└── main.jsx               # Punto de entrada y providers
```

### Datos guardados en `localStorage`

| Clave | Contenido |
|---|---|
| `powernut_productos` | Catálogo de productos (CRUD) |
| `usuarios` | Usuarios registrados (incluye al administrador) |
| `sesion` | Usuario conectado |
| `cart` | Carrito de compras |

Para reiniciar la aplicación a su estado inicial, borra estas claves desde las herramientas del navegador (*Application → Local Storage*).

---

## Pruebas unitarias y cobertura

Las pruebas se escriben con **Jasmine** y se ejecutan con **Karma** en Chrome Headless. Los componentes se prueban con **Testing Library**, y se usan *spies* de Jasmine para simular el diálogo de confirmación del navegador.

```bash
npm test
```

**Qué se prueba actualmente**
- `productos.js`: carga inicial, persistencia, recuperación ante JSON corrupto, que la semilla no se modifique, creación (id secuencial, precio numérico), actualización (existente e inexistente), eliminación y validación (incluida la URL de imagen).
- `AdminProductos`: listado inicial, errores al enviar vacío, creación de un producto y eliminación con confirmación.

Cada ejecución genera el reporte en `coverage/` (carpeta ignorada por Git). La meta de la evaluación es una **cobertura mínima del 60 %** sobre el código fuente de `src/`.

---

## Flujo de trabajo con Git

- `master`: versión estable de la entrega.
- `develop`: integración del equipo.
- `dev-*` y `feature/*`: ramas de trabajo individuales, que se integran a `develop` mediante Pull Request.

Convención de commits: `feat:` (funcionalidad), `fix:` (corrección), `test:` (pruebas), `chore:` (configuración), `docs:` (documentación).

---

## Despliegue

El sitio se publica como sitio estático en **Amazon S3** (AWS Academy Learner Lab):

1. `npm run build`
2. Subir **el contenido** de `dist/` al bucket (no la carpeta `dist` en sí).
3. Activar *Static website hosting* con `index.html` como documento de índice **y de error** (necesario para que React Router funcione al recargar una ruta interna).
4. Aplicar una política de lectura pública al bucket.

---

## Limitaciones conocidas

- No hay backend ni base de datos: los datos viven en el navegador de cada usuario y no se comparten entre dispositivos.
- Las contraseñas se guardan en texto plano en `localStorage`. Es aceptable solo para fines académicos; en un sistema real se requeriría un servidor con autenticación segura.
- El pago es una simulación y no se integra con Webpay ni con ningún medio de pago real.
- El sitio de S3 se sirve por HTTP, no HTTPS.

---

## Documentación de la entrega

- ERS (Especificación de Requisitos del Software): _(completar enlace o ubicación)_
- Documento de cobertura de testing: _(completar enlace o ubicación)_

---

## Licencia

Proyecto académico, sin fines comerciales.