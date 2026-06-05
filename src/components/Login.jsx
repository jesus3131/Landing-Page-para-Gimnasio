import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onClose }) {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await register(email, password, fullName)
      } else {
        await login(email, password)
      }
      onClose?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-white">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="font-body text-white/70 text-sm mb-1 block">Nombre completo</label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Tu nombre" required
              />
            </div>
          )}

          <div>
            <label className="font-body text-white/70 text-sm mb-1 block">Correo electrónico</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="correo@ejemplo.com" required
            />
          </div>

          <div>
            <label className="font-body text-white/70 text-sm mb-1 block">Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Mínimo 6 caracteres" minLength={6} required
            />
          </div>

          {error && <p className="font-body text-red-400 text-sm">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-surface-dark font-body font-semibold text-sm py-3.5 rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50"
          >
            {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <p className="font-body text-white/40 text-sm text-center mt-5">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline">
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  )
}
