const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

function construirHeaders(usuario) {
  const headers = { 'Content-Type': 'application/json' };
  if (usuario?.token) {
    headers['Authorization'] = `Bearer ${usuario.token}`;
  }
  if (usuario?.rol) {
    headers['X-User-Rol'] = String(usuario.rol).toUpperCase();
  }
  return headers;
}

async function manejarRespuesta(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error HTTP ${res.status}`);
  }
  return data;
}

export async function obtenerProductos(categoria = '') {
  const url = categoria
    ? `${API_URL}/products/category/${encodeURIComponent(categoria)}`
    : `${API_URL}/products`;
  const res = await fetch(url);
  return manejarRespuesta(res);
}

export async function obtenerProductoPorId(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  return manejarRespuesta(res);
}

export async function crearProducto(producto, usuario) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: construirHeaders(usuario),
    body: JSON.stringify(producto),
  });
  return manejarRespuesta(res);
}

export async function actualizarProducto(id, producto, usuario) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: construirHeaders(usuario),
    body: JSON.stringify(producto),
  });
  return manejarRespuesta(res);
}

export async function eliminarProducto(id, usuario) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: construirHeaders(usuario),
  });
  return manejarRespuesta(res);
}
