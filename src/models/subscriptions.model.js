import { supabase } from '../lib/supabase'

export async function getAllSubscriptions() {
  const { data, error } = await supabase
    .from('member_subscriptions')
    .select('*, members(full_name, phone), membership_plans(name, duration_days, price)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getActiveSubscriptions() {
  const { data, error } = await supabase
    .from('member_subscriptions')
    .select('*, members!inner(full_name, phone, document_number), membership_plans(name, duration_days, price)')
    .eq('active', true)
    .order('end_date')
  if (error) throw error
  return data
}

export async function getLatestSubscriptionPerMember() {
  const { data, error } = await supabase
    .from('member_subscriptions')
    .select('*, membership_plans(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  const map = {}
  ;(data || []).forEach(s => {
    if (!map[s.member_id]) map[s.member_id] = s
  })
  return Object.values(map)
}

export async function getCalendarSubscriptions() {
  const { data, error } = await supabase
    .from('member_subscriptions')
    .select('*, members(full_name, phone, document_number), membership_plans(name, duration_days, price)')
    .order('end_date')
  if (error) throw error
  return data
}

export async function createSubscription(fields) {
  const { data, error } = await supabase
    .from('member_subscriptions').insert([{
      member_id: fields.member_id,
      plan_id: fields.plan_id,
      start_date: fields.start_date,
      end_date: fields.end_date,
      price: fields.price,
      notes: fields.notes || null,
    }]).select().single()
  if (error) throw error
  return data
}

export async function updateSubscription(id, fields) {
  const { error } = await supabase
    .from('member_subscriptions').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteSubscription(id) {
  const { error } = await supabase
    .from('member_subscriptions').delete().eq('id', id)
  if (error) throw error
}

export async function getMembershipPlans() {
  const { data, error } = await supabase
    .from('membership_plans').select('*').order('sort_order')
  if (error) throw error
  return data
}

export async function createMembershipPlan(fields) {
  const { data, error } = await supabase
    .from('membership_plans').insert([fields]).select().single()
  if (error) throw error
  return data
}

export async function updateMembershipPlan(id, fields) {
  const { error } = await supabase
    .from('membership_plans').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteMembershipPlan(id) {
  const { error } = await supabase
    .from('membership_plans').update({ active: false }).eq('id', id)
  if (error) throw error
}
