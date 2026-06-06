import { useState, useEffect, useRef, useCallback } from 'react'
import * as galleryModel from '../models/gallery.model'

const VALID_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
const VALID_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

function isValidImageUrl(url) {
  try {
    const u = new URL(url)
    const ext = u.pathname.split('.').pop()?.toLowerCase()
    return u.protocol === 'https:' && VALID_EXTS.includes(ext)
  } catch { return false }
}

const SPANS = [
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-1 lg:row-span-2',
  'lg:col-span-2 lg:row-span-2',
]

export default function useAdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const loadImages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await galleryModel.getAllGalleryImages()
      setImages(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadImages() }, [loadImages])

  function nextSpan() {
    const used = images.filter(i => i.active !== false).length
    return SPANS[used % SPANS.length]
  }

  async function uploadFromFile(file) {
    if (!file) return
    if (!VALID_MIMES.includes(file.type)) {
      setToast({ type: 'error', message: `Formato no soportado: ${file.type || file.name.split('.').pop()}. Usa JPG, PNG, WEBP o GIF.` })
      throw new Error('invalid format')
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ type: 'error', message: 'La imagen supera los 10 MB. Comprime la imagen e intenta de nuevo.' })
      throw new Error('file too large')
    }
    setUploading(true)
    try {
      const span = nextSpan()
      await galleryModel.uploadGalleryImage(file, title, span)
      setTitle('')
      setToast({ type: 'success', message: 'Imagen subida correctamente' })
      await loadImages()
    } catch (e) {
      if (e.message !== 'invalid format' && e.message !== 'file too large') {
        setToast({ type: 'error', message: 'Error al subir: ' + (e.message || 'desconocido') })
      }
      throw e
    }
    finally { setUploading(false) }
  }

  async function uploadFromUrl() {
    const url = urlInput.trim()
    if (!url) return
    if (!isValidImageUrl(url)) {
      setToast({ type: 'error', message: 'URL inválida. Debe ser HTTPS y apuntar a una imagen (JPG, PNG, WEBP, GIF).' })
      return
    }
    setUploading(true)
    try {
      const span = nextSpan()
      await galleryModel.uploadGalleryImageFromUrl(url, title, span)
      setTitle('')
      setUrlInput('')
      setToast({ type: 'success', message: 'Imagen agregada desde URL' })
      await loadImages()
    } catch (e) {
      setToast({ type: 'error', message: 'Error al agregar: ' + (e.message || 'desconocido') })
    }
    finally { setUploading(false) }
  }

  async function upload() {
    const file = fileRef.current?.files?.[0]
    if (file) {
      try { await uploadFromFile(file) }
      catch {}
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      try { await uploadFromFile(file) }
      catch {}
    }
  }

  async function remove(img) {
    try {
      await galleryModel.softDeleteGalleryImage(img.id)
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, active: false } : i))
      setToast({ type: 'success', message: 'Imagen inhabilitada' })
    } catch (e) {
      setToast({ type: 'error', message: 'Error al inhabilitar' })
      throw e
    }
  }

  async function saveEdit(img) {
    const fields = {}
    if (editTitle !== img.title) fields.title = editTitle
    if (editCategory !== img.category) fields.category = editCategory
    if (Object.keys(fields).length === 0) { cancelEdit(); return }
    try {
      await galleryModel.updateGalleryImage(img.id, fields)
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, ...fields } : i))
      setToast({ type: 'success', message: 'Imagen actualizada' })
      cancelEdit()
    } catch (e) {
      setToast({ type: 'error', message: 'Error al guardar: ' + (e.message || 'desconocido') })
    }
  }

  function startEdit(img) {
    setEditingId(img.id)
    setEditTitle(img.title || '')
    setEditCategory(img.category || 'General')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditCategory('')
  }

  return {
    images, loading, uploading, title, setTitle,
    urlInput, setUrlInput,
    editingId, editTitle, setEditTitle, editCategory, setEditCategory,
    dragOver, setDragOver,
    fileRef, upload, uploadFromUrl, handleDrop, remove, saveEdit,
    startEdit, cancelEdit, toast,
  }
}
