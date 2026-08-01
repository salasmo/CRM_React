import { useState } from 'react'
import { Plus, Trash2, Download, ChevronDown, ChevronUp, Pencil, ClipboardList } from 'lucide-react'
import { downloadCSV } from '../utils/csv'
import ImportCSVButton from '../components/ImportCSVButton'
import EditLeadModal from '../components/EditLeadModal'
import LeadQuestionnaireModal from '../components/LeadQuestionnaireModal'
import { useAuth } from '../contexts/AuthContext'

const estados = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado', 'Perdido']
const calificaciones = ['Caliente', 'Tibio', 'Frío']
const motivosPerdida = ['Antes de la cita', 'Después de la cita']

const estadoColors = {
  Nuevo: 'bg-sf-blue/10 text-sf-blue',
  Contactado: 'bg-sf-warning/10 text-sf-warning',
  'Negociación': 'bg-purple-100 text-purple-700',
  Cerrado: 'bg-sf-success/10 text-sf-success',
  Perdido: 'bg-sf-danger/10 text-sf-danger',
}

const calificacionColors = {
  Caliente: 'bg-sf-danger/10 text-sf-danger',
  Tibio: 'bg-sf-warning/10 text-sf-warning',
  'Frío': 'bg-sf-blue/10 text-sf-blue',
}

function scoreColor(score) {
  if (score >= 70) return 'text-sf-success'
  if (score >= 40) return 'text-sf-warning'
  return 'text-sf-text-muted'
}

const leadColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Telefono' },
  { key: 'propiedad_interes', label: 'Propiedad de interes' },
  { key: 'campana', label: 'Campana' },
]

