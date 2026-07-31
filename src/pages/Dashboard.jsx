import { Users, Home, DollarSign, TrendingUp, CheckSquare, Megaphone } from 'lucide-react'
import { useMetaAds } from '../hooks/useMetaAds'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
      <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-sf-text-muted text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

export default function Dashboard({ leads, properties, tasks = [] }) {
  const disponibles = properties.filter(p => p.estado === 'Disponible').length
  const valorTotal = properties.reduce((sum, p) => sum + Number(p.precio), 0)
  const enNegociacion = leads.filter(l => l.estado === 'Negociación').length
  const tareasPendientes = tasks.filter(t => !t.completada).length

  const { campaigns } = useMetaAds()
  const leadsMetaTotal = campaigns.reduce((sum, c) => sum + c.leads, 0)
  const gastoMetaTotal = campaigns.reduce((sum, c) => sum + c.gasto, 0)
  const cplPromedio = leadsMetaTotal > 0 ? gastoMetaTotal / leadsMetaTotal : null

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Inicio</h1>
      <p className="text-sf-text-muted mb-6 text-sm">Resumen de tu actividad comercial</p>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Users} label="Leads totales" value={leads.length} color="bg-sf-blue" />
        <StatCard icon={Home} label="Propiedades disponibles" value={disponibles} color="bg-sf-success" />
        <StatCard icon={TrendingUp} label="En negociación" value={enNegociacion} color="bg-sf-warning" />
        <StatCard icon={CheckSquare} label="Tareas pendientes" value={tareasPendientes} color="bg-purple-600" />
        <StatCard icon={DollarSign} label="Valor de inventario" value={`$${valorTotal.toLocaleString('es-MX')}`} color="bg-sf-navy" />
        <StatCard icon={Megaphone} label="CPL Meta Ads (30 días)" value={cplPromedio ? `$${cplPromedio.toLocaleString('es-MX', { maximumFractionDigits: 0 })}` : '—'} color="bg-blue-500" />
      </div>

      <div className="bg-white border border-sf-border rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b border-sf-border">
          <h2 className="font-semibold text-sm">Leads recientes</h2>
        </div>
        <div className="divide-y divide-sf-border">
          {leads.slice(0, 5).map(lead => (
            <div key={lead.id} className="flex items-center justify-between px-5 py-3">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{lead.nombre}</p>
                <p className="text-xs text-sf-text-muted truncate">{lead.propiedad_interes}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sf-bg text-sf-text-muted whitespace-nowrap ml-3">{lead.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}