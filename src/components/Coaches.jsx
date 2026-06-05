import useCoaches from '../controllers/useCoaches'

export default function Coaches() {
  const { coaches } = useCoaches()

  return (
    <section id="coaches" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-20" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Entrenadores</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            COACHES PERSONALES
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Profesionales certificados listos para guiarte en cada paso de tu transformación.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-surface-card border border-white/5 rounded-3xl overflow-hidden scroll-reveal hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={coach.photo_url}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent" />
              </div>

              <div className="p-6 lg:p-8 -mt-16 relative">
                <h3 className="font-heading font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors duration-300">{coach.name}</h3>

                {coach.specialties && coach.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {coach.specialties.map((s, i) => (
                      <span key={i} className="font-mono text-2xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {coach.bio && (
                  <p className="font-body text-white/50 text-sm leading-relaxed">{coach.bio}</p>
                )}

                {coach.certifications && (
                  <p className="font-mono text-2xs text-white/30 mt-3">{coach.certifications}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
