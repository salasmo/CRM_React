import { createClient } from '@supabase/supabase-js'
import { enviarWhatsAppConFallback } from './_lib/whatsapp.js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !userData?.user) return res.status(401).json({ error: 'No autorizado' })

  const { conversacion_id, telefono, mensaje, autor } = req.body
  if (!telefono || !mensaje) return res.status(400).json({ error: 'Faltan datos' })

  try {
    const resultado = await enviarWhatsAppConFallback(telefono, mensaje)
    if (resultado.error) {
      return res.status(500).json({ error: resultado.error.message || 'Error al enviar' })
    }

    await supabase.from('whatsapp_mensajes').insert({
      conversacion_id,
      direccion: 'saliente',
      contenido: mensaje,
      autor: autor || 'Vendedor',
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}