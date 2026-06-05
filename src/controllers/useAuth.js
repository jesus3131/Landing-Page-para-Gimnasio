import { useState, useEffect, useCallback } from 'react'
import * as authModel from '../models/auth.model'
import * as profileModel from '../models/profile.model'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPermissions = useCallback(async (userId) => {
    try {
      const perms = await profileModel.getUserPermissions(userId)
      setPermissions(perms)
    } catch { setPermissions([]) }
  }, [])

  useEffect(() => {
    authModel.getSession().then(session => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        loadPermissions(session.user.id)
      }
      setLoading(false)
    })

    const { data: listener } = authModel.onAuthChange(session => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
        loadPermissions(session.user.id)
      } else {
        setProfile(null)
        setPermissions([])
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    try {
      const p = await profileModel.getProfile(userId)
      if (p?.disabled) {
        await authModel.signOut()
        setUser(null)
        setProfile(null)
        throw new Error('Cuenta deshabilitada. Contacta al administrador.')
      }
      setProfile(p)
    } catch (e) {
      if (e.message === 'Cuenta deshabilitada. Contacta al administrador.') throw e
      setProfile(null)
    }
  }

  async function login(email, password) {
    const result = await authModel.signIn(email, password)
    if (result?.user) {
      try {
        const p = await profileModel.getProfile(result.user.id)
        if (p?.disabled) {
          await authModel.signOut()
          throw new Error('Cuenta deshabilitada. Contacta al administrador.')
        }
        setProfile(p)
        loadPermissions(result.user.id)
      } catch (e) {
        if (e.message === 'Cuenta deshabilitada. Contacta al administrador.') throw e
      }
    }
    return result
  }

  async function register(email, password, fullName) {
    return authModel.signUp(email, password, fullName)
  }

  async function logout() {
    await authModel.signOut()
    setUser(null)
    setProfile(null)
    setPermissions([])
  }

  const hasPermission = useCallback((perm) => {
    if (profile?.role === 'admin') return true
    return permissions.includes(perm)
  }, [profile, permissions])

  const isAdmin = profile?.role === 'admin'
  const isSecretary = profile?.role === 'secretaria'
  const canManage = isAdmin || isSecretary || hasPermission('admin.access')

  return { user, profile, permissions, loading, isAdmin, isSecretary, canManage, hasPermission, login, register, logout }
}
