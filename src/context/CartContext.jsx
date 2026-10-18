import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

// Carrito compartido por toda la app. Se guarda en localStorage con la clave "cart"
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const agregar = (producto) => {
    const existe = items.find((i) => i.id === producto.id)
    if (existe) {
      setItems(items.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)))
    } else {
      setItems([...items, { ...producto, cantidad: 1 }])
    }
  }

  const quitar = (id) => setItems(items.filter((i) => i.id !== id))
  const vaciar = () => setItems([])
  const totalItems = items.reduce((suma, i) => suma + i.cantidad, 0)
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, agregar, quitar, vaciar, totalItems, total }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
