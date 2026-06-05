import { supabase } from '../lib/supabase'

export async function getPlans() {
  const { data, error } = await supabase
    .from('plans').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getPlanFeatures(planId) {
  const { data, error } = await supabase
    .from('plan_features').select('*')
    .eq('plan_id', planId).order('sort_order')
  if (error) throw error
  return data
}
