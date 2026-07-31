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
      <h1 className="text-3xl font-bold mb-8">Pipeline de ventas</h1>
      <div className="grid grid-cols-4 gap-4">
        {estados.map((estado, colIndex) => (
          <div key={estado} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="font-semibold mb-4 text-slate-300">
              {estado} <span className="text-slate-500">({leads.filter(l => l.estado === estado).length})</span>
            </h2>
            <div className="space-y-3">
              {leads.filter(l => l.estado === estado).map(lead => (
                <div key={lead.id} className="bg-slate-800 rounded-lg p-3">
                  <p className="font-medium text-sm">{lead.nombre}</p>
                  <p className="text-xs text-slate-400 mb-2">{lead.propiedadInteres}</p>
                  <div className="flex justify-between">
                    <button disabled={colIndex === 0} onClick={() => moveLead(lead.id, -1)} className="text-xs text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed">
                      ← Atrás
                    </button>
                    <button disabled={colIndex === estados.length - 1} onClick={() => moveLead(lead.id, 1)} className="text-xs text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed">
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