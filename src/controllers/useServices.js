import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getServices } from '../models/services.model'

const fallback = [
  { id: 1, title: 'CrossFit', slug: 'crossfit', description: 'Entrenamiento funcional de alta intensidad que combina levantamiento olímpico, gimnástica y cardio.', icon: 'fitness_center', image_url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80', tag: 'HIIT', tag_style: 'bg-orange-500/20 text-orange-400' },
  { id: 2, title: 'Yoga', slug: 'yoga', description: 'Fluidez y respiración consciente para conectar cuerpo y mente mientras desarrollas flexibilidad.', icon: 'self_improvement', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', tag: 'Flexibilidad', tag_style: 'bg-purple-500/20 text-purple-400' },
  { id: 3, title: 'Spinning', slug: 'spinning', description: 'Ciclismo indoor al ritmo de la música. Quema hasta 600 calorías por sesión.', icon: 'directions_bike', image_url: 'https://images.unsplash.com/photo-1529528744093-6f8abeee511d?w=800&q=80', tag: 'Cardio', tag_style: 'bg-red-500/20 text-red-400' },
  { id: 4, title: 'Box', slug: 'box', description: 'Técnica de boxeo con acondicionamiento físico para un entrenamiento completo de cuerpo total.', icon: 'sports_kabaddi', image_url: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80', tag: 'Fuerza', tag_style: 'bg-primary/20 text-primary' },
  { id: 5, title: 'Funcional', slug: 'funcional', description: 'Ejercicios que imitan movimientos cotidianos para mejorar tu rendimiento en la vida diaria.', icon: 'monitoring', image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', tag: 'General', tag_style: 'bg-blue-500/20 text-blue-400' },
  { id: 6, title: 'Pilates', slug: 'pilates', description: 'Fortalece tu core, mejora tu postura y gana flexibilidad con ejercicios de control y precisión.', icon: 'accessibility_new', image_url: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800&q=80', tag: 'Flexibilidad', tag_style: 'bg-purple-500/20 text-purple-400' },
]

export default function useServices() {
  const [services, setServices] = useState(fallback)
  const [loading, setLoading] = useState(false)

  const loadServices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getServices()
      if (data?.length > 0) setServices(data)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadServices() }, [loadServices])

  useEffect(() => {
    const channel = supabase.channel('services-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => loadServices())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadServices])

  return { services, loading }
}