// Catálogo de productos contra el backend, siempre a través del gateway (api.js).
// api.js agrega "Authorization: Bearer <token>" y renueva el token si venció.
// El rol NO se manda desde el front: el gateway lo saca del JWT y agrega X-User-Rol.
import { api } from './api.js'

export const obtenerProductos = (categoria = '') =>
  api(categoria ? `/products/category/${encodeURIComponent(categoria)}` : '/products')

export const obtenerProductoPorId = (id) => api(`/products/${id}`)

export const crearProducto = (producto) => api('/products', { method: 'POST', body: producto })

export const actualizarProducto = (id, producto) => api(`/products/${id}`, { method: 'PUT', body: producto })

export const eliminarProducto = (id) => api(`/products/${id}`, { method: 'DELETE' })
