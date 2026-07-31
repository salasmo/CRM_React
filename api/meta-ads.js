export default async function handler(req, res) {
    const { META_ACCESS_TOKEN, META_AD_ACCOUNT_ID } = process.env
  
    if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
      return res.status(500).json({ error: 'Faltan variables de entorno de Meta en el servidor' })
    }
  
    try {
      const fields = 'campaign_name,spend,impressions,clicks,actions'
      const url = `https://graph.facebook.com/v19.0/act_${META_AD_ACCOUNT_ID}/insights?level=campaign&date_preset=last_30d&fields=${fields}&access_token=${META_ACCESS_TOKEN}`
  
      const response = await fetch(url)
      const json = await response.json()
  
      if (json.error) {
        return res.status(400).json({ error: json.error.message })
      }
  
      const campaigns = (json.data || []).map(c => {
        const leadAction = (c.actions || []).find(a => a.action_type.includes('lead'))
        const leads = leadAction ? Number(leadAction.value) : 0
        const gasto = Number(c.spend || 0)
        return {
          nombre: c.campaign_name,
          gasto,
          impresiones: Number(c.impressions || 0),
          clics: Number(c.clicks || 0),
          leads,
          cpl: leads > 0 ? gasto / leads : null,
        }
      })
  
      res.status(200).json({ campaigns })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }