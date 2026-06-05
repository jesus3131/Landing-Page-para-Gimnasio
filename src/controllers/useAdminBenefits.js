import { useState, useEffect, useCallback } from 'react'
import * as benefitsModel from '../models/benefits.model'

export default function useAdminBenefits() {
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await benefitsModel.getAllBenefits()
      setBenefits(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await benefitsModel.createBenefit(fields)
    await load()
  }

  async function update(id, fields) {
    await benefitsModel.updateBenefit(id, fields)
    setBenefits(prev => prev.map(b => b.id === id ? { ...b, ...fields } : b))
  }

  async function remove(id) {
    await benefitsModel.deleteBenefit(id)
    setBenefits(prev => prev.filter(b => b.id !== id))
  }

  return { benefits, loading, create, update, remove, refresh: load }
}
