import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  Users,
  ShieldCheck,
  Eye,
  ArrowRight,
  Sparkles,
  Award,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import type { Certificate } from '../types/types';
import { mockStats, mockMonthlyData, mockCategoryData } from '../data/mockDashboard';
import { mockCertificates } from '../data/mockCertificates';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import StatCard from '../components/dashboard/StatCard';
import CertificateCard from '../components/certificates/CertificateCard';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
        <p className="font-semibold text-slate-800 mb-1.5 border-b border-slate-100 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, idx) => (
            <div key={`tooltip-item-${idx}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}:</span>
              </span>
              <span className="font-semibold text-slate-900">
                {entry.value.toLocaleString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // Take the first 5 certificates for the recent list
  const recentCertificates = mockCertificates.slice(0, 5);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const handleCopyTx = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
      case 'valid':
        return (
          <StatusBadge status="success" dot>
            Đã xác thực
          </StatusBadge>
        );
      case 'pending':
        return (
          <StatusBadge status="warning" dot>
            Chờ xử lý
          </StatusBadge>
        );
      case 'revoked':
        return (
          <StatusBadge status="danger" dot>
            Đã thu hồi
          </StatusBadge>
        );
      default:
        return <StatusBadge status="default">{status}</StatusBadge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <PageHeader
        title="Tổng quan hệ thống"
        description="Bảng điều khiển theo dõi số liệu cấp phát chứng chỉ, học liệu và hoạt động xác thực"
        action={
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Dữ liệu minh họa
            </span>
            <Link to="/dashboard/certificates">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Quản lý chứng chỉ
              </Button>
            </Link>
          </div>
        }
      />

      {/* Row 1: Stat Cards (4 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng chứng chỉ"
          value={mockStats.totalCertificates.toLocaleString('vi-VN')}
          icon={FileText}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Tổng học liệu"
          value={mockStats.totalMaterials.toLocaleString('vi-VN')}
          icon={BookOpen}
          trend={{ value: 8.3, isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Tổng người dùng"
          value={mockStats.totalUsers.toLocaleString('vi-VN')}
          icon={Users}
          trend={{ value: 15.2, isPositive: true }}
          color="violet"
        />
        <StatCard
          title="Đã xác thực"
          value={(mockStats.verifiedCertificates ?? 1089).toLocaleString('vi-VN')}
          icon={ShieldCheck}
          trend={{ value: 10.1, isPositive: true }}
          color="amber"
        />
      </div>

      {/* Row 2: Charts Section (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Chart: Monthly Statistics */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Thống kê theo tháng (Minh họa)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Số lượng chứng chỉ và học liệu phát hành qua các tháng trong năm
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              12 tháng
            </span>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockMonthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                  iconSize={10}
                />
                <Bar
                  dataKey="certificates"
                  name="Chứng chỉ"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="materials"
                  name="Học liệu"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Category Breakdown */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Phân loại chứng chỉ (Minh họa)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Phân bố số lượng chứng chỉ số theo từng ngành học và lĩnh vực
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              6 ngành chính
            </span>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockCategoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                  iconSize={10}
                />
                <Bar
                  dataKey="value"
                  name="Số lượng chứng chỉ"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Certificates Table */}
      <div className="mt-6 bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Chứng chỉ gần đây
              </h2>
              <span className="text-xs text-slate-500 font-normal">
                (Dữ liệu minh họa)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh sách các chứng chỉ số được cập nhật gần nhất trên hệ thống EduCertify
            </p>
          </div>

          <Link
            to="/dashboard/certificates"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Xem toàn bộ chứng chỉ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table responsive wrapper */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/75">
                <th scope="col" className="py-3 px-4 rounded-l-lg">
                  Mã chứng chỉ
                </th>
                <th scope="col" className="py-3 px-4">
                  Tên chứng chỉ
                </th>
                <th scope="col" className="py-3 px-4">
                  Người nhận
                </th>
                <th scope="col" className="py-3 px-4">
                  Ngày cấp
                </th>
                <th scope="col" className="py-3 px-4">
                  Trạng thái
                </th>
                <th scope="col" className="py-3 px-4 text-right rounded-r-lg">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCertificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      {cert.certificateCode || cert.code || cert.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors max-w-xs truncate" title={cert.title}>
                      {cert.title}
                    </div>
                    {cert.issuerName && (
                      <div className="text-xs text-slate-400 truncate max-w-xs">
                        {cert.issuerName}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {cert.holderName}
                    </div>
                    {cert.holderEmail && (
                      <div className="text-xs text-slate-400">
                        {cert.holderEmail}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {formatDate(cert.issueDate)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {renderStatusBadge(cert.status)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCertificate(cert)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <Modal
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          title={selectedCertificate.title}
          size="xl"
          footer={
            <Button
              variant="secondary"
              size="md"
              onClick={() => setSelectedCertificate(null)}
            >
              Đóng
            </Button>
          }
        >
          <div className="space-y-6">
            {/* Visual Certificate Card */}
            <div className="py-2">
              <CertificateCard certificate={selectedCertificate} />
            </div>

            {/* Detailed metadata list */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Thông tin văn bằng chi tiết
                </h3>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                <div>
                  <dt className="text-slate-500 font-medium">Mã chứng chỉ</dt>
                  <dd className="font-mono font-semibold text-slate-800 mt-0.5">
                    {selectedCertificate.certificateCode || selectedCertificate.code}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Trạng thái xác thực</dt>
                  <dd className="mt-0.5">
                    {renderStatusBadge(selectedCertificate.status)}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Người nhận chứng chỉ</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {selectedCertificate.holderName}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Email người nhận</dt>
                  <dd className="text-slate-700 mt-0.5">
                    {selectedCertificate.holderEmail || '—'}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Cơ quan / Đơn vị cấp</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {selectedCertificate.issuerName || 'Hệ thống EduCertify'}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Ngày phát hành</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {formatDate(selectedCertificate.issueDate)}
                  </dd>
                </div>

                {selectedCertificate.expiryDate && (
                  <div>
                    <dt className="text-slate-500 font-medium">Ngày hết hạn</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">
                      {formatDate(selectedCertificate.expiryDate)}
                    </dd>
                  </div>
                )}

                {selectedCertificate.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-slate-500 font-medium">Mô tả văn bằng</dt>
                    <dd className="text-slate-700 mt-0.5 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {selectedCertificate.description}
                    </dd>
                  </div>
                )}

                {selectedCertificate.txHash && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/80">
                    <dt className="text-slate-500 font-medium">
                      Mã băm giao dịch Blockchain (TxHash)
                    </dt>
                    <dd className="mt-1 flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono text-slate-800 break-all">
                      <span className="text-[11px]">{selectedCertificate.txHash}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyTx(selectedCertificate.txHash!)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Sao chép TxHash"
                        >
                          {copiedTx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={`https://etherscan.io/tx/${selectedCertificate.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Mở trên Blockchain Explorer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
