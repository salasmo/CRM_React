import { useState } from 'react'
import { X } from 'lucide-react'

export default function EditPropertyModal({ property, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: property.nombre || '',
    desarrollo: property.desarrollo || '',
    precio: property.precio || '',
    m2: property.m2 || '',
    tipo: property.tipo || 'Residencial',
    estado: property.estado || 'Disponible',
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      precio: Number(form.precio),
      m2: Number(form.m2),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-sf-border">
          <h2 className="font-semibold">Editar propiedad</h2>
          <button onClick={onClose} className="text-sf-text-muted hover:text-sf-text"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Nombre / Lote" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2" />
          <input placeholder="Desarrollo" value={form.desarrollo} onChange={e => setForm({ ...form, desarrollo: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue sm:col-span-2" />
          <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input type="number" placeholder="m²" value={form.m2} onChange={e => setForm({ ...form, m2: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Tipo (ej. Residencial)" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="Disponible">Disponible</option>
            <option value="Apartado">Apartado</option>
            <option value="Vendido">Vendido</option>
          </select>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium border border-sf-border hover:bg-sf-bg transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-sf-blue hover:bg-sf-navy text-white transition">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}