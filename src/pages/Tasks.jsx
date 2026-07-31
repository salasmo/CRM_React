import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'

export default function Tasks({ tasksTable, leads }) {
  const { data: tasks, insert, update, remove } = tasksTable
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', lead_id: '', fecha_limite: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo) return
    insert({ ...form, lead_id: form.lead_id || null })
    setForm({ titulo: '', lead_id: '', fecha_limite: '' })
    setShowForm(false)
  }

  const pendientes = tasks.filter(t => !t.completada)
  const completadas = tasks.filter(t => t.completada)

  function TaskItem({ task }) {
    const lead = leads.find(l => l.id === task.lead_id)
    return (
      <div className="bg-white border border-sf-border rounded-lg p-4 shadow-sm flex items-start gap-3">
        <button onClick={() => update(task.id, { completada: !task.completada })} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${task.completada ? 'bg-sf-success border-sf-success' : 'border-sf-border'}`}>
          {task.completada && <Check size={12} className="text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${task.completada ? 'line-through text-sf-text-muted' : ''}`}>{task.titulo}</p>
          <p className="text-xs text-sf-text-muted">
            {lead ? lead.nombre : 'Sin lead asociado'} {task.fecha_limite && `· vence ${task.fecha_limite}`}
          </p>
        </div>
        <button onClick={() => remove(task.id)} className="text-sf-text-muted hover:text-sf-danger">
          <Trash2 size={16} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tareas</h1>
          <p className="text-sf-text-muted text-sm">{pendientes.length} pendientes</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
          <input placeholder="Título de la tarea" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2" />
          <select value={form.lead_id} onChange={e => setForm({ ...form, lead_id: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="">Sin lead asociado</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
          </select>
          <input type="date" value={form.fecha_limite} onChange={e => setForm({ ...form, fecha_limite: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <button type="submit" className="sm:col-span-2 bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Guardar tarea
          </button>
        </form>
      )}

      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold text-sf-text-muted">Pendientes</h2>
        {pendientes.map(t => <TaskItem key={t.id} task={t} />)}
        {pendientes.length === 0 && <p className="text-sm text-sf-text-muted">No tienes tareas pendientes.</p>}
      </div>

      {completadas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-sf-text-muted">Completadas</h2>
          {completadas.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
      )}
    </div>
  )
}