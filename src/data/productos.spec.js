import { obtenerProductos, crearProducto } from './productos.js';

describe('Capa de datos: productos.js', () => {
  beforeEach(() => {
    // Limpia el localStorage antes de cada prueba
    localStorage.clear();
  });

  it('obtenerProductos debería devolver los productos iniciales si localStorage está vacío', () => {
    const productos = obtenerProductos();
    expect(productos.length).toBe(3);
    expect(productos[0].nombre).toBe('Mantequilla de Maní');
  });

  it('crearProducto debería agregar un producto nuevo y guardarlo en localStorage', () => {
    // inicializa el storage
    obtenerProductos(); 
    
    const nuevoProducto = { nombre: 'Avena', precio: 2000, categoria: 'Cereales' };
    const productoCreado = crearProducto(nuevoProducto);
    
    const productosActualizados = obtenerProductos();
    
    expect(productoCreado.nombre).toBe('Avena');
    expect(productoCreado.id).toBeDefined();
    expect(productosActualizados.length).toBe(4);
  });
});