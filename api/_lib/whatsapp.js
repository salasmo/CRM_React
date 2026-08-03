export function normalizarTelefono(tel) {
    if (!tel.startsWith('52')) return tel
    const resto = tel.slice(2)
    if (resto.startsWith('1') && resto.length === 11) {
      return '52' + resto.slice(1)
    }
    return tel
  }
  
  export function variantesMexico(telefono) {
    if (!telefono.startsWith('52')) return [telefono]
    const resto = telefono.slice(2)
    if (resto.startsWith('1')) {
      return [telefono, '52' + resto.slice(1)]
    } else {
      return [telefono, '521' + resto]
    }
  }
  
  export async function enviarWhatsApp(telefono, texto) {
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
  
  export async function enviarWhatsAppConFallback(telefono, texto) {
    const variantes = variantesMexico(telefono)
    for (const numero of variantes) {
      const resultado = await enviarWhatsApp(numero, texto)
      if (!resultado.error) return resultado
      if (resultado.error?.code !== 131030) return resultado
    }
    return { error: { message: 'Ninguna variante del número funcionó' } }
  }