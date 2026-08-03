import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const SYSTEM_PROMPT = `Eres un asistente de ventas de bienes raíces para Terralta, un desarrollo residencial en Zacatecas. Platicas por WhatsApp con prospectos interesados, de forma cálida, breve y natural (máximo 3-4 líneas por mensaje, como se escribe en WhatsApp real, sin sonar a robot ni a cuestionario).

A lo largo de la conversación intenta descubrir, con preguntas naturales (nunca todas de golpe):
- Su nombre
- Qué tipo de propiedad o lote le interesa
- Su presupuesto aproximado
- Qué tan pronto quiere comprar

Revisa SIEMPRE el historial completo de la conversación antes de responder. Si el prospecto ya te dio su nombre o algún dato antes, NO se lo vuelvas a preguntar — continúa la conversación de forma natural con base en lo que ya sabes.

Cuando ya tengas al menos su nombre y una señal clara de interés real (presupuesto o urgencia mencionados), considera que está listo para pasar con un asesor humano.

Responde ÚNICAMENTE con JSON válido, sin texto antes ni después, exactamente en esta forma:
{
  "respuesta": "mensaje para mandar al prospecto por WhatsApp",
  "listo_para_asesor": true o false,
  "datos_lead": {
    "nombre": "string o null",
    "propiedad_interes": "string o null",
    "presupuesto_mencionado": "string o null",
    "urgencia": "string o null"
  }
}`

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge)
    }
    return res.status(403).send('Verificación fallida')
  }

  if (req.method !== 'POST') return res.status(405).end()

  try {
    const entry = req.body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const mensaje = value?.messages?.[0]

    if (!mensaje) return res.status(200).send('EVENT_RECEIVED')

    const waMessageId = mensaje.id
    const telefono = mensaje.from
    const textoEntrante = mensaje.text?.body || ''
    const nombreContacto = value.contacts?.[0]?.profile?.name || null

    let { data: conversacion } = await supabase
      .from('whatsapp_conversaciones')
      .select('*')
      .eq('telefono', telefono)
      .single()

    if (!conversacion) {
      const { data: nueva } = await supabase
        .from('whatsapp_conversaciones')
        .insert({ telefono, nombre_contacto: nombreContacto, bot_activo: true })
        .select()
        .single()
      conversacion = nueva
    }

    const { error: insertError } = await supabase.from('whatsapp_mensajes').insert({
      conversacion_id: conversacion.id,
      direccion: 'entrante',
      contenido: textoEntrante,
      autor: nombreContacto || telefono,
      wa_message_id: waMessageId,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        console.log('Mensaje duplicado ignorado:', waMessageId)
        return res.status(200).send('EVENT_RECEIVED')
      }
      console.error('Error al guardar mensaje entrante:', insertError)
      return res.status(200).send('EVENT_RECEIVED')
    }

    if (!conversacion.bot_activo) {
      return res.status(200).send('EVENT_RECEIVED')
    }

    const { data: historial } = await supabase
      .from('whatsapp_mensajes')
      .select('direccion, contenido')
      .eq('conversacion_id', conversacion.id)
      .order('created_at', { ascending: true })
      .limit(20)

    const mensajesParaIA = historial.map(m => ({
      role: m.direccion === 'entrante' ? 'user' : 'assistant',
      content: m.contenido,
    }))

    console.log('Historial enviado a la IA:', JSON.stringify(mensajesParaIA))

    const iaResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...mensajesParaIA],
      }),
    })

    const iaData = await iaResponse.json()
    console.log('Respuesta cruda de OpenRouter:', JSON.stringify(iaData))

    let parsed
    try {
      const rawText = iaData.choices[0].message.content
      const jsonLimpio = rawText.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(jsonLimpio)
    } catch (parseErr) {
      console.error('No se pudo parsear la respuesta de la IA:', parseErr.message)
      parsed = { respuesta: 'Gracias por tu mensaje, en un momento te atendemos.', listo_para_asesor: false, datos_lead: {} }
    }

    const enviado = await enviarWhatsAppConFallback(telefono, parsed.respuesta)
    console.log('Resultado final de envío:', JSON.stringify(enviado))

    await supabase.from('whatsapp_mensajes').insert({
      conversacion_id: conversacion.id,
      direccion: 'saliente',
      contenido: parsed.respuesta,
      autor: 'Bot',
    })

    if (parsed.listo_para_asesor && !conversacion.lead_id) {
      const datos = parsed.datos_lead || {}
      const { data: leadCreado } = await supabase.from('leads').insert({
        nombre: datos.nombre || nombreContacto || 'Prospecto de WhatsApp',
        telefono,
        propiedad_interes: datos.propiedad_interes || null,
        origen: 'WhatsApp',
        comentarios: `Generado por el bot de WhatsApp.\nPresupuesto mencionado: ${datos.presupuesto_mencionado || 'no especificado'}\nUrgencia: ${datos.urgencia || 'no especificada'}`,
      }).select().single()

      await supabase.from('whatsapp_conversaciones')
        .update({ lead_id: leadCreado.id, bot_activo: false })
        .eq('id', conversacion.id)
    }

    res.status(200).send('EVENT_RECEIVED')
  } catch (err) {
    console.error('Error general en el webhook:', err)
    res.status(200).send('EVENT_RECEIVED')
  }
}

function variantesMexico(telefono) {
  if (!telefono.startsWith('52')) return [telefono]
  const resto = telefono.slice(2)
  if (resto.startsWith('1')) {
    return [telefono, '52' + resto.slice(1)]
  } else {
    return [telefono, '521' + resto]
  }
}

async function enviarWhatsAppConFallback(telefono, texto) {
  const variantes = variantesMexico(telefono)
  for (const numero of variantes) {
    const resultado = await enviarWhatsApp(numero, texto)
    if (!resultado.error) return resultado
    if (resultado.error?.code !== 131030) return resultado
  }
  return { error: { message: 'Ninguna variante del número funcionó' } }
}

async function enviarWhatsApp(telefono, texto) {
  const response = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: telefono,
      text: { body: texto },
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    console.error(`Error de Meta al enviar a ${telefono}:`, JSON.stringify(data))
  }
  return data
}