import { useState } from 'react'
import { Plus, MapPin, Trash2, Download } from 'lucide-react'
import { downloadCSV } from '../utils/csv'

const estadoColors = {
  Disponible: 'bg-sf-success/10 text-sf-success',
  Apartado: 'bg-sf-warning/10 text-sf-warning',
  Vendido: 'bg-sf-danger/10 text-sf-danger',
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Propiedades</h1>
          <p className="text-sf-text-muted text-sm">{properties.length} registros</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(properties, 'propiedades.csv')} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
            <Plus size={16} /> Nueva propiedad
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
          <input placeholder="Nombre / Lote" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Ubicación" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input type="number" placeholder="m²" value={form.m2} onChange={e => setForm({ ...form, m2: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue">
            <option value="Disponible">Disponible</option>
            <option value="Apartado">Apartado</option>
            <option value="Vendido">Vendido</option>
          </select>
          <button type="submit" className="bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition">
            Guardar propiedad
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(p => (
          <div key={p.id} className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{p.nombre}</h3>
              <button onClick={() => handleDelete(p.id)} className="text-sf-text-muted hover:text-sf-danger transition">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="flex items-center gap-1 text-sf-text-muted text-sm mb-3">
              <MapPin size={14} /> {p.ubicacion} · {p.m2} m²
            </p>
            <p className="text-xl font-bold text-sf-blue mb-3">${p.precio.toLocaleString('es-MX')}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoColors[p.estado]}`}>{p.estado}</span>
          </div>
        ))}
      </div>
    </div>
  )
}