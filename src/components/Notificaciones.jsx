import { Toast, ToastContainer } from 'react-bootstrap'

// Notificación flotante reutilizable (Toast de Bootstrap).
// Props: mensaje (texto a mostrar; vacío = oculta) y onClose (se llama al cerrarse)
function Notificacion({ mensaje, onClose }) {
  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 2000 }}>
      <Toast show={Boolean(mensaje)} onClose={onClose} delay={2500} autohide bg="success">
        <Toast.Body className="text-white fw-bold" role="status">✅ {mensaje}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default Notificacion