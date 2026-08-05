import { useState, useEffect } from 'react'
import { Plus, Trash2, Power, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Vendedores({ vendedoresTable, leads }) {
  const { profile } = useAuth()
  const isAdmin = profile?.rol === 'admin'

  const { data: vendedores, insert, update, remove } = vendedoresTable
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [siguienteId, setSiguienteId] = useState(null)

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('ruleta_estado').select('ultimo_vendedor_id').single()
      .then(({ data }) => {
        if (!data) return
        const activos = vendedores.filter(v => v.activo).sort((a, b) => a.orden - b.orden)
        if (activos.length === 0) return
        const idxUltimo = activos.findIndex(v => v.id === data.ultimo_vendedor_id)
        const siguiente = activos[(idxUltimo + 1) % activos.length]
        setSiguienteId(siguiente?.id || null)
      })
  }, [vendedores, isAdmin])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-sf-bg flex items-center justify-center mb-4">
          <Lock size={22} className="text-sf-text-muted" />
        </div>
        <h1 className="text-lg font-semibold mb-1">Acceso restringido</h1>
        <p className="text-sm text-sf-text-muted max-w-sm">
          Esta sección solo está disponible para administradores. Si necesitas información del equipo de ventas, pídesela a tu administrador.
        </p>
      </div>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setFormError('Completa los campos obligatorios: Nombre')
      return
    }
    setFormError('')
    insert(form)
    setForm({ nombre: '', email: '', telefono: '' })
    setShowForm(false)
  }

  async function handleDelete(vendedor) {
    const suyos = leads.filter(l => l.vendedor_id === vendedor.id)
    const mensaje = suyos.length > 0
      ? `${vendedor.nombre} tiene ${suyos.length} lead(s) asignado(s). Al eliminarlo, esos leads se quedarán sin vendedor asignado (no se borran). ¿Continuar?`
      : `¿Eliminar a ${vendedor.nombre}?`

    if (!window.confirm(mensaje)) return

    const { error } = await remove(vendedor.id)
    if (error) {
      alert('No se pudo eliminar: ' + error.message)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendedores</h1>
          <p className="text-sf-text-muted text-sm">{vendedores.length} en el equipo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
          <Plus size={16} /> Nuevo vendedor
        </button>
      </div>

      {siguienteId && (
        <div className="bg-sf-blue/10 border border-sf-blue/20 rounded-lg px-4 py-3 mb-6 text-sm text-sf-blue font-medium">
          Siguiente lead en la ruleta le toca a: {vendedores.find(v => v.id === siguienteId)?.nombre}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-sm">
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Nombre <span className="text-sf-danger">*</span></label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Email</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Teléfono</label>
            <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          {formError && <p className="text-sm text-sf-danger sm:col-span-3">{formError}</p>}
          <button type="submit" className="sm:col-span-3 bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Guardar vendedor
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendedores.map(v => {
          const suyos = leads.filter(l => l.vendedor_id === v.id)
          const cerrados = suyos.filter(l => l.estado === 'Cerrado').length
          return (
            <div key={v.id} className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{v.nombre}</h3>
                  <p className="text-xs text-sf-text-muted">{v.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => update(v.id, { activo: !v.activo })} title={v.activo ? 'Desactivar' : 'Activar'} className={v.activo ? 'text-sf-success' : 'text-sf-text-muted'}>
                    <Power size={16} />
                  </button>
                  <button onClick={() => handleDelete(v)} title="Eliminar vendedor" className="text-sf-text-muted hover:text-sf-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-sf-text-muted text-xs">Leads asignados</p>
                  <p className="font-bold text-lg">{suyos.length}</p>
                </div>
                <div>
                  <p className="text-sf-text-muted text-xs">Cerrados</p>
                  <p className="font-bold text-lg text-sf-success">{cerrados}</p>
                </div>
              </div>
              <span className={`inline-block mt-3 text-xs px-2.5 py-1 rounded-full font-medium ${v.activo ? 'bg-sf-success/10 text-sf-success' : 'bg-sf-bg text-sf-text-muted'}`}>
                {v.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          )
        })}
        {vendedores.length === 0 && (
          <p className="text-sm text-sf-text-muted col-span-full">Aún no tienes vendedores registrados.</p>
        )}
      </div>
    </div>
  )
}