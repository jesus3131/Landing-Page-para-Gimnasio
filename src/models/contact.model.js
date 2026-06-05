import { supabase } from '../lib/supabase'

export async function submitContactMessage({ name, email, phone, message }) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, phone, message }])
    .select()
  if (error) throw error
  return data
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages').select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function markMessageRead(id) {
  const { error } = await supabase
    .from('contact_messages').update({ read: true }).eq('id', id)
  if (error) throw error
}

export async function deleteContactMessage(id) {
  const { error } = await supabase
    .from('contact_messages').delete().eq('id', id)
  if (error) throw error
}
