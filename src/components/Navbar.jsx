import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#planes', label: 'Planes' },
  { href: '#coaches', label: 'Coaches' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar({ onLoginClick, onAdminClick }) {
  const { user, profile, canManage } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface-dark/95 backdrop-blur-md shadow-lg shadow-black/20 py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2.5">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#dfff00"/>
            <path d="M10 12h4v12h-4zM16 8h4v20h-4zM22 14h4v8h-4z" fill="#0d0d0d"/>
          </svg>
          <span className="text-white font-heading font-extrabold text-xl tracking-tight">ZONA<span className="text-primary">FIT</span></span>
        </a>

        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-white/70 hover:text-white font-body font-medium text-sm transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
          {canManage && (
            <li>
              <button onClick={onAdminClick} className="text-primary font-body font-medium text-sm hover:text-primary-hover transition-colors">
                Admin
              </button>
            </li>
          )}
          {user ? (
            <li className="flex items-center gap-3">
              <span className="text-white/40 font-body text-xs">{profile?.full_name}</span>
              <a href="#contacto" className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
                Únete Ahora
              </a>
            </li>
          ) : (
            <li className="flex items-center gap-3">
              <button onClick={onLoginClick} className="text-white/50 hover:text-white font-body text-sm transition-colors">
                Iniciar sesión
              </button>
              <a href="#contacto" className="bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
                Únete Ahora
              </a>
            </li>
          )}
        </ul>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      <div
        className={`lg:hidden absolute left-0 w-full bg-surface-dark/98 backdrop-blur-md border-t border-white/10 shadow-2xl shadow-black/40 transition-all duration-300 origin-top ${
          menuOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible pointer-events-none scale-y-0'
        }`}
        style={{ top: '100%', maxHeight: 'calc(100dvh - 3.5rem)', overflowY: 'auto' }}
      >
        <ul className="flex flex-col p-6 gap-5">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu} className="text-white/80 hover:text-white font-body font-medium text-base transition-colors block py-1">
                {link.label}
              </a>
            </li>
          ))}
          {canManage && (
            <li>
              <button onClick={() => { closeMenu(); onAdminClick() }} className="text-primary font-body font-medium text-base hover:text-primary-hover transition-colors w-full text-left py-1">
                Panel Admin
              </button>
            </li>
          )}
          <li className="border-t border-white/5 pt-4">
            {user ? (
              <span className="text-white/40 font-body text-sm block mb-3">Hola, {profile?.full_name}</span>
            ) : (
              <button onClick={() => { closeMenu(); onLoginClick() }} className="font-body text-white/50 hover:text-white text-sm transition-colors w-full text-left mb-3">
                Iniciar sesión
              </button>
            )}
            <a href="#contacto" onClick={closeMenu} className="inline-block bg-primary text-surface-dark font-body font-semibold text-sm px-5 py-3 rounded-xl text-center w-full hover:bg-primary-hover transition-all">
              Únete Ahora
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
