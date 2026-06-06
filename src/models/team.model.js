import { supabase } from '../lib/supabase'

export async function getTeam() {
  const { data, error } = await supabase
    .from('team').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getAllTeam() {
  const { data, error } = await supabase
    .from('team').select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createTeamMember(fields) {
  const { data, error } = await supabase
    .from('team').insert([{
      ...fields,
      active: fields.active ?? true,
      sort_order: fields.sort_order ?? 0,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateTeamMember(id, fields) {
  const { error } = await supabase
    .from('team').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteTeamMember(id) {
  const { error } = await supabase
    .from('team').update({ active: false }).eq('id', id)
  if (error) throw error
}
