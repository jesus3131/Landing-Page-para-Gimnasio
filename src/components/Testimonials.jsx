import useTestimonials from '../controllers/useTestimonials'

export default function Testimonials() {
  const { testimonials } = useTestimonials()

  return (
    <section id="testimonios" className="relative py-24 lg:py-32 bg-surface-card/50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Testimonios</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            LO QUE DICEN<br />
            NUESTROS ATLETAS
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Historias reales de personas que transformaron su vida en ZONAFIT.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-surface-card border border-white/5 rounded-3xl p-8 lg:p-10 scroll-reveal">
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[#f4a261] text-base">star</span>
                ))}
              </div>
              <p className="font-body text-white/60 text-sm leading-relaxed mb-8 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-surface-elevated to-surface-dark flex items-center justify-center text-white font-body font-semibold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="font-body font-semibold text-white text-sm">{t.author}</p>
                  <p className="font-body text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
