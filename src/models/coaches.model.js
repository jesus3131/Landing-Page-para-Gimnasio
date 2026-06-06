import { supabase } from '../lib/supabase'

export async function getCoaches() {
  const { data, error } = await supabase
    .from('coaches').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getAllCoaches() {
  const { data, error } = await supabase
    .from('coaches').select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createCoach(fields) {
  const { data, error } = await supabase
    .from('coaches').insert([{
      ...fields,
      active: fields.active ?? true,
      sort_order: fields.sort_order ?? 0,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateCoach(id, fields) {
  const { error } = await supabase
    .from('coaches').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteCoach(id) {
  const { error } = await supabase
    .from('coaches').update({ active: false }).eq('id', id)
  if (error) throw error
}
