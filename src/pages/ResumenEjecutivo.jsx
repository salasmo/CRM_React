import { useState, useMemo } from 'react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMetaAds } from '../hooks/useMetaAds'
import { formatCurrency, formatCurrencyCompact, formatPercent, formatMonthLabel } from '../utils/format'
import { ChevronDown, ChevronUp } from 'lucide-react'

const COLOR_INK = '#032D60'
const COLOR_INK_SOFT = '#706E6B'
const COLOR_GOLD = '#FE9339'
const COLOR_GREEN = '#04844B'

function StatBlock({ label, value, sub, accent }) {
  return (
    <div className="bg-white border border-sf-border rounded-lg p-4 shadow-sm min-w-0">
      <p className="text-xs text-sf-text-muted truncate">{label}</p>
      <p className={`text-xl font-bold mt-1 truncate ${accent ? 'text-sf-blue' : ''}`}>{value}</p>
      <p className="text-xs text-sf-text-muted mt-1 truncate">{sub}</p>
    </div>
  )
}

const origenes = ['Meta Ads', 'Llamada en frío', 'Referido', 'Boca a boca', 'Otro']

export default function ResumenEjecutivo({ leads, properties }) {
  const { campaigns } = useMetaAds()
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [showTabla, setShowTabla] = useState(false)

  const leadsFiltrados = useMemo(() => {
    return leads.filter(l => {
      if (!l.fecha_lead) return true
      if (desde && l.fecha_lead < desde) return false
      if (hasta && l.fecha_lead > hasta) return false
      return true
    })
  }, [leads, desde, hasta])

  const precioPropiedad = (nombre) => properties.find(p => p.nombre === nombre)?.precio || 0

  const k = useMemo(() => {
    const citas = leadsFiltrados.filter(l => l.cita_realizada).length
    const apartados = leadsFiltrados.filter(l => l.estado === 'Negociación' || l.estado === 'Cerrado').length
    const ventas = leadsFiltrados.filter(l => l.estado === 'Cerrado').length
    const perdidas = leadsFiltrados.filter(l => l.estado === 'Perdido').length
    const montoVenta = leadsFiltrados
      .filter(l => l.estado === 'Cerrado')
      .reduce((sum, l) => sum + precioPropiedad(l.propiedad_interes), 0)

    return {
      citas,
      apartados,
      ventas,
      perdidas,
      montoVenta,
      tasaCitaApartado: citas ? (apartados / citas) * 100 : 0,
      tasaApartadoVenta: apartados ? (ventas / apartados) * 100 : 0,
      tasaPerdida: leadsFiltrados.length ? (perdidas / leadsFiltrados.length) * 100 : 0,
      tasaConversion: citas ? (ventas / citas) * 100 : 0,
    }
  }, [leadsFiltrados, properties])

  const gastoMeta = campaigns.reduce((sum, c) => sum + c.gasto, 0)
  const costoPorCita = k.citas ? gastoMeta / k.citas : 0
  const roas = gastoMeta ? k.montoVenta / gastoMeta : 0

  const rendimientoOrigen = useMemo(() => {
    return origenes.map(origen => {
      const deEsteOrigen = leadsFiltrados.filter(l => l.origen === origen)
      const citas = deEsteOrigen.filter(l => l.cita_realizada).length
      const apartados = deEsteOrigen.filter(l => l.estado === 'Negociación' || l.estado === 'Cerrado').length
      const ventas = deEsteOrigen.filter(l => l.estado === 'Cerrado').length
      const perdidos = deEsteOrigen.filter(l => l.estado === 'Perdido').length
      const venta = deEsteOrigen
        .filter(l => l.estado === 'Cerrado')
        .reduce((sum, l) => sum + precioPropiedad(l.propiedad_interes), 0)

      return {
        origen,
        citas,
        apartados,
        ventas,
        venta,
        citaApartado: citas ? (apartados / citas) * 100 : 0,
        apartadoVenta: apartados ? (ventas / apartados) * 100 : 0,
        tasaConversion: citas ? (ventas / citas) * 100 : 0,
        tasaPerdido: deEsteOrigen.length ? (perdidos / deEsteOrigen.length) * 100 : 0,
      }
    }).filter(o => o.citas + o.apartados + o.ventas > 0)
  }, [leadsFiltrados, properties])

  const mensual = useMemo(() => {
    const meses = {}
    function agregar(fecha, campo) {
      if (!fecha) return
      const mes = fecha.slice(0, 7)
      meses[mes] = meses[mes] || { mes, citas: 0, apartados: 0, ventas: 0 }
      meses[mes][campo]++
    }
    leadsFiltrados.forEach(l => {
      if (l.fecha_cita) agregar(l.fecha_cita, 'citas')
      if (l.fecha_propuesta) agregar(l.fecha_propuesta, 'apartados')
      if (l.fecha_contrato) agregar(l.fecha_contrato, 'ventas')
    })
    return Object.values(meses)
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .map(m => ({ ...m, mesLabel: formatMonthLabel(m.mes) }))
  }, [leadsFiltrados])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <div>
          <h1 className="text-2xl font-bold">Resumen Ejecutivo</h1>
          <p className="text-sf-text-muted text-sm">Estatera · Inteligencia de Ventas</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sf-blue" />
          <span className="text-sf-text-muted text-xs">a</span>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="border border-sf-border rounded-md px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sf-blue" />
        </div>
      </div>

      {/* Totales del embudo */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 mb-4">
        <StatBlock label="Total Citas" value={k.citas.toLocaleString('es-MX')} sub="Oportunidades generadas" />
        <StatBlock label="Total Apartados" value={k.apartados.toLocaleString('es-MX')} sub={`${formatPercent(k.tasaCitaApartado)} de las citas`} />
        <StatBlock label="Total Ventas" value={k.ventas.toLocaleString('es-MX')} sub={`${formatPercent(k.tasaApartadoVenta)} de los apartados`} />
        <StatBlock label="Perdidos" value={k.perdidas.toLocaleString('es-MX')} sub={`${formatPercent(k.tasaPerdida)} tasa de pérdida`} />
        <StatBlock label="$ Venta" value={formatCurrencyCompact(k.montoVenta)} sub="Monto de ventas cerradas" accent />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatBlock label="Tasa de conversión" value={formatPercent(k.tasaConversion)} sub="Cita → Venta" />
        <StatBlock label="Gasto en Meta" value={formatCurrencyCompact(gastoMeta)} sub="Últimos 30 días" />
        <StatBlock label="Costo por Cita" value={formatCurrency(costoPorCita)} sub="Inversión / citas generadas" />
        <StatBlock label="ROAS" value={`${roas.toFixed(2)}x`} sub="Venta por peso invertido" />
      </div>

      {/* Rendimiento por origen */}
      <h2 className="text-sm font-semibold text-sf-text-muted uppercase mb-3">Rendimiento por origen</h2>
      {rendimientoOrigen.length === 0 ? (
        <p className="text-sm text-sf-text-muted bg-white border border-sf-border rounded-lg p-5 mb-8">Sin datos de origen para el periodo seleccionado.</p>
      ) : (
        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm mb-8">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rendimientoOrigen}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="origen" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="citas" name="Citas" fill={COLOR_INK_SOFT} radius={[4, 4, 0, 0]} />
              <Bar dataKey="apartados" name="Apartados" fill={COLOR_GOLD} radius={[4, 4, 0, 0]} />
              <Bar dataKey="ventas" name="Ventas" fill={COLOR_GREEN} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead className="bg-sf-bg text-sf-text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Origen</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Citas</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Apartados</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Ventas</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">Venta</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">% Cita-Apartado</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">% Apartado-Venta</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">% Conversión</th>
                  <th className="px-3 py-2 font-medium whitespace-nowrap">% Perdido</th>
                </tr>
              </thead>
              <tbody>
                {rendimientoOrigen.map(o => (
                  <tr key={o.origen} className="border-t border-sf-border">
                    <td className="px-3 py-2 font-medium whitespace-nowrap">{o.origen}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{o.citas}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{o.apartados}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{o.ventas}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(o.venta)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatPercent(o.citaApartado)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatPercent(o.apartadoVenta)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatPercent(o.tasaConversion)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatPercent(o.tasaPerdido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evolución mensual */}
      <h2 className="text-sm font-semibold text-sf-text-muted uppercase mb-3">Citas, Apartados y Ventas por mes</h2>
      {mensual.length === 0 ? (
        <p className="text-sm text-sf-text-muted bg-white border border-sf-border rounded-lg p-5">Sin historial suficiente para la vista mensual.</p>
      ) : (
        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <p className="text-xs text-sf-text-muted mb-2">Citas por mes</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mensual}>
                  <XAxis dataKey="mesLabel" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="citas" stroke={COLOR_INK} fill={COLOR_INK} fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-sf-text-muted mb-2">Apartados por mes</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mensual}>
                  <XAxis dataKey="mesLabel" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="apartados" stroke={COLOR_GOLD} fill={COLOR_GOLD} fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-sf-text-muted mb-2">Ventas por mes</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mensual}>
                  <XAxis dataKey="mesLabel" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="ventas" stroke={COLOR_GREEN} fill={COLOR_GREEN} fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button onClick={() => setShowTabla(!showTabla)} className="flex items-center gap-1 text-sm text-sf-blue mt-2">
            Ver tabla mensual {showTabla ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showTabla && (
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-sm">
                <thead className="bg-sf-bg text-sf-text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">Mes</th>
                    <th className="px-3 py-2 font-medium">Citas</th>
                    <th className="px-3 py-2 font-medium">Apartados</th>
                    <th className="px-3 py-2 font-medium">Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {mensual.map(m => (
                    <tr key={m.mes} className="border-t border-sf-border">
                      <td className="px-3 py-2">{m.mesLabel}</td>
                      <td className="px-3 py-2">{m.citas}</td>
                      <td className="px-3 py-2">{m.apartados}</td>
                      <td className="px-3 py-2">{m.ventas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}