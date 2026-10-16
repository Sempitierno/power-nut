import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

// Estructura común: Header arriba, la página actual al medio (<Outlet />), Footer abajo
function Layout() {
  return (
    <>
      <Header />
        <Outlet />
      <Footer />
    </>
  )
}

export default Layout
