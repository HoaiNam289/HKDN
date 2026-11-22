import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Link as LinkIcon,
  Lock,
  FileCheck,
  Sparkles,
  Award,
  Users,
  Globe,
  Zap,
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="font-sans">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Nền tảng xác thực số hàng đầu Việt Nam</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Xác thực{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Chứng chỉ
              </span>{' '}
              và Học liệu số
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              EduCertify ứng dụng công nghệ chữ ký số PKI và Blockchain để đảm bảo
              tính xác thực, minh bạch và bất biến cho mọi chứng chỉ và tài liệu giáo dục.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/verify"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 text-base"
              >
                <ShieldCheck className="w-5 h-5" />
                Xác thực chứng chỉ
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/student/materials"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 text-base backdrop-blur-sm"
              >
                <BookOpen className="w-5 h-5" />
                Khám phá học liệu
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {[
                { label: 'Chứng chỉ đã cấp', value: '1,247+' },
                { label: 'Lượt xác thực', value: '5,890+' },
                { label: 'Học liệu số', value: '856+' },
                { label: 'Người dùng', value: '3,400+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-blue-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" className="w-full h-14 text-[#F8FAFC]">
            <path d="M0 56V28C240 0 480 0 720 28C960 56 1200 56 1440 28V56H0Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* ===== TECHNOLOGY SECTION ===== */}
      <section className="py-20 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              Công nghệ nền tảng
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Bảo mật bởi Chữ ký số và Blockchain
            </h2>
            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
              Kết hợp hạ tầng khóa công khai (PKI) và sổ cái phi tập trung để tạo nên
              hệ thống xác thực không thể giả mạo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Chữ ký số PKI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mỗi chứng chỉ được ký bằng khóa riêng của tổ chức phát hành, đảm bảo nguồn gốc
                và tính toàn vẹn dữ liệu theo tiêu chuẩn RSA-2048/SHA-256.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-5">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Blockchain Ethereum</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mã băm (hash) của chứng chỉ được ghi nhận trên Blockchain qua hợp đồng thông minh,
                tạo bằng chứng bất biến không thể chỉnh sửa hay xóa bỏ.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Xác thực tức thì</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bất kỳ ai cũng có thể tra cứu và xác minh chứng chỉ trong vài giây
                thông qua mã định danh, mã QR hoặc tải lên file PDF gốc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Lợi ích cho mọi đối tượng
            </h2>
            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
              EduCertify phục vụ toàn bộ hệ sinh thái giáo dục — từ cơ sở đào tạo, giảng viên,
              sinh viên đến nhà tuyển dụng.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Sinh viên</h3>
              <ul className="space-y-2">
                {['Quản lý chứng chỉ tập trung', 'Chia sẻ xác thực dễ dàng', 'Truy cập học liệu mọi lúc'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Cơ sở đào tạo</h3>
              <ul className="space-y-2">
                {['Phát hành chứng chỉ số', 'Giảm gian lận bằng cấp', 'Quản lý học liệu an toàn'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Nhà tuyển dụng</h3>
              <ul className="space-y-2">
                {['Xác minh bằng cấp tức thì', 'Tra cứu công khai', 'Tiết kiệm thời gian kiểm tra'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Hệ thống</h3>
              <ul className="space-y-2">
                {['Bảo mật cấp doanh nghiệp', 'Dữ liệu bất biến', 'Minh bạch và tin cậy'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Bắt đầu xác thực chứng chỉ ngay hôm nay
          </h2>
          <p className="text-blue-100 text-base mb-8 max-w-xl mx-auto">
            Chỉ cần nhập mã chứng chỉ hoặc quét mã QR để kiểm tra tính hợp lệ trong vài giây.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
            >
              <ShieldCheck className="w-5 h-5" />
              Xác thực ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Đăng nhập hệ thống
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
