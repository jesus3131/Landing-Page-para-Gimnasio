import { supabase } from '../lib/supabase'

export async function getEvents() {
  const { data, error } = await supabase
    .from('events').select('*')
    .eq('active', true).order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllEvents() {
  const { data, error } = await supabase
    .from('events').select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function createEvent(fields) {
  const { data, error } = await supabase
    .from('events').insert([{
      ...fields,
      active: fields.active ?? true,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateEvent(id, fields) {
  const { error } = await supabase
    .from('events').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from('events').update({ active: false }).eq('id', id)
  if (error) throw error
}
