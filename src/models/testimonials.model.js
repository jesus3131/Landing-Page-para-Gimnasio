import { supabase } from '../lib/supabase'

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials').select('*')
    .eq('active', true).order('sort_order')
  if (error) throw error
  return data
}
