import { useState } from 'react'
import { Plus, Trash2, Download } from 'lucide-react'
import { downloadCSV } from '../utils/csv'

const tipos = ['Cliente', 'Proveedor', 'Broker', 'Otro']

export default function Contacts({ contactsTable }) {
  const { data: contacts, insert, remove } = contactsTable
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', tipo: 'Cliente' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    insert(form)
    setForm({ nombre: '', empresa: '', email: '', telefono: '', tipo: 'Cliente' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-sf-text-muted text-sm">{contacts.length} registros</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(contacts, 'contactos.csv')} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
            <Plus size={16} /> Nuevo contacto
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2">
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button type="submit" className="sm:col-span-2 bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Guardar contacto
          </button>
        </form>
      )}

      <div className="hidden md:block bg-white border border-sf-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-sf-bg text-sf-text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Empresa</th>
              <th className="px-5 py-3 font-medium">Contacto</th>
              <th className="px-5 py-3 font-medium">Tipo</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className="border-t border-sf-border hover:bg-sf-bg/50">
                <td className="px-5 py-3 font-medium">{c.nombre}</td>
                <td className="px-5 py-3 text-sf-text-muted">{c.empresa}</td>
                <td className="px-5 py-3 text-sf-text-muted">{c.email}<br />{c.telefono}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-sf-bg text-sf-text-muted">{c.tipo}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(c.id)} className="text-sf-text-muted hover:text-sf-danger transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {contacts.map(c => (
          <div key={c.id} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium">{c.nombre}</p>
              <button onClick={() => remove(c.id)} className="text-sf-text-muted hover:text-sf-danger">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-sf-text-muted">{c.empresa}</p>
            <p className="text-sm text-sf-text-muted mb-2">{c.email} · {c.telefono}</p>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sf-bg text-sf-text-muted">{c.tipo}</span>
          </div>
        ))}
      </div>
    </div>
  )
}