import { useState, useEffect } from 'react'
import { getGalleryImages } from '../models/gallery.model'

export default function useGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryImages()
      .then(data => { if (data?.length > 0) setImages(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { images, loading }
}
