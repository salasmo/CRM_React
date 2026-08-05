import { useState, useMemo } from 'react'
import { Plus, MapPin, Trash2, Download, ArrowUpDown, Pencil } from 'lucide-react'
import { downloadCSV } from '../utils/csv'
import ImportCSVButton from '../components/ImportCSVButton'
import EditPropertyModal from '../components/EditPropertyModal'

const estadoColors = {
  Disponible: 'bg-sf-success/10 text-sf-success',
  Apartado: 'bg-sf-warning/10 text-sf-warning',
  Vendido: 'bg-sf-danger/10 text-sf-danger',
}

const propertyColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'desarrollo', label: 'Desarrollo' },
  { key: 'precio', label: 'Precio', number: true },
  { key: 'm2', label: 'M2', number: true },
  { key: 'tipo', label: 'Tipo' },
  { key: 'estado', label: 'Estado' },
]

const opcionesOrden = [
  { value: 'nombre-asc', label: 'Nombre (A-Z)' },
  { value: 'nombre-desc', label: 'Nombre (Z-A)' },
  { value: 'precio-asc', label: 'Precio (menor a mayor)' },
  { value: 'precio-desc', label: 'Precio (mayor a menor)' },
  { value: 'm2-asc', label: 'm² (menor a mayor)' },
  { value: 'm2-desc', label: 'm² (mayor a menor)' },
]

export default function Properties({ propertiesTable }) {
  const { data: properties, insert, update, remove, refetch } = propertiesTable
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [form, setForm] = useState({ nombre: '', desarrollo: '', precio: '', tipo: 'Residencial', estado: 'Disponible', m2: '' })

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroDesarrollo, setFiltroDesarrollo] = useState('')
  const [orden, setOrden] = useState('nombre-asc')

  const desarrollosDisponibles = useMemo(
    () => [...new Set(properties.map(p => p.desarrollo).filter(Boolean))],
    [properties]
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre) return
    insert({ ...form, precio: Number(form.precio), m2: Number(form.m2) })
    setForm({ nombre: '', desarrollo: '', precio: '', tipo: 'Residencial', estado: 'Disponible', m2: '' })
    setShowForm(false)
  }

  async function handleUpdate(id, changes) {
    const { error } = await update(id, changes)
    if (error) alert('No se pudo guardar el cambio: ' + error.message)
  }

  function descargarPlantilla() {
    downloadCSV([{ Nombre: 'Lote 30 - Terralta', Desarrollo: 'Terralta', Precio: 900000, M2: 260, Tipo: 'Residencial', Estado: 'Disponible' }], 'plantilla-propiedades.csv')
  }

  const propertiesVisibles = useMemo(() => {
    let resultado = properties.filter(p => {
      if (busqueda && !p.nombre?.toLowerCase().includes(busqueda.toLowerCase())) return false
      if (filtroEstado && p.estado !== filtroEstado) return false
      if (filtroDesarrollo && p.desarrollo !== filtroDesarrollo) return false
      return true
    })

    const [campo, direccion] = orden.split('-')
    resultado = [...resultado].sort((a, b) => {
      let av = a[campo], bv = b[campo]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return direccion === 'asc' ? -1 : 1
      if (av > bv) return direccion === 'asc' ? 1 : -1
      return 0
    })

    return resultado
  }, [properties, busqueda, filtroEstado, filtroDesarrollo, orden])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Propiedades</h1>
          <p className="text-sf-text-muted text-sm">{propertiesVisibles.length} de {properties.length} registros</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={descargarPlantilla} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> Plantilla
          </button>
          <ImportCSVButton table="properties" columns={propertyColumns} onDone={refetch} />
          <button onClick={() => downloadCSV(propertiesVisibles, 'propiedades.csv')} className="flex items-center gap-2 border border-sf-border bg-white hover:bg-sf-bg px-3 py-2 rounded-md text-sm font-medium transition">
            <Download size={16} /> CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-sf-blue hover:bg-sf-navy text-white px-3 py-2 rounded-md text-sm font-medium transition">
            <Plus size={16} /> Nueva propiedad
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input placeholder="Buscar por nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="border border-sf-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
        <select value={filtroDesarrollo} onChange={e => setFiltroDesarrollo(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-sm outline-none">
          <option value="">Todos los desarrollos</option>
          {desarrollosDisponibles.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-sm outline-none">
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Apartado">Apartado</option>
          <option value="Vendido">Vendido</option>
        </select>
        <div className="flex items-center gap-1.5 border border-sf-border rounded-md px-2 py-1.5">
          <ArrowUpDown size={14} className="text-sf-text-muted" />
          <select value={orden} onChange={e => setOrden(e.target.value)} className="text-sm outline-none">
            {opcionesOrden.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {(busqueda || filtroEstado || filtroDesarrollo) && (
          <button onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroDesarrollo('') }} className="text-sm text-sf-blue hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-sf-border rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
          <input placeholder="Nombre / Lote" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
          <input placeholder="Desarrollo" value={form.desarrollo} onChange={e => setForm({ ...form, desarrollo: e.target.value })} className="border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue" />
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
        {propertiesVisibles.map(p => (
          <div key={p.id} className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{p.nombre}</h3>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditingProperty(p)} className="text-sf-text-muted hover:text-sf-blue transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(p.id)} className="text-sf-text-muted hover:text-sf-danger transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="flex items-center gap-1 text-sf-text-muted text-sm mb-3">
              <MapPin size={14} /> {p.desarrollo} · {p.m2} m²
            </p>
            <p className="text-xl font-bold text-sf-blue mb-3">${Number(p.precio).toLocaleString('es-MX')}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoColors[p.estado]}`}>{p.estado}</span>
          </div>
        ))}
        {propertiesVisibles.length === 0 && (
          <p className="text-sm text-sf-text-muted col-span-full text-center py-8">No hay propiedades que coincidan con estos filtros.</p>
        )}
      </div>

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSave={changes => handleUpdate(editingProperty.id, changes)}
        />
      )}
    </div>
  )
}