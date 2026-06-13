import { supabase } from '../lib/supabase'

export async function getTodayAttendance() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('attendance')
    .select('*, members(full_name, document_number, phone)')
    .gte('check_in', today)
    .lt('check_in', new Date(new Date(today).getTime() + 86400000).toISOString())
    .order('check_in', { ascending: false })
  if (error) throw error
  return data
}

export async function getAttendanceByMember(memberId) {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_id', memberId)
    .gte('check_in', today)
    .lt('check_in', new Date(new Date(today).getTime() + 86400000).toISOString())
    .limit(1)
  if (error) throw error
  return data
}

export async function checkIn(memberId) {
  const { data, error } = await supabase
    .from('attendance').insert([{ member_id: memberId }]).select().single()
  if (error) throw error
  return data
}

export async function getAttendanceStats(days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data: total, error: err1 } = await supabase
    .from('attendance').select('id', { count: 'exact', head: true })
    .gte('check_in', since)
  if (err1) throw err1

  const { data: daily, error: err2 } = await supabase
    .from('attendance').select('check_in')
    .gte('check_in', since)
    .order('check_in')
  if (err2) throw err2

  const byDay = {}
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000).toISOString().split('T')[0]
    byDay[d] = 0
  }
  ;(daily || []).forEach(a => {
    const d = a.check_in.substring(0, 10)
    if (byDay[d] !== undefined) byDay[d]++
  })

  return { total: total?.count || 0, daily: byDay }
}
