import useEvents from '../controllers/useEvents'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Events() {
  const { events } = useEvents()

  return (
    <section id="eventos" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-20" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Eventos</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            PRÓXIMOS EVENTOS
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            No te pierdas las actividades, talleres y competencias que tenemos preparadas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-surface-card border border-white/5 rounded-3xl overflow-hidden scroll-reveal hover:border-primary/30 transition-all duration-500 group"
            >
              {event.image_url && (
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 lg:p-7">
                <div className="flex items-center gap-3 mb-4">
                  {event.date && (
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                      <span className="font-body text-white/60 text-xs">{formatDate(event.date)}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                      <span className="font-body text-white/60 text-xs">{event.time.slice(0, 5)}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors duration-300">{event.title}</h3>
                <p className="font-body text-white/50 text-sm leading-relaxed mb-4">{event.description}</p>

                {event.location && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-white/30 text-sm">location_on</span>
                    <span className="font-body text-white/40 text-xs">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
