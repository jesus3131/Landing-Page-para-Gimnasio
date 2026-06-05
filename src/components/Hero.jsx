import { useEffect, useState, useRef } from 'react'

function useCountUp(end, duration = 2000) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = performance.now()
          const step = (now) => {
            const t = Math.min((now - start) / duration, 1)
            setValue(Math.floor(t * end))
            if (t < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { value, ref }
}

export default function Hero() {
  const { value: members, ref: membersRef } = useCountUp(3000)
  const { value: years, ref: yearsRef } = useCountUp(15)
  const { value: trainers, ref: trainersRef } = useCountUp(10)

  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Gimnasio moderno"
          className="w-full h-full object-cover scale-105 animate-[ken-burns_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)]" />
      </div>

      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-mono font-medium mb-6 animate-[fadeInDown_0.8s_ease-out]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
            Nuevo horario extendido 6am — 11pm
          </div>

          <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-6">
            <span className="text-white inline-block animate-[fadeInUp_0.8s_ease-out]">TRANSFORMA TU CUERPO,</span>
            <br />
            <span className="text-primary inline-block animate-[fadeInUp_0.8s_ease-out_0.2s] relative">
              SUPERA TUS LÍMITES
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full blur-sm" />
            </span>
          </h1>

          <p className="font-body text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mb-10 animate-[fadeInUp_0.8s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
            Entrena con los mejores equipos, entrenadores certificados y planes personalizados diseñados para tus objetivos.
          </p>

          <div className="flex flex-wrap gap-4 animate-[fadeInUp_0.8s_ease-out_0.6s] opacity-0 [animation-fill-mode:forwards]">
            <a
              href="#planes"
              className="relative bg-primary text-surface-dark font-body font-semibold text-sm px-8 py-4 rounded-xl hover:bg-primary-hover transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              Empieza Hoy
            </a>
            <a
              href="#contacto"
              className="relative border border-white/30 text-white font-body font-semibold text-sm px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              Prueba Gratis
            </a>
          </div>

          <div className="flex gap-8 sm:gap-14 mt-14 animate-[fadeInUp_0.8s_ease-out_0.8s] opacity-0 [animation-fill-mode:forwards]">
            <div ref={membersRef}>
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-white">+{members}</p>
              <p className="font-body text-white/50 text-xs sm:text-sm">Miembros activos</p>
            </div>
            <div ref={yearsRef}>
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-white">+{years}</p>
              <p className="font-body text-white/50 text-xs sm:text-sm">Años de experiencia</p>
            </div>
            <div ref={trainersRef}>
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-white">+{trainers}</p>
              <p className="font-body text-white/50 text-xs sm:text-sm">Entrenadores</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
