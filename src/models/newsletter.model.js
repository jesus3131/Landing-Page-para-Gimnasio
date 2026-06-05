import { supabase } from '../lib/supabase'

export async function subscribeToNewsletter(email) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }])
    .select()
  if (error) throw error
  return data
}
