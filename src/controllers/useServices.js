import { useState, useEffect } from 'react'
import { getServices } from '../models/services.model'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices()
      .then(data => setServices(data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { services, loading }
}
