import { supabase } from '../lib/supabase'

const EDGE_FUNCTION_URL = 'https://tyfzggtxbbtgxocwajkb.supabase.co/functions/v1/manage-users'

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

export async function createUser({ email, password, full_name, role }) {
  const session = await supabase.auth.getSession()
  const token = session?.data?.session?.access_token
  const res = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'create', email, password, full_name, role }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al crear usuario')
  return data
}

export async function updateUserDisabled(userId, disabled) {
  const { error } = await supabase
    .from('profiles').update({ disabled }).eq('id', userId)
  if (error) throw error
}

export async function getUserPermissions(userId) {
  const { data, error } = await supabase
    .from('user_permissions').select('permission').eq('user_id', userId)
  if (error) throw error
  return (data || []).map(r => r.permission)
}

export async function setUserPermission(userId, permission) {
  const { error } = await supabase
    .from('user_permissions').insert({ user_id: userId, permission })
  if (error) throw error
}

export async function removeUserPermission(userId, permission) {
  const { error } = await supabase
    .from('user_permissions').delete()
    .eq('user_id', userId).eq('permission', permission)
  if (error) throw error
}
