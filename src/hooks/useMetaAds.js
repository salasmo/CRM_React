import { useState, useEffect } from 'react'

export function useMetaAds() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/meta-ads')
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setCampaigns(data.campaigns || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { campaigns, loading, error }
}