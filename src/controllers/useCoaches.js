import { useState, useEffect } from 'react'
import { getCoaches } from '../models/coaches.model'

const fallback = [
  { id: 1, name: 'Carlos Méndez', photo_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80', specialties: ['Fuerza', 'Powerlifting', 'Nutrición Deportiva'], bio: 'Coach especializado en entrenamiento de fuerza y powerlifting con más de 10 años de experiencia.', certifications: 'CrossFit L1, NSCA-CPT' },
  { id: 2, name: 'Ana Ramírez', photo_url: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80', specialties: ['Yoga', 'Flexibilidad', 'Mindfulness'], bio: 'Instructora certificada de yoga y meditación, apasionada por conectar mente y cuerpo.', certifications: 'RYT-500, Yoga Alliance' },
  { id: 3, name: 'Luis Torres', photo_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80', specialties: ['CrossFit', 'HIIT', 'Acondicionamiento'], bio: 'Entrenador de CrossFit y HIIT, enfocado en llevar tu resistencia al siguiente nivel.', certifications: 'CrossFit Level 2, USAW' },
]

export default function useCoaches() {
  const [coaches, setCoaches] = useState(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCoaches()
      .then(data => { if (data?.length > 0) setCoaches(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { coaches, loading }
}
