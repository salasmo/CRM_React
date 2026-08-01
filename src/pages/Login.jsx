import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', codigo: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function switchMode(newMode) {
    setMode(newMode)
    setError('')
    setMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await signIn(form.email, form.password)
      if (error) setError('Correo o contraseña incorrectos.')
    }

    if (mode === 'signup') {
      const { error } = await signUp(form.email, form.password, form.nombre, form.codigo)
      if (error) setError(error.message)
      else setMessage('Cuenta creada. Revisa tu correo para confirmarla antes de entrar.')
    }

    if (mode === 'forgot') {
      const { error } = await resetPassword(form.email)
      if (error) setError(error.message)
      else setMessage('Te mandamos un correo con el link para restablecer tu contraseña.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-sf-bg flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-sf-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Building2 className="text-sf-blue" size={26} />
          <span className="text-xl font-bold">Estatera</span>
        </div>

        <h1 className="text-center text-sm font-semibold text-sf-text-muted mb-6">
          {mode === 'signin' && 'Inicia sesión'}
          {mode === 'signup' && 'Crea tu cuenta'}
          {mode === 'forgot' && 'Recupera tu contraseña'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-sf-text-muted">Nombre</label>
              <input required value={form.nombre} onChange={e => update('nombre', e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-sf-text-muted">Correo</label>
            <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-sm font-medium text-sf-text-muted">Contraseña</label>
              <input type="password" required minLength={6} value={form.password} onChange={e => update('password', e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-sf-text-muted">Clave de invitación</label>
              <input required value={form.codigo} onChange={e => update('codigo', e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
              <p className="text-xs text-sf-text-muted mt-1">Pídesela al administrador del CRM.</p>
            </div>
          )}

          {error && <p className="text-sm text-sf-danger">{error}</p>}
          {message && <p className="text-sm text-sf-success">{message}</p>}

          <button type="submit" disabled={loading} className="w-full bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition disabled:opacity-50">
            {loading ? 'Un momento...' : mode === 'signin' ? 'Iniciar sesión' : mode === 'signup' ? 'Crear cuenta' : 'Enviar link'}
          </button>
        </form>

        <div className="text-center mt-5 text-sm space-y-2">
          {mode === 'signin' && (
            <>
              <button onClick={() => switchMode('forgot')} className="text-sf-blue hover:underline block w-full">¿Olvidaste tu contraseña?</button>
              <button onClick={() => switchMode('signup')} className="text-sf-blue hover:underline block w-full">Crear una cuenta nueva</button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => switchMode('signin')} className="text-sf-blue hover:underline">Ya tengo cuenta, iniciar sesión</button>
          )}
          {mode === 'forgot' && (
            <button onClick={() => switchMode('signin')} className="text-sf-blue hover:underline">Regresar a iniciar sesión</button>
          )}
        </div>
      </div>

      <Link to="/privacy-policy" className="text-xs text-sf-text-muted hover:text-sf-blue transition mt-4">
        Aviso de privacidad
      </Link>
    </div>
  )
}