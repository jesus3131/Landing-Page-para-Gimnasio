import { useState, useEffect, useCallback } from 'react'
import * as metricsModel from '../models/metrics.model'

export default function useMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await metricsModel.getMetrics()
      setMetrics(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  return { metrics, loading, refresh: load }
}
