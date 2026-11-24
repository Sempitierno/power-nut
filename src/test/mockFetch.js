import { act } from '@testing-library/react'

// Simula una respuesta del backend sin levantar ningún servidor
export const respuesta = (status, data) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(data) })

// Deja que terminen las promesas pendientes (fetch → json → setState)
export const esperarPromesas = () =>
  act(async () => {
    for (let i = 0; i < 10; i++) await Promise.resolve()
  })
