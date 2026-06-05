import { useState, useEffect } from 'react'
import * as authModel from '../models/auth.model'
import * as profileModel from '../models/profile.model'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authModel.getSession().then(session => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: listener } = authModel.onAuthChange(session => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    try {
      const p = await profileModel.getProfile(userId)
      setProfile(p)
    } catch { setProfile(null) }
  }

  async function login(email, password) {
    return authModel.signIn(email, password)
  }

  async function register(email, password, fullName) {
    return authModel.signUp(email, password, fullName)
  }

  async function logout() {
    await authModel.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.role === 'admin'
  const isSecretary = profile?.role === 'secretaria'
  const canManage = isAdmin || isSecretary

  return { user, profile, loading, isAdmin, isSecretary, canManage, login, register, logout }
}
