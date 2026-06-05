import { supabase } from '../lib/supabase'

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateUserRole(userId, role) {
  const { error } = await supabase
    .from('profiles').update({ role }).eq('id', userId)
  if (error) throw error
}
