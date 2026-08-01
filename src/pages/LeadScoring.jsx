import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#0176D3', '#04844B', '#FE9339', '#C23934', '#032D60']

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm min-w-0">
      <p className="text-sf-text-muted text-sm truncate">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold mt-1 truncate ${color || ''}`}>{value}</p>
    </div>
  )
}

export default function LeadScoring({ leads }) {
  const scorePromedio = leads.length ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length) : 0

  const rangos = [
    { rango: '0-20', min: 0, max: 20 },
    { rango: '21-40', min: 21, max: 40 },
    { rango: '41-60', min: 41, max: 60 },
    { rango: '61-80', min: 61, max: 80 },
    { rango: '81-100', min: 81, max: 100 },
  ]
  const distribucionScore = rangos.map(r => ({
    rango: r.rango,
    leads: leads.filter(l => (l.score || 0) >= r.min && (l.score || 0) <= r.max).length,
  }))

  const porCalificacion = ['Caliente', 'Tibio', 'Frío']
    .map(c => ({ name: c, value: leads.filter(l => l.calificacion === c).length }))
    .filter(c => c.value > 0)

  const campanas = [...new Set(leads.map(l => l.campana).filter(Boolean))]
  const porCampana = campanas.map(camp => {
    const leadsCamp = leads.filter(l => l.campana === camp)
    const scorePromedioCamp = leadsCamp.length ? Math.round(leadsCamp.reduce((s, l) => s + (l.score || 0), 0) / leadsCamp.length) : 0
    return { campana: camp, leads: leadsCamp.length, scorePromedio: scorePromedioCamp }
  })

  const perdidos = leads.filter(l => l.estado === 'Perdido')
  const perdidosAntes = perdidos.filter(l => l.motivo_perdida === 'Antes de la cita').length
  const perdidosDespues = perdidos.filter(l => l.motivo_perdida === 'Después de la cita').length
  const perdidosSinEspecificar = perdidos.length - perdidosAntes - perdidosDespues

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Scoring de leads</h1>
      <p className="text-sf-text-muted text-sm mb-6">Calidad y origen de tus leads, basado en un modelo tipo BANT</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Score promedio" value={scorePromedio} color="text-sf-blue" />
        <StatCard label="Leads calientes" value={leads.filter(l => l.calificacion === 'Caliente').length} color="text-sf-danger" />
        <StatCard label="Con cita realizada" value={leads.filter(l => l.cita_realizada).length} color="text-sf-success" />
        <StatCard label="Leads perdidos" value={perdidos.length} color="text-sf-text-muted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Distribución de score</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={distribucionScore}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="rango" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="leads" fill="#0176D3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Leads por calificación</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={porCalificacion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {porCalificacion.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm mb-4">
        <h2 className="font-semibold text-sm mb-4">Score promedio por campaña</h2>
        {porCampana.length === 0 ? (
          <p className="text-sm text-sf-text-muted">Aún no tienes leads con campaña de origen registrada.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porCampana}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="campana" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="scorePromedio" name="Score promedio" fill="#032D60" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
        <h2 className="font-semibold text-sm mb-1">¿Dónde se pierden los leads?</h2>
        <p className="text-xs text-sf-text-muted mb-4">Antes de la cita apunta a un problema de calificación inicial; después de la cita apunta a un problema en la decisión o el precio.</p>
        {perdidos.length === 0 ? (
          <p className="text-sm text-sf-text-muted">Sin leads perdidos registrados todavía.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-sf-warning">{perdidosAntes}</p>
              <p className="text-xs text-sf-text-muted mt-1">Antes de la cita</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sf-danger">{perdidosDespues}</p>
              <p className="text-xs text-sf-text-muted mt-1">Después de la cita</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sf-text-muted">{perdidosSinEspecificar}</p>
              <p className="text-xs text-sf-text-muted mt-1">Sin especificar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}