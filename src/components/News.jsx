import useNews from '../controllers/useNews'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function News() {
  const { news } = useNews()

  return (
    <section id="noticias" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-20" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Noticias</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            NOTICIAS Y NOVEDADES
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Mantente al día con todo lo que sucede en ZonaFit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-surface-card border border-white/5 rounded-3xl overflow-hidden scroll-reveal hover:border-white/20 transition-all duration-500 group"
            >
              {item.image_url && (
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 lg:p-7">
                <div className="flex items-center gap-2 mb-3">
                  {item.date && (
                    <span className="font-body text-white/40 text-xs">{formatDate(item.date)}</span>
                  )}
                  {item.author && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="font-body text-white/40 text-xs">{item.author}</span>
                    </>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors duration-300">{item.title}</h3>

                {item.summary && (
                  <p className="font-body text-white/50 text-sm leading-relaxed">{item.summary}</p>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-primary text-sm mt-4 hover:text-primary-hover transition-colors"
                  >
                    Leer más
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
