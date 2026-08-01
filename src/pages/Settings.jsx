import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Save, KeyRound, User, Users } from 'lucide-react'

export default function Settings({ vendedores }) {
  const { profile, session, updatePassword, refreshProfile } = useAuth()

  const [nombre, setNombre] = useState(profile?.nombre || '')
  const [nombreMsg, setNombreMsg] = useState('')
  const [loadingNombre, setLoadingNombre] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [signupCode, setSignupCode] = useState('')
  const [codeMsg, setCodeMsg] = useState('')
  const [codeError, setCodeError] = useState('')
  const [loadingCode, setLoadingCode] = useState(false)

  const [profiles, setProfiles] = useState([])

  const isAdmin = profile?.rol === 'admin'

  useEffect(() => {
    setNombre(profile?.nombre || '')
  }, [profile])

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('app_settings').select('value').eq('key', 'signup_code').single()
      .then(({ data }) => { if (data) setSignupCode(data.value) })
    cargarPerfiles()
  }, [isAdmin])

  function cargarPerfiles() {
    supabase.from('profiles').select('*').order('nombre')
      .then(({ data }) => setProfiles(data || []))
  }

  async function handleNombreSubmit(e) {
    e.preventDefault()
    setNombreMsg('')
    setLoadingNombre(true)
    const { error } = await supabase.from('profiles').update({ nombre }).eq('id', session.user.id)
    setLoadingNombre(false)
    if (error) { setNombreMsg('No se pudo guardar: ' + error.message); return }
    await refreshProfile()
    setNombreMsg('Nombre actualizado.')
  }

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

  async function asignarVendedor(profileId, vendedorId) {
    await supabase.from('profiles').update({ vendedor_id: vendedorId || null }).eq('id', profileId)
    cargarPerfiles()
  }

  async function cambiarRol(profileId, rol) {
    await supabase.from('profiles').update({ rol }).eq('id', profileId)
    cargarPerfiles()
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
        <p className="text-sm mb-4"><span className="text-sf-text-muted">Correo:</span> {session?.user?.email}</p>
        <form onSubmit={handleNombreSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-sf-text-muted">Nombre para mostrar</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full mt-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          {nombreMsg && <p className={`text-sm ${nombreMsg.startsWith('No') ? 'text-sf-danger' : 'text-sf-success'}`}>{nombreMsg}</p>}
          <button type="submit" disabled={loadingNombre} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition disabled:opacity-50">
            <Save size={16} /> {loadingNombre ? 'Guardando...' : 'Guardar nombre'}
          </button>
        </form>
        <p className="text-sm mt-4"><span className="text-sf-text-muted">Rol:</span> {profile?.rol === 'admin' ? 'Administrador' : 'Vendedor'}</p>
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
        <>
          <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm mb-6 max-w-lg">
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

          <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-sf-blue" />
              <h2 className="font-semibold text-sm">Equipo — liga cada cuenta a un vendedor</h2>
            </div>
            <p className="text-xs text-sf-text-muted mb-4">
              Cuando alguien crea su cuenta, aparece aquí. Ligalo a su registro en "Vendedores" para que solo vea y califique sus propios leads.
            </p>
            <div className="space-y-3">
              {profiles.map(p => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 border border-sf-border rounded-md px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.nombre || 'Sin nombre'}</p>
                    <p className="text-xs text-sf-text-muted truncate">{p.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={p.rol} onChange={e => cambiarRol(p.id, e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-xs outline-none">
                      <option value="vendedor">Vendedor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <select value={p.vendedor_id || ''} onChange={e => asignarVendedor(p.id, e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-xs outline-none">
                      <option value="">Sin ligar a vendedor</option>
                      {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {profiles.length === 0 && <p className="text-sm text-sf-text-muted">Aún no hay cuentas creadas.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}