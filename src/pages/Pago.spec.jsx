import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderConProviders } from '../test/renderConProviders.jsx'
import { respuesta } from '../test/mockFetch.js'
import Pago from './Pago.jsx'

const CARRITO = {
  usuarioId: 7,
  items: [{ id: 50, productoId: 1, nombre: 'Crema de Maní', precio: 6990, img: '', cantidad: 2 }],
  total: 13980,
  totalItems: 2,
}

// Backend simulado: responde según método y URL
function backendSimulado(rutas) {
  return spyOn(window, 'fetch').and.callFake((url, opciones) => {
    const clave = `${opciones.method} ${url.replace('http://localhost:8080', '')}`
    const r = rutas[clave]
    return r ? r() : respuesta(404, { error: `sin mock para ${clave}` })
  })
}

const BASE = {
  'GET /users/me': () => respuesta(200, { nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' }),
  'GET /api/v1/cart': () => respuesta(200, CARRITO),
  'DELETE /api/v1/cart': () => respuesta(204, null),
}

function dibujarPago() {
  renderConProviders(
    <Routes>
      <Route path="/pago" element={<Pago />} />
      <Route path="/carrito" element={<h1>Página carrito</h1>} />
    </Routes>,
    '/pago',
  )
}

describe('Pago (pedidos)', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('tokens', JSON.stringify({ token: 't', refreshToken: 'r' }))
  })

  it('muestra el resumen del carrito del backend', async () => {
    backendSimulado(BASE)
    dibujarPago()
    expect(await screen.findByText('Crema de Maní × 2')).toBeTruthy()
    expect(screen.getByText(/Total a pagar/).textContent).toContain('13.980')
  })

  it('al pagar crea la orden, paga y muestra el comprobante', async () => {
    const spy = backendSimulado({
      ...BASE,
      'POST /api/v1/orders': () => respuesta(201, { id: 15, total: 13980, estado: 'PENDIENTE', items: [] }),
      'POST /api/v1/payments': () =>
        respuesta(201, { id: 1, ordenId: 15, monto: 13980, estado: 'APROBADO', estadoOrden: 'APROBADO', codigoTransaccion: 'WP-ABC123' }),
    })
    dibujarPago()
    fireEvent.click(await screen.findByText('Pagar'))
    expect(await screen.findByText('WP-ABC123')).toBeTruthy()
    expect(screen.getByText('Orden #15')).toBeTruthy()
    const pago = spy.calls.all().find((c) => c.args[0].endsWith('/api/v1/payments'))
    expect(JSON.parse(pago.args[1].body)).toEqual({ ordenId: 15, resultado: 'APROBADO' })
  })

  it('si no hay stock muestra el error del backend y no aprueba', async () => {
    backendSimulado({
      ...BASE,
      'POST /api/v1/orders': () => respuesta(400, { error: 'Stock insuficiente para Crema de Maní. Disponible: 1' }),
    })
    dibujarPago()
    fireEvent.click(await screen.findByText('Pagar'))
    expect(await screen.findByText('Stock insuficiente para Crema de Maní. Disponible: 1')).toBeTruthy()
    expect(screen.queryByText(/Pago aprobado/)).toBeNull()
  })

  it('con el carrito vacío vuelve al carrito', async () => {
    backendSimulado({ ...BASE, 'GET /api/v1/cart': () => respuesta(200, { ...CARRITO, items: [] }) })
    dibujarPago()
    expect(await screen.findByText('Página carrito')).toBeTruthy()
  })
})