export default function Leads({ leadsTable, properties, vendedores }) {
  const { data: leads, insert, update, remove, refetch } = leadsTable
  const { profile } = useAuth()
  const isAdmin = profile?.rol === 'admin'

  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [editingLead, setEditingLead] = useState(null)
  const [questionnaireLead, setQuestionnaireLead] = useState(null)
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', propiedad_interes: '',
    campana: '', calificacion: '', comentarios: '', cita_realizada: false,
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    insert(form)
    setForm({ nombre: '', email: '', telefono: '', propiedad_interes: '', campana: '', calificacion: '', comentarios: '', cita_realizada: false })
    setShowForm(false)
  }

  function nombreVendedor(lead) {
    return vendedores.find(v => v.id === lead.vendedor_id)?.nombre || 'Sin asignar'
  }

  function descargarPlantilla() {
    downloadCSV([{ Nombre: 'Juan Pérez', Email: 'juan@email.com', Telefono: '55 1234 5678', 'Propiedad de interes': 'Lote 14 - Terralta', Campana: 'Campaña Facebook Julio' }], 'plantilla-leads.csv')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sf-text-muted text-sm">{leads.length} registros</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={descargarPlantilla} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> Plantilla
          </button>
          <ImportCSVButton table="leads" columns={leadColumns} onDone={refetch} />
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
          <input placeholder="Campaña de origen (ej. Facebook Julio)" value={form.campana} onChange={e => setForm({ ...form, campana: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.calificacion} onChange={e => setForm({ ...form, calificacion: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="">Calificación (opcional)</option>
            {calificaciones.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-sf-text-muted sm:col-span-2">
            <input type="checkbox" checked={form.cita_realizada} onChange={e => setForm({ ...form, cita_realizada: e.target.checked })} />
            Ya tuvo cita / visita a la propiedad
          </label>
          <textarea placeholder="Comentarios" value={form.comentarios} onChange={e => setForm({ ...form, comentarios: e.target.value })} rows={2} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2" />
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
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Calificación</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Vendedor</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <>
                <tr key={lead.id} className="border-t border-sf-border hover:bg-sf-bg/50">
                  <td className="px-4 py-3 font-medium">{lead.nombre}</td>
                  <td className="px-4 py-3">
                    <select value={lead.estado} onChange={e => update(lead.id, { estado: e.target.value })} className={`rounded-full px-3 py-1 text-xs font-medium outline-none border-0 ${estadoColors[lead.estado]}`}>
                      {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={lead.calificacion || ''} onChange={e => update(lead.id, { calificacion: e.target.value || null })} className={`rounded-full px-3 py-1 text-xs font-medium outline-none border-0 ${lead.calificacion ? calificacionColors[lead.calificacion] : 'bg-sf-bg text-sf-text-muted'}`}>
                      <option value="">Sin calificar</option>
                      {calificaciones.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className={`px-4 py-3 font-bold ${scoreColor(lead.score)}`}>{lead.score ?? 0}</td>
                  <td className="px-4 py-3 text-sf-text-muted text-sm">{nombreVendedor(lead)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQuestionnaireLead(lead)} title="Cuestionario de calificación" className="text-sf-text-muted hover:text-sf-blue">
                        <ClipboardList size={16} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => setEditingLead(lead)} title="Editar lead" className="text-sf-text-muted hover:text-sf-blue">
                          <Pencil size={16} />
                        </button>
                      )}
                      <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="text-sf-text-muted hover:text-sf-blue">
                        {expandedId === lead.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button onClick={() => remove(lead.id)} className="text-sf-text-muted hover:text-sf-danger transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr className="border-t border-sf-border bg-sf-bg/40">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-sf-text-muted mb-1">Contacto</p>
                          <p className="text-sm">{lead.email || '—'} · {lead.telefono || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-sf-text-muted mb-1">Propiedad de interés</p>
                          <p className="text-sm">{lead.propiedad_interes || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-sf-text-muted mb-1">Campaña de origen</p>
                          <p className="text-sm">{lead.campana || '—'}</p>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={!!lead.cita_realizada} onChange={e => update(lead.id, { cita_realizada: e.target.checked })} />
                          Ya tuvo cita / visita
                        </label>
                        {lead.estado === 'Perdido' && (
                          <div>
                            <label className="text-xs text-sf-text-muted mb-1 block">Motivo de pérdida</label>
                            <select value={lead.motivo_perdida || ''} onChange={e => update(lead.id, { motivo_perdida: e.target.value || null })} className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
                              <option value="">Sin especificar</option>
                              {motivosPerdida.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        )}
                        <div className="sm:col-span-2">
                          <p className="text-xs text-sf-text-muted mb-1">Comentarios</p>
                          <p className="text-sm whitespace-pre-wrap">{lead.comentarios || '—'}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
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
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${scoreColor(lead.score)}`}>{lead.score ?? 0}</span>
                <button onClick={() => setQuestionnaireLead(lead)} className="text-sf-text-muted hover:text-sf-blue">
                  <ClipboardList size={16} />
                </button>
                {isAdmin && (
                  <button onClick={() => setEditingLead(lead)} className="text-sf-text-muted hover:text-sf-blue">
                    <Pencil size={16} />
                  </button>
                )}
                <button onClick={() => remove(lead.id)} className="text-sf-text-muted hover:text-sf-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-sf-text-muted">{lead.email}</p>
            <p className="text-sm text-sf-text-muted mb-2">{lead.telefono}</p>
            <p className="text-xs text-sf-text-muted mb-3">{lead.propiedad_interes} {lead.campana && `· ${lead.campana}`}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <select value={lead.estado} onChange={e => update(lead.id, { estado: e.target.value })} className={`rounded-full px-3 py-1 text-xs font-medium outline-none border-0 ${estadoColors[lead.estado]}`}>
                {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
              </select>
              <select value={lead.calificacion || ''} onChange={e => update(lead.id, { calificacion: e.target.value || null })} className={`rounded-full px-3 py-1 text-xs font-medium outline-none border-0 ${lead.calificacion ? calificacionColors[lead.calificacion] : 'bg-sf-bg text-sf-text-muted'}`}>
                <option value="">Sin calificar</option>
                {calificaciones.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {lead.estado === 'Perdido' && (
              <select value={lead.motivo_perdida || ''} onChange={e => update(lead.id, { motivo_perdida: e.target.value || null })} className="w-full border border-sf-border rounded-md px-3 py-2 text-xs outline-none mb-2">
                <option value="">Motivo de pérdida</option>
                {motivosPerdida.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
            {lead.comentarios && <p className="text-xs text-sf-text-muted whitespace-pre-wrap mb-2">{lead.comentarios}</p>}
            <p className="text-xs text-sf-text-muted">Vendedor: {nombreVendedor(lead)}</p>
          </div>
        ))}
      </div>

      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          properties={properties}
          vendedores={vendedores}
          onClose={() => setEditingLead(null)}
          onSave={changes => update(editingLead.id, changes)}
        />
      )}

      {questionnaireLead && (
        <LeadQuestionnaireModal
          lead={questionnaireLead}
          onClose={() => setQuestionnaireLead(null)}
          onSave={changes => update(questionnaireLead.id, changes)}
        />
      )}
    </div>
  )
  }