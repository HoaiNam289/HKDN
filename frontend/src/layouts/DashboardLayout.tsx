import React, { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  LogOut,
  ChevronRight,
  User,
  Bell,
  Home,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import BrandLogo from '../components/common/BrandLogo';

/**
 * Route name mapping for Vietnamese breadcrumbs
 */
const ROUTE_NAME_MAP: Record<string, string> = {
  dashboard: 'Tổng quan',
  certificates: 'Chứng chỉ',
  materials: 'Học liệu',
  users: 'Người dùng',
  verify: 'Xác thực',
  create: 'Tạo mới',
  edit: 'Chỉnh sửa',
  details: 'Chi tiết',
};

const STORAGE_KEY = 'hkdn_sidebar_collapsed';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load initial collapsed state from localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Toggle collapsed state and persist to localStorage
  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch (error) {
        console.error('Không thể lưu trạng thái thanh bên:', error);
      }
      return next;
    });
  };

  // Build breadcrumbs dynamically from current pathname
  const breadcrumbs = useMemo(() => {
    const rawSegments = location.pathname.split('/').filter(Boolean);

    // If root or empty, fallback to dashboard
    if (rawSegments.length === 0) {
      return [
        {
          label: 'Tổng quan',
          href: '/dashboard',
          isLast: true,
        },
      ];
    }

    const items: Array<{ label: string; href: string; isLast: boolean }> = [];
    let accumulatedPath = '';

    rawSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const mappedLabel =
        ROUTE_NAME_MAP[segment.toLowerCase()] ||
        decodeURIComponent(segment);

      items.push({
        label: mappedLabel,
        href: accumulatedPath,
        isLast: index === rawSegments.length - 1,
      });
    });

    return items;
  }, [location.pathname]);

  // Handle logout (UI only, no token clearing per specifications)
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Container - shifts according to desktop sidebar width */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          {/* Header Left: Hamburger (mobile/tablet) & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Mở trình đơn điều hướng"
              title="Mở trình đơn"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            {/* Compact brand in the responsive header */}
            <Link to="/dashboard" className="shrink-0" aria-label="EduCertify - Xác thực chứng chỉ & học liệu số">
              <BrandLogo showTagline={false} />
            </Link>

            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Đường dẫn điều hướng"
              className="flex items-center text-sm font-medium text-slate-600 truncate"
            >
              <ol className="flex items-center space-x-1.5 sm:space-x-2 truncate">
                <li className="flex items-center">
                  <Link
                    to="/dashboard"
                    className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                    title="Trang chủ Tổng quan"
                  >
                    <Home className="w-4 h-4" />
                    <span className="sr-only">Trang chủ</span>
                  </Link>
                </li>

                {breadcrumbs.map((crumb) => (
                  <li key={crumb.href} className="flex items-center space-x-1.5 sm:space-x-2 truncate">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    {crumb.isLast ? (
                      <span
                        className="text-slate-900 font-semibold truncate"
                        aria-current="page"
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="text-slate-500 hover:text-blue-600 transition-colors truncate"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Header Right: User Info, Avatar, and Logout */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Notification indicator (optional decorative element) */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Thông báo"
              title="Thông báo hệ thống (Dữ liệu minh họa)"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* User Profile Card (Mock Data) */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center ring-2 ring-blue-100 shadow-xs select-none shrink-0"
                title="Nguyễn Quản Trị"
              >
                NQ
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="text-sm font-semibold text-slate-900">
                    Nguyễn Quản Trị
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <User className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                    Admin
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Dữ liệu minh họa
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button (UI only, no token clearing) */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all cursor-pointer ml-1 sm:ml-2"
              title="Đăng xuất khỏi hệ thống"
              aria-label="Đăng xuất"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600 transition-colors" />
              <span className="hidden md:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
