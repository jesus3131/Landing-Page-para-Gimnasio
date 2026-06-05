import { useState, useEffect, useCallback } from 'react'
import * as eventsModel from '../models/events.model'

export default function useAdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await eventsModel.getAllEvents()
      setEvents(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await eventsModel.createEvent(fields)
    await load()
  }

  async function update(id, fields) {
    await eventsModel.updateEvent(id, fields)
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e))
  }

  async function remove(id) {
    await eventsModel.deleteEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return { events, loading, create, update, remove, refresh: load }
}
