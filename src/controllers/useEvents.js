import { useState, useEffect } from 'react'
import { getEvents } from '../models/events.model'

const fallback = [
  { id: 1, title: 'Torneo de CrossFit ZonaFit 2026', description: 'Únete al evento más intenso del año. Categorías principiante, intermedio y avanzado. Premios en efectivo y membresías gratuitas.', date: '2026-07-15', time: '09:00', image_url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80', location: 'ZonaFit Gym Principal' },
  { id: 2, title: 'Taller de Nutrición Deportiva', description: 'Aprende los fundamentos de la nutrición para rendir al máximo. Impartido por nuestra nutrióloga Diana López.', date: '2026-06-20', time: '11:00', image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80', location: 'Sala de Usos Múltiples' },
  { id: 3, title: 'Reto de 30 Días', description: 'Transforma tu cuerpo en 30 días con entrenamiento diario guiado y plan nutricional incluido. Inscripciones abiertas.', date: '2026-08-01', time: '06:00', image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', location: 'ZonaFit Gym' },
]

export default function useEvents() {
  const [events, setEvents] = useState(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getEvents()
      .then(data => { if (data?.length > 0) setEvents(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { events, loading }
}
