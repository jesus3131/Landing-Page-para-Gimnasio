import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
      return
    }
  }, [])

  return null
}
