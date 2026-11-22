import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, type RoleCode } from './AuthContext'

export function RequireAuth() {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <div className="min-h-screen bg-slate-50" aria-label="Đang khôi phục phiên đăng nhập" />
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

export function RequireRole({ roles }: { roles: RoleCode[] }) {
  const { user, hasRole } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return roles.some(hasRole) ? <Outlet /> : <Navigate to="/home" replace />
}
