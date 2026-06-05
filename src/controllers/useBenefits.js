import { useState, useEffect } from 'react'
import { getBenefits } from '../models/benefits.model'

const fallback = [
  { id: 1, icon: 'fitness_center', title: 'GYM PAS', description: 'Acceso completo a nuestras instalaciones con equipamiento de última generación.', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', stat: '24/7', stat_label: 'acceso' },
  { id: 2, icon: 'schedule', title: 'HORARIO', description: 'Abierto de 6am a 11pm todos los días para que entrenes a tu ritmo.', image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', stat: '6am-11pm', stat_label: 'horario' },
  { id: 3, icon: 'personal_injury', title: 'ENTRENADOR', description: 'Planes personalizados con seguimiento continuo de profesionales certificados.', image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', stat: '+15', stat_label: 'coaches' },
  { id: 4, icon: 'groups', title: 'CLASES GRUPALES', description: 'CrossFit, Yoga, Spinning y más. Más de 20 clases semanales.', image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', stat: '20+', stat_label: 'clases/sem' },
  { id: 5, icon: 'restaurant', title: 'NUTRICIÓN', description: 'Asesoría nutricional profesional para complementar tu entrenamiento.', image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', stat: '1:1', stat_label: 'consultas' },
]

export default function useBenefits() {
  const [benefits, setBenefits] = useState(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getBenefits()
      .then(data => { if (data?.length > 0) setBenefits(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { benefits, loading }
}
