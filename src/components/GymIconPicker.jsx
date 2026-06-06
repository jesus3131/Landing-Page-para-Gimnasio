import { useState } from 'react'

const ICONS = [
  { name: 'fitness_center', keywords: ['gym', 'pesas', 'mancuernas', 'fuerza'] },
  { name: 'exercise', keywords: ['ejercicio', 'entrenamiento'] },
  { name: 'self_improvement', keywords: ['yoga', 'meditacion', 'mente', 'bienestar'] },
  { name: 'accessibility_new', keywords: ['accesibilidad', 'pilates', 'flexibilidad'] },
  { name: 'directions_bike', keywords: ['bicicleta', 'spinning', 'cardio', 'ciclismo'] },
  { name: 'sports_kabaddi', keywords: ['boxeo', 'lucha', 'box', 'combate'] },
  { name: 'monitoring', keywords: ['estadisticas', 'progreso', 'grafico', 'rendimiento'] },
  { name: 'personal_injury', keywords: ['entrenador', 'coach', 'personal'] },
  { name: 'groups', keywords: ['grupo', 'clases', 'grupales', 'equipo'] },
  { name: 'group_add', keywords: ['unirse', 'miembros', 'invitar'] },
  { name: 'schedule', keywords: ['horario', 'reloj', 'tiempo', 'hora'] },
  { name: 'event', keywords: ['evento', 'calendario', 'fecha'] },
  { name: 'calendar_month', keywords: ['calendario', 'agenda', 'mes'] },
  { name: 'restaurant', keywords: ['nutricion', 'comida', 'dieta', 'alimentacion'] },
  { name: 'restaurant_menu', keywords: ['menu', 'comida', 'nutricion'] },
  { name: 'water_drop', keywords: ['agua', 'hidratacion', 'drop'] },
  { name: 'hotel', keywords: ['descanso', 'recuperacion', 'sueno'] },
  { name: 'bedtime', keywords: ['dormir', 'descanso', 'noche'] },
  { name: 'favorite', keywords: ['favorito', 'like', 'corazon', 'me gusta'] },
  { name: 'stars', keywords: ['beneficios', 'estrella', 'destacado'] },
  { name: 'emoji_events', keywords: ['trofeo', 'logro', 'meta', 'objetivo'] },
  { name: 'military_tech', keywords: ['medalla', 'insignia', 'logro'] },
  { name: 'trending_up', keywords: ['progreso', 'mejora', 'crecimiento', 'ascenso'] },
  { name: 'trending_down', keywords: ['perdida', 'descenso', 'peso'] },
  { name: 'local_fire_department', keywords: ['fuego', 'intenso', 'quemar', 'calorias'] },
  { name: 'whatshot', keywords: ['caliente', 'fuego', 'popular'] },
  { name: 'energy_savings_leaf', keywords: ['energia', 'ahorro', 'naturaleza'] },
  { name: 'heart_plus', keywords: ['salud', 'corazon', 'cardio', 'medico'] },
  { name: 'monitor_heart', keywords: ['ritmo', 'cardiaco', 'pulso', 'salud'] },
  { name: 'pulse', keywords: ['pulso', 'ritmo', 'cardiaco', 'latido'] },
  { name: 'scale', keywords: ['peso', 'bascula', 'medida'] },
  { name: 'height', keywords: ['altura', 'estatura', 'medida'] },
  { name: 'straighten', keywords: ['medir', 'regla', 'dimension'] },
  { name: 'run_circle', keywords: ['correr', 'running', 'cardio'] },
  { name: 'directions_run', keywords: ['correr', 'sprint', 'running'] },
  { name: 'stadium', keywords: ['estadio', 'deporte', 'cancha'] },
  { name: 'pool', keywords: ['piscina', 'natacion', 'aqua'] },
  { name: 'kayaking', keywords: ['remo', 'agua', 'cardio'] },
  { name: 'skateboarding', keywords: ['skate', 'equilibrio'] },
  { name: 'sports_score', keywords: ['puntaje', 'score', 'marcador'] },
  { name: 'counter_1', keywords: ['numero', 'contador'] },
  { name: 'music_note', keywords: ['musica', 'ritmo', 'cancion'] },
  { name: 'headphones', keywords: ['audifonos', 'musica'] },
  { name: 'volume_up', keywords: ['volumen', 'sonido', 'musica'] },
  { name: 'videocam', keywords: ['video', 'camara', 'grabar'] },
  { name: 'photo_camera', keywords: ['foto', 'camara', 'imagen'] },
  { name: 'play_circle', keywords: ['reproducir', 'video', 'inicio'] },
  { name: 'smart_display', keywords: ['pantalla', 'tv', 'monitor'] },
  { name: 'phone_iphone', keywords: ['telefono', 'app', 'movil'] },
  { name: 'laptop', keywords: ['computadora', 'laptop', 'pc'] },
  { name: 'devices', keywords: ['dispositivos', 'equipos'] },
  { name: 'shopping_cart', keywords: ['carrito', 'compras', 'tienda'] },
  { name: 'credit_card', keywords: ['pago', 'tarjeta', 'membresia'] },
  { name: 'payments', keywords: ['pagos', 'finanzas', 'precio'] },
  { name: 'qr_code_scanner', keywords: ['qr', 'codigo', 'escaneo'] },
  { name: 'verified', keywords: ['verificado', 'certificado', 'confiable'] },
  { name: 'badge', keywords: ['insignia', 'equipo', 'credencial'] },
  { name: 'workspace_premium', keywords: ['premium', 'pro', 'vip'] },
  { name: 'diamond', keywords: ['diamante', 'premium', 'exclusivo'] },
  { name: 'new_releases', keywords: ['nuevo', 'lanzamiento', 'noticia'] },
  { name: 'campaign', keywords: ['campaña', 'promocion', 'anuncio'] },
  { name: 'celebration', keywords: ['celebracion', 'fiesta', 'logro'] },
  { name: 'confirmation_number', keywords: ['boleto', 'ticket', 'entrada'] },
  { name: 'map', keywords: ['mapa', 'ubicacion', 'direccion'] },
  { name: 'location_on', keywords: ['ubicacion', 'direccion', 'lugar'] },
  { name: 'directions', keywords: ['como llegar', 'navegacion', 'ruta'] },
  { name: 'store', keywords: ['tienda', 'local', 'sucursal'] },
  { name: 'home', keywords: ['inicio', 'casa', 'principal'] },
  { name: 'info', keywords: ['informacion', 'info', 'detalle'] },
  { name: 'help', keywords: ['ayuda', 'soporte', 'pregunta'] },
  { name: 'support_agent', keywords: ['soporte', 'atencion', 'agente'] },
  { name: 'call', keywords: ['llamar', 'telefono', 'contacto'] },
  { name: 'chat', keywords: ['chat', 'mensaje', 'conversacion'] },
  { name: 'mail', keywords: ['correo', 'email', 'mensaje'] },
  { name: 'notifications', keywords: ['notificacion', 'alerta', 'aviso'] },
  { name: 'announcement', keywords: ['anuncio', 'comunicado', 'aviso'] },
  { name: 'article', keywords: ['articulo', 'noticia', 'blog'] },
  { name: 'newspaper', keywords: ['noticias', 'periodico', 'prensa'] },
  { name: 'book', keywords: ['libro', 'guia', 'manual'] },
  { name: 'school', keywords: ['escuela', 'educacion', 'aprender'] },
  { name: 'menu_book', keywords: ['catalogo', 'menu', 'lista'] },
  { name: 'list', keywords: ['lista', 'orden', 'checklist'] },
  { name: 'checklist', keywords: ['checklist', 'lista', 'verificacion'] },
  { name: 'fact_check', keywords: ['verificar', 'comprobar', 'hecho'] },
  { name: 'task_alt', keywords: ['completado', 'tarea', 'listo'] },
  { name: 'edit', keywords: ['editar', 'modificar', 'cambiar'] },
  { name: 'settings', keywords: ['configuracion', 'ajustes', 'opciones'] },
  { name: 'admin_panel_settings', keywords: ['admin', 'panel', 'administracion'] },
  { name: 'manage_accounts', keywords: ['gestionar', 'cuenta', 'administrar'] },
  { name: 'security', keywords: ['seguridad', 'proteccion', 'escudo'] },
  { name: 'lock', keywords: ['candado', 'seguro', 'privado'] },
  { name: 'visibility', keywords: ['visible', 'ver', 'mostrar'] },
  { name: 'download', keywords: ['descargar', 'bajar'] },
  { name: 'upload', keywords: ['subir', 'cargar'] },
  { name: 'delete', keywords: ['eliminar', 'borrar', 'quitar'] },
  { name: 'restore', keywords: ['restaurar', 'recuperar', 'deshacer'] },
  { name: 'refresh', keywords: ['actualizar', 'recargar', 'refrescar'] },
  { name: 'search', keywords: ['buscar', 'lupa', 'explorar'] },
  { name: 'filter_list', keywords: ['filtro', 'filtrar', 'ordenar'] },
  { name: 'sort', keywords: ['ordenar', 'clasificar'] },
  { name: 'share', keywords: ['compartir', 'enviar'] },
  { name: 'link', keywords: ['enlace', 'link', 'url'] },
  { name: 'qr_code', keywords: ['qr', 'codigo'] },
  { name: 'photo_library', keywords: ['galeria', 'fotos', 'imagenes'] },
  { name: 'add_photo_alternate', keywords: ['agregar foto', 'subir imagen'] },
  { name: 'palette', keywords: ['paleta', 'color', 'diseno'] },
  { name: 'brush', keywords: ['pincel', 'editar', 'diseno'] },
]

