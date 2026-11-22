import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  TrendingUp,
  Link as LinkIcon,
} from 'lucide-react';
import { mockCurrentStudent, mockStudentCertificates, mockRecentActivities } from '../../data/mockStudentData';
import { useAuth } from '../../auth/AuthContext';

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  verified: { label: 'Đã xác thực', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  valid: { label: 'Hợp lệ', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  pending: { label: 'Chờ duyệt', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  revoked: { label: 'Đã thu hồi', bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const student = { ...mockCurrentStudent, fullName: user?.fullName ?? '', email: user?.email ?? '' };
  const certs = mockStudentCertificates;
  const verifiedCount = certs.filter((c) => c.status === 'verified' || c.status === 'valid').length;
  const pendingCount = certs.filter((c) => c.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      {/* Demo indicator */}
      <div className="mb-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Dữ liệu minh họa — Chưa kết nối API thực tế</span>
      </div>

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Xin chào, {student.fullName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {student.department} · MSSV: {student.studentId}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <TrendingUp className="w-3 h-3" />
              <span>+2</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{certs.length}</div>
          <p className="text-xs text-slate-500 mt-1">Tổng chứng chỉ</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{verifiedCount}</div>
          <p className="text-xs text-slate-500 mt-1">Đã xác thực</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">6</div>
          <p className="text-xs text-slate-500 mt-1">Học liệu có thể truy cập</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
          <p className="text-xs text-slate-500 mt-1">Đang chờ duyệt</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Certificates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Chứng chỉ gần đây</h2>
            <Link
              to="/student/certificates"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {certs.slice(0, 3).map((cert) => {
              const status = statusConfig[(cert.status || 'verified').toLowerCase()] || statusConfig.verified;
              const StatusIcon = status.icon;
              return (
                <div key={cert.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{cert.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{cert.issuerName}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{formatDate(cert.issueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.text} shrink-0`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Thao tác nhanh</h2>
            <div className="space-y-2.5">
              <Link
                to="/verify"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group"
              >
                <ShieldCheck className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Xác thực chứng chỉ</p>
                  <p className="text-[11px] text-blue-500">Kiểm tra tính hợp lệ</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/student/materials"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors group"
              >
                <BookOpen className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Thư viện học liệu</p>
                  <p className="text-[11px] text-violet-500">Truy cập tài liệu số</p>
                </div>
                <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/student/certificates"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors group"
              >
                <Award className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Chứng chỉ của tôi</p>
                  <p className="text-[11px] text-emerald-500">Xem và quản lý</p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Hoạt động gần đây</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {mockRecentActivities.slice(0, 4).map((activity) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                  certificate_received: Award,
                  material_accessed: FileText,
                  certificate_pending: Clock,
                  verification: ShieldCheck,
                };
                const colorMap: Record<string, string> = {
                  certificate_received: 'bg-emerald-50 text-emerald-600',
                  material_accessed: 'bg-blue-50 text-blue-600',
                  certificate_pending: 'bg-amber-50 text-amber-600',
                  verification: 'bg-violet-50 text-violet-600',
                };
                const Icon = iconMap[activity.type] || FileText;
                const color = colorMap[activity.type] || 'bg-slate-50 text-slate-600';

                return (
                  <div key={activity.id} className="px-6 py-3.5 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{activity.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Blockchain Status</h3>
                <p className="text-[11px] text-blue-200">Trạng thái xác thực</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200">Đã ghi trên chain</span>
                <span className="font-bold">{verifiedCount}/{certs.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(verifiedCount / certs.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-blue-200 mt-1">
                {pendingCount > 0 ? `${pendingCount} chứng chỉ đang chờ xác nhận` : 'Tất cả đã được xác thực'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
