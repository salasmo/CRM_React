import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMetaAds } from '../hooks/useMetaAds'

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
      <p className="text-sf-text-muted text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color || ''}`}>{value}</p>
    </div>
  )
}

export default function MetaAds() {
  const { campaigns, loading, error } = useMetaAds()

  if (loading) return <p className="text-sf-text-muted text-sm">Cargando campañas...</p>

  if (error) {
    return (
      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
        <p className="text-sf-danger text-sm font-medium mb-1">No se pudo conectar con Meta Ads</p>
        <p className="text-sf-text-muted text-sm">{error}</p>
      </div>
    )
  }

  const gastoTotal = campaigns.reduce((sum, c) => sum + c.gasto, 0)
  const leadsTotal = campaigns.reduce((sum, c) => sum + c.leads, 0)
  const cplPromedio = leadsTotal > 0 ? gastoTotal / leadsTotal : null

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Meta Ads</h1>
      <p className="text-sf-text-muted text-sm mb-6">Campañas activas · últimos 30 días</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Gasto total" value={`$${gastoTotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`} />
        <StatCard label="Leads generados" value={leadsTotal} color="text-sf-success" />
        <StatCard label="CPL promedio" value={cplPromedio ? `$${cplPromedio.toLocaleString('es-MX', { maximumFractionDigits: 0 })}` : '—'} color="text-sf-blue" />
      </div>

      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-sm mb-4">Leads por campaña</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={campaigns}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="nombre" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="leads" fill="#0176D3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-sf-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-sf-bg text-sf-text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Campaña</th>
              <th className="px-5 py-3 font-medium">Gasto</th>
              <th className="px-5 py-3 font-medium">Impresiones</th>
              <th className="px-5 py-3 font-medium">Clics</th>
              <th className="px-5 py-3 font-medium">Leads</th>
              <th className="px-5 py-3 font-medium">CPL</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.nombre} className="border-t border-sf-border hover:bg-sf-bg/50">
                <td className="px-5 py-3 font-medium">{c.nombre}</td>
                <td className="px-5 py-3 text-sf-text-muted">${c.gasto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</td>
                <td className="px-5 py-3 text-sf-text-muted">{c.impresiones.toLocaleString('es-MX')}</td>
                <td className="px-5 py-3 text-sf-text-muted">{c.clics.toLocaleString('es-MX')}</td>
                <td className="px-5 py-3 text-sf-text-muted">{c.leads}</td>
                <td className="px-5 py-3 text-sf-text-muted">{c.cpl ? `$${c.cpl.toLocaleString('es-MX', { maximumFractionDigits: 0 })}` : '—'}</td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-sf-text-muted">No hay campañas activas en este periodo.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}