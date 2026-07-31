import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const estados = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado']

export default function Leads({ leads, setLeads, properties }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', estado: 'Nuevo', propiedadInteres: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    setLeads([...leads, { ...form, id: Date.now() }])
    setForm({ nombre: '', email: '', telefono: '', estado: 'Nuevo', propiedadInteres: '' })
    setShowForm(false)
  }

  function handleDelete(id) {
    setLeads(leads.filter(l => l.id !== id))
  }

  function handleEstadoChange(id, nuevoEstado) {
    setLeads(leads.map(l => l.id === id ? { ...l, estado: nuevoEstado } : l))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} /> Nuevo lead
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <select value={form.propiedadInteres} onChange={e => setForm({ ...form, propiedadInteres: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Propiedad de interés</option>
            {properties.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
          </select>
          <button type="submit" className="col-span-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg py-2 font-medium transition">
            Guardar lead
          </button>
        </form>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Contacto</th>
              <th className="px-6 py-3">Propiedad de interés</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t border-slate-800">
                <td className="px-6 py-4 font-medium">{lead.nombre}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{lead.email}<br />{lead.telefono}</td>
                <td className="px-6 py-4 text-slate-400">{lead.propiedadInteres}</td>
                <td className="px-6 py-4">
                  <select value={lead.estado} onChange={e => handleEstadoChange(lead.id, e.target.value)} className="bg-slate-800 rounded-lg px-3 py-1 text-sm outline-none">
                    {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(lead.id)} className="text-slate-500 hover:text-red-400 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}