import { screen, fireEvent, act } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderConProviders } from '../test/renderConProviders.jsx'
import Registro from './Registro.jsx'

// Escribe en un input por su placeholder (único en el formulario)
const escribir = (placeholder, valor) => fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } })

// Completa el formulario de registro con datos válidos
const llenarFormulario = (datos = {}) => {
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: datos.nombre ?? 'Ana Pérez' } })
  escribir('Correo', datos.correo ?? 'ana@correo.cl')
  escribir('Confirmar correo', datos.correoConf ?? datos.correo ?? 'ana@correo.cl')
  escribir('Mín. 8 caracteres, 1 número, 1 símbolo', datos.password ?? 'Abc12345!')
  escribir('Confirmar contraseña', datos.passwordConf ?? datos.password ?? 'Abc12345!')
  // Las listas de región y comuna se eligen por su opción por defecto
  fireEvent.change(screen.getByDisplayValue('Seleccione Región...'), { target: { value: 'RM' } })
  fireEvent.change(screen.getByDisplayValue('Comuna...'), { target: { value: 'Providencia' } })
}

// Dibuja el formulario de registro y una ruta /login para verificar la redirección
function dibujarRegistro() {
  renderConProviders(
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<h1>Página de login</h1>} />
    </Routes>,
    '/registro',
  )
}

describe('Registro', () => {
  // El registro redirige al login con un setTimeout: se controla el reloj de Jasmine
  beforeEach(() => {
    localStorage.clear()
    jasmine.clock().install()
  })

  afterEach(() => jasmine.clock().uninstall())

  it('muestra errores al enviar el formulario vacío', () => {
    dibujarRegistro()
    fireEvent.click(screen.getByText('Registrarse'))
    // Cada campo inválido muestra su mensaje de error
    expect(screen.getByText('El nombre solo puede tener letras')).toBeTruthy()
    expect(screen.getByText('Correo inválido')).toBeTruthy()
    expect(screen.getByText('Mínimo 8 caracteres, 1 número y 1 símbolo')).toBeTruthy()
    expect(screen.getByText('Selecciona región y comuna')).toBeTruthy()
    // Y no se muestra la notificación de éxito
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('muestra error si el nombre tiene números', () => {
    dibujarRegistro()
    // Solo el nombre está mal: el resto de los datos es válido
    llenarFormulario({ nombre: 'Ana123' })
    fireEvent.click(screen.getByText('Registrarse'))
    expect(screen.getByText('El nombre solo puede tener letras')).toBeTruthy()
    // Al no pasar la validación no se registra ni se notifica
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('muestra error si las contraseñas no coinciden', () => {
    dibujarRegistro()
    // Ambas contraseñas cumplen el formato, pero son distintas
    llenarFormulario({ password: 'Abc12345!', passwordConf: 'Abc12345?' })
    fireEvent.click(screen.getByText('Registrarse'))
    expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('registra con datos válidos, muestra la notificación y redirige al login', () => {
    dibujarRegistro()
    llenarFormulario()
    fireEvent.click(screen.getByText('Registrarse'))
    // Aparece la notificación de éxito (role="status")
    expect(screen.getByRole('status').textContent).toContain('Te has registrado con éxito')
    // El usuario quedó guardado en localStorage
    expect(JSON.parse(localStorage.getItem('usuarios')).some((u) => u.correo === 'ana@correo.cl')).toBeTrue()
    // Pasados los 2,5 s del setTimeout se redirige al login
    act(() => { jasmine.clock().tick(2500) })
    expect(screen.getByText('Página de login')).toBeTruthy()
  })
})
