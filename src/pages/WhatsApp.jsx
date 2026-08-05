import { useState, useEffect, useCallback } from 'react'
import { Send, Bot, User, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function WhatsApp() {
  const { profile, session } = useAuth()
  const [conversaciones, setConversaciones] = useState([])
  const [activaId, setActivaId] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargarConversaciones = useCallback(() => {
    supabase.from('whatsapp_conversaciones').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setConversaciones(data || []))
  }, [])

  const cargarMensajes = useCallback((conversacionId) => {
    supabase.from('whatsapp_mensajes').select('*').eq('conversacion_id', conversacionId).order('created_at', { ascending: true })
      .then(({ data }) => setMensajes(data || []))
  }, [])

  useEffect(() => {
    cargarConversaciones()
    const interval = setInterval(cargarConversaciones, 5000)
    return () => clearInterval(interval)
  }, [cargarConversaciones])

  useEffect(() => {
    if (!activaId) return
    cargarMensajes(activaId)
    const interval = setInterval(() => cargarMensajes(activaId), 3000)
    return () => clearInterval(interval)
  }, [activaId, cargarMensajes])

  const conversacionActiva = conversaciones.find(c => c.id === activaId)

  async function toggleBot(conv) {
    await supabase.from('whatsapp_conversaciones').update({ bot_activo: !conv.bot_activo }).eq('id', conv.id)
    cargarConversaciones()
  }

  async function eliminarConversacion(e, conv) {
    e.stopPropagation()
    const confirmado = window.confirm(`¿Eliminar la conversación con ${conv.nombre_contacto || conv.telefono}? Esto borra también todo el historial de mensajes.`)
    if (!confirmado) return

    await supabase.from('whatsapp_conversaciones').delete().eq('id', conv.id)

    if (activaId === conv.id) {
      setActivaId(null)
      setMensajes([])
    }
    cargarConversaciones()
  }

  async function enviarManual(e) {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !conversacionActiva) return
    setEnviando(true)
    await fetch('/api/whatsapp-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({
        conversacion_id: conversacionActiva.id,
        telefono: conversacionActiva.telefono,
        mensaje: nuevoMensaje,
        autor: profile?.nombre || 'Vendedor',
      }),
    })
    setNuevoMensaje('')
    setEnviando(false)
    cargarMensajes(activaId)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">WhatsApp</h1>
      <p className="text-sf-text-muted text-sm mb-6">Conversaciones activas del bot</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        <div className="bg-white border border-sf-border rounded-lg shadow-sm overflow-y-auto">
          {conversaciones.length === 0 && (
            <p className="p-4 text-sm text-sf-text-muted">Aún no hay conversaciones.</p>
          )}
          {conversaciones.map(conv => (
            <div
              key={conv.id}
              onClick={() => setActivaId(conv.id)}
              className={`w-full text-left px-4 py-3 border-b border-sf-border hover:bg-sf-bg transition cursor-pointer ${activaId === conv.id ? 'bg-sf-blue/5' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{conv.nombre_contacto || conv.telefono}</p>
                <div className="flex items-center gap-2 shrink-0">
                  {conv.bot_activo ? (
                    <Bot size={14} className="text-sf-blue" />
                  ) : (
                    <User size={14} className="text-sf-success" />
                  )}
                  <button onClick={e => eliminarConversacion(e, conv)} className="text-sf-text-muted hover:text-sf-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-sf-text-muted">{conv.telefono}</p>
              {conv.lead_id && <span className="text-xs text-sf-success">Lead creado</span>}
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white border border-sf-border rounded-lg shadow-sm flex flex-col overflow-hidden">
          {!conversacionActiva ? (
            <div className="flex-1 flex items-center justify-center text-sm text-sf-text-muted">
              Selecciona una conversación
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-sf-border flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{conversacionActiva.nombre_contacto || conversacionActiva.telefono}</p>
                  <p className="text-xs text-sf-text-muted">{conversacionActiva.telefono}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-sf-text-muted">
                    <input type="checkbox" checked={conversacionActiva.bot_activo} onChange={() => toggleBot(conversacionActiva)} />
                    Bot activo
                  </label>
                  <button onClick={e => eliminarConversacion(e, conversacionActiva)} className="text-sf-text-muted hover:text-sf-danger" title="Eliminar conversación">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mensajes.map(m => (
                  <div key={m.id} className={`flex ${m.direccion === 'saliente' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.direccion === 'saliente' ? 'bg-sf-blue text-white' : 'bg-sf-bg text-sf-text'}`}>
                      <p className="whitespace-pre-wrap">{m.contenido}</p>
                      <p className={`text-[10px] mt-1 ${m.direccion === 'saliente' ? 'text-white/70' : 'text-sf-text-muted'}`}>{m.autor}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={enviarManual} className="p-3 border-t border-sf-border flex gap-2">
                <input
                  value={nuevoMensaje}
                  onChange={e => setNuevoMensaje(e.target.value)}
                  placeholder={conversacionActiva.bot_activo ? 'El bot está contestando esta conversación...' : 'Escribe un mensaje'}
                  className="flex-1 border border-sf-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sf-blue"
                />
                <button type="submit" disabled={enviando} className="bg-sf-blue hover:bg-sf-navy text-white rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}