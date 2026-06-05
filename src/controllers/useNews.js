import { useState, useEffect } from 'react'
import { getNews } from '../models/news.model'

const fallback = [
  { id: 1, title: 'Nuevo equipamiento de última generación', summary: 'Hemos renovado nuestra zona de musculación con máquinas Hammer Strength y bancas ajustables.', content: '', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', date: '2026-05-28', author: 'ZonaFit' },
  { id: 2, title: 'Horario extendido en todas las sucursales', summary: 'A partir de junio abrimos 24/7 los 365 días del año para que entrenes a la hora que quieras.', content: '', image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', date: '2026-05-20', author: 'ZonaFit' },
  { id: 3, title: 'ZonaFit alcanza los 5000 miembros activos', summary: 'Gracias a tu confianza seguimos creciendo. Celebraremos con un evento especial para toda la comunidad.', content: '', image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', date: '2026-05-10', author: 'ZonaFit' },
]

export default function useNews() {
  const [news, setNews] = useState(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getNews()
      .then(data => { if (data?.length > 0) setNews(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { news, loading }
}
