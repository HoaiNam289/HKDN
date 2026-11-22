import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Eye, EyeOff, FileCheck, Lock, Mail, ShieldCheck } from 'lucide-react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import BrandLogo from '../components/common/BrandLogo'
import { useAuth } from '../auth/AuthContext'

function getError(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { error?: string } } })?.response
  return response?.data?.error || fallback
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Vui lòng nhập email hợp lệ.')
    if (!password) return setError('Vui lòng nhập mật khẩu.')
    setLoading(true)
    try {
      const user = await login(email, password)
      const from = (location.state as { from?: string } | null)?.from
      if (from) navigate(from, { replace: true })
      else if (user.roles.some((role) => role.code === 'ADMIN')) navigate('/dashboard', { replace: true })
      else if (user.roles.some((role) => role.code === 'STUDENT')) navigate('/student/dashboard', { replace: true })
      else navigate('/home', { replace: true })
    } catch (requestError) {
      setError(getError(requestError, 'Email hoặc mật khẩu không đúng.'))
    } finally { setLoading(false) }
  }

  return <div className="auth-page min-h-screen bg-[#f6f7f4] text-[#172033] font-sans flex">
    <section className="auth-story hidden lg:flex lg:w-[53%] min-h-screen flex-col justify-between p-12 xl:p-16 bg-[#173f9f] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(120deg, transparent 0 52%, rgba(255,255,255,.12) 52% 53%, transparent 53%), linear-gradient(35deg, transparent 0 68%, rgba(255,255,255,.08) 68% 69%, transparent 69%)' }} />
      <div className="relative z-10"><BrandLogo onDark /></div>
      <div className="relative z-10 max-w-xl py-10">
        <p className="text-xs uppercase tracking-[.18em] text-blue-200 mb-6">Hồ sơ học thuật số</p>
        <h1 className="text-4xl xl:text-5xl font-medium tracking-[-.04em] leading-[1.08]">Mỗi chứng chỉ có một lịch sử đáng tin.</h1>
        <p className="mt-6 text-base leading-7 text-blue-100 max-w-lg">EduCertify giúp cơ sở giáo dục phát hành, lưu trữ và xác thực chứng chỉ cùng học liệu số trong một hồ sơ minh bạch.</p>
        <div className="mt-12 grid gap-3 max-w-md"><div className="auth-feature"><CheckCircle2 /><div><strong>Xác thực tức thì</strong><span>Đối chiếu mã định danh và chữ ký số trong vài giây</span></div><small>01</small></div><div className="auth-feature"><FileCheck /><div><strong>Học liệu có nguồn gốc</strong><span>Giữ lịch sử phiên bản và bằng chứng toàn vẹn</span></div><small>02</small></div></div>
      </div>
      <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-5 text-xs text-blue-200"><span>EduCertify · 2026</span><span>Hệ thống xác thực số</span></div>
    </section>
    <section className="flex-1 min-h-screen flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16"><div className="w-full max-w-[420px]">
      <div className="lg:hidden mb-12"><BrandLogo /></div>
      <div className="mb-9"><div className="auth-kicker"><ShieldCheck /> Cổng quản trị</div><h2 className="mt-5 text-3xl font-medium tracking-[-.035em]">Đăng nhập hệ thống</h2><p className="mt-2 text-sm text-[#667085]">Quản lý chứng chỉ, học liệu và các phiên xác thực</p></div>
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-5" noValidate>
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} icon={<Mail className="w-5 h-5" />} required autoComplete="email" />
        <Input label="Mật khẩu" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} icon={<Lock className="w-5 h-5" />} rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} onRightIconClick={() => setShowPassword((value) => !value)} required autoComplete="current-password" />
        <button type="button" className="text-sm text-blue-700 hover:underline" onClick={() => setForgotMessage('Tính năng khôi phục mật khẩu chưa được triển khai.')}>Quên mật khẩu?</button>
        {forgotMessage && <p className="text-xs text-amber-700">{forgotMessage}</p>}
        <Button type="submit" size="lg" className="w-full justify-center auth-submit" isLoading={loading}><span>Đăng nhập</span><ArrowRight className="w-4 h-4" /></Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">Chưa có tài khoản? <Link to="/register" className="font-semibold text-blue-700 hover:underline">Đăng ký ngay</Link></p>
    </div></section>
  </div>
}
