import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import api, { setAccessToken } from '../services/api'

export type RoleCode = 'ADMIN' | 'ISSUER' | 'STUDENT'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  enabled: boolean
  locked: boolean
  roles: Array<{ id: number; code: RoleCode; name: string }>
}

interface LoginResponse { accessToken: string; tokenType: string; expiresIn: number; user: AuthUser }
interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthUser>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (role: RoleCode) => boolean
  ready: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('educertify_access_token'))
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    const restore = async () => {
      if (!token) { setReady(true); return }
      setAccessToken(token)
      try {
        const response = await api.get<AuthUser>('/auth/me')
        if (active) setUser(response.data)
      } catch {
        if (active) {
          sessionStorage.removeItem('educertify_access_token')
          setToken(null)
          setAccessToken(null)
        }
      } finally { if (active) setReady(true) }
    }
    void restore()
    return () => { active = false }
  }, [token])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    ready,
    async login(email, password) {
      const response = await api.post<LoginResponse>('/auth/login', { email, password })
      setToken(response.data.accessToken)
      setAccessToken(response.data.accessToken)
      sessionStorage.setItem('educertify_access_token', response.data.accessToken)
      setUser(response.data.user)
      return response.data.user
    },
    async register(fullName, email, password) {
      await api.post('/auth/register', { fullName, email, password })
    },
    logout() {
      setToken(null)
      setUser(null)
      setAccessToken(null)
      sessionStorage.removeItem('educertify_access_token')
    },
    hasRole(role) { return user?.roles.some((item) => item.code === role) ?? false },
  }), [ready, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
