import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import BrandLogo from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Local form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Validation errors state
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Input change handlers - clear individual error on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Form submit validation (UI only - no API calls or fake authentication)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);

    // If validation passes without errors, navigate to dashboard
    if (Object.keys(newErrors).length === 0) {
      navigate('/dashboard');
    }
  };

  // Quick fill demo credentials for reviewer convenience
  const handleFillDemo = () => {
    setEmail('admin@educertify.edu.vn');
    setPassword('123456');
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] font-sans antialiased text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
      {/* ========================================================= */}
      {/* LEFT PANEL (DESKTOP: 60% Width, Gradient & Decorative UI) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:w-[60%] flex-col justify-between p-10 xl:p-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient glowing circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Section */}
        <div className="relative z-10">
          <BrandLogo onDark />
        </div>

        {/* Center Hero Information & Visual Overlapping Cards */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-blue-100 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nền tảng Quản lý &amp; Xác thực Minh bạch</span>
          </div>

          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hệ thống Xác thực Chứng chỉ và Học liệu số
          </h1>
          <p className="mt-4 text-base xl:text-lg text-blue-100/90 leading-relaxed font-normal">
            Bảo đảm tính toàn vẹn dữ liệu, chống giả mạo văn bằng chứng chỉ và chữ ký số học liệu theo tiêu chuẩn giáo dục số.
          </p>

          {/* Overlapping Glassmorphism Cards */}
          <div className="mt-10 space-y-4">
            {/* Card 1: Certificate Verification */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 shadow-xl transition-all duration-300 hover:bg-white/15">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/30 border border-white/20 text-white shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white truncate">
                      Xác thực Chứng chỉ Tức thì
                    </h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Blockchain
                    </span>
                  </div>
                  <p className="text-sm text-blue-100/80 mt-1 line-clamp-2">
                    Tra cứu nguồn gốc, mã số định danh duy nhất và chữ ký phân tán của từng văn bằng chứng chỉ.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Digital Materials (Overlapping offset) */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 shadow-xl sm:ml-6 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/30 border border-white/20 text-white shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white truncate">
                      Học liệu Số Có Chữ Ký Điện Tử
                    </h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/30">
                      Bảo toàn vẹn
                    </span>
                  </div>
                  <p className="text-sm text-blue-100/80 mt-1 line-clamp-2">
                    Quản lý phiên bản bài giảng, giáo trình với cơ chế băm bảo mật ngăn chặn mọi sửa đổi trái phép.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info / Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/80 pt-6 border-t border-white/15">
          <span>© 2026 Hệ thống EduCertify. Bản quyền thuộc về cơ sở giáo dục.</span>
          <span className="font-medium bg-white/10 px-2 py-0.5 rounded">
            Dữ liệu minh họa
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL (DESKTOP: 40% Width | MOBILE: FULL WIDTH)     */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Top Header Banner with Gradient */}
          <div className="lg:hidden w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 rounded-2xl text-white mb-8 shadow-md relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
            <div className="relative">
              <BrandLogo onDark />
            </div>
          </div>

          {/* Form Header */}
          <div className="text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Đăng nhập
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Vui lòng nhập thông tin tài khoản
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              placeholder="admin@educertify.edu.vn"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5 text-slate-400" />}
              required
              autoComplete="email"
            />

            {/* Password Field with Eye/EyeOff toggle */}
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5 text-slate-400" />}
              rightIcon={
                showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )
              }
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              required
              autoComplete="current-password"
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600"
                />
                <span className="text-slate-600">Ghi nhớ đăng nhập</span>
              </label>

              <a
                href="#forgot-password"
                onClick={(e) => e.preventDefault()}
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-md shadow-blue-500/20 cursor-pointer font-semibold"
              >
                Đăng nhập
              </Button>
            </div>
          </form>

          {/* Illustrative Demo Box */}
          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Tài khoản mẫu thử nghiệm
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Dữ liệu minh họa
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Nhấn vào thẻ bên dưới để tự động điền tài khoản quản trị viên và đăng nhập:
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-lg text-xs font-medium text-slate-700 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-blue-600 font-medium">admin@educertify.edu.vn</span>
              </div>
              <span className="font-mono text-slate-400 group-hover:text-blue-500">123456</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
