import { useState, useRef } from 'react'
import { Plus, Trash2, Upload, Pencil, FileText } from 'lucide-react'

export default function Desarrollos({ desarrollosTable }) {
  const { data: desarrollos, insert, update, remove } = desarrollosTable
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ nombre: '', contexto: '' })
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function abrirNuevo() {
    setForm({ nombre: '', contexto: '' })
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  function abrirEditar(d) {
    setForm({ nombre: d.nombre, contexto: d.contexto || '' })
    setEditingId(d.id)
    setError('')
    setShowForm(true)
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setForm(f => ({ ...f, contexto: event.target.result }))
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    setError('')

    if (editingId) {
      const { error } = await update(editingId, form)
      if (error) { setError(error.message); return }
    } else {
      const { error } = await insert(form)
      if (error) { setError(error.message); return }
    }

    setShowForm(false)
    setForm({ nombre: '', contexto: '' })
    setEditingId(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Desarrollos</h1>
          <p className="text-sf-text-muted text-sm">Contexto que usa el bot de WhatsApp para responder sobre cada desarrollo</p>
        </div>
        <button onClick={abrirNuevo} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
          <Plus size={16} /> Nuevo desarrollo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-sf-text-muted block mb-1">Nombre del desarrollo</label>
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Debe coincidir con la 'Ubicación' usada en Propiedades"
              className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-sf-text-muted">Contexto (info del desarrollo)</label>
              <div>
                <input ref={fileInputRef} type="file" accept=".md,.txt" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-1.5 text-xs text-sf-blue hover:underline">
                  <Upload size={13} /> Subir archivo .md o .txt
                </button>
              </div>
            </div>
            <textarea
              value={form.contexto}
              onChange={e => setForm({ ...form, contexto: e.target.value })}
              rows={10}
              placeholder="Descripción del desarrollo, amenidades, precios generales, ubicación, política de apartado, preguntas frecuentes, etc. Esto es lo que el bot va a usar para responder con precisión."
              className="w-full border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue font-mono"
            />
          </div>

          {error && <p className="text-sm text-sf-danger">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-md text-sm font-medium border border-sf-border hover:bg-sf-bg transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-sf-blue hover:bg-sf-navy text-white transition">
              Guardar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {desarrollos.map(d => (
          <div key={d.id} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <FileText size={18} className="text-sf-blue mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium">{d.nombre}</p>
                  <p className="text-xs text-sf-text-muted mt-1 line-clamp-2 whitespace-pre-wrap">
                    {d.contexto ? d.contexto.slice(0, 200) + (d.contexto.length > 200 ? '...' : '') : 'Sin contexto todavía.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => abrirEditar(d)} className="text-sf-text-muted hover:text-sf-blue">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(d.id)} className="text-sf-text-muted hover:text-sf-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {desarrollos.length === 0 && (
          <p className="text-sm text-sf-text-muted text-center py-8">Aún no tienes desarrollos registrados.</p>
        )}
      </div>
    </div>
  )
}