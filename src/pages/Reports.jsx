import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#0176D3', '#04844B', '#FE9339', '#C23934']

export default function Reports({ leads, properties }) {
  const leadsByEstado = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado'].map(estado => ({
    estado,
    cantidad: leads.filter(l => l.estado === estado).length,
  }))

  const propiedadesPorEstado = ['Disponible', 'Apartado', 'Vendido']
    .map(estado => ({ name: estado, value: properties.filter(p => p.estado === estado).length }))
    .filter(p => p.value > 0)

  const valorPorEstado = ['Disponible', 'Apartado', 'Vendido'].map(estado => ({
    estado,
    valor: properties.filter(p => p.estado === estado).reduce((sum, p) => sum + Number(p.precio), 0),
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reportes</h1>
      <p className="text-sf-text-muted text-sm mb-6">Analítica de ventas e inventario</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Leads por etapa</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadsByEstado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#0176D3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold text-sm mb-4">Propiedades por estado</h2>
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
        </div>

        <div className="bg-white border border-sf-border rounded-lg p-5 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-sm mb-4">Valor de inventario por estado</h2>
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