export default function GymIconPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? ICONS.filter(i =>
        i.name.includes(search.toLowerCase()) ||
        i.keywords.some(k => k.includes(search.toLowerCase()))
      )
    : ICONS

  return (
    <div>
      {label && <label className="font-body text-white/40 text-2xs uppercase tracking-wider block mb-1">{label}</label>}

      <div className="flex gap-2">
        <div
          onClick={() => setOpen(true)}
          className="flex-1 flex items-center gap-3 bg-surface-dark border border-white/10 rounded-xl px-4 py-2.5 cursor-pointer hover:border-white/20 transition-colors"
        >
          {value ? (
            <>
              <span className="material-symbols-outlined text-primary text-lg">{value}</span>
              <span className="font-body text-white text-sm">{value}</span>
            </>
          ) : (
            <span className="font-body text-white/30 text-sm">Seleccionar icono...</span>
          )}
          <span className="material-symbols-outlined text-white/30 text-sm ml-auto">arrow_drop_down</span>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-2 rounded-xl border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-surface-card border border-white/10 rounded-3xl p-5 w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-lg text-white">Seleccionar icono</h4>
              <button onClick={() => setOpen(false)} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
                <span className="material-symbols-outlined text-white/60 text-sm">close</span>
              </button>
            </div>

            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined text-lg">search</span>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar icono..."
                className="w-full bg-surface-dark border border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-6 gap-2 overflow-y-auto flex-1 min-h-0 pb-1">
              {filtered.map(icon => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => { onChange(icon.name); setOpen(false) }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    value === icon.name
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'hover:bg-white/10 text-white/70 border border-transparent'
                  }`}
                  title={icon.name}
                >
                  <span className="material-symbols-outlined text-lg">{icon.name}</span>
                  <span className="font-mono text-2xs truncate w-full text-center">{icon.name}</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="font-body text-white/40 text-sm text-center py-8">No se encontraron iconos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}