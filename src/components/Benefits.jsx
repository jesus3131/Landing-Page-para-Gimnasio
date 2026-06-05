import useBenefits from '../controllers/useBenefits'

export default function Benefits() {
  const { benefits } = useBenefits()

  return (
    <section id="beneficios" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-30" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Beneficios</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            TODO LO QUE OFRECEMOS
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Instalaciones, equipo y acompañamiento para que tu transformación sea completa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group relative bg-surface-card/80 backdrop-blur border border-white/10 rounded-3xl overflow-hidden scroll-reveal hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
            >
              {benefit.image_url && (
                <div className="absolute inset-0">
                  <img src={benefit.image_url} alt={benefit.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                </div>
              )}

              <div className="relative p-6 lg:p-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform duration-300">{benefit.icon}</span>
                </div>

                <h3 className="font-heading font-bold text-sm text-white mb-2.5 leading-snug group-hover:text-primary transition-colors duration-300">{benefit.title}</h3>
                <p className="font-body text-white/50 text-xs leading-relaxed group-hover:text-white/70 transition-colors duration-300">{benefit.description}</p>

                {(benefit.stat && benefit.stat !== '—') && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="font-heading font-black text-lg text-primary">{benefit.stat}</p>
                    <p className="font-body text-white/40 text-2xs uppercase tracking-wider">{benefit.stat_label}</p>
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
