import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Eye, EyeOff, FileCheck, Lock, Mail, UserRound } from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../auth/AuthContext'

function getError(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { error?: string } } })?.response
  return response?.data?.error || fallback
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [accepted, setAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setSuccess('')
    if (!form.fullName.trim()) return setError('Vui lòng nhập họ và tên.')
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError('Vui lòng nhập email hợp lệ.')
    if (form.password.length < 12) return setError('Mật khẩu phải có ít nhất 12 ký tự.')
    if (form.password !== form.confirmPassword) return setError('Mật khẩu xác nhận không trùng khớp.')
    if (!accepted) return setError('Bạn cần đồng ý với điều khoản sử dụng.')
    setLoading(true)
    try { await register(form.fullName, form.email, form.password); setSuccess('Tạo tài khoản thành công. Bạn sẽ được chuyển đến trang đăng nhập.'); setTimeout(() => navigate('/login'), 900) }
    catch (requestError) { setError(getError(requestError, 'Không thể tạo tài khoản. Vui lòng thử lại.')) }
    finally { setLoading(false) }
  }

  return <div className="auth-page min-h-screen bg-[#f6f7f4] text-[#172033] font-sans flex">
    <section className="auth-story hidden lg:flex lg:w-[45%] min-h-screen flex-col justify-between p-12 xl:p-16 bg-[#173f9f] text-white relative overflow-hidden"><div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'linear-gradient(120deg, transparent 0 52%, rgba(255,255,255,.12) 52% 53%, transparent 53%), linear-gradient(35deg, transparent 0 68%, rgba(255,255,255,.08) 68% 69%, transparent 69%)' }} /><div className="relative z-10"><BrandLogo onDark /></div><div className="relative z-10 max-w-xl py-10"><p className="text-xs uppercase tracking-[.18em] text-blue-200 mb-6">Hồ sơ học thuật số</p><h1 className="text-4xl xl:text-5xl font-medium tracking-[-.04em] leading-[1.08]">Bắt đầu hồ sơ đáng tin của bạn.</h1><p className="mt-6 text-base leading-7 text-blue-100">Tài khoản mới được cấp quyền Sinh viên và có thể sử dụng các tính năng xác thực sau khi đăng nhập.</p><div className="mt-10 grid gap-3 max-w-md"><div className="auth-feature"><CheckCircle2 /><div><strong>Đăng ký an toàn</strong><span>Mật khẩu được băm BCrypt trước khi lưu</span></div><small>01</small></div><div className="auth-feature"><FileCheck /><div><strong>Quyền rõ ràng</strong><span>Tài khoản công khai chỉ nhận role STUDENT</span></div><small>02</small></div></div></div><div className="relative z-10 border-t border-white/20 pt-5 text-xs text-blue-200">EduCertify · 2026</div></section>
    <section className="flex-1 min-h-screen flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16"><div className="w-full max-w-[460px]"><div className="lg:hidden mb-10"><BrandLogo /></div><div className="mb-8"><h2 className="text-3xl font-medium tracking-[-.035em]">Tạo tài khoản</h2><p className="mt-2 text-sm text-[#667085]">Đăng ký tài khoản sinh viên trên EduCertify</p></div>
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}{success && <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
      <form onSubmit={submit} className="space-y-4" noValidate><Input label="Họ và tên" placeholder="Nguyễn Văn A" value={form.fullName} onChange={update('fullName')} icon={<UserRound className="w-5 h-5" />} required autoComplete="name" /><Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} icon={<Mail className="w-5 h-5" />} required autoComplete="email" /><Input label="Mật khẩu" type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 12 ký tự" value={form.password} onChange={update('password')} icon={<Lock className="w-5 h-5" />} rightIcon={showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} onRightIconClick={() => setShowPassword((value) => !value)} required autoComplete="new-password" /><Input label="Xác nhận mật khẩu" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={update('confirmPassword')} icon={<Lock className="w-5 h-5" />} rightIcon={showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} onRightIconClick={() => setShowConfirm((value) => !value)} required autoComplete="new-password" /><label className="flex items-start gap-2 text-sm text-slate-600"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" /> <span>Tôi đồng ý với điều khoản sử dụng của EduCertify.</span></label><Button type="submit" size="lg" className="w-full justify-center" isLoading={loading}><span>Tạo tài khoản</span><ArrowRight className="w-4 h-4" /></Button></form><p className="mt-7 text-center text-sm text-slate-600">Đã có tài khoản? <Link to="/login" className="font-semibold text-blue-700 hover:underline">Đăng nhập</Link></p>
    </div></section></div>
}
