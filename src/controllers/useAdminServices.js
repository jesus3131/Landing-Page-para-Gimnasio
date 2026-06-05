import { useState, useEffect, useCallback } from 'react'
import * as servicesModel from '../models/services.model'

export default function useAdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await servicesModel.getAllServices()
      setServices(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await servicesModel.createService(fields)
    await load()
  }

  async function update(id, fields) {
    await servicesModel.updateService(id, fields)
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s))
  }

  async function remove(id) {
    await servicesModel.deleteService(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return { services, loading, create, update, remove, refresh: load }
}
