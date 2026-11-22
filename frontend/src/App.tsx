import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import UserLayout from './layouts/UserLayout'

// Admin Pages (giữ nguyên)
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CertificatesPage from './pages/CertificatesPage'
import MaterialsPage from './pages/MaterialsPage'
import UsersPage from './pages/UsersPage'
import VerifyPage from './pages/VerifyPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth, RequireRole } from './auth/RouteGuards'

// User Portal Pages (mới)
import HomePage from './pages/user/HomePage'
import StudentDashboard from './pages/user/StudentDashboard'
import MyCertificates from './pages/user/MyCertificates'
import MaterialLibrary from './pages/user/MaterialLibrary'
import UserProfile from './pages/user/UserProfile'

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* ========== Trang đăng nhập ========== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ========== Trang xác thực công khai (giữ nguyên) ========== */}
        <Route path="/verify" element={<VerifyPage />} />

        {/* ========== Trang chủ người dùng (công khai) ========== */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* ========== Student Portal (User Layout) ========== */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole roles={['STUDENT']} />}>
            <Route path="/student" element={<UserLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="certificates" element={<MyCertificates />} />
              <Route path="materials" element={<MaterialLibrary />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>
        </Route>

        {/* ========== Admin Dashboard (giữ nguyên) ========== */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole roles={['ADMIN']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="materials" element={<MaterialsPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        {/* ========== Mặc định ========== */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
