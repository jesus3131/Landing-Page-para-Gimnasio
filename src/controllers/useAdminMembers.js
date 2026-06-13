import { useState, useEffect, useCallback } from 'react'
import * as membersModel from '../models/members.model'
import * as subscriptionsModel from '../models/subscriptions.model'

export default function useAdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await membersModel.getAllMembers()
      setMembers(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await membersModel.createMember(fields)
    await load()
  }

  async function update(id, fields) {
    await membersModel.updateMember(id, fields)
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...fields } : m))
  }

  async function remove(id) {
    await membersModel.deleteMember(id)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  async function createSubscription(fields) {
    const sub = await subscriptionsModel.createSubscription(fields)
    return sub
  }

  async function updateSubscription(id, fields) {
    await subscriptionsModel.updateSubscription(id, fields)
  }

  async function cancelSubscription(id) {
    await subscriptionsModel.cancelSubscription(id)
  }

  return { members, loading, create, update, remove, createSubscription, updateSubscription, cancelSubscription, refresh: load }
}
