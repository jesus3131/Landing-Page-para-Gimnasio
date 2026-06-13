import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import ImageField from './ImageField'
import GymIconPicker from './GymIconPicker'
import useAdminMessages from '../controllers/useAdminMessages'
import useAdminGallery from '../controllers/useAdminGallery'
import useAdminUsers from '../controllers/useAdminUsers'
import useAdminBenefits from '../controllers/useAdminBenefits'
import useAdminServices from '../controllers/useAdminServices'
import useAdminCoaches from '../controllers/useAdminCoaches'
import useAdminTeam from '../controllers/useAdminTeam'
import useAdminEvents from '../controllers/useAdminEvents'
import useAdminNews from '../controllers/useAdminNews'
import useAdminMembers from '../controllers/useAdminMembers'
import useAdminPayments from '../controllers/useAdminPayments'
import useAdminAttendance from '../controllers/useAdminAttendance'
import useMetrics from '../controllers/useMetrics'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function Admin({ onLogout }) {
  const { profile, isAdmin, hasPermission, logout: authLogout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [expiredCount, setExpiredCount] = useState(0)
  const [expiringCount, setExpiringCount] = useState(0)
  const [alerts, setAlerts] = useState([])
  const [showAlerts, setShowAlerts] = useState(false)
  const alertRef = useRef(null)

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = (await import('../lib/supabase')).supabase
        const today = new Date().toISOString().split('T')[0]
        const in3days = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

        const [expiredRes, expiringRes] = await Promise.all([
          supabase.from('member_subscriptions')
            .select('*, members(full_name, phone), membership_plans(name)')
            .eq('active', true).lt('end_date', today).order('end_date'),
          supabase.from('member_subscriptions')
            .select('*, members(full_name, phone), membership_plans(name)')
            .eq('active', true).gte('end_date', today).lte('end_date', in3days).order('end_date'),
        ])
        const expired = expiredRes.data || []
        const expiring = expiringRes.data || []
        setExpiredCount(expired.length)
        setExpiringCount(expiring.length)
        setAlerts([
          ...expired.map(s => ({ ...s, type: 'expired', label: 'Vencido' })),
          ...expiring.map(s => ({ ...s, type: 'expiring', label: 'Por vencer' })),
        ])
      } catch {}
    }
    loadAlerts()
    const interval = setInterval(loadAlerts, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (!alertRef.current?.contains(e.target)) setShowAlerts(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const logout = () => { authLogout(); onLogout?.() }

  const can = (perm) => isAdmin || hasPermission(perm)

  useEffect(() => {
    if (!can('users.manage') && activeTab === 'users') setActiveTab('dashboard')
    if (!can('benefits.manage') && activeTab === 'benefits') setActiveTab('dashboard')
    if (!can('services.manage') && activeTab === 'services') setActiveTab('dashboard')
    if (!can('coaches.manage') && activeTab === 'coaches') setActiveTab('dashboard')
    if (!can('team.manage') && activeTab === 'team') setActiveTab('dashboard')
    if (!can('events.manage') && activeTab === 'events') setActiveTab('dashboard')
    if (!can('news.manage') && activeTab === 'news') setActiveTab('dashboard')
    if (!can('gallery.manage') && activeTab === 'gallery') setActiveTab('dashboard')
    if (!can('members.manage') && activeTab === 'members') setActiveTab('dashboard')
    if (!can('members.manage') && activeTab === 'calendar') setActiveTab('dashboard')
    if (!can('members.manage') && activeTab === 'attendance') setActiveTab('dashboard')
    if (!can('payments.manage') && activeTab === 'payments') setActiveTab('dashboard')
    if (!can('metrics.view') && activeTab === 'metrics') setActiveTab('dashboard')
  }, [activeTab])

  if (!profile) return null

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    ...(can('messages.manage') ? [{ id: 'messages', label: 'Mensajes', icon: 'mail' }] : []),
    ...(can('benefits.manage') ? [{ id: 'benefits', label: 'Beneficios', icon: 'stars' }] : []),
    ...(can('services.manage') ? [{ id: 'services', label: 'Servicios', icon: 'fitness_center' }] : []),
    ...(can('coaches.manage') ? [{ id: 'coaches', label: 'Coaches', icon: 'groups' }] : []),
    ...(can('team.manage') ? [{ id: 'team', label: 'Equipo', icon: 'badge' }] : []),
    ...(can('events.manage') ? [{ id: 'events', label: 'Eventos', icon: 'event' }] : []),
    ...(can('news.manage') ? [{ id: 'news', label: 'Noticias', icon: 'newspaper' }] : []),
    ...(can('gallery.manage') ? [{ id: 'gallery', label: 'Galería', icon: 'photo_library' }] : []),
    ...(can('members.manage') ? [{ id: 'members', label: 'Miembros', icon: 'group' }] : []),
    ...(can('members.manage') ? [{ id: 'calendar', label: 'Calendario', icon: 'calendar_month' }] : []),
    ...(can('members.manage') ? [{ id: 'attendance', label: 'Asistencia', icon: 'qr_code_scanner' }] : []),
    ...(can('payments.manage') ? [{ id: 'payments', label: 'Pagos', icon: 'payments' }] : []),
    ...(can('metrics.view') ? [{ id: 'metrics', label: 'Métricas', icon: 'monitoring' }] : []),
    ...(can('users.manage') ? [{ id: 'users', label: 'Usuarios', icon: 'people' }] : []),
  ]

  return (
    <div className="min-h-screen bg-surface-dark">
      <aside className="fixed top-0 left-0 h-full w-64 bg-surface-card border-r border-white/5 hidden lg:flex flex-col z-50">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#dfff00"/><path d="M10 12h4v12h-4zM16 8h4v20h-4zM22 14h4v8h-4z" fill="#0d0d0d"/></svg>
            <span className="font-heading font-extrabold text-lg text-white">ZONA<span className="text-primary">FIT</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-surface-dark font-semibold'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-body font-semibold text-primary text-xs">{profile.full_name?.charAt(0) || '?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-white text-sm truncate">{profile.full_name}</p>
              <p className="font-body text-primary text-2xs uppercase tracking-wider">{profile.role}</p>
            </div>
            <div className="relative" ref={alertRef}>
              <button onClick={() => setShowAlerts(!showAlerts)} className="relative w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-white/60 text-lg">notifications</span>
                {(expiredCount + expiringCount) > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-2xs font-mono font-bold
                    ${expiredCount > 0 ? 'bg-red-500 text-white' : 'bg-amber-500 text-surface-dark'}">
                    {expiredCount + expiringCount}
                  </span>
                )}
              </button>
                  {showAlerts && alerts.length > 0 && (
                    <div className="absolute bottom-full right-0 mb-2 w-80 bg-surface-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-white/5">
                        <p className="font-body font-semibold text-white text-xs">Alertas de membresía</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {alerts.slice(0, 10).map(a => (
                          <div key={a.id} className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 transition-colors">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.type === 'expired' ? 'bg-red-500' : 'bg-amber-500'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-white text-xs truncate">{a.members?.full_name}</p>
                              <p className="font-body text-white/40 text-2xs">{a.membership_plans?.name} · vence {a.end_date}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {a.members?.phone && (
                                <a href={`https://wa.me/57${a.members.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola ' + a.members.full_name + ', te recordamos que tu membresia en ZonaFit Gym ' + (a.type === 'expired' ? 'esta vencida. ¡Renueva ya!' : 'vence pronto. ¡Renueva a tiempo!'))}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-green-500/10 rounded flex items-center justify-center hover:bg-green-500/20">
                                  <span className="material-symbols-outlined text-green-400 text-xs">chat</span>
                                </a>
                              )}
                              <span className={`font-mono text-2xs px-2 py-0.5 rounded-full ${a.type === 'expired' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{a.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
            </div>
          </div>
          <button onClick={logout} className="w-full border border-white/10 text-white/50 hover:text-white font-body text-xs py-2 rounded-lg hover:bg-white/5 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="lg:hidden flex items-center justify-between p-4 bg-surface-card border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#dfff00"/><path d="M10 12h4v12h-4zM16 8h4v20h-4zM22 14h4v8h-4z" fill="#0d0d0d"/></svg>
            <span className="font-heading font-extrabold text-white">ZONA<span className="text-primary">FIT</span></span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-body text-xs whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-primary text-surface-dark font-semibold' : 'text-white/50 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button onClick={logout} className="px-3 py-1.5 rounded-lg text-white/40 font-body text-xs border border-white/10">
              Salir
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'benefits' && <BenefitsPanel />}
          {activeTab === 'services' && <ServicesPanel />}
          {activeTab === 'coaches' && <CoachesPanel />}
          {activeTab === 'team' && <TeamPanel />}
          {activeTab === 'events' && <EventsPanel />}
          {activeTab === 'news' && <NewsPanel />}
          {activeTab === 'gallery' && <GalleryPanel />}
          {activeTab === 'members' && <MembersPanel />}
          {activeTab === 'calendar' && <CalendarPanel />}
          {activeTab === 'attendance' && <AttendancePanel />}
          {activeTab === 'payments' && <PaymentsPanel />}
          {activeTab === 'metrics' && <MetricsPanel />}
          {activeTab === 'users' && <Users />}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onNavigate }) {
  const { isAdmin, isSecretary, hasPermission } = useAuth()
  const { messages, loading: msgLoading } = useAdminMessages()
  const { images, loading: imgLoading } = useAdminGallery()
  const { users, loading: usrLoading } = useAdminUsers()
  const { coaches, loading: coachesLoading } = useAdminCoaches()
  const { team, loading: teamLoading } = useAdminTeam()
  const { events, loading: eventsLoading } = useAdminEvents()
  const { news, loading: newsLoading } = useAdminNews()
  const { metrics, loading: metricsLoading } = useMetrics()
  const { attendance, stats: attStats, loading: attLoading } = useAdminAttendance()

  const can = (perm) => isAdmin || hasPermission(perm)

  const now = new Date()
  const monthStr = now.toISOString().substring(0, 7)
  const paymentsThisMonth = metrics?.payments?.filter(p => p.payment_date?.startsWith(monthStr)) || []
  const revenueThisMonth = paymentsThisMonth.reduce((s, p) => s + Number(p.amount), 0)

  const todayStr = now.toISOString().split('T')[0]
  const newMembersThisMonth = metrics?.activeMembers || 0

  const stats = [
    ...(can('members.manage') ? [{
      icon: 'group', label: 'Miembros activos', value: metrics?.activeMembers || 0,
      sub: `${metrics?.activeSubscriptions || 0} con suscripción activa`,
      color: 'bg-emerald-500/10 text-emerald-400', tab: 'members',
    }] : []),
    ...(can('payments.manage') ? [{
      icon: 'payments', label: 'Facturación del mes', value: `$${(revenueThisMonth).toLocaleString('es-CO')}`,
      sub: `${paymentsThisMonth.length} pago${paymentsThisMonth.length !== 1 ? 's' : ''} este mes`,
      color: 'bg-primary/10 text-primary', tab: 'payments',
    }] : []),
    ...(can('members.manage') ? [{
      icon: 'monitoring', label: 'Asistencia hoy', value: attendance.length,
      sub: attStats ? `${attStats.total} en los últimos 30 días` : '',
      color: 'bg-blue-500/10 text-blue-400', tab: 'attendance',
    }] : []),
    ...(can('messages.manage') ? [{
      icon: 'mail', label: 'Mensajes', value: messages.length,
      sub: `${messages.filter(m => !m.read).length} sin leer`,
      color: 'bg-primary/10 text-primary', tab: 'messages',
    }] : []),
    ...(can('benefits.manage') ? [{
      icon: 'stars', label: 'Beneficios', value: '5',
      sub: 'Arrastra para reordenar',
      color: 'bg-amber-500/10 text-amber-400', tab: 'benefits',
    }] : []),
    ...(can('services.manage') ? [{
      icon: 'fitness_center', label: 'Servicios', value: '5',
      sub: 'Editar contenido',
      color: 'bg-green-500/10 text-green-400', tab: 'services',
    }] : []),
    ...(can('coaches.manage') ? [{
      icon: 'groups', label: 'Coaches', value: coaches.length,
      sub: 'Entrenadores personales',
      color: 'bg-cyan-500/10 text-cyan-400', tab: 'coaches',
    }] : []),
    ...(can('team.manage') ? [{
      icon: 'badge', label: 'Equipo', value: team.length,
      sub: 'Personal administrativo',
      color: 'bg-pink-500/10 text-pink-400', tab: 'team',
    }] : []),
    ...(can('events.manage') ? [{
      icon: 'event', label: 'Eventos', value: events.length,
      sub: 'Próximos eventos',
      color: 'bg-orange-500/10 text-orange-400', tab: 'events',
    }] : []),
    ...(can('news.manage') ? [{
      icon: 'newspaper', label: 'Noticias', value: news.length,
      sub: 'Últimas novedades',
      color: 'bg-indigo-500/10 text-indigo-400', tab: 'news',
    }] : []),
    ...(can('gallery.manage') ? [{
      icon: 'photo_library', label: 'Galería', value: images.length,
      sub: `${images.length} imagen${images.length !== 1 ? 'es' : ''}`,
      color: 'bg-blue-500/10 text-blue-400', tab: 'gallery',
    }] : []),
    ...(can('users.manage') ? [{
      icon: 'people', label: 'Usuarios', value: users.length,
      sub: `${users.filter(u => u.role === 'admin').length} admin · ${users.filter(u => u.role === 'secretaria').length} secretaria${users.filter(u => u.disabled).length > 0 ? ` · ${users.filter(u => u.disabled).length} deshab.` : ''}`,
      color: 'bg-purple-500/10 text-purple-400', tab: 'users',
    }] : []),
  ]

  const loading = msgLoading || imgLoading || usrLoading || coachesLoading || teamLoading || eventsLoading || newsLoading || metricsLoading || attLoading

  const attChartData = attStats?.daily
    ? Object.entries(attStats.daily).slice(-14).map(([d, c]) => ({ date: d.substring(5), count: c }))
    : []

  const revChartData = metrics?.revenueByMonth
    ? Object.entries(metrics.revenueByMonth).slice(-6).map(([m, v]) => ({ month: m, revenue: v }))
    : []

  return (
    <div>
      <h2 className="font-heading font-black text-2xl lg:text-3xl text-white mb-2">Dashboard</h2>
      <p className="font-body text-white/40 text-sm mb-8">
        {isAdmin ? 'Administrador' : isSecretary ? 'Secretaria' : 'Usuario'} · Panel de control
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {stats.map(s => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.tab)}
            className="bg-surface-card border border-white/5 rounded-2xl p-6 text-left hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
              <span className="material-symbols-outlined text-xl">{s.icon}</span>
            </div>
            <p className="font-body text-white/40 text-xs uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-heading font-bold text-3xl text-white">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : s.value}
            </p>
            <p className="font-body text-white/30 text-xs mt-2">{s.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-10">
        {revChartData.length > 0 && (
          <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
            <h4 className="font-heading font-bold text-white text-sm mb-4">Ingresos mensuales</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#dfff00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {attChartData.length > 0 && (
          <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
            <h4 className="font-heading font-bold text-white text-sm mb-4">Asistencia diaria (14 días)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
        <h3 className="font-heading font-bold text-lg text-white mb-4">Acceso rápido</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button onClick={() => onNavigate('messages')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">mail</span>
            <div><p className="font-body font-semibold text-white text-sm">Revisar mensajes</p><p className="font-body text-white/40 text-xs">Gestiona las solicitudes de contacto</p></div>
          </button>
          <button onClick={() => onNavigate('members')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">group</span>
            <div><p className="font-body font-semibold text-white text-sm">Gestionar miembros</p><p className="font-body text-white/40 text-xs">Registra y administra miembros</p></div>
          </button>
          <button onClick={() => onNavigate('payments')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">payments</span>
            <div><p className="font-body font-semibold text-white text-sm">Registrar pagos</p><p className="font-body text-white/40 text-xs">Control de pagos y membresías</p></div>
          </button>
          <button onClick={() => onNavigate('attendance')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
            <div><p className="font-body font-semibold text-white text-sm">Registrar asistencia</p><p className="font-body text-white/40 text-xs">Check-in diario de miembros</p></div>
          </button>
          <button onClick={() => onNavigate('gallery')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
            <div><p className="font-body font-semibold text-white text-sm">Subir imágenes</p><p className="font-body text-white/40 text-xs">Actualiza la galería del sitio</p></div>
          </button>
          <button onClick={() => onNavigate('calendar')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <div><p className="font-body font-semibold text-white text-sm">Calendario</p><p className="font-body text-white/40 text-xs">Vencimientos y eventos</p></div>
          </button>
        </div>
      </div>
    </div>
  )
}

function Messages() {
  const { messages, allMessages, loading, search, setSearch, filter, setFilter, markRead, remove, unreadCount } = useAdminMessages()
  const [confirmId, setConfirmId] = useState(null)

  async function handleDelete(id) {
    try { await remove(id) }
    catch { alert('Error al inhabilitar') }
    setConfirmId(null)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Mensajes</h3>
          <p className="font-body text-white/40 text-xs mt-1">
            {allMessages.length} total · <span className="text-primary">{unreadCount} sin leer</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined text-lg">search</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar mensajes..."
            className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary"
          />
        </div>
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-body text-xs transition-all ${
              filter === f ? 'bg-primary text-surface-dark font-semibold' : 'bg-surface-card text-white/50 border border-white/10 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'unread' ? 'No leídos' : 'Leídos'}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">mail</span>
          <p className="font-body text-white/40">No hay mensajes{search ? ' que coincidan' : ' aún'}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`bg-surface-card border rounded-2xl p-5 transition-all hover:border-white/20 ${
                msg.read ? 'border-white/5' : 'border-primary/30 bg-primary/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.read ? 'bg-white/10' : 'bg-primary/20'
                  }`}>
                    <span className="font-body font-semibold text-sm text-white">{msg.name?.charAt(0) || '?'}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-body font-semibold text-white text-sm truncate">{msg.name}</p>
                      {!msg.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                    </div>
                    <p className="font-body text-white/40 text-xs truncate">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                  </div>
                </div>
                <p className="font-body text-white/30 text-2xs flex-shrink-0">{new Date(msg.created_at).toLocaleString('es-MX')}</p>
              </div>

              <p className="font-body text-white/70 text-sm mb-4 leading-relaxed">{msg.message}</p>

              <div className="flex items-center gap-3">
                {!msg.read && (
                  <button onClick={() => markRead(msg.id)} className="flex items-center gap-1.5 font-body text-xs text-primary hover:text-primary-hover transition-colors">
                    <span className="material-symbols-outlined text-sm">mark_email_read</span>
                    Marcar leído
                  </button>
                )}
                <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 font-body text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="material-symbols-outlined text-sm">reply</span>
                  Responder
                </a>
                {confirmId === msg.id ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <button onClick={() => handleDelete(msg.id)} className="font-body text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Confirmar</button>
                    <button onClick={() => setConfirmId(null)} className="font-body text-xs text-white/40 hover:text-white">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmId(msg.id)} className="flex items-center gap-1.5 font-body text-xs text-red-400 hover:text-red-300 transition-colors ml-auto">
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BenefitsPanel() {
  const { benefits, loading, create, update, remove } = useAdminBenefits()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ title: '', description: '', icon: '', image_url: '', stat: '', stat_label: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(b) {
    setEditingId(b.id)
    setEditData({ title: b.title, description: b.description, icon: b.icon, image_url: b.image_url || '', stat: b.stat, stat_label: b.stat_label, active: b.active, sort_order: b.sort_order })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.title) return
    try { await create(newData); setShowNew(false); setNewData({ title: '', description: '', icon: '', image_url: '', stat: '', stat_label: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Equipos de última generación' },
    { key: 'description', label: 'Descripción', placeholder: 'Descripción del beneficio' },
    { key: 'icon', label: 'Icono', placeholder: 'Ej: fitness_center', type: 'icon' },
    { key: 'image_url', label: 'URL de imagen', placeholder: 'https://...', type: 'image' },
    { key: 'stat', label: 'Estadística', placeholder: 'Ej: +50' },
    { key: 'stat_label', label: 'Etiqueta de estadística', placeholder: 'Ej: máquinas' },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Beneficios</h3>
          <p className="font-body text-white/40 text-xs mt-1">{benefits.length} elementos</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'add'}</span>
          {showNew ? 'Cancelar' : 'Nuevo beneficio'}
        </button>
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          {fields.map(f => renderField(f, newData, setNewData))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            Crear beneficio
          </button>
        </div>
      )}

      {benefits.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">stars</span>
          <p className="font-body text-white/40">No hay beneficios aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {benefits.map(b => (
            <div key={b.id} className="bg-surface-card border border-white/5 rounded-2xl p-5 transition-all hover:border-white/20">
              {editingId === b.id ? (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{f.label}</label>
                      {f.type === 'image' ? (
                        <ImageField value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.type === 'icon' ? (
                        <GymIconPicker value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.key === 'description' ? (
                        <textarea value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary resize-none" rows={2} />
                      ) : (
                        <input type="text" value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e => setEditData(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="font-body text-white/70 text-sm">Activo</span>
                    </label>
                    <input type="number" value={editData.sort_order} onChange={e => setEditData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-16 bg-surface-dark border border-white/10 rounded-lg px-2 py-1.5 font-body text-xs text-white focus:outline-none focus:border-primary" placeholder="Orden" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(b.id)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-all">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white font-body text-xs px-4 py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-primary text-lg">{b.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-white text-sm">{b.title}</p>
                        {!b.active && <span className="font-body text-2xs text-white/30 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>}
                        <span className="font-body text-2xs text-white/30">#{b.sort_order}</span>
                      </div>
                      <p className="font-body text-white/50 text-xs mt-1 line-clamp-2">{b.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-heading font-bold text-sm text-primary">{b.stat}</span>
                        <span className="font-body text-white/40 text-2xs uppercase">{b.stat_label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(b)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                    </button>
                    {confirmId === b.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(b.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </button>
                        <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(b.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ServicesPanel() {
  const { services, loading, create, update, remove } = useAdminServices()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ title: '', description: '', icon: '', image_url: '', tag: '', tag_style: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(s) {
    setEditingId(s.id)
    setEditData({ title: s.title, description: s.description, icon: s.icon, image_url: s.image_url, tag: s.tag, tag_style: s.tag_style, active: s.active, sort_order: s.sort_order })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.title) return
    try { await create(newData); setShowNew(false); setNewData({ title: '', description: '', icon: '', image_url: '', tag: '', tag_style: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Musculación' },
    { key: 'description', label: 'Descripción', placeholder: 'Descripción del servicio' },
    { key: 'icon', label: 'Icono', placeholder: 'Ej: fitness_center', type: 'icon' },
    { key: 'image_url', label: 'URL de imagen', placeholder: 'https://...', type: 'image' },
    { key: 'tag', label: 'Etiqueta', placeholder: 'Ej: Fuerza' },
    { key: 'tag_style', label: 'Estilo de etiqueta (Tailwind)', placeholder: 'bg-primary/20 text-primary' },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const renderField = (f, data, setData) => {
    if (f.area) return (
      <textarea key={f.key} value={data[f.key]} onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary resize-none" rows={2} />
    )
    if (f.type === 'image') return (
      <ImageField key={f.key} value={data[f.key] || ''} onChange={v => setData(p => ({ ...p, [f.key]: v }))} label={f.label} />
    )
    if (f.type === 'icon') return (
      <GymIconPicker key={f.key} value={data[f.key] || ''} onChange={v => setData(p => ({ ...p, [f.key]: v }))} label={f.label} />
    )
    return (
      <input key={f.key} type="text" value={data[f.key] || ''} onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Servicios</h3>
          <p className="font-body text-white/40 text-xs mt-1">{services.length} elementos</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'add'}</span>
          {showNew ? 'Cancelar' : 'Nuevo servicio'}
        </button>
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          {fields.map(f => renderField(f, newData, setNewData))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            Crear servicio
          </button>
        </div>
      )}

      {services.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">fitness_center</span>
          <p className="font-body text-white/40">No hay servicios aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="bg-surface-card border border-white/5 rounded-2xl p-5 transition-all hover:border-white/20">
              {editingId === s.id ? (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{f.label}</label>
                      {f.type === 'image' ? (
                        <ImageField value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.type === 'icon' ? (
                        <GymIconPicker value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.area || f.key === 'description' ? (
                        <textarea value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary resize-none" rows={2} />
                      ) : (
                        <input type="text" value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e => setEditData(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="font-body text-white/70 text-sm">Activo</span>
                    </label>
                    <input type="number" value={editData.sort_order} onChange={e => setEditData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-16 bg-surface-dark border border-white/10 rounded-lg px-2 py-1.5 font-body text-xs text-white focus:outline-none focus:border-primary" placeholder="Orden" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(s.id)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-all">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white font-body text-xs px-4 py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {s.icon && (
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-lg">{s.icon}</span>
                      </div>
                    )}
                    {!s.icon && s.image_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-white text-sm">{s.title}</p>
                        {!s.active && <span className="font-body text-2xs text-white/30 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>}
                        <span className="font-body text-2xs text-white/30">#{s.sort_order}</span>
                      </div>
                      {s.tag && (
                        <span className={`inline-block font-mono text-2xs px-2 py-0.5 rounded-full mt-1.5 ${s.tag_style || 'bg-white/10 text-white/50'}`}>{s.tag}</span>
                      )}
                      <p className="font-body text-white/50 text-xs mt-1.5 line-clamp-2">{s.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(s)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                    </button>
                    {confirmId === s.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(s.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </button>
                        <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(s.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryPanel() {
  const {
    images, loading, uploading, title, setTitle,
    urlInput, setUrlInput,
    editingId, editTitle, setEditTitle, editCategory, setEditCategory,
    dragOver, setDragOver, fileRef, upload, uploadFromUrl, handleDrop, remove,
    saveEdit, startEdit, cancelEdit, toast,
  } = useAdminGallery()
  const [confirmId, setConfirmId] = useState(null)

  async function handleDelete(img) {
    try { await remove(img) }
    catch { _ }
    setConfirmId(null)
  }

  return (
    <div>
      <h3 className="font-heading font-bold text-2xl text-white mb-6">Galería de imágenes</h3>

      <div
        className={`border-2 border-dashed rounded-2xl p-8 mb-6 text-center transition-all ${
          dragOver ? 'border-primary bg-primary/5' : 'border-white/10 bg-surface-card hover:border-white/20'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className="material-symbols-outlined text-4xl text-white/20 mb-3">{dragOver ? 'cloud_upload' : 'add_photo_alternate'}</span>
        <p className="font-body text-white/50 text-sm mb-4">
          {dragOver ? 'Suelta la imagen aquí' : 'Arrastra una imagen o selecciona desde el dispositivo'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <input type="file" ref={fileRef} accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={upload} hidden />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50">
            {uploading ? 'Subiendo...' : 'Subir desde dispositivo'}
          </button>
        </div>
        <p className="font-body text-white/30 text-2xs mt-3">JPG, PNG, WEBP, GIF — Máx. 10 MB</p>
      </div>

      <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-8">
        <p className="font-body text-white/40 text-xs mb-3">O pega una URL de imagen:</p>
        <div className="flex flex-wrap gap-3">
          <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" className="flex-1 min-w-[200px] bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título (opcional)" className="w-44 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          <button onClick={uploadFromUrl} disabled={uploading || !urlInput.trim()} className="bg-surface-elevated text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50">
            {uploading ? 'Agregando...' : 'Agregar desde URL'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">photo_library</span>
          <p className="font-body text-white/40">No hay imágenes aún. Sube tu primera imagen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className={`bg-surface-card border rounded-2xl overflow-hidden group ${img.active === false ? 'border-red-500/30 opacity-60' : 'border-white/5'}`}>
              <div className="aspect-square relative overflow-hidden">
                {img.active === false && (
                  <div className="absolute top-2 left-2 z-10 bg-red-500/80 text-white font-mono text-2xs px-2 py-0.5 rounded-full">Inactivo</div>
                )}
                <img src={img.image_url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => startEdit(img)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined text-white text-base">edit</span>
                  </button>
                  {confirmId === img.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(img)} className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600">
                        <span className="material-symbols-outlined text-white text-base">check</span>
                      </button>
                      <button onClick={() => setConfirmId(null)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                        <span className="material-symbols-outlined text-white text-base">close</span>
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(img.id)} className="w-9 h-9 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <span className="material-symbols-outlined text-white text-base">delete</span>
                    </button>
                  )}
                </div>

                {uploading && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}
              </div>

              <div className="p-3">
                {editingId === img.id ? (
                  <div className="space-y-2">
                    <input
                      type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-surface-dark border border-primary/50 rounded-lg px-2 py-1 font-body text-xs text-white focus:outline-none"
                      placeholder="Título"
                      autoFocus
                    />
                    <input
                      type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)}
                      className="w-full bg-surface-dark border border-primary/50 rounded-lg px-2 py-1 font-body text-xs text-white focus:outline-none"
                      placeholder="Categoría"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(img)} className="text-xs bg-primary text-surface-dark font-body font-semibold px-2 py-1 rounded hover:bg-primary-hover">Guardar</button>
                      <button onClick={cancelEdit} className="text-xs text-white/40 hover:text-white font-body">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-body text-white/70 text-xs truncate">{img.title || 'Sin título'}</p>
                    {img.category && <p className="font-body text-white/30 text-2xs">{img.category}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg font-body text-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          <span className="material-symbols-outlined text-sm">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.message}
        </div>
      )}
    </div>
  )
}

const ALL_PERMISSIONS = [
  { id: 'admin.access', label: 'Acceso al panel', icon: 'admin_panel_settings' },
  { id: 'messages.manage', label: 'Mensajes', icon: 'mail' },
  { id: 'benefits.manage', label: 'Beneficios', icon: 'stars' },
  { id: 'services.manage', label: 'Servicios', icon: 'fitness_center' },
  { id: 'coaches.manage', label: 'Coaches', icon: 'groups' },
  { id: 'team.manage', label: 'Equipo', icon: 'badge' },
  { id: 'events.manage', label: 'Eventos', icon: 'event' },
  { id: 'news.manage', label: 'Noticias', icon: 'newspaper' },
  { id: 'gallery.manage', label: 'Galería', icon: 'photo_library' },
  { id: 'members.manage', label: 'Miembros', icon: 'group' },
  { id: 'payments.manage', label: 'Pagos', icon: 'payments' },
  { id: 'metrics.view', label: 'Métricas', icon: 'monitoring' },
  { id: 'users.manage', label: 'Usuarios', icon: 'people' },
]

function PermissionsModal({ userId, userName, onClose }) {
  const { getUserPermissions, setPermission, removePermission } = useAdminUsers()
  const [perms, setPerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getUserPermissions(userId).then(p => { setPerms(p); setLoading(false) }).catch(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  async function toggle(permId, has, label) {
    const next = has ? 'revocado' : 'concedido'
    setPerms(prev => has ? prev.filter(p => p !== permId) : [...prev, permId])
    setToast({ type: next === 'concedido' ? 'success' : 'info', message: `Permiso "${label}" ${next}` })
    try {
      if (has) {
        await removePermission(userId, permId)
      } else {
        await setPermission(userId, permId)
      }
    } catch {
      setPerms(prev => has ? [...prev, permId] : prev.filter(p => p !== permId))
      setToast({ type: 'error', message: `Error al actualizar permiso "${label}"` })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-surface-card border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-heading font-bold text-lg text-white">Permisos</h4>
            <p className="font-body text-white/40 text-xs mt-0.5">{userName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
            <span className="material-symbols-outlined text-white/60 text-sm">close</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-1">
            {ALL_PERMISSIONS.map(p => {
              const has = perms.includes(p.id)
              return (
                <label key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${has ? 'bg-primary/20' : 'bg-white/5'}`}>
                    <span className={`material-symbols-outlined text-base ${has ? 'text-primary' : 'text-white/30'}`}>{p.icon}</span>
                  </div>
                  <span className={`font-body text-sm flex-1 ${has ? 'text-white' : 'text-white/40'}`}>{p.label}</span>
                  <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${has ? 'bg-primary' : 'bg-white/10'}`} onClick={() => toggle(p.id, has, p.label)}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${has ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {toast && (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg font-body text-sm transition-all animate-fade-in ${
            toast.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            <span className="material-symbols-outlined text-sm">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  )
}

function Users() {
  const { users, allUsers, loading, search, setSearch, changeRole, createUser, toggleDisabled, adminCount, secretaryCount, userCount, disabledCount } = useAdminUsers()
  const [showNew, setShowNew] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'usuario' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [permsUser, setPermsUser] = useState(null)

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      setError('Todos los campos son obligatorios')
      return
    }
    setCreating(true)
    try {
      await createUser(newUser)
      setSuccess(`Usuario ${newUser.email} creado correctamente`)
      setNewUser({ email: '', password: '', full_name: '', role: 'usuario' })
      setShowNew(false)
    } catch (err) {
      setError(err.message || 'Error al crear usuario')
    } finally {
      setCreating(false)
    }
  }

  async function handleToggleDisabled(u) {
    try {
      await toggleDisabled(u.id, !u.disabled)
    } catch {
      alert('Error al cambiar estado')
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      {permsUser && (
        <PermissionsModal
          userId={permsUser.id}
          userName={permsUser.full_name || permsUser.email}
          onClose={() => setPermsUser(null)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Usuarios</h3>
          <p className="font-body text-white/40 text-xs mt-1">
            {allUsers.length} total ·
            <span className="text-primary"> {adminCount} admin</span> ·
            <span className="text-blue-400"> {secretaryCount} secretaria</span> ·
            <span className="text-white/50"> {userCount} usuario</span>
            {disabledCount > 0 && <span className="text-red-400"> · {disabledCount} deshabilitado{disabledCount > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'person_add'}</span>
          {showNew ? 'Cancelar' : 'Crear usuario'}
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm">Nuevo usuario</h4>
          <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="Correo electrónico" required className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          <input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Contraseña" required className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          <input type="text" value={newUser.full_name} onChange={e => setNewUser(p => ({ ...p, full_name: e.target.value }))} placeholder="Nombre completo" required className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary">
            <option value="usuario">Usuario</option>
            <option value="secretaria">Secretaria</option>
            <option value="admin">Admin</option>
          </select>
          {error && <p className="font-body text-red-400 text-xs">{error}</p>}
          {success && <p className="font-body text-green-400 text-xs">{success}</p>}
          <button type="submit" disabled={creating} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50">
            {creating ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      )}

      <div className="relative mb-6 max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined text-lg">search</span>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar usuarios..."
          className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary"
        />
      </div>

      {users.length === 0 ? (
        <p className="font-body text-white/40 text-center py-12">No se encontraron usuarios.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Usuario</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">ID</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Rol</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Estado</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${u.disabled ? 'opacity-50' : ''}`}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-body font-semibold text-primary text-xs">{u.full_name?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <p className="font-body text-white text-sm">{u.full_name || '—'}</p>
                        {u.email && <p className="font-body text-white/30 text-xs">{u.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><p className="font-body text-white/30 text-xs font-mono">{u.id.slice(0, 12)}...</p></td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block font-mono text-2xs px-2.5 py-1 rounded-full ${
                      u.role === 'admin' ? 'bg-primary/20 text-primary' :
                      u.role === 'secretaria' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {u.disabled ? (
                      <span className="font-mono text-2xs bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full">Deshabilitado</span>
                    ) : (
                      <span className="font-mono text-2xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full">Activo</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        className="bg-surface-dark border border-white/10 rounded-lg px-3 py-1.5 font-body text-xs text-white focus:outline-none focus:border-primary"
                      >
                        <option value="usuario">Usuario</option>
                        <option value="secretaria">Secretaria</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleToggleDisabled(u)}
                        className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                          u.disabled
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {u.disabled ? 'Habilitar' : 'Deshab.'}
                      </button>
                      <button
                        onClick={() => setPermsUser(u)}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-body text-xs hover:bg-primary/20 transition-all"
                      >
                        Permisos
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CoachesPanel() {
  const { coaches, loading, create, update, remove } = useAdminCoaches()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ name: '', bio: '', certifications: '', specialties: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(c) {
    setEditingId(c.id)
    setEditData({ name: c.name, photo_url: c.photo_url || '', bio: c.bio || '', certifications: c.certifications || '', specialties: c.specialties ? JSON.stringify(c.specialties) : '[]', active: c.active, sort_order: c.sort_order })
  }

  async function saveEdit(id) {
    const data = { ...editData }
    try { data.specialties = JSON.parse(editData.specialties || '[]') } catch { data.specialties = [] }
    try { await update(id, data) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.name) return
    const data = { ...newData }
    try { data.specialties = JSON.parse(newData.specialties || '[]') } catch { data.specialties = [] }
    try { await create(data); setShowNew(false); setNewData({ name: '', bio: '', certifications: '', specialties: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  const fields = [
    { key: 'name', label: 'Nombre', placeholder: 'Ej: Carlos Méndez' },
    { key: 'photo_url', label: 'URL de foto', placeholder: 'https://...', type: 'image' },
    { key: 'bio', label: 'Biografía', placeholder: 'Descripción del coach', area: true },
    { key: 'certifications', label: 'Certificaciones', placeholder: 'Ej: CrossFit L1, NSCA-CPT' },
    { key: 'specialties', label: 'Especialidades (JSON)', placeholder: '["Fuerza","CrossFit"]' },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Coaches</h3>
          <p className="font-body text-white/40 text-xs mt-1">{coaches.length} elementos</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'add'}</span>
          {showNew ? 'Cancelar' : 'Nuevo coach'}
        </button>
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          {fields.map(f => (
            f.area ? (
              <textarea key={f.key} value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary resize-none" rows={2} />
            ) : f.type === 'image' ? (
              <ImageField key={f.key} value={newData[f.key] || ''} onChange={v => setNewData(p => ({ ...p, [f.key]: v }))} label={f.label} />
            ) : (
              <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            )
          ))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            Crear coach
          </button>
        </div>
      )}

      {coaches.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">groups</span>
          <p className="font-body text-white/40">No hay coaches aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coaches.map(c => (
            <div key={c.id} className="bg-surface-card border border-white/5 rounded-2xl p-5 transition-all hover:border-white/20">
              {editingId === c.id ? (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{f.label}</label>
                      {f.type === 'image' ? (
                        <ImageField value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.area ? (
                        <textarea value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary resize-none" rows={2} />
                      ) : (
                        <input type="text" value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e => setEditData(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="font-body text-white/70 text-sm">Activo</span>
                    </label>
                    <input type="number" value={editData.sort_order} onChange={e => setEditData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-16 bg-surface-dark border border-white/10 rounded-lg px-2 py-1.5 font-body text-xs text-white focus:outline-none focus:border-primary" placeholder="Orden" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(c.id)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-all">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white font-body text-xs px-4 py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {c.photo_url && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-white text-sm">{c.name}</p>
                        {!c.active && <span className="font-body text-2xs text-white/30 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>}
                      </div>
                      {c.specialties?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {c.specialties.map((s, i) => (
                            <span key={i} className="font-mono text-2xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                      {c.bio && <p className="font-body text-white/50 text-xs mt-1.5 line-clamp-2">{c.bio}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(c)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                    </button>
                    {confirmId === c.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(c.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </button>
                        <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(c.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TeamPanel() {
  const { team, loading, create, update, remove } = useAdminTeam()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ name: '', role: '', bio: '', photo_url: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(t) {
    setEditingId(t.id)
    setEditData({ name: t.name, photo_url: t.photo_url || '', role: t.role || '', bio: t.bio || '', active: t.active, sort_order: t.sort_order })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.name) return
    try { await create(newData); setShowNew(false); setNewData({ name: '', role: '', bio: '', photo_url: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  const fields = [
    { key: 'name', label: 'Nombre', placeholder: 'Ej: María Fernández' },
    { key: 'role', label: 'Rol', placeholder: 'Ej: Gerente General' },
    { key: 'photo_url', label: 'URL de foto', placeholder: 'https://...', type: 'image' },
    { key: 'bio', label: 'Biografía', placeholder: 'Descripción del miembro', area: true },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Equipo</h3>
          <p className="font-body text-white/40 text-xs mt-1">{team.length} elementos</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'add'}</span>
          {showNew ? 'Cancelar' : 'Nuevo miembro'}
        </button>
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          {fields.map(f => (
            f.area ? (
              <textarea key={f.key} value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary resize-none" rows={2} />
            ) : f.type === 'image' ? (
              <ImageField key={f.key} value={newData[f.key] || ''} onChange={v => setNewData(p => ({ ...p, [f.key]: v }))} label={f.label} />
            ) : (
              <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            )
          ))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            Crear miembro
          </button>
        </div>
      )}

      {team.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">badge</span>
          <p className="font-body text-white/40">No hay miembros aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {team.map(t => (
            <div key={t.id} className="bg-surface-card border border-white/5 rounded-2xl p-5 transition-all hover:border-white/20">
              {editingId === t.id ? (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{f.label}</label>
                      {f.type === 'image' ? (
                        <ImageField value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.area ? (
                        <textarea value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary resize-none" rows={2} />
                      ) : (
                        <input type="text" value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e => setEditData(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="font-body text-white/70 text-sm">Activo</span>
                    </label>
                    <input type="number" value={editData.sort_order} onChange={e => setEditData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-16 bg-surface-dark border border-white/10 rounded-lg px-2 py-1.5 font-body text-xs text-white focus:outline-none focus:border-primary" placeholder="Orden" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(t.id)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-all">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white font-body text-xs px-4 py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {t.photo_url && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-white text-sm">{t.name}</p>
                        {!t.active && <span className="font-body text-2xs text-white/30 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>}
                      </div>
                      {t.role && <span className="font-mono text-2xs text-primary">{t.role}</span>}
                      {t.bio && <p className="font-body text-white/50 text-xs mt-1.5 line-clamp-2">{t.bio}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(t)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                    </button>
                    {confirmId === t.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(t.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </button>
                        <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(t.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EventsPanel() {
  const { events, loading, create, update, remove } = useAdminEvents()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ title: '', description: '', date: '', time: '', location: '', image_url: '', icon: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(e) {
    setEditingId(e.id)
    setEditData({ title: e.title, description: e.description || '', date: e.date || '', time: e.time || '', location: e.location || '', image_url: e.image_url || '', icon: e.icon || '', active: e.active })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.title) return
    try { await create(newData); setShowNew(false); setNewData({ title: '', description: '', date: '', time: '', location: '', image_url: '', icon: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Torneo de CrossFit' },
    { key: 'description', label: 'Descripción', placeholder: 'Descripción del evento', area: true },
    { key: 'date', label: 'Fecha (YYYY-MM-DD)', placeholder: '2026-07-15' },
    { key: 'time', label: 'Hora', placeholder: '09:00' },
    { key: 'location', label: 'Ubicación', placeholder: 'ZonaFit Montería' },
    { key: 'icon', label: 'Icono', placeholder: 'Ej: event', type: 'icon' },
    { key: 'image_url', label: 'URL de imagen', placeholder: 'https://...', type: 'image' },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Eventos</h3>
          <p className="font-body text-white/40 text-xs mt-1">{events.length} elementos</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'add'}</span>
          {showNew ? 'Cancelar' : 'Nuevo evento'}
        </button>
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          {fields.map(f => renderField(f, newData, setNewData))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            Crear evento
          </button>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">event</span>
          <p className="font-body text-white/40">No hay eventos aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(e => (
            <div key={e.id} className="bg-surface-card border border-white/5 rounded-2xl p-5 transition-all hover:border-white/20">
              {editingId === e.id ? (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{f.label}</label>
                      {f.type === 'image' ? (
                        <ImageField value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.type === 'icon' ? (
                        <GymIconPicker value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.area ? (
                        <textarea value={editData[f.key]} onChange={e_ => setEditData(p => ({ ...p, [f.key]: e_.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary resize-none" rows={2} />
                      ) : (
                        <input type="text" value={editData[f.key]} onChange={e_ => setEditData(p => ({ ...p, [f.key]: e_.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e_ => setEditData(p => ({ ...p, active: e_.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="font-body text-white/70 text-sm">Activo</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(e.id)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-all">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white font-body text-xs px-4 py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {e.icon && (
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-lg">{e.icon}</span>
                      </div>
                    )}
                    {!e.icon && e.image_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={e.image_url} alt={e.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-white text-sm">{e.title}</p>
                        {!e.active && <span className="font-body text-2xs text-white/30 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        {e.date && <span className="font-body text-white/40 text-xs">{e.date}</span>}
                        {e.time && <span className="font-body text-white/40 text-xs">{e.time.slice(0, 5)}</span>}
                        {e.location && <span className="font-body text-white/40 text-xs">{e.location}</span>}
                      </div>
                      {e.description && <p className="font-body text-white/50 text-xs mt-1.5 line-clamp-2">{e.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(e)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                    </button>
                    {confirmId === e.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(e.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </button>
                        <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(e.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NewsPanel() {
  const { news, loading, create, update, remove } = useAdminNews()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ title: '', summary: '', content: '', image_url: '', link: '', author: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(n) {
    setEditingId(n.id)
    setEditData({ title: n.title, summary: n.summary || '', content: n.content || '', image_url: n.image_url || '', link: n.link || '', author: n.author || '', date: n.date || '', active: n.active })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.title) return
    try { await create(newData); setShowNew(false); setNewData({ title: '', summary: '', content: '', image_url: '', link: '', author: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Nuevo equipamiento' },
    { key: 'summary', label: 'Resumen', placeholder: 'Breve descripción de la noticia' },
    { key: 'content', label: 'Contenido completo', placeholder: 'Contenido...', area: true },
    { key: 'image_url', label: 'URL de imagen', placeholder: 'https://...', type: 'image' },
    { key: 'link', label: 'Enlace externo', placeholder: 'https://...' },
    { key: 'author', label: 'Autor', placeholder: 'ZonaFit' },
    { key: 'date', label: 'Fecha (YYYY-MM-DD)', placeholder: '2026-05-28' },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Noticias</h3>
          <p className="font-body text-white/40 text-xs mt-1">{news.length} elementos</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
          <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'add'}</span>
          {showNew ? 'Cancelar' : 'Nueva noticia'}
        </button>
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          {fields.map(f => (
            f.area ? (
              <textarea key={f.key} value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary resize-none" rows={3} />
            ) : f.type === 'image' ? (
              <ImageField key={f.key} value={newData[f.key] || ''} onChange={v => setNewData(p => ({ ...p, [f.key]: v }))} label={f.label} />
            ) : (
              <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            )
          ))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            Crear noticia
          </button>
        </div>
      )}

      {news.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">newspaper</span>
          <p className="font-body text-white/40">No hay noticias aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map(n => (
            <div key={n.id} className="bg-surface-card border border-white/5 rounded-2xl p-5 transition-all hover:border-white/20">
              {editingId === n.id ? (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key}>
                      <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{f.label}</label>
                      {f.type === 'image' ? (
                        <ImageField value={editData[f.key] || ''} onChange={v => setEditData(p => ({ ...p, [f.key]: v }))} />
                      ) : f.area ? (
                        <textarea value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary resize-none" rows={3} />
                      ) : (
                        <input type="text" value={editData[f.key]} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e => setEditData(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                      <span className="font-body text-white/70 text-sm">Activo</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(n.id)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-4 py-2 rounded-lg hover:bg-primary-hover transition-all">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 hover:text-white font-body text-xs px-4 py-2">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {n.image_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-white text-sm">{n.title}</p>
                        {!n.active && <span className="font-body text-2xs text-white/30 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {n.date && <span className="font-body text-white/40 text-xs">{n.date}</span>}
                        {n.author && <span className="font-body text-white/40 text-xs">{n.author}</span>}
                      </div>
                      {n.summary && <p className="font-body text-white/50 text-xs mt-1.5 line-clamp-2">{n.summary}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(n)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                    </button>
                    {confirmId === n.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(n.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        </button>
                        <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(n.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const CHART_COLORS = ['#dfff00', '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#2dd4bf', '#f87171', '#e879f9']

function MetricsPanel() {
  const { metrics, loading, refresh } = useMetrics()

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  if (!metrics) return <div className="text-center py-16"><p className="font-body text-white/40">No hay datos disponibles.</p></div>

  const revenueData = Object.entries(metrics.revenueByMonth || {}).map(([m, v]) => ({ month: m, ingresos: Number(v) })).sort((a, b) => a.month.localeCompare(b.month))
  const planData = Object.entries(metrics.planDistribution || {}).map(([n, v]) => ({ name: n, value: v }))
  const methodData = Object.entries(metrics.revenueByMethod || {}).map(([m, v]) => ({ name: m === 'cash' ? 'Efectivo' : m === 'transfer' ? 'Transferencia' : m === 'card' ? 'Tarjeta' : m, value: Number(v) }))

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Métricas & Reportes</h3>
          <p className="font-body text-white/40 text-xs mt-1">Panel de rendimiento del gimnasio</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 bg-surface-card border border-white/10 text-white font-body text-sm px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
          <span className="material-symbols-outlined text-sm">refresh</span>
          Actualizar
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <span className="material-symbols-outlined text-primary text-2xl mb-2">group</span>
          <p className="font-body text-white/40 text-xs uppercase tracking-wider">Miembros activos</p>
          <p className="font-heading font-bold text-3xl text-white mt-1">{metrics.activeSubscriptions}</p>
        </div>
        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <span className="material-symbols-outlined text-green-400 text-2xl mb-2">payments</span>
          <p className="font-body text-white/40 text-xs uppercase tracking-wider">Ingresos totales</p>
          <p className="font-heading font-bold text-3xl text-white mt-1">${Number(metrics.totalRevenue || 0).toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <span className="material-symbols-outlined text-amber-400 text-2xl mb-2">receipt_long</span>
          <p className="font-body text-white/40 text-xs uppercase tracking-wider">Pagos registrados</p>
          <p className="font-heading font-bold text-3xl text-white mt-1">{metrics.totalPayments}</p>
        </div>
        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <span className="material-symbols-outlined text-red-400 text-2xl mb-2">warning</span>
          <p className="font-body text-white/40 text-xs uppercase tracking-wider">Vencidos / por vencer</p>
          <p className="font-heading font-bold text-3xl text-white mt-1">{metrics.expiredMembers?.length || 0}<span className="text-sm text-white/40"> + {metrics.expiringSoon?.length || 0}</span></p>
        </div>
      </div>

      {metrics.expiredMembers?.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-red-400 text-lg">warning</span>
            <h4 className="font-heading font-bold text-white text-sm">Membresías vencidas ({metrics.expiredMembers.length})</h4>
          </div>
          <div className="space-y-2">
            {metrics.expiredMembers.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <span className="font-body text-white text-sm">{m.members?.full_name}</span>
                <span className="font-body text-red-400 text-xs">Vence: {m.end_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {metrics.expiringSoon?.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-amber-400 text-lg">schedule</span>
            <h4 className="font-heading font-bold text-white text-sm">Por vencer pronto ({metrics.expiringSoon.length})</h4>
          </div>
          <div className="space-y-2">
            {metrics.expiringSoon.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <span className="font-body text-white text-sm">{m.members?.full_name}</span>
                <span className="font-body text-amber-400 text-xs">Vence: {m.end_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Ingresos por mes</h4>
          {revenueData.length === 0 ? (
            <p className="font-body text-white/30 text-xs text-center py-8">Sin datos de ingresos</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#ffffff60', fontSize: 11 }} />
                <YAxis tick={{ fill: '#ffffff60', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="ingresos" fill="#dfff00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Miembros por plan</h4>
          {planData.length === 0 ? (
            <p className="font-body text-white/30 text-xs text-center py-8">Sin miembros registrados</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {planData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Ingresos por método de pago</h4>
          {methodData.length === 0 ? (
            <p className="font-body text-white/30 text-xs text-center py-8">Sin datos de pagos</p>
          ) : (
            <div className="space-y-3">
              {methodData.map((m, i) => {
                const total = methodData.reduce((s, x) => s + x.value, 0)
                const pct = total > 0 ? (m.value / total * 100) : 0
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-white/70 text-xs">{m.name}</span>
                      <span className="font-body text-white/50 text-xs">${Number(m.value).toLocaleString('es-CO')} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: pct + '%', backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Planes disponibles</h4>
          {(!metrics.plans || metrics.plans.length === 0) ? (
            <p className="font-body text-white/30 text-xs text-center py-8">Sin planes configurados</p>
          ) : (
            <div className="space-y-3">
              {metrics.plans.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-body font-semibold text-white text-sm">{p.name}</p>
                    <p className="font-body text-white/30 text-xs">{p.duration_days} días</p>
                  </div>
                  <span className="font-heading font-bold text-primary">${Number(p.price).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MembersPanel() {
  const { members, loading, create, update, remove, createSubscription, updateSubscription, cancelSubscription } = useAdminMembers()
  const [plans, setPlans] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newData, setNewData] = useState({ full_name: '', phone: '', email: '', document_type: 'CC', document_number: '', address: '', notes: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [search, setSearch] = useState('')
  const [subModal, setSubModal] = useState(null)
  const [subData, setSubData] = useState({ plan_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '' })
  const [latestSubs, setLatestSubs] = useState({})
  const [subViewModal, setSubViewModal] = useState(null)
  const [subViewData, setSubViewData] = useState([])
  const [editSubId, setEditSubId] = useState(null)
  const [editSubEndDate, setEditSubEndDate] = useState('')
  const [cancelSubId, setCancelSubId] = useState(null)
  const [cardMember, setCardMember] = useState(null)

  useEffect(() => {
    import('../models/subscriptions.model').then(m => m.getMembershipPlans()).then(setPlans).catch(() => {})
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const m = await import('../models/subscriptions.model')
        const subs = await m.getLatestSubscriptionPerMember()
        const map = {}
        ;(subs || []).forEach(s => { map[s.member_id] = s })
        setLatestSubs(map)
      } catch {}
    })()
  }, [members.length])

  function startEdit(m) {
    setEditingId(m.id)
    setEditData({ full_name: m.full_name, phone: m.phone || '', email: m.email || '', document_type: m.document_type || 'CC', document_number: m.document_number || '', address: m.address || '', notes: m.notes || '', photo_url: m.photo_url || '' })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.full_name) return
    try { await create(newData); setShowNew(false); setNewData({ full_name: '', phone: '', email: '', document_type: 'CC', document_number: '', address: '', notes: '' }) }
    catch (e) { alert('Error al crear: ' + e.message) }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al inhabilitar') }
  }

  async function handleSubscribe() {
    if (!subModal || !subData.plan_id || !subData.end_date) return
    try {
      const plan = plans.find(p => p.id === subData.plan_id)
      await createSubscription({
        member_id: subModal.id,
        plan_id: subData.plan_id,
        start_date: subData.start_date,
        end_date: subData.end_date,
        price: plan?.price || 0,
      })
      setSubModal(null)
      setSubData({ plan_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '' })
      const m = await import('../models/subscriptions.model')
      const subs = await m.getLatestSubscriptionPerMember()
      const map = {}
      ;(subs || []).forEach(s => { map[s.member_id] = s })
      setLatestSubs(map)
    } catch (e) { alert('Error al crear suscripción: ' + e.message) }
  }

  async function handleViewSubs(member) {
    try {
      const m = await import('../models/subscriptions.model')
      const subs = await m.getMemberSubscriptions(member.id)
      setSubViewData(subs || [])
      setSubViewModal(member)
    } catch { alert('Error al cargar suscripciones') }
  }

  async function handleEditSubDate(subId) {
    if (!editSubEndDate) return
    try {
      await updateSubscription(subId, { end_date: editSubEndDate })
      setEditSubId(null)
      setEditSubEndDate('')
      if (subViewModal) {
        const m = await import('../models/subscriptions.model')
        const subs = await m.getMemberSubscriptions(subViewModal.id)
        setSubViewData(subs || [])
      }
      const m = await import('../models/subscriptions.model')
      const subs = await m.getLatestSubscriptionPerMember()
      const map = {}
      ;(subs || []).forEach(s => { map[s.member_id] = s })
      setLatestSubs(map)
    } catch { alert('Error al actualizar fecha') }
  }

  async function handleCancelSub(subId) {
    try {
      await cancelSubscription(subId)
      setCancelSubId(null)
      if (subViewModal) {
        const m = await import('../models/subscriptions.model')
        const subs = await m.getMemberSubscriptions(subViewModal.id)
        setSubViewData(subs || [])
      }
      const m = await import('../models/subscriptions.model')
      const subs = await m.getLatestSubscriptionPerMember()
      const map = {}
      ;(subs || []).forEach(s => { map[s.member_id] = s })
      setLatestSubs(map)
    } catch { alert('Error al cancelar suscripción') }
  }

  const filtered = members.filter(m =>
    m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.document_number?.includes(search) ||
    m.phone?.includes(search)
  )

  function exportCSV() {
    const headers = ['Nombre', 'Documento', 'Teléfono', 'Email', 'Dirección', 'Estado', 'Plan', 'Vencimiento']
    const rows = filtered.map(m => {
      const sub = latestSubs[m.id]
      let status = 'Inactivo'
      let plan = ''
      let end = ''
      if (m.active) {
        if (!sub) { status = 'Sin plan' }
        else {
          const today = new Date()
          const endDate = new Date(sub.end_date + 'T23:59:59')
          if (endDate < today) status = 'Vencido'
          else if (endDate <= new Date(today.getTime() + 3 * 86400000)) status = 'Por vencer'
          else status = 'Activo'
          plan = sub.membership_plans?.name || ''
          end = sub.end_date || ''
        }
      }
      return [m.full_name, `${m.document_type || ''} ${m.document_number || ''}`, m.phone || '', m.email || '', m.address || '', status, plan, end]
    })
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `miembros_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const fields = [
    { key: 'full_name', label: 'Nombre completo', placeholder: 'Ej: Juan Pérez' },
    { key: 'phone', label: 'Teléfono', placeholder: '+57 300 123 4567' },
    { key: 'email', label: 'Email', placeholder: 'juan@ejemplo.com' },
    { key: 'document_number', label: 'Número de documento', placeholder: '1234567890' },
    { key: 'address', label: 'Dirección', placeholder: 'Cra 1 #2-3, Montería' },
    { key: 'notes', label: 'Notas', placeholder: 'Observaciones...', area: true },
  ]

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Miembros</h3>
          <p className="font-body text-white/40 text-xs mt-1">{filtered.length} de {members.length} miembros</p>
        </div>
        <div className="flex gap-2">
          {filtered.length > 0 && (
            <button onClick={exportCSV} className="flex items-center gap-2 bg-white/5 text-white/70 font-body text-sm px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-sm">download</span>
              CSV
            </button>
          )}
          <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
            <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'person_add'}</span>
            {showNew ? 'Cancelar' : 'Nuevo miembro'}
          </button>
        </div>
      </div>

      <div className="relative mb-6 max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined text-lg">search</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar miembros..." className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex gap-2 mb-2">
            {['CC', 'CE', 'NIT'].map(dt => (
              <button key={dt} onClick={() => setNewData(p => ({ ...p, document_type: dt }))} className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${newData.document_type === dt ? 'bg-primary text-surface-dark font-semibold' : 'bg-white/5 text-white/50 hover:text-white'}`}>{dt}</button>
            ))}
          </div>
          {fields.map(f => (
            f.area ? (
              <textarea key={f.key} value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary resize-none" rows={2} />
            ) : (
              <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            )
          ))}
          <button onClick={handleCreate} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all">Crear miembro</button>
        </div>
      )}

      {subModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSubModal(null)}>
          <div className="bg-surface-card border border-white/10 rounded-3xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h4 className="font-heading font-bold text-white text-lg mb-1">Nueva suscripción</h4>
            <p className="font-body text-white/40 text-xs mb-5">{subModal.full_name}</p>
            <div className="space-y-3">
              <div>
                <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">Plan</label>
                <select value={subData.plan_id} onChange={e => {
                  const plan = plans.find(p => p.id === e.target.value)
                  const start = subData.start_date
                  const end = plan ? new Date(new Date(start).getTime() + plan.duration_days * 86400000).toISOString().split('T')[0] : ''
                  setSubData(p => ({ ...p, plan_id: e.target.value, end_date: end }))
                }} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary">
                  <option value="">Seleccionar plan...</option>
                  {plans.filter(p => p.active).map(p => (
                    <option key={p.id} value={p.id}>{p.name} — ${Number(p.price).toLocaleString('es-CO')} ({p.duration_days} días)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">Fecha de inicio</label>
                <input type="date" value={subData.start_date} onChange={e => {
                  const start = e.target.value
                  const plan = plans.find(p => p.id === subData.plan_id)
                  const end = plan ? new Date(new Date(start).getTime() + plan.duration_days * 86400000).toISOString().split('T')[0] : ''
                  setSubData(p => ({ ...p, start_date: start, end_date: end }))
                }} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">Fecha de vencimiento</label>
                <input type="date" value={subData.end_date} onChange={e => setSubData(p => ({ ...p, end_date: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSubscribe} disabled={!subData.plan_id || !subData.end_date} className="flex-1 bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50">
                  Crear suscripción
                </button>
                <button onClick={() => setSubModal(null)} className="px-5 py-2.5 text-white/40 hover:text-white font-body text-sm rounded-xl">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => { setSubViewModal(null); setEditSubId(null); setCancelSubId(null) }}>
          <div className="bg-surface-card border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="font-heading font-bold text-white text-lg">Suscripciones</h4>
                <p className="font-body text-white/40 text-xs mt-0.5">{subViewModal.full_name}</p>
              </div>
              <button onClick={() => { setSubViewModal(null); setEditSubId(null); setCancelSubId(null) }} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                <span className="material-symbols-outlined text-white/60 text-sm">close</span>
              </button>
            </div>
            {subViewData.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-3xl text-white/20 mb-2">subscriptions</span>
                <p className="font-body text-white/30 text-xs">Sin suscripciones registradas</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subViewData.map(s => (
                  <div key={s.id} className={`rounded-xl p-4 ${s.active ? 'bg-white/5' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-semibold text-white text-sm">{s.membership_plans?.name}</span>
                        {!s.active && <span className="font-mono text-2xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Cancelada</span>}
                      </div>
                      <span className="font-heading font-bold text-primary text-sm">${Number(s.price).toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-2xs font-body text-white/40">
                      <span>Inicio: {s.start_date}</span>
                      <span>Fin: {s.end_date}</span>
                    </div>
                    {s.active && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                        {editSubId === s.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input type="date" value={editSubEndDate} onChange={e => setEditSubEndDate(e.target.value)} className="flex-1 bg-surface-dark border border-white/10 rounded-lg px-3 py-1.5 font-body text-xs text-white focus:outline-none focus:border-primary" />
                            <button onClick={() => handleEditSubDate(s.id)} className="bg-primary text-surface-dark font-body text-xs px-3 py-1.5 rounded-lg hover:bg-primary-hover">
                              Guardar
                            </button>
                            <button onClick={() => setEditSubId(null)} className="text-white/40 hover:text-white font-body text-xs">
                              Cancelar
                            </button>
                          </div>
                        ) : cancelSubId === s.id ? (
                          <div className="flex items-center gap-2">
                            <span className="font-body text-xs text-red-400">¿Cancelar esta suscripción?</span>
                            <button onClick={() => handleCancelSub(s.id)} className="bg-red-500 text-white font-body text-xs px-3 py-1.5 rounded-lg hover:bg-red-600">
                              Sí, cancelar
                            </button>
                            <button onClick={() => setCancelSubId(null)} className="text-white/40 hover:text-white font-body text-xs">
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => { setEditSubId(s.id); setEditSubEndDate(s.end_date); setCancelSubId(null) }} className="flex items-center gap-1 text-white/50 hover:text-primary font-body text-xs transition-colors">
                              <span className="material-symbols-outlined text-xs">edit</span>
                              Editar fecha
                            </button>
                            <button onClick={() => { setCancelSubId(s.id); setEditSubId(null) }} className="flex items-center gap-1 text-red-400/70 hover:text-red-400 font-body text-xs transition-colors">
                              <span className="material-symbols-outlined text-xs">cancel</span>
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {cardMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:bg-white print:p-0 print:static print:inset-auto" onClick={() => setCardMember(null)}>
          <div className="bg-surface-card border border-white/10 rounded-3xl p-6 w-full max-w-sm print:shadow-none print:border-0 print:bg-white print:p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 print:hidden">
              <h4 className="font-heading font-bold text-white text-lg">Carnet de membresía</h4>
              <button onClick={() => setCardMember(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                <span className="material-symbols-outlined text-white/60 text-sm">close</span>
              </button>
            </div>
            <div className="bg-gradient-to-br from-surface-dark to-surface-card rounded-2xl p-5 border border-white/10 print:border-gray-200 print:from-white print:to-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-heading font-bold text-primary text-lg print:text-black">ZONAFIT</p>
                  <p className="font-body text-white/40 text-2xs print:text-gray-500">Gimnasio · Montería</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl print:text-black">fitness_center</span>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-heading font-bold text-white text-xl mb-1 print:text-black">{cardMember.full_name}</p>
                <p className="font-body text-white/40 text-xs print:text-gray-500">{cardMember.document_type} {cardMember.document_number}</p>
              </div>
              {(() => {
                const sub = latestSubs[cardMember.id]
                if (!sub) return <p className="font-body text-white/30 text-xs print:text-gray-400">Sin suscripción activa</p>
                return (
                  <div className="space-y-2 text-2xs">
                    <div className="flex justify-between">
                      <span className="font-body text-white/40 print:text-gray-500">Plan</span>
                      <span className="font-body text-white font-semibold print:text-black">{sub.membership_plans?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-white/40 print:text-gray-500">Inicio</span>
                      <span className="font-body text-white print:text-black">{sub.start_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-white/40 print:text-gray-500">Vence</span>
                      <span className="font-body text-white font-semibold print:text-black">{sub.end_date}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10 print:border-gray-200">
                      <span className="font-body text-white/40 print:text-gray-500">ID</span>
                      <span className="font-mono text-white/50 print:text-gray-400">{sub.id?.substring(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
            <div className="flex gap-3 mt-4 print:hidden">
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all flex-1 justify-center">
                <span className="material-symbols-outlined text-sm">print</span>
                Imprimir
              </button>
              <button onClick={() => setCardMember(null)} className="px-5 py-2.5 text-white/40 hover:text-white font-body text-sm rounded-xl">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">group</span>
          <p className="font-body text-white/40">No hay miembros registrados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Nombre</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Documento</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Teléfono</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Estado</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!m.active ? 'opacity-50' : ''}`}>
                  <td className="py-3 pr-4">
                    <p className="font-body font-semibold text-white text-sm">{m.full_name}</p>
                    {m.email && <p className="font-body text-white/30 text-xs">{m.email}</p>}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-body text-white/50 text-xs">{m.document_type} {m.document_number}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-body text-white/50 text-xs">{m.phone || '—'}</span>
                  </td>
                  <td className="py-3 pr-4">
                    {!m.active ? (
                      <span className="font-mono text-2xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Inactivo</span>
                    ) : (() => {
                      const sub = latestSubs[m.id]
                      const today = new Date()
                      if (!sub) return <span className="font-mono text-2xs bg-white/10 text-white/50 px-2 py-1 rounded-full">Sin plan</span>
                      const end = new Date(sub.end_date + 'T23:59:59')
                      if (!sub.active) return <span className="font-mono text-2xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Cancelada</span>
                      if (end < today) return <span className="font-mono text-2xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Vencido</span>
                      if (end <= new Date(today.getTime() + 3 * 86400000)) return <span className="font-mono text-2xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">Por vencer</span>
                      return <span className="font-mono text-2xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Activo</span>
                    })()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(m)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                        <span className="material-symbols-outlined text-white/60 text-sm">edit</span>
                      </button>
                      <button onClick={() => handleViewSubs(m)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${latestSubs[m.id] ? 'bg-primary/10 hover:bg-primary/20' : 'bg-white/5 hover:bg-white/10'}`}>
                        <span className={`material-symbols-outlined text-sm ${latestSubs[m.id] ? 'text-primary' : 'text-white/40'}`}>subscriptions</span>
                      </button>
                      <button onClick={() => setSubModal(m)} className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center hover:bg-emerald-500/20">
                        <span className="material-symbols-outlined text-emerald-400 text-sm">add</span>
                      </button>
                      {m.phone && (
                        <a href={`https://wa.me/57${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola ' + m.full_name + ', soy de ZonaFit Gym.')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center hover:bg-green-500/20">
                          <span className="material-symbols-outlined text-green-400 text-sm">chat</span>
                        </a>
                      )}
                      <button onClick={() => setCardMember(m)} className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center hover:bg-indigo-500/20">
                        <span className="material-symbols-outlined text-indigo-400 text-sm">badge</span>
                      </button>
                      {confirmId === m.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(m.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                            <span className="material-symbols-outlined text-white text-sm">check</span>
                          </button>
                          <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                            <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => m.active ? setConfirmId(m.id) : null} className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.active ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-white/5'} transition-colors`}>
                          <span className={`material-symbols-outlined text-sm ${m.active ? 'text-red-400' : 'text-white/20'}`}>delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PaymentsPanel() {
  const { payments, loading, create, remove } = useAdminPayments()
  const { members } = useAdminMembers()
  const [showNew, setShowNew] = useState(false)
  const [newPayment, setNewPayment] = useState({ member_id: '', amount: '', payment_method: 'cash', reference: '', notes: '' })
  const [confirmId, setConfirmId] = useState(null)
  const [search, setSearch] = useState('')
  const [receiptPayment, setReceiptPayment] = useState(null)

  async function handleCreate() {
    if (!newPayment.member_id || !newPayment.amount) return
    try {
      await create({
        member_id: newPayment.member_id,
        subscription_id: '00000000-0000-0000-0000-000000000000',
        amount: parseFloat(newPayment.amount),
        payment_method: newPayment.payment_method,
        reference: newPayment.reference || null,
        notes: newPayment.notes || null,
      })
      setShowNew(false)
      setNewPayment({ member_id: '', amount: '', payment_method: 'cash', reference: '', notes: '' })
    } catch (e) { alert('Error al registrar pago: ' + e.message) }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al eliminar') }
  }

  function exportPaymentsCSV() {
    const headers = ['Miembro', 'Documento', 'Monto', 'Método', 'Referencia', 'Fecha', 'Notas']
    const rows = filtered.map(p => [
      p.members?.full_name || '',
      p.members?.document_number ? `${p.members.document_type || ''} ${p.members.document_number}` : '',
      p.amount,
      p.payment_method === 'cash' ? 'Efectivo' : p.payment_method === 'transfer' ? 'Transferencia' : p.payment_method === 'card' ? 'Tarjeta' : p.payment_method,
      p.reference || '',
      p.payment_date || '',
      p.notes || '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pagos_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const filtered = payments.filter(p =>
    p.members?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const formatCOP = (n) => '$' + Number(n).toLocaleString('es-CO')

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Pagos</h3>
          <p className="font-body text-white/40 text-xs mt-1">{payments.length} registros</p>
        </div>
        <div className="flex gap-2">
          {payments.length > 0 && (
            <button onClick={exportPaymentsCSV} className="flex items-center gap-2 bg-white/5 text-white/70 font-body text-sm px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-sm">download</span>
              CSV
            </button>
          )}
          <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary-hover transition-all">
            <span className="material-symbols-outlined text-sm">{showNew ? 'close' : 'payments'}</span>
            {showNew ? 'Cancelar' : 'Registrar pago'}
          </button>
        </div>
      </div>

      <div className="relative mb-6 max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined text-lg">search</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre..." className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
      </div>

      {showNew && (
        <div className="bg-surface-card border border-white/10 rounded-2xl p-5 mb-6 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm">Nuevo pago</h4>
          <select value={newPayment.member_id} onChange={e => setNewPayment(p => ({ ...p, member_id: e.target.value }))} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary">
            <option value="">Seleccionar miembro...</option>
            {members.filter(m => m.active).map(m => (
              <option key={m.id} value={m.id}>{m.full_name} {m.document_number ? `(${m.document_type} ${m.document_number})` : ''}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <input type="number" value={newPayment.amount} onChange={e => setNewPayment(p => ({ ...p, amount: e.target.value }))} placeholder="Monto" className="flex-1 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            <select value={newPayment.payment_method} onChange={e => setNewPayment(p => ({ ...p, payment_method: e.target.value }))} className="w-36 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-primary">
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div className="flex gap-3">
            <input type="text" value={newPayment.reference} onChange={e => setNewPayment(p => ({ ...p, reference: e.target.value }))} placeholder="Referencia (opcional)" className="flex-1 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            <input type="text" value={newPayment.notes} onChange={e => setNewPayment(p => ({ ...p, notes: e.target.value }))} placeholder="Notas" className="flex-1 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          </div>
          <button onClick={handleCreate} disabled={!newPayment.member_id || !newPayment.amount} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50">
            Registrar pago
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-3">payments</span>
          <p className="font-body text-white/40">No hay pagos registrados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Miembro</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Monto</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Método</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Fecha</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <p className="font-body font-semibold text-white text-sm">{p.members?.full_name || '—'}</p>
                    {p.members?.document_number && <span className="font-body text-white/30 text-xs">{p.members.document_type} {p.members.document_number}</span>}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-heading font-bold text-primary text-sm">{formatCOP(p.amount)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-2xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                      {p.payment_method === 'cash' ? 'Efectivo' : p.payment_method === 'transfer' ? 'Transferencia' : p.payment_method === 'card' ? 'Tarjeta' : p.payment_method}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-body text-white/50 text-xs">{p.payment_date}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setReceiptPayment(p)} className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20">
                        <span className="material-symbols-outlined text-primary text-sm">receipt</span>
                      </button>
                      {confirmId === p.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(p.id)} className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                            <span className="material-symbols-outlined text-white text-sm">check</span>
                          </button>
                          <button onClick={() => setConfirmId(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                            <span className="material-symbols-outlined text-white/60 text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(p.id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center hover:bg-red-500/20">
                        <span className="material-symbols-outlined text-red-400 text-sm">delete</span>
                      </button>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {receiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setReceiptPayment(null)}>
          <div className="bg-surface-card border border-white/10 rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-heading font-bold text-white text-lg">Recibo de pago</h4>
              <button onClick={() => setReceiptPayment(null)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                <span className="material-symbols-outlined text-white/60 text-sm">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-white/10">
                <p className="font-heading font-bold text-primary text-xl">ZONAFIT</p>
                <p className="font-body text-white/40 text-xs">Gimnasio · Montería</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-body text-white/40">Miembro</span>
                  <span className="font-body text-white font-semibold">{receiptPayment.members?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-white/40">Documento</span>
                  <span className="font-body text-white">{receiptPayment.members?.document_type} {receiptPayment.members?.document_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-white/40">Monto</span>
                  <span className="font-heading font-bold text-primary">{formatCOP(receiptPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-white/40">Método</span>
                  <span className="font-body text-white">
                    {receiptPayment.payment_method === 'cash' ? 'Efectivo' : receiptPayment.payment_method === 'transfer' ? 'Transferencia' : receiptPayment.payment_method === 'card' ? 'Tarjeta' : receiptPayment.payment_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-white/40">Fecha</span>
                  <span className="font-body text-white">{receiptPayment.payment_date}</span>
                </div>
                {receiptPayment.reference && (
                  <div className="flex justify-between">
                    <span className="font-body text-white/40">Referencia</span>
                    <span className="font-mono text-white/70 text-xs">{receiptPayment.reference}</span>
                  </div>
                )}
                {receiptPayment.notes && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="font-body text-white/40 text-xs">Notas</span>
                    <p className="font-body text-white/60 text-xs mt-1">{receiptPayment.notes}</p>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button onClick={() => window.print()} className="flex-1 bg-primary text-surface-dark font-body font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">print</span>
                  Imprimir
                </button>
                <button onClick={() => setReceiptPayment(null)} className="px-4 py-2.5 text-white/40 hover:text-white font-body text-sm rounded-xl">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CalendarPanel() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [members, setMembers] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const m = await import('../models/subscriptions.model')
        const mm = await import('../models/members.model')
        const [s, mems] = await Promise.all([m.getCalendarSubscriptions(), mm.getAllMembers()])
        setSubs(s || [])
        setMembers(mems || [])
      } catch {}
      setLoading(false)
    })()
  }, [])

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

  const nav = (d) => setCurrentMonth(new Date(year, month + d, 1))

  const subsByDate = {}
  subs.forEach(s => {
    if (s.end_date) {
      const d = s.end_date
      if (!subsByDate[d]) subsByDate[d] = []
      subsByDate[d].push(s)
    }
  })

  const todayStr = today.toISOString().split('T')[0]
  const dayStatus = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const daySubs = subsByDate[dateStr]
    if (!daySubs) return null
    const hasExpired = daySubs.some(s => s.end_date < todayStr)
    const hasExpiring = daySubs.some(s => s.end_date >= todayStr && s.end_date <= new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0])
    if (hasExpired) return 'expired'
    if (hasExpiring) return 'expiring'
    return 'active'
  }

  const formatCOP = (n) => '$' + Number(n).toLocaleString('es-CO')

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push({ d: prevDays - firstDay + 1 + i, other: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ d, other: false })
  }
  const remaining = days.length % 7
  if (remaining > 0) {
    for (let i = 1; i <= 7 - remaining; i++) {
      days.push({ d: i, other: true })
    }
  }

  const weekRows = []
  for (let i = 0; i < days.length; i += 7) {
    weekRows.push(days.slice(i, i + 7))
  }

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null

  const selectedSubs = selectedDateStr ? (subsByDate[selectedDateStr] || []) : []
  const activeMembersCount = members.filter(m => m.active).length
  const expiredSubsCount = subs.filter(s => s.end_date && s.end_date < todayStr).length
  const expiringSubsCount = subs.filter(s => s.end_date && s.end_date >= todayStr && s.end_date <= new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]).length

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Calendario de vencimientos</h3>
          <p className="font-body text-white/40 text-xs mt-1">{activeMembersCount} miembros activos</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="font-body text-green-400 text-xs uppercase tracking-wider">Al día</p>
          <p className="font-heading font-bold text-2xl text-white mt-1">{activeMembersCount - expiredSubsCount - expiringSubsCount}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <p className="font-body text-amber-400 text-xs uppercase tracking-wider">Por vencer (7 días)</p>
          <p className="font-heading font-bold text-2xl text-white mt-1">{expiringSubsCount}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="font-body text-red-400 text-xs uppercase tracking-wider">Vencidos</p>
          <p className="font-heading font-bold text-2xl text-white mt-1">{expiredSubsCount}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => nav(-1)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-white/60 text-lg">chevron_left</span>
            </button>
            <h4 className="font-heading font-bold text-white text-base">{monthNames[month]} {year}</h4>
            <button onClick={() => nav(1)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-white/60 text-lg">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(n => (
              <div key={n} className="text-center font-body text-white/30 text-2xs py-2 uppercase tracking-wider">{n}</div>
            ))}
          </div>

          {weekRows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7">
              {row.map((day, di) => {
                const status = day.other ? null : dayStatus(day.d)
                const isToday = !day.other && day.d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const isSelected = !day.other && day.d === selectedDay
                const count = day.other ? 0 : (subsByDate[`${year}-${String(month + 1).padStart(2, '0')}-${String(day.d).padStart(2, '0')}`]?.length || 0)
                return (
                  <button
                    key={di}
                    onClick={() => !day.other && setSelectedDay(isSelected ? null : day.d)}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all relative
                      ${day.other ? 'text-white/10 cursor-default' : isSelected ? 'bg-primary text-surface-dark font-bold' : isToday ? 'bg-primary/20 text-primary font-bold' : 'text-white/70 hover:bg-white/5'}
                    `}
                  >
                    <span className={`font-body ${isSelected ? 'font-bold' : ''}`}>{day.d}</span>
                    {!day.other && count > 0 && (
                      <div className="flex gap-0.5">
                        {status === 'expired' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        {status === 'expiring' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                        {status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-4">
            {selectedDay
              ? `${selectedDay} de ${monthNames[month]} ${year}`
              : 'Selecciona un día'}
          </h4>
          {!selectedDay ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-3xl text-white/20 mb-2">calendar_month</span>
              <p className="font-body text-white/30 text-xs">Toca un día para ver los vencimientos</p>
            </div>
          ) : selectedSubs.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-3xl text-white/20 mb-2">check_circle</span>
              <p className="font-body text-white/30 text-xs">Sin vencimientos este día</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedSubs.map(s => {
                const isExpired = s.end_date < todayStr
                const reminderText = isExpired ? 'Hola ' + s.members?.full_name + ', tu membresia en ZonaFit Gym esta vencida. ¡Renueva ya!' : 'Hola ' + s.members?.full_name + ', te recordamos que tu membresia en ZonaFit Gym vence el ' + s.end_date + '. ¡Renueva a tiempo!'
                return (
                  <div key={s.id} className={`rounded-xl px-3 py-2.5 ${isExpired ? 'bg-red-500/10 border border-red-500/20' : s.end_date <= new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0] ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/5'}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-body font-semibold text-white text-sm">{s.members?.full_name}</p>
                      <div className="flex items-center gap-1">
                        {s.members?.phone && (
                          <a href={`https://wa.me/57${s.members.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(reminderText)}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-green-500/10 rounded flex items-center justify-center hover:bg-green-500/20">
                            <span className="material-symbols-outlined text-green-400 text-xs">chat</span>
                          </a>
                        )}
                        <span className={`font-mono text-2xs px-2 py-0.5 rounded-full ${isExpired ? 'bg-red-500/20 text-red-400' : s.end_date <= new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0] ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                          {isExpired ? 'Vencido' : 'Activo'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-white/40 text-xs">{s.membership_plans?.name}</span>
                      <span className="font-body text-white/20 text-xs">·</span>
                      <span className="font-body text-white/40 text-xs">{s.members?.phone || 'Sin teléfono'}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-white/30 text-2xs">Inicio: {s.start_date}</span>
                      <span className="font-body text-white/30 text-2xs">Fin: {s.end_date}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AttendancePanel() {
  const { attendance, loading, stats, checkIn } = useAdminAttendance()
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [checkinMsg, setCheckinMsg] = useState(null)

  useEffect(() => {
    import('../models/members.model').then(m => m.getAllMembers()).then(d => setMembers(d || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!checkinMsg) return
    const t = setTimeout(() => setCheckinMsg(null), 3000)
    return () => clearTimeout(t)
  }, [checkinMsg])

  const filtered = members.filter(m =>
    m.active && (
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.document_number?.includes(search) ||
      m.phone?.includes(search)
    )
  )

  const checkedInIds = new Set(attendance.map(a => a.member_id))

  async function handleCheckIn(memberId, name) {
    try {
      await checkIn(memberId)
      setCheckinMsg({ type: 'success', text: 'Check-in: ' + name })
    } catch {
      setCheckinMsg({ type: 'error', text: 'Error al registrar ' + name })
    }
  }

  const formatDate = (d) => {
    const dt = new Date(d)
    return dt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Asistencia</h3>
          <p className="font-body text-white/40 text-xs mt-1">{attendance.length} check-in{attendance.length !== 1 ? 's' : ''} hoy</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-body text-white/50 text-xs">{stats?.total || 0} en 30 dias</span>
          </div>
        </div>
      </div>

      <div className="relative mb-6 max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined text-lg">search</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar miembro..." className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Miembros activos</h4>
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-3xl text-white/20 mb-2">search</span>
              <p className="font-body text-white/30 text-xs">No se encontraron miembros</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filtered.map(m => {
                const checked = checkedInIds.has(m.id)
                return (
                  <div key={m.id} className={'flex items-center justify-between p-3 rounded-xl transition-all ' + (checked ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5 hover:bg-white/[0.07]')}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' + (checked ? 'bg-green-500/20' : 'bg-white/10')}>
                        <span className={'material-symbols-outlined text-sm ' + (checked ? 'text-green-400' : 'text-white/40')}>{checked ? 'check' : 'person'}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-white text-sm truncate">{m.full_name}</p>
                        <p className="font-body text-white/30 text-2xs">{m.document_type} {m.document_number}{m.phone ? ' . ' + m.phone : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {checked ? (
                        <span className="font-mono text-2xs text-green-400">{formatDate(attendance.find(a => a.member_id === m.id)?.check_in)}</span>
                      ) : (
                        <button onClick={() => handleCheckIn(m.id, m.full_name)} className="bg-primary text-surface-dark font-body font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-all">
                          Check-in
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-surface-card border border-white/5 rounded-2xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Registro de hoy</h4>
          {attendance.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-3xl text-white/20 mb-2">qr_code_scanner</span>
              <p className="font-body text-white/30 text-xs">Sin registros hoy</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {attendance.map(a => (
                <div key={a.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body font-semibold text-white text-xs truncate">{a.members?.full_name}</p>
                    <p className="font-body text-white/30 text-2xs">{a.members?.document_number || ''}</p>
                  </div>
                  <span className="font-mono text-2xs text-white/50 flex-shrink-0">{formatDate(a.check_in)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {checkinMsg && (
        <div className={'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg font-body text-sm transition-all animate-fade-in ' + (checkinMsg.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30')}>
          <span className="material-symbols-outlined text-sm">{checkinMsg.type === 'success' ? 'check_circle' : 'error'}</span>
          {checkinMsg.text}
        </div>
      )}
    </div>
  )
}
