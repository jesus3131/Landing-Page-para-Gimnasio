import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import useAdminMessages from '../controllers/useAdminMessages'
import useAdminGallery from '../controllers/useAdminGallery'
import useAdminUsers from '../controllers/useAdminUsers'
import useAdminBenefits from '../controllers/useAdminBenefits'
import useAdminServices from '../controllers/useAdminServices'

export default function Admin() {
  const { profile, isAdmin, isSecretary, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (isSecretary && (activeTab === 'users' || activeTab === 'benefits' || activeTab === 'services')) setActiveTab('dashboard')
  }, [isSecretary, activeTab])

  if (!profile) return null

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'messages', label: 'Mensajes', icon: 'mail' },
    ...(isAdmin ? [{ id: 'benefits', label: 'Beneficios', icon: 'stars' }] : []),
    ...(isAdmin ? [{ id: 'services', label: 'Servicios', icon: 'fitness_center' }] : []),
    { id: 'gallery', label: 'Galería', icon: 'photo_library' },
    ...(isAdmin ? [{ id: 'users', label: 'Usuarios', icon: 'people' }] : []),
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
          {activeTab === 'gallery' && <GalleryPanel />}
          {activeTab === 'users' && <Users />}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onNavigate }) {
  const { isAdmin, isSecretary } = useAuth()
  const { messages, loading: msgLoading } = useAdminMessages()
  const { images, loading: imgLoading } = useAdminGallery()
  const { users, loading: usrLoading } = useAdminUsers()

  const stats = [
    {
      icon: 'mail', label: 'Mensajes', value: messages.length,
      sub: `${messages.filter(m => !m.read).length} sin leer`,
      color: 'bg-primary/10 text-primary', tab: 'messages',
    },
    ...(isAdmin ? [{
      icon: 'stars', label: 'Beneficios', value: '5',
      sub: 'Arrastra para reordenar',
      color: 'bg-amber-500/10 text-amber-400', tab: 'benefits',
    }] : []),
    ...(isAdmin ? [{
      icon: 'fitness_center', label: 'Servicios', value: '5',
      sub: 'Editar contenido',
      color: 'bg-green-500/10 text-green-400', tab: 'services',
    }] : []),
    {
      icon: 'photo_library', label: 'Galería', value: images.length,
      sub: `${images.length} imagen${images.length !== 1 ? 'es' : ''}`,
      color: 'bg-blue-500/10 text-blue-400', tab: 'gallery',
    },
    ...(isAdmin ? [{
      icon: 'people', label: 'Usuarios', value: users.length,
      sub: `${users.filter(u => u.role === 'admin').length} admin · ${users.filter(u => u.role === 'secretaria').length} secretaria`,
      color: 'bg-purple-500/10 text-purple-400', tab: 'users',
    }] : []),
  ]

  const loading = msgLoading || imgLoading || usrLoading

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
  const [newData, setNewData] = useState({ title: '', description: '', icon: '', stat: '', stat_label: '' })
  const [showNew, setShowNew] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  function startEdit(b) {
    setEditingId(b.id)
    setEditData({ title: b.title, description: b.description, icon: b.icon, stat: b.stat, stat_label: b.stat_label, active: b.active, sort_order: b.sort_order })
  }

  async function saveEdit(id) {
    try { await update(id, editData) }
    catch { alert('Error al guardar') }
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newData.title) return
    try { await create(newData); setShowNew(false); setNewData({ title: '', description: '', icon: '', stat: '', stat_label: '' }) }
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
            <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
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
                      {f.key === 'description' ? (
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
    { key: 'image_url', label: 'URL de imagen', placeholder: 'https://...' },
    { key: 'tag', label: 'Etiqueta', placeholder: 'Ej: Fuerza' },
    { key: 'tag_style', label: 'Estilo de etiqueta (Tailwind)', placeholder: 'bg-primary/20 text-primary' },
  ]

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

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
          {fields.map(f => (
            <input key={f.key} type="text" value={newData[f.key]} onChange={e => setNewData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary" />
          ))}
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
                      {f.key === 'description' ? (
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
    editingId, editTitle, setEditTitle, editCategory, setEditCategory,
    dragOver, setDragOver, fileRef, upload, handleDrop, remove,
    saveEdit, startEdit, cancelEdit,
  } = useAdminGallery()
  const [confirmId, setConfirmId] = useState(null)

  async function handleDelete(img) {
    try { await remove(img) }
    catch { alert('Error al eliminar') }
    setConfirmId(null)
  }

  return (
    <div>
      <h3 className="font-heading font-bold text-2xl text-white mb-6">Galería de imágenes</h3>

      <div
        className={`border-2 border-dashed rounded-2xl p-8 mb-8 text-center transition-all ${
          dragOver ? 'border-primary bg-primary/5' : 'border-white/10 bg-surface-card hover:border-white/20'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className="material-symbols-outlined text-4xl text-white/20 mb-3">{dragOver ? 'cloud_upload' : 'add_photo_alternate'}</span>
        <p className="font-body text-white/50 text-sm mb-4">
          {dragOver ? 'Suelta la imagen aquí' : 'Arrastra una imagen o selecciona desde el explorador'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="relative">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título (opcional)" className="bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary w-44" />
          </div>
          <input type="file" ref={fileRef} accept="image/*" onChange={upload} hidden />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50">
            {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
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
    </div>
  )
}

function Users() {
  const { users, allUsers, loading, search, setSearch, changeRole, adminCount, secretaryCount, userCount } = useAdminUsers()
  const [changingId, setChangingId] = useState(null)

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-2xl text-white">Usuarios</h3>
          <p className="font-body text-white/40 text-xs mt-1">
            {allUsers.length} total ·
            <span className="text-primary"> {adminCount} admin</span> ·
            <span className="text-blue-400"> {secretaryCount} secretaria</span> ·
            <span className="text-white/50"> {userCount} usuario</span>
          </p>
        </div>
      </div>

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
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Nombre</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">ID</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3 pr-4">Rol</th>
                <th className="font-body text-white/50 text-2xs uppercase tracking-wider py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-body font-semibold text-primary text-xs">{u.full_name?.charAt(0) || '?'}</span>
                      </div>
                      <p className="font-body text-white text-sm">{u.full_name || '—'}</p>
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
