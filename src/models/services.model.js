import { supabase } from '../lib/supabase'

export async function getServices() {
  const { data, error } = await supabase
    .from('services').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getAllServices() {
  const { data, error } = await supabase
    .from('services').select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createService({ title, slug, description, icon, image_url, tag, tag_style, active }) {
  const { data, error } = await supabase
    .from('services').insert([{
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      description, icon, image_url, tag, tag_style,
      active: active ?? true,
      sort_order: 0,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateService(id, fields) {
  const { error } = await supabase
    .from('services').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteService(id) {
  const { error } = await supabase
    .from('services').delete().eq('id', id)
  if (error) throw error
}
