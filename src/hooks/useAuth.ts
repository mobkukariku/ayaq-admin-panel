import { useState, useEffect } from 'react'
import { authApi } from '../api/auth'
import type { TokenPayload } from '../api/auth'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [payload, setPayload] = useState<TokenPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    authApi.getPayload(token)
      .then(res => setPayload(res.data))
      .catch(() => logout())
  }, [token])

  async function login(email: string, password: string) {
    setError('')
    setLoading(true)
    try {
      const { data } = await authApi.login({ email, password })
      localStorage.setItem('token', data.authToken)
      setToken(data.authToken)
      return true
    } catch {
      setError('Неверный email или пароль')
      return false
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setPayload(null)
  }

  const isAuthenticated = !!token

  return { token, payload, isAuthenticated, loading, error, login, logout }
}
