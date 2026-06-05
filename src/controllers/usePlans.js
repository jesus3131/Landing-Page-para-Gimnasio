import { useState, useEffect } from 'react'
import { getPlans, getPlanFeatures } from '../models/plans.model'

export default function usePlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const plansData = await getPlans()
        const withFeatures = await Promise.all(
          (plansData || []).map(async (plan) => {
            const features = await getPlanFeatures(plan.id)
            return { ...plan, features: features || [] }
          })
        )
        setPlans(withFeatures)
      } catch { /* silent */ }
      finally { setLoading(false) }
    })()
  }, [])

  return { plans, loading }
}
