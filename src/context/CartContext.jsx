import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { api } from '../services/api.js'

const CartContext = createContext()

// El backend (pedidos) guarda los items con "productoId"; el front usa "id"
const desdeServidor = (carrito) =>
  (carrito?.items || []).map((i) => ({
    id: i.productoId,
    nombre: i.nombre,
    precio: i.precio,
    img: i.img,
    cantidad: i.cantidad,
  }))

const leerLocal = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || []
  } catch {
    return []
  }
}

// Carrito compartido por toda la app:
// - Invitado: se guarda en localStorage ("cart").
// - Con sesión: vive en el microservicio de pedidos (/api/v1/cart), asociado al usuario del JWT.
// Al iniciar sesión, lo que el invitado tenía en el carrito se sube al backend.
export function CartProvider({ children }) {
  const auth = useAuth() // es undefined si no hay AuthProvider (tests del carrito solo)
  const usuario = auth?.usuario
  const [itemsLocal, setItemsLocal] = useState(leerLocal)
  const [itemsServidor, setItemsServidor] = useState([])
  const [cargadoPara, setCargadoPara] = useState(null) // correo del usuario cuyo carrito ya se cargó
  const fusionadoPara = useRef(null) // evita subir dos veces el carrito de invitado

  // Persistencia del carrito de invitado
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(itemsLocal))
  }, [itemsLocal])

  // Al iniciar sesión: sube el carrito de invitado (si había) y luego trae el del backend
  useEffect(() => {
    if (!usuario) return
    let activo = true
    const correo = usuario.correo

    async function cargar() {
      if (fusionadoPara.current !== correo) {
        fusionadoPara.current = correo
        const invitado = leerLocal()
        if (invitado.length > 0) {
          localStorage.removeItem('cart')
          for (const i of invitado) {
            await api('/api/v1/cart/items', {
              method: 'POST',
              body: { productoId: i.id, cantidad: i.cantidad },
            }).catch(() => {}) // si un producto ya no tiene stock, se omite
          }
          if (activo) setItemsLocal([])
        }
      }
      const carrito = await api('/api/v1/cart')
      if (activo) {
        setItemsServidor(desdeServidor(carrito))
        setCargadoPara(correo)
      }
    }

    cargar().catch(() => {
      if (activo) setCargadoPara(correo) // si falla, se muestra vacío en vez de quedar cargando
    })
    return () => {
      activo = false
    }
  }, [usuario])

  // Cargando mientras se recupera la sesión o mientras llega el carrito del backend
  const cargando = Boolean(auth?.cargando) || (Boolean(usuario) && cargadoPara !== usuario.correo)
  const items = usuario ? (cargando ? [] : itemsServidor) : itemsLocal

  // Lanza Error con el mensaje del backend, ej: "Stock insuficiente para ..."
  const agregar = async (producto) => {
    if (usuario) {
      const carrito = await api('/api/v1/cart/items', {
        method: 'POST',
        body: { productoId: producto.id, cantidad: 1 },
      })
      setItemsServidor(desdeServidor(carrito))
      return
    }
    const existe = itemsLocal.find((i) => i.id === producto.id)
    if (existe) {
      setItemsLocal(itemsLocal.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)))
    } else {
      setItemsLocal([...itemsLocal, { ...producto, cantidad: 1 }])
    }
  }

  const quitar = async (id) => {
    if (usuario) {
      const carrito = await api(`/api/v1/cart/items/${id}`, { method: 'DELETE' })
      setItemsServidor(desdeServidor(carrito))
      return
    }
    setItemsLocal(itemsLocal.filter((i) => i.id !== id))
  }

  const vaciar = async () => {
    if (usuario) {
      setItemsServidor([])
      await api('/api/v1/cart', { method: 'DELETE' }).catch(() => {})
      return
    }
    setItemsLocal([])
  }

  const totalItems = items.reduce((suma, i) => suma + i.cantidad, 0)
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, cargando, agregar, quitar, vaciar, totalItems, total }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
