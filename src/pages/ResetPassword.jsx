import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building2 } from 'lucide-react'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) setError(error.message)
    else {
      setDone(true)
      setTimeout(() => navigate('/'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-sf-bg flex items-center justify-center p-4">
      <div className="bg-white border border-sf-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Building2 className="text-sf-blue" size={26} />
          <span className="text-xl font-bold">Terralta CRM</span>
        </div>
        <h1 className="text-center text-sm font-semibold text-sf-text-muted mb-6">Define tu nueva contraseña</h1>

        {done ? (
          <p className="text-center text-sm text-sf-success">Contraseña actualizada. Entrando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" required minLength={6} placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
            {error && <p className="text-sm text-sf-danger">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}