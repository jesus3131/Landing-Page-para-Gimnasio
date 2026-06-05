import { useState, useMemo } from 'react'
import useGallery from '../controllers/useGallery'

export default function Gallery() {
  const { images } = useGallery()
  const [hovered, setHovered] = useState(null)
  const [filter, setFilter] = useState('Todas')
  const [lightbox, setLightbox] = useState(null)

  const categories = useMemo(() => {
    const cats = [...new Set(images.map(i => i.category).filter(Boolean))]
    return ['Todas', ...cats]
  }, [images])

  const filtered = useMemo(
    () => filter === 'Todas' ? images : images.filter(i => i.category === filter),
    [images, filter]
  )

  return (
    <section id="galeria" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-12">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Galería</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            INSTALACIONES
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Espacios premium diseñados para tu rendimiento.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-mono text-xs px-4 py-2 rounded-full transition-all duration-300 ${
                filter === cat
                  ? 'bg-primary text-surface-dark font-semibold'
                  : 'bg-surface-card text-white/50 hover:text-white border border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
          {filtered.map((img, i) => (
            <div
              key={img.id || i}
              className="break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer scroll-reveal relative"
              onMouseEnter={() => setHovered(img.id || i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setLightbox(img)}
            >
              <img src={img.image_url} alt={img.alt} className="w-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" />

              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${hovered === (img.id || i) ? 'opacity-100' : 'opacity-0'}`} />

              <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${hovered === (img.id || i) ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                <p className="font-heading font-bold text-white text-lg">{img.title || 'ZONAFIT'}</p>
                <p className="font-body text-white/50 text-xs mt-1">{img.alt || img.category || ''}</p>
              </div>

              <div className={`absolute top-4 right-4 transition-all duration-500 ${hovered === (img.id || i) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                <div className="w-10 h-10 bg-primary/90 backdrop-blur rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface-dark text-lg">fullscreen</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-2xl">close</span>
          </button>

          <div className="max-w-5xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.alt} className="w-full h-full object-contain rounded-2xl" />
            <div className="text-center mt-4">
              <p className="font-heading font-bold text-xl text-white">{lightbox.title || 'ZONAFIT'}</p>
              <p className="font-body text-white/50 text-sm mt-1">{lightbox.alt || lightbox.category || ''}</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {filtered.map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => setLightbox(img)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  lightbox.id === img.id ? 'bg-primary w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
