import { supabase } from '../lib/supabase'

export async function getBenefits() {
  const { data, error } = await supabase
    .from('benefits').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getAllBenefits() {
  const { data, error } = await supabase
    .from('benefits').select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createBenefit({ title, description, icon, stat, stat_label, active }) {
  const { data, error } = await supabase
    .from('benefits').insert([{
      title, description, icon, stat, stat_label,
      active: active ?? true,
      sort_order: 0,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateBenefit(id, fields) {
  const { error } = await supabase
    .from('benefits').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteBenefit(id) {
  const { error } = await supabase
    .from('benefits').update({ active: false }).eq('id', id)
  if (error) throw error
}
