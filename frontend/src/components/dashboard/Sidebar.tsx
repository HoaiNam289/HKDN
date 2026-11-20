import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  {
    name: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Chứng chỉ',
    href: '/dashboard/certificates',
    icon: Award,
  },
  {
    name: 'Học liệu',
    href: '/dashboard/materials',
    icon: BookOpen,
  },
  {
    name: 'Người dùng',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'Xác thực',
    href: '/verify',
    icon: ShieldCheck,
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();

  // Close mobile sidebar automatically on route changes
  useEffect(() => {
    if (isMobileOpen) {
      onMobileClose();
    }
  }, [location.pathname, isMobileOpen, onMobileClose]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Đóng thanh điều hướng"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              onMobileClose();
            }
          }}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        } ${
          isMobileOpen
            ? 'translate-x-0 w-[260px] shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top section: Brand / Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <NavLink
              to="/dashboard"
              className={`flex items-center gap-3 overflow-hidden ${
                isCollapsed ? 'lg:justify-center lg:w-full' : ''
              }`}
            >
              <BrandLogo
                compact={isCollapsed && !isMobileOpen}
                showTagline={!isCollapsed || isMobileOpen}
              />
            </NavLink>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onMobileClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 space-y-1.5" aria-label="Menu chính">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <div key={item.href} className="relative group">
                  <NavLink
                    to={item.href}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                        isCollapsed && !isMobileOpen
                          ? 'justify-center mx-2 px-0'
                          : 'px-3 mx-3'
                      } ${
                        isActive || isItemActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                    title={isCollapsed && !isMobileOpen ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0 stroke-[2]" />

                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </NavLink>

                  {/* Tooltip on hover when collapsed on desktop */}
                  {isCollapsed && !isMobileOpen && (
                    <div
                      role="tooltip"
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50"
                    >
                      {item.name}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom section: Collapse/expand toggle button */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onToggle}
            className={`hidden lg:flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            aria-label={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-500 stroke-[2]" />
            ) : (
              <>
                <span className="text-xs font-medium text-slate-600 truncate">
                  Thu gọn thanh bên
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-400 stroke-[2]" />
              </>
            )}
          </button>

          {/* Collapsed indicator label or system tag */}
          {(!isCollapsed || isMobileOpen) && (
            <div className="mt-2 px-3 pt-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hệ thống EduCertify</span>
              <span className="bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                v1.0
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
