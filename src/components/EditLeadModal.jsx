import { useState } from 'react'
import { X } from 'lucide-react'

const estados = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado', 'Perdido']

export default function EditLeadModal({ lead, properties, vendedores, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: lead.nombre || '',
    email: lead.email || '',
    telefono: lead.telefono || '',
    propiedad_interes: lead.propiedad_interes || '',
    campana: lead.campana || '',
    vendedor_id: lead.vendedor_id || '',
    estado: lead.estado || 'Nuevo',
    comentarios: lead.comentarios || '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ ...form, vendedor_id: form.vendedor_id || null })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-sf-border sticky top-0 bg-white">
          <h2 className="font-semibold">Editar lead</h2>
          <button onClick={onClose} className="text-sf-text-muted hover:text-sf-text"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.propiedad_interes} onChange={e => setForm({ ...form, propiedad_interes: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="">Propiedad de interés</option>
            {properties.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
          </select>
          <input placeholder="Campaña de origen" value={form.campana} onChange={e => setForm({ ...form, campana: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.vendedor_id} onChange={e => setForm({ ...form, vendedor_id: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="">Sin asignar</option>
            {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
          </select>
          <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            {estados.map(estado => <option key={estado} value={estado}>{estado}</option>)}
          </select>
          <textarea placeholder="Comentarios" value={form.comentarios} onChange={e => setForm({ ...form, comentarios: e.target.value })} rows={2} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2" />
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium border border-sf-border hover:bg-sf-bg transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-sf-blue hover:bg-sf-navy text-white transition">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}