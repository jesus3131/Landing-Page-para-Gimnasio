import useServices from '../controllers/useServices'

export default function Services() {
  const { services } = useServices()

  return (
    <section id="servicios" className="relative py-24 lg:py-32 bg-surface-card/50 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-20" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Servicios</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            NUESTROS SERVICIOS
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Variedad de disciplinas para todos los niveles. Encuentra la que más se adapte a ti.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="group relative rounded-3xl overflow-hidden min-h-[360px] scroll-reveal cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <img
                src={service.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/40" />

              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />

              {service.tag && (
                <span className={`absolute top-5 left-5 z-10 font-mono text-2xs px-3 py-1 rounded-full uppercase tracking-wider ${service.tag_style || 'bg-primary/20 text-primary'} opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0`}>
                  {service.tag}
                </span>
              )}

              <div className="relative z-10 h-full flex flex-col justify-end p-7 lg:p-8">
                {service.icon && (
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-primary text-xl">{service.icon}</span>
                  </div>
                )}

                <h3 className="font-heading font-bold text-2xl text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>

                <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500">
                  <p className="font-body text-white/60 text-sm leading-relaxed pt-2 border-t border-white/10">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
