import { useState } from 'react'
import { Plus, Trash2, Power } from 'lucide-react'

export default function Vendedores({ vendedoresTable, leads }) {
  const { data: vendedores, insert, update, remove } = vendedoresTable
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    insert(form)
    setForm({ nombre: '', email: '', telefono: '' })
    setShowForm(false)
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

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-sm">
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
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
                  <button onClick={() => remove(v.id)} className="text-sf-text-muted hover:text-sf-danger">
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
      </div>
    </div>
  )
}