import { useState, useEffect, useCallback } from 'react'
import * as paymentsModel from '../models/payments.model'

export default function useAdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await paymentsModel.getAllPayments()
      setPayments(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await paymentsModel.createPayment(fields)
    await load()
  }

  async function update(id, fields) {
    await paymentsModel.updatePayment(id, fields)
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p))
  }

  async function remove(id) {
    await paymentsModel.deletePayment(id)
    setPayments(prev => prev.filter(p => p.id !== id))
  }

  return { payments, loading, create, update, remove, refresh: load }
}
