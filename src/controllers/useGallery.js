import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getGalleryImages } from '../models/gallery.model'

const fallback = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', title: 'Zona de musculación', alt: 'Máquinas de pesas', category: 'Instalaciones' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', title: 'Área de cardio', alt: 'Tapetas y elípticas', category: 'Instalaciones' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80', title: 'Zona CrossFit', alt: 'Entrenamiento funcional', category: 'Entrenamiento' },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', title: 'Entrenamiento personal', alt: 'Sesiones one-to-one', category: 'Entrenamiento' },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', title: 'Salón de yoga', alt: 'Espacio de meditación', category: 'Instalaciones' },
]

export default function useGallery() {
  const [images, setImages] = useState(fallback)
  const [loading, setLoading] = useState(false)

  const loadGallery = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getGalleryImages()
      if (data?.length > 0) setImages(data)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadGallery() }, [loadGallery])

  useEffect(() => {
    const channel = supabase.channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => loadGallery())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadGallery])

  return { images, loading }
}