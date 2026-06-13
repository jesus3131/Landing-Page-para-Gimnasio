import { supabase } from '../lib/supabase'

export async function getAllMembers() {
  const { data, error } = await supabase
    .from('members').select('*').order('full_name')
  if (error) throw error
  return data
}

export async function getActiveMembers() {
  const { data, error } = await supabase
    .from('members').select('*, member_subscriptions!inner(plan_id, start_date, end_date, active, membership_plans!inner(name, duration_days))')
    .eq('member_subscriptions.active', true)
    .order('full_name')
  if (error) throw error
  return data
}

export async function createMember(fields) {
  const { data, error } = await supabase
    .from('members').insert([{
      full_name: fields.full_name,
      phone: fields.phone || null,
      email: fields.email || null,
      document_type: fields.document_type || 'CC',
      document_number: fields.document_number || null,
      address: fields.address || null,
      notes: fields.notes || null,
      photo_url: fields.photo_url || null,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateMember(id, fields) {
  const { error } = await supabase
    .from('members').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function deleteMember(id) {
  const { error } = await supabase
    .from('members').update({ active: false }).eq('id', id)
  if (error) throw error
}
