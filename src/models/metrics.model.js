import { supabase } from '../lib/supabase'

export async function getMetrics() {
  const [membersRes, activeSubsRes, plansRes, paymentsRes, totalRevenueRes] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('member_subscriptions').select('*, members!inner(full_name, phone), membership_plans(name, duration_days, price)', { count: 'exact', head: true }).eq('active', true),
    supabase.from('membership_plans').select('*').eq('active', true).order('sort_order'),
    supabase.from('payments').select('amount, payment_date, payment_method'),
    supabase.from('payments').select('amount', { count: 'exact', head: true }),
  ])

  const activeMembers = membersRes.count || 0
  const totalRevenue = totalRevenueRes.count || 0
  const payments = paymentsRes.data || []
  const totalRevenueSum = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const expiredSubsRes = await supabase
    .from('member_subscriptions')
    .select('*, members!inner(full_name, phone), membership_plans(name, duration_days, price)', { count: 'exact' })
    .eq('active', true)
    .lt('end_date', new Date().toISOString().split('T')[0])

  const expiredMembers = expiredSubsRes.data || []

  const expiringRes = await supabase
    .from('member_subscriptions')
    .select('*, members!inner(full_name, phone), membership_plans(name, duration_days, price)')
    .eq('active', true)
    .gte('end_date', new Date().toISOString().split('T')[0])
    .lte('end_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  const expiringSoon = expiringRes.data || []

  const byPlanRes = await supabase
    .from('member_subscriptions')
    .select('plan_id, membership_plans!inner(name)')
    .eq('active', true)

  const planCounts = {}
  const planData = byPlanRes.data || []
  planData.forEach(s => {
    const name = s.membership_plans?.name || 'Unknown'
    planCounts[name] = (planCounts[name] || 0) + 1
  })

  const byMethod = {}
  payments.forEach(p => {
    byMethod[p.payment_method] = (byMethod[p.payment_method] || 0) + Number(p.amount)
  })

  const revenueByMonth = {}
  payments.forEach(p => {
    if (p.payment_date) {
      const month = p.payment_date.substring(0, 7)
      revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(p.amount)
    }
  })

  const plansList = plansRes.data || []
  const activeSubscriptions = activeSubsRes.count || 0

  return {
    activeMembers,
    activeSubscriptions,
    totalRevenue: totalRevenueSum,
    totalPayments: totalRevenue,
    plans: plansList,
    expiredMembers,
    expiringSoon,
    planDistribution: planCounts,
    revenueByMonth,
    revenueByMethod: byMethod,
    payments,
  }
}
