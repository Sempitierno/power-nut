export const STORAGE_KEY = 'powernut_productos'
const IMG = 'https://mejorconsalud.as.com/wp-content/uploads/2020/09/frasco-mantequilla-cacahuete.jpg'

const productosIniciales = [
  { id: 1, nombre: 'Crema de Maní Natural — 500 g', precio: 6990, categoria: 'Crema de maní', img: IMG },
  { id: 2, nombre: 'Crema de Maní Natural — 1 kg', precio: 11990, categoria: 'Crema de maní', img: IMG },
]

// Devuelve null si no hay datos o el JSON está corrupto (nunca lanza)
const leer = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(data) ? data : null
  } catch { return null }
}
const guardar = (lista) => localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))

export const obtenerProductos = () => {
  const data = leer()
  if (data) return data
  const semilla = productosIniciales.map((p) => ({ ...p })) // copia: no muta la constante
  guardar(semilla)
  return semilla
}

export const validarProducto = ({ nombre, precio, categoria }) => {
  const errores = {}
  if (!nombre?.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!(Number(precio) > 0)) errores.precio = 'El precio debe ser mayor a 0'
  if (!categoria?.trim()) errores.categoria = 'La categoría es obligatoria'
  return errores
}

export const crearProducto = (datos) => {
  const productos = obtenerProductos()
  const id = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1 // secuencial
  const nuevo = { ...datos, nombre: datos.nombre.trim(), precio: Number(datos.precio), id }
  guardar([...productos, nuevo])
  return nuevo
}

export const actualizarProducto = (id, datos) => {
  const productos = obtenerProductos()
  const actual = productos.find((p) => p.id === id)
  if (!actual) return null // contrato explícito
  const actualizado = { ...actual, ...datos, id }
  if (datos.precio !== undefined) actualizado.precio = Number(datos.precio)
  guardar(productos.map((p) => (p.id === id ? actualizado : p)))
  return actualizado
}

export const eliminarProducto = (id) => {
  const productos = obtenerProductos()
  const filtrados = productos.filter((p) => p.id !== id)
  guardar(filtrados)
  return filtrados.length < productos.length // true si borró algo
}