import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import DashboardLayout from './layouts/DashboardLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CertificatesPage from './pages/CertificatesPage'
import MaterialsPage from './pages/MaterialsPage'
import UsersPage from './pages/UsersPage'
import VerifyPage from './pages/VerifyPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Trang xác thực công khai */}
        <Route path="/verify" element={<VerifyPage />} />

        {/* Dashboard với layout chung */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Mặc định chuyển đến trang đăng nhập */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
