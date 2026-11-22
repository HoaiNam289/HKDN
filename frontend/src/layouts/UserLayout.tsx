import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Award,
  BookOpen,
  User,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';
import { useAuth } from '../auth/AuthContext';

/**
 * User Layout — Giao diện riêng cho sinh viên / người dùng.
 * Tách biệt hoàn toàn với DashboardLayout (Admin).
 */

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Trang chủ', href: '/home', icon: Home, exact: true },
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'Chứng chỉ', href: '/student/certificates', icon: Award },
  { name: 'Học liệu', href: '/student/materials', icon: BookOpen },
  { name: 'Xác thực', href: '/verify', icon: ShieldCheck },
];

const UserLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link to="/home" className="shrink-0" aria-label="EduCertify">
                <BrandLogo showTagline={false} />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right: Profile + Mobile toggle */}
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  title={user?.fullName}
                  aria-label="Menu người dùng"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-xs">
                    {(user?.fullName || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-900 leading-tight">{user?.fullName}</span>
                    <span className="text-[10px] text-slate-500">{user?.email}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1.5 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <User className="w-2.5 h-2.5" />
                          Sinh viên
                        </span>
                      </div>
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => { setIsProfileOpen(false); navigate('/student/profile'); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Thông tin cá nhân
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsProfileOpen(false); navigate('/student/dashboard'); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </button>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Mở menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
              <BrandLogo showTagline={false} />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.exact}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); navigate('/student/profile'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
                Thông tin cá nhân
              </button>
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <BrandLogo showTagline />
              <p className="mt-3 text-xs text-slate-500 leading-5 max-w-xs">
                Nền tảng xác thực chứng chỉ và học liệu số ứng dụng công nghệ chữ ký số và Blockchain.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li><Link to="/home" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">Trang chủ</Link></li>
                <li><Link to="/verify" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">Xác thực chứng chỉ</Link></li>
                <li><Link to="/student/certificates" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">Chứng chỉ của tôi</Link></li>
                <li><Link to="/student/materials" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">Thư viện học liệu</Link></li>
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Công nghệ</h4>
              <ul className="space-y-2">
                <li><span className="text-xs text-slate-500">Chữ ký số PKI</span></li>
                <li><span className="text-xs text-slate-500">Blockchain Ethereum</span></li>
                <li><span className="text-xs text-slate-500">Smart Contract</span></li>
                <li><span className="text-xs text-slate-500">Mã hóa SHA-256</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Liên hệ</h4>
              <ul className="space-y-2">
                <li><span className="text-xs text-slate-500">support@educertify.edu.vn</span></li>
                <li><span className="text-xs text-slate-500">(028) 1234 5678</span></li>
                <li><span className="text-xs text-slate-500">TP. Hồ Chí Minh, Việt Nam</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              © 2024 EduCertify — Hệ thống Xác thực Chứng chỉ và Học liệu số
            </p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400">Hệ thống hoạt động</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
