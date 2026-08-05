import { useState } from 'react'
import { Plus, Trash2, Clock } from 'lucide-react'

export default function CalendarPage({ eventsTable, leads }) {
  const { data: events, insert, remove } = eventsTable
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ titulo: '', fecha: '', hora: '', lead_id: '' })

  function handleSubmit(e) {
    e.preventDefault()
    const faltantes = []
    if (!form.titulo.trim()) faltantes.push('Título')
    if (!form.fecha) faltantes.push('Fecha')
    if (faltantes.length > 0) {
      setFormError('Completa los campos obligatorios: ' + faltantes.join(', '))
      return
    }
    setFormError('')
    insert({ ...form, lead_id: form.lead_id || null })
    setForm({ titulo: '', fecha: '', hora: '', lead_id: '' })
    setShowForm(false)
  }

  const sorted = [...events].sort((a, b) => new Date(`${a.fecha}T${a.hora || '00:00'}`) - new Date(`${b.fecha}T${b.hora || '00:00'}`))
  const grouped = sorted.reduce((acc, ev) => {
    acc[ev.fecha] = acc[ev.fecha] || []
    acc[ev.fecha].push(ev)
    return acc
  }, {})

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Calendario</h1>
          <p className="text-sf-text-muted text-sm">{events.length} citas agendadas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
          <Plus size={16} /> Nueva cita
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
          <div className="sm:col-span-2">
            <label className="text-xs text-sf-text-muted mb-1 block">Título <span className="text-sf-danger">*</span></label>
            <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Fecha <span className="text-sf-danger">*</span></label>
            <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div>
            <label className="text-xs text-sf-text-muted mb-1 block">Hora</label>
            <input type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-sf-text-muted mb-1 block">Lead asociado</label>
            <select value={form.lead_id} onChange={e => setForm({ ...form, lead_id: e.target.value })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
              <option value="">Sin lead asociado</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
          </div>
          {formError && <p className="text-sm text-sf-danger sm:col-span-2">{formError}</p>}
          <button type="submit" className="sm:col-span-2 bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Agendar
          </button>
        </form>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([fecha, evs]) => (
          <div key={fecha}>
            <h2 className="text-sm font-semibold text-sf-text-muted mb-2">{fecha}</h2>
            <div className="space-y-2">
              {evs.map(ev => {
                const lead = leads.find(l => l.id === ev.lead_id)
                return (
                  <div key={ev.id} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {ev.hora && <span className="flex items-center gap-1 text-sf-blue text-xs"><Clock size={12} /> {ev.hora}</span>}
                        {ev.titulo}
                      </p>
                      {lead && <p className="text-xs text-sf-text-muted mt-1">Con {lead.nombre}</p>}
                    </div>
                    <button onClick={() => remove(ev.id)} className="text-sf-text-muted hover:text-sf-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-sf-text-muted">No tienes citas agendadas.</p>}
      </div>
    </div>
  )
}