import { useState } from 'react'
import { Plus, MapPin, Trash2 } from 'lucide-react'

const estadoColors = {
  Disponible: 'bg-emerald-500/10 text-emerald-400',
  Apartado: 'bg-amber-500/10 text-amber-400',
  Vendido: 'bg-red-500/10 text-red-400',
}

export default function Properties({ properties, setProperties }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', ubicacion: '', precio: '', tipo: 'Residencial', estado: 'Disponible', m2: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    setProperties([...properties, { ...form, id: Date.now(), precio: Number(form.precio), m2: Number(form.m2) }])
    setForm({ nombre: '', ubicacion: '', precio: '', tipo: 'Residencial', estado: 'Disponible', m2: '' })
    setShowForm(false)
  }

  function handleDelete(id) {
    setProperties(properties.filter(p => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Propiedades</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium transition">
          <Plus size={18} /> Nueva propiedad
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
          <input placeholder="Nombre / Lote" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Ubicación" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <input type="number" placeholder="m²" value={form.m2} onChange={e => setForm({ ...form, m2: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="bg-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Disponible">Disponible</option>
            <option value="Apartado">Apartado</option>
            <option value="Vendido">Vendido</option>
          </select>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 rounded-lg py-2 font-medium transition">
            Guardar propiedad
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map(p => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{p.nombre}</h3>
              <button onClick={() => handleDelete(p.id)} className="text-slate-500 hover:text-red-400 transition">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="flex items-center gap-1 text-slate-400 text-sm mb-3">
              <MapPin size={14} /> {p.ubicacion} · {p.m2} m²
            </p>
            <p className="text-2xl font-bold text-emerald-400 mb-3">${p.precio.toLocaleString('es-MX')}</p>
            <span className={`text-xs px-3 py-1 rounded-full ${estadoColors[p.estado]}`}>{p.estado}</span>
          </div>
        ))}
      </div>
    </div>
  )
}