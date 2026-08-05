import { useState } from 'react'
import { Plus, Trash2, Download } from 'lucide-react'
import { downloadCSV } from '../utils/csv'
import ImportCSVButton from '../components/ImportCSVButton'

const tipos = ['Cliente', 'Proveedor', 'Broker', 'Otro']

const tipoColors = {
  Cliente: 'bg-sf-success/10 text-sf-success',
  Proveedor: 'bg-sf-blue/10 text-sf-blue',
  Broker: 'bg-purple-100 text-purple-700',
  Otro: 'bg-sf-bg text-sf-text-muted',
}

const contactColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Telefono' },
  { key: 'tipo', label: 'Tipo' },
]

export default function Contacts({ contactsTable, leads = [] }) {
  const { data: contacts, insert, remove, refetch } = contactsTable
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', tipo: 'Cliente', notas: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setFormError('Completa los campos obligatorios: Nombre')
      return
    }
    setFormError('')
    insert(form)
    setForm({ nombre: '', empresa: '', email: '', telefono: '', tipo: 'Cliente', notas: '' })
    setShowForm(false)
  }

  function descargarPlantilla() {
    downloadCSV([{ Nombre: 'Ana Torres', Empresa: 'Torres Bienes Raíces', Email: 'ana@email.com', Telefono: '55 1234 5678', Tipo: 'Broker' }], 'plantilla-contactos.csv')
  }

  function referidosDe(contactoId) {
    return leads.filter(l => l.broker_id === contactoId)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-sf-text-muted text-sm">{contacts.length} registros</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={descargarPlantilla} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> Plantilla
          </button>
          <ImportCSVButton table="contacts" columns={contactColumns} onDone={refetch} />
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
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Nombre <span className="text-sf-danger">*</span></label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Empresa</label>
            <input value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Email</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Teléfono</label>
            <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-sf-text-muted mb-1 block">Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
              {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-sf-text-muted mb-1 block">Notas</label>
            <textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} rows={2} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          {formError && <p className="text-sm text-sf-danger sm:col-span-2">{formError}</p>}
          <button type="submit" className="sm:col-span-2 bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Guardar contacto
          </button>
        </form>
      )}

      <div className="space-y-3">
        {contacts.map(c => {
          const referidos = c.tipo === 'Broker' ? referidosDe(c.id) : []
          const cerrados = referidos.filter(l => l.estado === 'Cerrado').length
          return (
            <div key={c.id} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{c.nombre}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${tipoColors[c.tipo]}`}>{c.tipo}</span>
                  </div>
                  {c.empresa && <p className="text-sm text-sf-text-muted">{c.empresa}</p>}
                  <p className="text-xs text-sf-text-muted mt-1">{c.email} {c.email && c.telefono && '·'} {c.telefono}</p>
                  {c.notas && <p className="text-xs text-sf-text-muted mt-2 whitespace-pre-wrap">{c.notas}</p>}
                  {c.tipo === 'Broker' && (
                    <p className="text-xs text-sf-blue mt-2 font-medium">
                      {referidos.length} lead{referidos.length !== 1 ? 's' : ''} referido{referidos.length !== 1 ? 's' : ''} · {cerrados} cerrado{cerrados !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <button onClick={() => remove(c.id)} className="text-sf-text-muted hover:text-sf-danger shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
        {contacts.length === 0 && <p className="text-sm text-sf-text-muted">Aún no tienes contactos registrados.</p>}
      </div>
    </div>
  )
}