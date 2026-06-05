import { useState, useEffect, useCallback } from 'react'
import * as coachesModel from '../models/coaches.model'

export default function useAdminCoaches() {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await coachesModel.getAllCoaches()
      setCoaches(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await coachesModel.createCoach(fields)
    await load()
  }

  async function update(id, fields) {
    await coachesModel.updateCoach(id, fields)
    setCoaches(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c))
  }

  async function remove(id) {
    await coachesModel.deleteCoach(id)
    setCoaches(prev => prev.filter(c => c.id !== id))
  }

  return { coaches, loading, create, update, remove, refresh: load }
}
