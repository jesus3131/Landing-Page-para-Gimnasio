import { useState, useEffect } from 'react'
import { getTestimonials } from '../models/testimonials.model'

export default function useTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTestimonials()
      .then(data => setTestimonials(data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { testimonials, loading }
}
