import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Save, KeyRound, User } from 'lucide-react'

export default function Settings() {
  const { profile, session, updatePassword } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [signupCode, setSignupCode] = useState('')
  const [codeMsg, setCodeMsg] = useState('')
  const [codeError, setCodeError] = useState('')
  const [loadingCode, setLoadingCode] = useState(false)

  const isAdmin = profile?.rol === 'admin'

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('app_settings').select('value').eq('key', 'signup_code').single()
      .then(({ data }) => { if (data) setSignupCode(data.value) })
  }, [isAdmin])

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordMsg('')
    setLoadingPassword(true)
    const { error } = await updatePassword(newPassword)
    setLoadingPassword(false)
    if (error) setPasswordError(error.message)
    else { setPasswordMsg('Contraseña actualizada.'); setNewPassword('') }
  }

  async function handleCodeSubmit(e) {
    e.preventDefault()
    setCodeError('')
    setCodeMsg('')
    setLoadingCode(true)
    const { error } = await supabase.from('app_settings').update({ value: signupCode }).eq('key', 'signup_code')
    setLoadingCode(false)
    if (error) setCodeError(error.message)
    else setCodeMsg('Clave de invitación actualizada.')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Configuración</h1>
      <p className="text-sf-text-muted text-sm mb-6">Tu cuenta y ajustes del CRM</p>

      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm mb-6 max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-sf-blue" />
          <h2 className="font-semibold text-sm">Tu cuenta</h2>
        </div>
        <p className="text-sm mb-1"><span className="text-sf-text-muted">Nombre:</span> {profile?.nombre || '—'}</p>
        <p className="text-sm mb-1"><span className="text-sf-text-muted">Correo:</span> {session?.user?.email}</p>
        <p className="text-sm"><span className="text-sf-text-muted">Rol:</span> {profile?.rol === 'admin' ? 'Administrador' : 'Vendedor'}</p>
      </div>

      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm mb-6 max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={18} className="text-sf-blue" />
          <h2 className="font-semibold text-sm">Cambiar contraseña</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <input type="password" required minLength={6} placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          {passwordError && <p className="text-sm text-sf-danger">{passwordError}</p>}
          {passwordMsg && <p className="text-sm text-sf-success">{passwordMsg}</p>}
          <button type="submit" disabled={loadingPassword} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition disabled:opacity-50">
            <Save size={16} /> {loadingPassword ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>

      {isAdmin && (
        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound size={18} className="text-sf-blue" />
            <h2 className="font-semibold text-sm">Clave de invitación</h2>
          </div>
          <p className="text-xs text-sf-text-muted mb-3">Esta es la clave que le compartes a tus vendedores para que puedan crear su cuenta.</p>
          <form onSubmit={handleCodeSubmit} className="space-y-3">
            <input required value={signupCode} onChange={e => setSignupCode(e.target.value)} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
            {codeError && <p className="text-sm text-sf-danger">{codeError}</p>}
            {codeMsg && <p className="text-sm text-sf-success">{codeMsg}</p>}
            <button type="submit" disabled={loadingCode} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition disabled:opacity-50">
              <Save size={16} /> {loadingCode ? 'Guardando...' : 'Guardar clave'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}