import { useState, useEffect, useRef, useCallback } from 'react'
import * as galleryModel from '../models/gallery.model'

export default function useAdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const loadImages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await galleryModel.getAllGalleryImages()
      setImages(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadImages() }, [loadImages])

  async function uploadFromFile(file) {
    if (!file) return
    setUploading(true)
    try {
      await galleryModel.uploadGalleryImage(file, title)
      setTitle('')
      await loadImages()
    } catch (e) { throw e }
    finally { setUploading(false) }
  }

  async function upload() {
    await uploadFromFile(fileRef.current?.files?.[0])
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      try { await uploadFromFile(file) }
      catch (e) { alert('Error al subir: ' + e.message) }
    }
  }

  async function remove(img) {
    try {
      await galleryModel.deleteGalleryImage(img.id, img.storage_path)
      setImages(prev => prev.filter(i => i.id !== img.id))
    } catch (e) { throw e }
  }

  async function saveEdit(img) {
    const fields = {}
    if (editTitle !== img.title) fields.title = editTitle
    if (editCategory !== img.category) fields.category = editCategory
    if (Object.keys(fields).length === 0) { cancelEdit(); return }
    try {
      await galleryModel.updateGalleryImage(img.id, fields)
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, ...fields } : i))
      cancelEdit()
    } catch (e) { alert('Error al guardar: ' + e.message) }
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
    editingId, editTitle, setEditTitle, editCategory, setEditCategory,
    dragOver, setDragOver,
    fileRef, upload, handleDrop, remove, saveEdit,
    startEdit, cancelEdit,
  }
}
