import { useState, useEffect } from 'react'
import { getBenefits } from '../models/benefits.model'

export default function useBenefits() {
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBenefits()
      .then(data => setBenefits(data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { benefits, loading }
}
