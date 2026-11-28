import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getPortalMenu, type NavItem } from '../../navigation';
import BrandLogo from './BrandLogo';

export default function PortalHeader() {
  const { user, ready, hasRole, logout } = useAuth();
  const { main, account } = getPortalMenu(hasRole);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<'account' | 'mobile' | null>(null);
  const closeMenu = () => setOpenMenu(null);

  const navigationLinks = main.map(({ href, name, icon: Icon, exact }) => (
    <NavLink
      key={href} to={href} end={exact} onClick={closeMenu}
      className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 xl:py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{name}</span>
    </NavLink>
  ));

  const extraAccountItems = account.filter((item) => !main.some((link) => link.href === item.href));
  const renderAccountLink = ({ href, name, icon: Icon }: NavItem) => (
    <Link key={href} to={href} onClick={closeMenu}
      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
      <Icon className="w-4 h-4 shrink-0" /> {name}
    </Link>
  );

  const loginLink = (
    <Link to="/login" onClick={closeMenu}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg">
      <LogIn className="w-4 h-4" /> Đăng nhập
    </Link>
  );

  const logoutButton = (
    <button type="button" onClick={() => { closeMenu(); logout(); navigate('/login'); }}
      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
      <LogOut className="w-4 h-4" /> Đăng xuất
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs"
      onKeyDown={(event) => { if (event.key === 'Escape') closeMenu(); }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/home" onClick={closeMenu} aria-label="Trang chủ EduCertify" className="shrink-0">
            <BrandLogo showTagline={false} />
          </Link>
          <nav aria-label="Điều hướng chính" className="hidden xl:flex items-center gap-1">
            {navigationLinks}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {ready && !user && loginLink}
          {user && (
            <div className="relative">
              <button type="button" aria-label="Menu người dùng" aria-expanded={openMenu === 'account'}
                onClick={() => setOpenMenu(openMenu === 'account' ? null : 'account')}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50">
                <span className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center">
                  {user.fullName.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col text-left max-w-32">
                  <span className="truncate text-sm font-semibold text-slate-900">{user.fullName}</span>
                  <span className="truncate text-[10px] text-slate-500">{user.email}</span>
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
              {openMenu === 'account' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={closeMenu} />
                  <div className="absolute right-0 mt-2 z-20 w-56 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500 break-words">{user.email}</p>
                      <p className="text-xs text-blue-700">{user.roles.map((role) => role.name).join(', ')}</p>
                    </div>
                    {account.map(renderAccountLink)}
                    {logoutButton}
                  </div>
                </>
              )}
            </div>
          )}
          <button type="button" aria-label="Mở menu" aria-expanded={openMenu === 'mobile'}
            onClick={() => setOpenMenu('mobile')} className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {openMenu === 'mobile' && (
        <div className="fixed inset-x-0 top-0 h-dvh z-50 xl:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeMenu} />
          <div className="absolute top-0 right-0 w-72 max-w-full h-full overflow-auto bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-slate-100">
              <BrandLogo showTagline={false} />
              <button type="button" aria-label="Đóng menu" onClick={closeMenu}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <nav aria-label="Điều hướng di động" className="flex-1 p-3 space-y-1">{navigationLinks}</nav>
            {ready && (
              <div className="p-3 border-t border-slate-100">
                {user ? <>{extraAccountItems.map(renderAccountLink)}{logoutButton}</> : loginLink}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
