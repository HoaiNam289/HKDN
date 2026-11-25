import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import BrandLogo from '../components/common/BrandLogo';
import PortalHeader from '../components/common/PortalHeader';
import { getPortalMenu } from '../navigation';

const UserLayout: React.FC = () => {
  const { hasRole } = useAuth();
  const { main } = getPortalMenu(hasRole);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased">
      <PortalHeader />

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
                {main.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
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
