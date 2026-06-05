import { useState, useCallback } from 'react'
import { submitContactMessage as submit } from '../models/contact.model'

export default function useContact() {
  const [status, setStatus] = useState('idle')

  const submitContact = useCallback(async (formData) => {
    setStatus('loading')
    try {
      await submit(formData)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 4000)
      return true
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
      return false
    }
  }, [])

  return { status, submitContact }
}
