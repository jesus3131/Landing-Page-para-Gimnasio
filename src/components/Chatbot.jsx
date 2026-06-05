import { useState } from 'react'

const steps = [
  {
    id: 'welcome',
    bot: '¡Hola! Soy el asistente de ZONAFIT. ¿En qué puedo ayudarte?',
    options: [
      { label: 'Quiero inscribirme', next: 'inscripcion' },
      { label: 'Horarios y precios', next: 'info' },
      { label: 'Hablar con un asesor', next: 'asesor' },
    ],
  },
  {
    id: 'inscripcion',
    bot: '¡Excelente decisión! Para inscribirte necesitamos algunos datos. ¿Prefieres que te contactemos por WhatsApp?',
    options: [
      { label: 'Sí, envíame a WhatsApp', next: 'whatsapp' },
      { label: 'Ver planes primero', next: 'planes' },
      { label: 'Volver al inicio', next: 'welcome' },
    ],
  },
  {
    id: 'info',
    bot: 'Estamos abiertos de Lunes a Viernes 6am — 11pm, Sábados 7am — 8pm y Domingos 8am — 2pm.\n\nTenemos planes desde $29/mes. ¿Te gustaría que un asesor te dé más detalles?',
    options: [
      { label: 'Sí, contáctame', next: 'whatsapp' },
      { label: 'Ver planes', next: 'planes' },
      { label: 'Volver al inicio', next: 'welcome' },
    ],
  },
  {
    id: 'planes',
    bot: 'Ofrecemos 3 planes:\n\n• Básico $29/mes — Acceso al gym, 5 clases\n• Profesional $49/mes — Ilimitado + Piscina & Spa\n• Premium $79/mes — 24/7 + Entrenador personal\n\n¿Te interesa alguno?',
    options: [
      { label: 'Sí, quiero contratar', next: 'whatsapp' },
      { label: 'Más información', next: 'asesor' },
      { label: 'Volver al inicio', next: 'welcome' },
    ],
  },
  {
    id: 'asesor',
    bot: 'Uno de nuestros asesores te atenderá por WhatsApp. ¿Listo para empezar?',
    options: [
      { label: 'Sí, ir a WhatsApp', next: 'whatsapp' },
      { label: 'Volver al inicio', next: 'welcome' },
    ],
  },
  {
    id: 'whatsapp',
    bot: '¡Te esperamos en ZONAFIT! Te redirigimos a WhatsApp para continuar.',
    isFinal: true,
  },
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState('welcome')
  const [history, setHistory] = useState([])
  const step = steps.find(s => s.id === currentStep)

  function handleOption(option) {
    setHistory(prev => [...prev, { user: option.label, bot: step.bot }])
    if (option.next === 'whatsapp') {
      const phone = '521234567890'
      const msg = encodeURIComponent('¡Hola! Quiero más información sobre ZONAFIT.')
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
      setCurrentStep('welcome')
      setHistory([])
      setOpen(false)
      return
    }
    setCurrentStep(option.next)
  }

  function resetChat() {
    setCurrentStep('welcome')
    setHistory([])
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-surface-card border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden animate-slide-up">
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-surface-dark rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
              </div>
              <div>
                <p className="font-body font-semibold text-surface-dark text-sm">Asistente ZONAFIT</p>
                <p className="font-body text-surface-dark/60 text-2xs">Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-surface-dark/60 hover:text-surface-dark">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="p-4 h-80 overflow-y-auto space-y-3">
            {history.length > 0 && history.map((h, i) => (
              <div key={i}>
                <div className="flex justify-end mb-2">
                  <div className="bg-primary/20 text-white font-body text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
                    {h.user}
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-surface-dark/50 text-white/80 font-body text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%] leading-relaxed whitespace-pre-line">
              {step.bot}
            </div>
          </div>

          <div className="p-4 border-t border-white/5 space-y-2">
            {step.isFinal ? (
              <button
                onClick={resetChat}
                className="w-full bg-primary text-surface-dark font-body font-semibold text-sm py-2.5 rounded-xl hover:bg-primary-hover transition-colors"
              >
                Volver a empezar
              </button>
            ) : (
              step.options.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleOption(opt)}
                  className="w-full text-left bg-surface-dark/50 hover:bg-surface-dark text-white/80 hover:text-white font-body text-sm px-4 py-2.5 rounded-xl border border-white/5 hover:border-primary/30 transition-all"
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-black/30 hover:scale-110 transition-transform duration-200"
        aria-label="Abrir chat"
      >
        <span className="material-symbols-outlined text-surface-dark text-2xl">
          {open ? 'close' : 'chat'}
        </span>
      </button>
    </>
  )
}
