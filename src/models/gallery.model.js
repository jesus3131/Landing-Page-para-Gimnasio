import { supabase } from '../lib/supabase'

export async function getGalleryImages() {
  const { data, error } = await supabase
    .from('gallery').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getAllGalleryImages() {
  const { data, error } = await supabase
    .from('gallery').select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadGalleryImage(file, title) {
  const ext = file.name.split('.').pop()
  const filePath = `gallery/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('gallery').upload(filePath, file)
  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('gallery').getPublicUrl(filePath)

  const { data, error } = await supabase
    .from('gallery').insert([{
      image_url: publicUrl,
      storage_path: filePath,
      title: title || 'Sin título',
      alt: title || 'Imagen de galería',
      category: 'General',
      span: 'lg:col-span-1 lg:row-span-1',
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateGalleryImage(id, fields) {
  const { error } = await supabase
    .from('gallery').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteGalleryImage(id, storagePath) {
  if (storagePath) {
    await supabase.storage.from('gallery').remove([storagePath])
  }
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
}
