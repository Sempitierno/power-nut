import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Home from './pages/Home.jsx'
import Carrito from './pages/Carrito.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import AdminProductos from './pages/admin/AdminProductos.jsx'
import Pago from './pages/Pago.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Solo usuarios logueados (cualquier rol) */}
        <Route path="/pago" element={<RutaProtegida><Pago /></RutaProtegida>} />

        {/* Solo ADMIN */}
        <Route path="/admin/productos" element={<RutaProtegida rol="admin"><AdminProductos /></RutaProtegida>} />
      </Route>
    </Routes>
  )
}

export default App
