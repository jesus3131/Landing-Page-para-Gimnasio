import { supabase } from '../lib/supabase'

export async function getNews() {
  const { data, error } = await supabase
    .from('news').select('*')
    .eq('active', true).order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllNews() {
  const { data, error } = await supabase
    .from('news').select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function createNewsItem(fields) {
  const { data, error } = await supabase
    .from('news').insert([{
      ...fields,
      active: fields.active ?? true,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateNewsItem(id, fields) {
  const { error } = await supabase
    .from('news').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteNewsItem(id) {
  const { error } = await supabase
    .from('news').delete().eq('id', id)
  if (error) throw error
}
