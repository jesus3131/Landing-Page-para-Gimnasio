import { useState, useEffect, useCallback, useMemo } from 'react'
import * as profileModel from '../models/profile.model'

export default function useAdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await profileModel.getAllProfiles()
      setUsers(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  async function changeRole(userId, newRole) {
    try {
      await profileModel.updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (e) { throw e }
  }

  async function createUser({ email, password, full_name, role }) {
    const result = await profileModel.createUser({ email, password, full_name, role })
    await loadUsers()
    return result
  }

  async function toggleDisabled(userId, disabled) {
    await profileModel.updateUserDisabled(userId, disabled)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, disabled } : u))
  }

  async function getUserPermissions(userId) {
    return profileModel.getUserPermissions(userId)
  }

  async function setPermission(userId, permission) {
    await profileModel.setUserPermission(userId, permission)
  }

  async function removePermission(userId, permission) {
    await profileModel.removeUserPermission(userId, permission)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u =>
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q)
    )
  }, [users, search])

  const adminCount = users.filter(u => u.role === 'admin').length
  const secretaryCount = users.filter(u => u.role === 'secretaria').length
  const userCount = users.filter(u => u.role === 'usuario').length
  const disabledCount = users.filter(u => u.disabled).length

  return { users: filtered, allUsers: users, loading, search, setSearch, changeRole, createUser, toggleDisabled, getUserPermissions, setPermission, removePermission, adminCount, secretaryCount, userCount, disabledCount }
}
