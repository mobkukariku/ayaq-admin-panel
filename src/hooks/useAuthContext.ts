import { createContext, useContext } from 'react'
import type { TokenPayload } from '../api/auth'

export interface AuthContextValue {
  token: string | null
  payload: TokenPayload | null
  isAuthenticated: boolean
  loading: boolean
  error: string
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
