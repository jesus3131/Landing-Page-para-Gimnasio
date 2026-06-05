const footerLinks = {
  Clases: ['CrossFit', 'Yoga', 'Spinning', 'HIIT', 'Pilates'],
  'El Gimnasio': ['Sobre nosotros', 'Entrenadores', 'Planes', 'Testimonios'],
  Ayuda: ['FAQ', 'Términos', 'Privacidad', 'Contacto'],
}

export default function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-white/5 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/5 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="#dfff00"/>
                <path d="M10 12h4v12h-4zM16 8h4v20h-4zM22 14h4v8h-4z" fill="#0d0d0d"/>
              </svg>
              <span className="text-white font-heading font-extrabold text-lg tracking-tight">ZONA<span className="text-primary">FIT</span></span>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed max-w-xs">
              Más que un gimnasio, un estilo de vida. Transformamos vidas a través del movimiento desde 2010.
            </p>
            <div className="flex gap-3 mt-6">
              {['FB', 'IG', 'TW', 'YT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 font-body text-xs hover:bg-primary hover:border-primary hover:text-surface-dark transition-all duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-body font-bold text-white text-sm mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-white/40 text-sm hover:text-primary transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center font-body text-white/20 text-xs">
          &copy; {new Date().getFullYear()} ZONAFIT. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
