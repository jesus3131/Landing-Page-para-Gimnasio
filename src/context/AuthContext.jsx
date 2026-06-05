import { createContext, useContext } from 'react'
import useAuthController from '../controllers/useAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useAuthController()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
