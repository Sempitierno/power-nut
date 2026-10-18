const STORAGE_KEY = 'powernut_productos';

const productosIniciales = [
  { id: 1, nombre: 'Mantequilla de Maní', precio: 5000, categoria: 'Untables' },
  { id: 2, nombre: 'Mix de Frutos Secos', precio: 3500, categoria: 'Snacks' },
  { id: 3, nombre: 'Barra de Proteína', precio: 1500, categoria: 'Snacks' }
];

export const obtenerProductos = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productosIniciales));
    return productosIniciales;
  }
  return JSON.parse(data);
};

export const crearProducto = (producto) => {
  const productos = obtenerProductos();
  const nuevoProducto = { ...producto, id: Date.now() };
  productos.push(nuevoProducto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  return nuevoProducto;
};

export const actualizarProducto = (id, datosActualizados) => {
  const productos = obtenerProductos();
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...datosActualizados };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  }
  return productos[index];
};

export const eliminarProducto = (id) => {
  const productos = obtenerProductos();
  const filtrados = productos.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
};