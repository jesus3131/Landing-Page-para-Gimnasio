import { useState, useEffect, useCallback } from 'react'
import * as teamModel from '../models/team.model'

export default function useAdminTeam() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await teamModel.getAllTeam()
      setTeam(data || [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(fields) {
    await teamModel.createTeamMember(fields)
    await load()
  }

  async function update(id, fields) {
    await teamModel.updateTeamMember(id, fields)
    setTeam(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t))
  }

  async function remove(id) {
    await teamModel.deleteTeamMember(id)
    setTeam(prev => prev.filter(t => t.id !== id))
  }

  return { team, loading, create, update, remove, refresh: load }
}
