import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Home from './pages/Home.jsx'
import Carrito from './pages/Carrito.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import AdminProductos from './pages/admin/AdminProductos.jsx'
import Pago from './pages/Pago.jsx'

<Route path="/pago" element={<Pago />} />
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin/productos" element={<RutaProtegida><AdminProductos /></RutaProtegida>} />
      </Route>
    </Routes>
  )
}

export default App
