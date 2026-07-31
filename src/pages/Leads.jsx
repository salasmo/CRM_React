import { useState } from 'react'
import { Plus, Trash2, Download } from 'lucide-react'
import { downloadCSV } from '../utils/csv'

const estados = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado']
const estadoColors = {
  Nuevo: 'bg-sf-blue/10 text-sf-blue',
  Contactado: 'bg-sf-warning/10 text-sf-warning',
  'Negociación': 'bg-purple-100 text-purple-700',
  Cerrado: 'bg-sf-success/10 text-sf-success',
}

export default function Leads({ leadsTable, properties, vendedores }) {
  const { data: leads, insert, update, remove } = leadsTable
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', estado: 'Nuevo', propiedad_interes: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    insert(form)
    setForm({ nombre: '', email: '', telefono: '', estado: 'Nuevo', propiedad_interes: '' })
    setShowForm(false)
  }

  function nombreVendedor(lead) {
    return vendedores.find(v => v.id === lead.vendedor_id)?.nombre || 'Sin asignar'
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sf-text-muted text-sm">{leads.length} registros</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(leads, 'leads.csv')} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
            <Plus size={16} /> Nuevo lead
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.propiedad_interes} onChange={e => setForm({ ...form, propiedad_interes: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="">Propiedad de interés</option>
            {properties.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
          </select>
          <button type="submit" className="sm:col-span-2 bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Guardar lead
          </button>
        </form>
      )}

      {/* Tabla - desktop */}
      <div className="hidden md:block bg-white border border-sf-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-sf-bg text-sf-text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Contacto</th>
              <th className="px-5 py-3 font-medium">Propiedad de interés</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Vendedor</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t border-sf-border hover:bg-sf-bg/50">
                <td className="px-5 py-3 font-medium">{lead.nombre}</td>
                <td className="px-5 py-3 text-sf-text-muted">{lead.email}<br />{lead.telefono}</td>
                <td className="px-5 py-3 text-sf-text-muted">{lead.propiedad_interes}</td>
                <td className="px-5 py-3">
                  <select value={lead.estado} onChange={e => update(lead.id, { estado: e.target.value })} className={`rounded-full px-3 py-1 text-xs font-medium outline-none border-0 ${estadoColors[lead.estado]}`}>
                    {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3 text-sf-text-muted text-sm">{nombreVendedor(lead)}</td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(lead.id)} className="text-sf-text-muted hover:text-sf-danger transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas - mobile */}
      <div className="md:hidden space-y-3">
        {leads.map(lead => (
          <div key={lead.id} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium">{lead.nombre}</p>
              <button onClick={() => remove(lead.id)} className="text-sf-text-muted hover:text-sf-danger">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-sf-text-muted">{lead.email}</p>
            <p className="text-sm text-sf-text-muted mb-3">{lead.telefono}</p>
            <p className="text-xs text-sf-text-muted mb-2">{lead.propiedad_interes}</p>
            <p className="text-xs text-sf-text-muted mb-2">Vendedor: {nombreVendedor(lead)}</p>
            <select value={lead.estado} onChange={e => update(lead.id, { estado: e.target.value })} className={`rounded-full px-3 py-1 text-xs font-medium outline-none border-0 ${estadoColors[lead.estado]}`}>
              {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}