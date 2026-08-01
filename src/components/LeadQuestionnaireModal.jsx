import { useState } from 'react'
import { X } from 'lucide-react'

const preguntas = [
  {
    id: 'presupuesto',
    texto: '¿El presupuesto del lead coincide con el precio de la propiedad que le interesa?',
    opciones: [
      { texto: 'Sí, coincide o está por encima', puntos: 3 },
      { texto: 'Es cercano, con algo de flexibilidad', puntos: 2 },
      { texto: 'Está muy por debajo', puntos: 0 },
    ],
  },
  {
    id: 'autoridad',
    texto: '¿Quién toma la decisión de compra?',
    opciones: [
      { texto: 'El lead decide solo', puntos: 3 },
      { texto: 'Decide en pareja o familia, ya lo platicaron', puntos: 2 },
      { texto: 'Depende de un tercero no identificado', puntos: 0 },
    ],
  },
  {
    id: 'necesidad',
    texto: '¿Qué tan clara es su necesidad de comprar?',
    opciones: [
      { texto: 'Tiene una razón concreta (mudanza, inversión, etc.)', puntos: 3 },
      { texto: 'Está explorando opciones', puntos: 1 },
      { texto: 'Solo tiene curiosidad', puntos: 0 },
    ],
  },
  {
    id: 'tiempo',
    texto: '¿En cuánto tiempo planea decidir?',
    opciones: [
      { texto: 'Menos de 1 mes', puntos: 3 },
      { texto: 'Entre 1 y 3 meses', puntos: 2 },
      { texto: 'Más de 3 meses / sin fecha definida', puntos: 0 },
    ],
  },
  {
    id: 'respuesta',
    texto: '¿Qué tan rápido responde a tus mensajes?',
    opciones: [
      { texto: 'El mismo día', puntos: 2 },
      { texto: 'Tarda unos días', puntos: 1 },
      { texto: 'Dejó de responder / se enfrió', puntos: 0 },
    ],
  },
  {
    id: 'cita',
    texto: '¿Ya tuvo cita o visita a la propiedad?',
    opciones: [
      { texto: 'Sí', puntos: 0, cita: true },
      { texto: 'No', puntos: 0, cita: false },
    ],
  },
]

export default function LeadQuestionnaireModal({ lead, onClose, onSave }) {
  const [respuestas, setRespuestas] = useState({})

  function seleccionar(preguntaId, opcion) {
    setRespuestas(r => ({ ...r, [preguntaId]: opcion }))
  }

  const todasContestadas = preguntas.every(p => respuestas[p.id] !== undefined)

  function handleSubmit(e) {
    e.preventDefault()
    if (!todasContestadas) return

    const puntosTotales = preguntas
      .filter(p => p.id !== 'cita')
      .reduce((sum, p) => sum + respuestas[p.id].puntos, 0)

    let calificacion = 'Frío'
    if (puntosTotales >= 10) calificacion = 'Caliente'
    else if (puntosTotales >= 5) calificacion = 'Tibio'

    const citaRealizada = respuestas.cita.cita

    const resumen = preguntas.map(p => `${p.texto} → ${respuestas[p.id].texto}`).join('\n')
    const comentarioNuevo = `[Cuestionario de calificación - ${new Date().toLocaleDateString('es-MX')}]\n${resumen}\nPuntaje: ${puntosTotales}/14 → ${calificacion}`
    const comentariosFinal = lead.comentarios ? `${lead.comentarios}\n\n${comentarioNuevo}` : comentarioNuevo

    onSave({ calificacion, cita_realizada: citaRealizada, comentarios: comentariosFinal })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-sf-border sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold">Cuestionario de calificación</h2>
            <p className="text-xs text-sf-text-muted">{lead.nombre}</p>
          </div>
          <button onClick={onClose} className="text-sf-text-muted hover:text-sf-text"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {preguntas.map(p => (
            <div key={p.id}>
              <p className="text-sm font-medium mb-2">{p.texto}</p>
              <div className="space-y-1.5">
                {p.opciones.map(op => (
                  <label key={op.texto} className={`flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer transition ${respuestas[p.id]?.texto === op.texto ? 'border-sf-blue bg-sf-blue/5' : 'border-sf-border hover:bg-sf-bg'}`}>
                    <input type="radio" name={p.id} checked={respuestas[p.id]?.texto === op.texto} onChange={() => seleccionar(p.id, op)} className="accent-[#0176D3]" />
                    {op.texto}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" disabled={!todasContestadas} className="w-full bg-sf-blue hover:bg-sf-navy text-white rounded-md py-2 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed">
            Calcular calificación y guardar
          </button>
        </form>
      </div>
    </div>
  )
}