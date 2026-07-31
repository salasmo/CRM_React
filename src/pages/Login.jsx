import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Building2 } from 'lucide-react'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError('Correo o contraseña incorrectos.')
  }

  return (
    <div className="min-h-screen bg-sf-bg flex items-center justify-center p-4">
      <div className="bg-white border border-sf-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Building2 className="text-sf-blue" size={26} />
          <span className="text-xl font-bold">Terralta CRM</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-sf-text-muted">Correo</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-sm font-medium text-sf-text-muted">Contraseña</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          {error && <p className="text-sm text-sf-danger">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition disabled:opacity-50">
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}