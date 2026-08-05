import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#0176D3', '#04844B', '#FE9339', '#C23934']

export default function Reports({ leads, properties }) {
  const [filtroCampana, setFiltroCampana] = useState('')
  const [filtroDesarrollo, setFiltroDesarrollo] = useState('')
  const [filtroOrigen, setFiltroOrigen] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const campanas = useMemo(() => [...new Set(leads.map(l => l.campana).filter(Boolean))], [leads])
  const origenes = useMemo(() => [...new Set(leads.map(l => l.origen).filter(Boolean))], [leads])
  const desarrollos = useMemo(() => [...new Set(properties.map(p => p.desarrollo).filter(Boolean))], [properties])

  function desarrolloDeLead(lead) {
    return properties.find(p => p.nombre === lead.propiedad_interes)?.desarrollo || null
  }

  const leadsFiltrados = useMemo(() => {
    return leads.filter(l => {
      if (filtroCampana && l.campana !== filtroCampana) return false
      if (filtroOrigen && l.origen !== filtroOrigen) return false
      if (filtroDesarrollo && desarrolloDeLead(l) !== filtroDesarrollo) return false
      if (desde && l.fecha_lead && l.fecha_lead < desde) return false
      if (hasta && l.fecha_lead && l.fecha_lead > hasta) return false
      return true
    })
  }, [leads, filtroCampana, filtroOrigen, filtroDesarrollo, desde, hasta, properties])

  const propertiesFiltradas = useMemo(() => {
    if (!filtroDesarrollo) return properties
    return properties.filter(p => p.desarrollo === filtroDesarrollo)
  }, [properties, filtroDesarrollo])

  const leadsByEstado = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado', 'Perdido'].map(estado => ({
    estado,
    cantidad: leadsFiltrados.filter(l => l.estado === estado).length,
  }))

  const propiedadesPorEstado = ['Disponible', 'Apartado', 'Vendido']
    .map(estado => ({ name: estado, value: propertiesFiltradas.filter(p => p.estado === estado).length }))
    .filter(p => p.value > 0)

  const valorPorEstado = ['Disponible', 'Apartado', 'Vendido'].map(estado => ({
    estado,
    valor: propertiesFiltradas.filter(p => p.estado === estado).reduce((sum, p) => sum + Number(p.precio), 0),
  }))

  const hayFiltros = filtroCampana || filtroDesarrollo || filtroOrigen || desde || hasta

  function limpiarFiltros() {
    setFiltroCampana('')
    setFiltroDesarrollo('')
    setFiltroOrigen('')
    setDesde('')
    setHasta('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reportes</h1>
      <p className="text-sf-text-muted text-sm mb-6">Analítica de ventas e inventario</p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <select value={filtroCampana} onChange={e => setFiltroCampana(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-sm outline-none">
          <option value="">Todas las campañas</option>
          {campanas.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroDesarrollo} onChange={e => setFiltroDesarrollo(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-sm outline-none">
          <option value="">Todos los desarrollos</option>
          {desarrollos.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filtroOrigen} onChange={e => setFiltroOrigen(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-sm outline-none">
          <option value="">Todos los orígenes</option>
          {origenes.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="flex items-center gap-1.5 text-sm">
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sf-blue" />
          <span className="text-sf-text-muted text-xs">a</span>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sf-blue" />
        </div>
        {hayFiltros && (
          <button onClick={limpiarFiltros} className="text-sm text-sf-blue hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Leads por etapa</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadsByEstado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="estado" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#0176D3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Propiedades por estado {filtroDesarrollo && `(${filtroDesarrollo})`}</h2>
          {propiedadesPorEstado.length === 0 ? (
            <p className="text-sm text-sf-text-muted py-8 text-center">Sin propiedades para este filtro.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={propiedadesPorEstado} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {propiedadesPorEstado.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-sm mb-4">Valor de inventario por estado {filtroDesarrollo && `(${filtroDesarrollo})`}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={valorPorEstado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={v => `$${v.toLocaleString('es-MX')}`} />
              <Bar dataKey="valor" fill="#032D60" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}