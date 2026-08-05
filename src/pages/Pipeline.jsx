import { useAuth } from '../contexts/AuthContext'

const estados = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado', 'Perdido']

export default function Pipeline({ leadsTable }) {
  const { data: leads, update } = leadsTable
  const { profile } = useAuth()
  const isAdmin = profile?.rol === 'admin'

  const leadsVisibles = isAdmin ? leads : leads.filter(l => l.vendedor_id === profile?.vendedor_id)

  function moveLead(lead, direction) {
    const currentIndex = estados.indexOf(lead.estado)
    const newIndex = currentIndex + direction
    if (newIndex < 0 || newIndex >= estados.length) return
    update(lead.id, { estado: estados[newIndex] })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Pipeline de ventas</h1>
      <p className="text-sf-text-muted text-sm mb-6">
        {isAdmin ? 'Todos los leads del equipo, por etapa' : 'Tus leads asignados, por etapa'}
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {estados.map((estado, colIndex) => (
          <div key={estado} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm min-w-[260px] flex-1">
            <h2 className="font-semibold mb-3 text-sm">
              {estado} <span className="text-sf-text-muted font-normal">({leadsVisibles.filter(l => l.estado === estado).length})</span>
            </h2>
            <div className="space-y-3">
              {leadsVisibles.filter(l => l.estado === estado).map(lead => (
                <div key={lead.id} className="bg-sf-bg rounded-md p-3">
                  <p className="font-medium text-sm">{lead.nombre}</p>
                  <p className="text-xs text-sf-text-muted mb-2">{lead.propiedad_interes}</p>
                  <div className="flex justify-between">
                    <button disabled={colIndex === 0} onClick={() => moveLead(lead, -1)} className="text-xs text-sf-text-muted hover:text-sf-blue disabled:opacity-20 disabled:cursor-not-allowed">
                      ← Atrás
                    </button>
                    <button disabled={colIndex === estados.length - 1} onClick={() => moveLead(lead, 1)} className="text-xs text-sf-text-muted hover:text-sf-blue disabled:opacity-20 disabled:cursor-not-allowed">
                      Avanzar →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {leadsVisibles.filter(l => l.estado === estado).length === 0 && (
              <p className="text-xs text-sf-text-muted text-center py-4">Sin leads en esta etapa.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}