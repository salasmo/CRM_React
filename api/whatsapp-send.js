import { createClient } from '@supabase/supabase-js'

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
    await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: telefono,
        text: { body: mensaje },
      }),
    })

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