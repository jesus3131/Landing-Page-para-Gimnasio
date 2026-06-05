import { supabase } from '../lib/supabase'

export async function getPlans() {
  const { data, error } = await supabase
    .from('plans').select('*, plan_features(*)')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getServices() {
  const { data, error } = await supabase
    .from('services').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}

export async function getBenefits() {
  const { data, error } = await supabase
    .from('benefits').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}
