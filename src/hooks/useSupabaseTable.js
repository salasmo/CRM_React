import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSupabaseTable(table, orderBy = 'created_at') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: false })
    if (error) console.error(error)
    else setData(data)
    setLoading(false)
  }, [table, orderBy])

  useEffect(() => { fetchData() }, [fetchData])

  async function insert(row) {
    const { data: inserted, error } = await supabase.from(table).insert(row).select()
    if (error) { console.error(error); return }
    setData(prev => [...inserted, ...prev])
  }

  async function update(id, changes) {
    const { error } = await supabase.from(table).update(changes).eq('id', id)
    if (error) { console.error(error); return }
    setData(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item))
  }

  async function remove(id) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) { console.error(error); return }
    setData(prev => prev.filter(item => item.id !== id))
  }

  return { data, loading, insert, update, remove, refetch: fetchData }
}