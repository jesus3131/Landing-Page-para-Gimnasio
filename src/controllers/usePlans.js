import { useState, useEffect } from 'react'
import { getPlans, getPlanFeatures } from '../models/plans.model'

const fallbackPlans = [
  { id: 1, name: 'Básico', slug: 'basico', price: 79000, period: 'month', description: 'Perfecto para quienes inician.', featured: false, image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', features: [{ id: 1, label: 'Acceso al gym 6am-10pm', included: true }, { id: 2, label: 'Área de musculación y cardio', included: true }, { id: 3, label: '5 clases grupales al mes', included: true }, { id: 4, label: 'Vestidores y duchas', included: true }] },
  { id: 2, name: 'Profesional', slug: 'profesional', price: 129000, period: 'month', description: 'Nuestro plan más popular con acceso ilimitado.', featured: true, image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', features: [{ id: 5, label: 'Acceso al gym 6am-10pm', included: true }, { id: 6, label: 'Clases grupales ilimitadas', included: true }, { id: 7, label: 'Piscina & spa', included: true }, { id: 8, label: 'Vestidores y duchas', included: true }] },
  { id: 3, name: 'Premium', slug: 'premium', price: 199000, period: 'month', description: 'La experiencia definitiva con atención personalizada 24/7.', featured: false, image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', features: [{ id: 9, label: 'Acceso 24/7', included: true }, { id: 10, label: 'Clases ilimitadas', included: true }, { id: 11, label: '12 sesiones de entrenador personal', included: true }, { id: 12, label: 'Nutrición personalizada', included: true }] },
]

export default function usePlans() {
  const [plans, setPlans] = useState(fallbackPlans)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      try {
        const plansData = await getPlans()
        if (plansData?.length > 0) {
          const withFeatures = await Promise.all(
            plansData.map(async (plan) => {
              const features = await getPlanFeatures(plan.id)
              return { ...plan, features: features || [] }
            })
          )
          setPlans(withFeatures)
        }
      } catch { /* use fallback */ }
      finally { setLoading(false) }
    })()
  }, [])

  return { plans, loading }
}
