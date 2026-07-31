const estados = ['Nuevo', 'Contactado', 'Negociación', 'Cerrado']

export default function Pipeline({ leads, setLeads }) {
  function moveLead(id, direction) {
    setLeads(leads.map(lead => {
      if (lead.id !== id) return lead
      const currentIndex = estados.indexOf(lead.estado)
      const newIndex = currentIndex + direction
      if (newIndex < 0 || newIndex >= estados.length) return lead
      return { ...lead, estado: estados[newIndex] }
    }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Pipeline de ventas</h1>
      <p className="text-sf-text-muted text-sm mb-6">Avanza cada lead por etapa</p>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {estados.map((estado, colIndex) => (
          <div key={estado} className="bg-white border border-sf-border rounded-lg p-4 shadow-sm min-w-[260px] flex-1">
            <h2 className="font-semibold mb-3 text-sm">
              {estado} <span className="text-sf-text-muted font-normal">({leads.filter(l => l.estado === estado).length})</span>
            </h2>
            <div className="space-y-3">
              {leads.filter(l => l.estado === estado).map(lead => (
                <div key={lead.id} className="bg-sf-bg rounded-md p-3">
                  <p className="font-medium text-sm">{lead.nombre}</p>
                  <p className="text-xs text-sf-text-muted mb-2">{lead.propiedadInteres}</p>
                  <div className="flex justify-between">
                    <button disabled={colIndex === 0} onClick={() => moveLead(lead.id, -1)} className="text-xs text-sf-text-muted hover:text-sf-blue disabled:opacity-20 disabled:cursor-not-allowed">
                      ← Atrás
                    </button>
                    <button disabled={colIndex === estados.length - 1} onClick={() => moveLead(lead.id, 1)} className="text-xs text-sf-text-muted hover:text-sf-blue disabled:opacity-20 disabled:cursor-not-allowed">
                      Avanzar →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}