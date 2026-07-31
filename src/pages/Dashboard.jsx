import { Users, Home, DollarSign, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

export default function Dashboard({ leads, properties }) {
  const disponibles = properties.filter(p => p.estado === 'Disponible').length
  const valorTotal = properties.reduce((sum, p) => sum + p.precio, 0)
  const enNegociacion = leads.filter(l => l.estado === 'Negociación').length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Leads totales" value={leads.length} color="bg-blue-600" />
        <StatCard icon={Home} label="Propiedades disponibles" value={disponibles} color="bg-emerald-600" />
        <StatCard icon={TrendingUp} label="En negociación" value={enNegociacion} color="bg-amber-600" />
        <StatCard icon={DollarSign} label="Valor de inventario" value={`$${valorTotal.toLocaleString('es-MX')}`} color="bg-violet-600" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Leads recientes</h2>
        <div className="space-y-3">
          {leads.slice(0, 5).map(lead => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div>
                <p className="font-medium">{lead.nombre}</p>
                <p className="text-sm text-slate-400">{lead.propiedadInteres}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300">{lead.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}