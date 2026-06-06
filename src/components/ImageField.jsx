import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const VALID_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export default function ImageField({ value, onChange, label, bucket = 'gallery' }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  async function uploadFile(file) {
    if (!file) return
    setError('')

    if (!VALID_MIMES.includes(file.type)) {
      setError('Formato no soportado. Usa JPG, PNG, WEBP o GIF.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen supera los 10 MB.')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${bucket}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('gallery').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('gallery').getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (e) {
      setError('Error al subir: ' + (e.message || 'desconocido'))
    } finally {
      setUploading(false)
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (file) await uploadFile(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await uploadFile(file)
  }

  return (
    <div>
      {label && <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{label}</label>}

      {value && (
        <div className="mb-2 w-20 h-20 rounded-xl overflow-hidden border border-white/10">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="flex-1 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary"
        />
        <input type="file" ref={fileRef} accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={handleFileSelect} hidden />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-surface-elevated text-white font-body font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">{uploading ? 'hourglass_top' : 'upload'}</span>
          {uploading ? '' : 'Subir'}
        </button>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mt-2 border-2 border-dashed rounded-xl py-2 text-center transition-all text-xs cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5 text-primary' : 'border-white/5 text-white/20 hover:border-white/10 hover:text-white/40'
        }`}
      >
        {dragOver ? 'Suelta aquí' : 'Arrastra una imagen aquí'}
      </div>

      {error && <p className="font-body text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}