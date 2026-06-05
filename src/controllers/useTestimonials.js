import { useState, useEffect } from 'react'
import { getTestimonials } from '../models/testimonials.model'

const fallback = [
  { id: 1, quote: 'Desde que entreno en ZONAFIT mi vida cambió por completo. Bajé 15 kilos en 6 meses y gané una confianza que nunca había tenido.', author: 'María Pérez', role: 'Miembro desde 2023', initials: 'MP', rating: 5 },
  { id: 2, quote: 'Las clases de CrossFit son increíbles. Los entrenadores siempre están pendientes de tu técnica y te motivan a dar lo mejor.', author: 'Jorge López', role: 'Miembro desde 2024', initials: 'JL', rating: 5 },
  { id: 3, quote: 'El ambiente es espectacular. Todos son bienvenidos sin importar tu nivel. ZONAFIT no es solo un gimnasio, es una familia.', author: 'Andrea García', role: 'Miembro desde 2022', initials: 'AG', rating: 5 },
]

export default function useTestimonials() {
  const [testimonials, setTestimonials] = useState(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTestimonials()
      .then(data => { if (data?.length > 0) setTestimonials(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { testimonials, loading }
}
