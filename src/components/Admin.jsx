import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import ImageField from './ImageField'
import useAdminMessages from '../controllers/useAdminMessages'
import useAdminGallery from '../controllers/useAdminGallery'
import useAdminUsers from '../controllers/useAdminUsers'
import useAdminBenefits from '../controllers/useAdminBenefits'
import useAdminServices from '../controllers/useAdminServices'
import useAdminCoaches from '../controllers/useAdminCoaches'
import useAdminTeam from '../controllers/useAdminTeam'
import useAdminEvents from '../controllers/useAdminEvents'
import useAdminNews from '../controllers/useAdminNews'

export default function Admin({ onLogout }) {
  const { profile, isAdmin, hasPermission, logout: authLogout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

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

  const can = (perm) => isAdmin || hasPermission(perm)

  const stats = [
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

  const loading = msgLoading || imgLoading || usrLoading || coachesLoading || teamLoading || eventsLoading || newsLoading

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

      <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
        <h3 className="font-heading font-bold text-lg text-white mb-4">Acceso rápido</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => onNavigate('messages')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">mail</span>
            <div><p className="font-body font-semibold text-white text-sm">Revisar mensajes</p><p className="font-body text-white/40 text-xs">Gestiona las solicitudes de contacto</p></div>
          </button>
          <button onClick={() => onNavigate('gallery')} className="flex items-center gap-3 bg-white/5 hover:bg-primary/10 rounded-xl p-4 transition-colors text-left">
            <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
            <div><p className="font-body font-semibold text-white text-sm">Subir imágenes</p><p className="font-body text-white/40 text-xs">Actualiza la galería del sitio</p></div>
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
    catch { alert('Error al eliminar') }
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
    catch { alert('Error al eliminar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Equipos de última generación' },
    { key: 'description', label: 'Descripción', placeholder: 'Descripción del beneficio' },
    { key: 'icon', label: 'Icono (Material Symbol)', placeholder: 'Ej: fitness_center' },
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
          {fields.map(f => (
            f.type === 'image' ? (
              <ImageField key={f.key} value={newData[f.key] || ''} onChange={v => setNewData(p => ({ ...p, [f.key]: v }))} label={f.label} />
            ) : (
              <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
            )
          ))}
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
    catch { alert('Error al eliminar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Musculación' },
    { key: 'description', label: 'Descripción', placeholder: 'Descripción del servicio' },
    { key: 'icon', label: 'Icono (Material Symbol)', placeholder: 'Ej: fitness_center' },
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
                    {s.image_url && (
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
            <div key={img.id} className="bg-surface-card border border-white/5 rounded-2xl overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
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
    catch { alert('Error al eliminar') }
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
    catch { alert('Error al eliminar') }
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
  const [newData, setNewData] = useState({ title: '', description: '', date: '', time: '', location: '', image_url: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(e) {
    setEditingId(e.id)
    setEditData({ title: e.title, description: e.description || '', date: e.date || '', time: e.time || '', location: e.location || '', image_url: e.image_url || '', active: e.active })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.title) return
    try { await create(newData); setShowNew(false); setNewData({ title: '', description: '', date: '', time: '', location: '', image_url: '' }) }
    catch { alert('Error al crear') }
  }

  async function handleDelete(id) {
    try { await remove(id); setConfirmId(null) }
    catch { alert('Error al eliminar') }
  }

  const fields = [
    { key: 'title', label: 'Título', placeholder: 'Ej: Torneo de CrossFit' },
    { key: 'description', label: 'Descripción', placeholder: 'Descripción del evento', area: true },
    { key: 'date', label: 'Fecha (YYYY-MM-DD)', placeholder: '2026-07-15' },
    { key: 'time', label: 'Hora', placeholder: '09:00' },
    { key: 'location', label: 'Ubicación', placeholder: 'ZonaFit Montería' },
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
                    {e.image_url && (
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
    catch { alert('Error al eliminar') }
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
