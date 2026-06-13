import { supabase } from '../lib/supabase'

export async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments').select('*, members(full_name, document_number), member_subscriptions(plan_id, membership_plans!inner(name))')
    .order('payment_date', { ascending: false })
  if (error) throw error
  return data
}

export async function getPaymentsByMember(memberId) {
  const { data, error } = await supabase
    .from('payments').select('*, member_subscriptions(plan_id, membership_plans!inner(name))')
    .eq('member_id', memberId)
    .order('payment_date', { ascending: false })
  if (error) throw error
  return data
}

export async function createPayment(fields) {
  const { data, error } = await supabase
    .from('payments').insert([{
      subscription_id: fields.subscription_id,
      member_id: fields.member_id,
      amount: fields.amount,
      payment_date: fields.payment_date || new Date().toISOString().split('T')[0],
      payment_method: fields.payment_method || 'cash',
      reference: fields.reference || null,
      notes: fields.notes || null,
      period_start: fields.period_start || null,
      period_end: fields.period_end || null,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updatePayment(id, fields) {
  const { error } = await supabase
    .from('payments').update(fields).eq('id', id)
  if (error) throw error
}

export async function deletePayment(id) {
  const { error } = await supabase
    .from('payments').delete().eq('id', id)
  if (error) throw error
}
