import useContact from '../controllers/useContact'

const contactInfo = [
  { icon: 'call', label: 'Teléfono', value: '+52 55 1234 5678' },
  { icon: 'mail', label: 'Correo', value: 'hola@zonafit.mx' },
  { icon: 'location_on', label: 'Ubicación', value: 'Av. Reforma 245, Col. Juárez, CDMX' },
]

export default function Contact() {
  const { status, submitContact } = useContact()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const ok = await submitContact({
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    })
    if (ok) form.reset()
  }

  return (
    <section id="contacto" className="relative py-24 lg:py-32 bg-surface-card/50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">Contacto</p>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            ¿LISTO PARA COMENZAR?
          </h2>
          <p className="font-body text-white/50 text-base max-w-xl mx-auto mt-4">
            Contáctanos y descubre cómo ZONAFIT puede transformar tu rutina.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          <div className="space-y-8">
            {contactInfo.map((info) => (
              <div key={info.icon} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{info.icon}</span>
                </div>
                <div>
                  <p className="font-mono text-white/40 text-2xs uppercase tracking-wider mb-1">{info.label}</p>
                  <p className="font-body text-white font-semibold text-sm">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="name" required placeholder="Nombre" className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            <input type="email" name="email" required placeholder="Email" className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            <input type="tel" name="phone" placeholder="Teléfono" className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            <textarea name="message" required placeholder="Mensaje" rows={4} className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y" />
            <button
              type="submit" disabled={status === 'loading'}
              className="w-full bg-primary text-surface-dark font-body font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === 'loading' && 'Enviando...'}
              {status === 'success' && 'Mensaje enviado ✓'}
              {status === 'error' && 'Error al enviar'}
              {status === 'idle' && 'SOLICITAR INFORMACIÓN'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
