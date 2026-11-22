import React, { useState } from 'react';
import {
  Award,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Hash,
  Calendar,
  Building,
  User,
  Link as LinkIcon,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Filter,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { mockStudentCertificates } from '../../data/mockStudentData';
import type { Certificate } from '../../types/types';

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const truncateHash = (hash: string) => {
  if (!hash || hash.length <= 16) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

const statusConfig: Record<string, { label: string; badge: 'success' | 'warning' | 'danger' | 'info' | 'default'; icon: React.ComponentType<{ className?: string }> }> = {
  verified: { label: 'Đã xác thực', badge: 'success', icon: CheckCircle2 },
  valid: { label: 'Hợp lệ', badge: 'success', icon: CheckCircle2 },
  pending: { label: 'Chờ duyệt', badge: 'warning', icon: Clock },
  revoked: { label: 'Đã thu hồi', badge: 'danger', icon: XCircle },
};

const MyCertificates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const certs = mockStudentCertificates;

  const filtered = certs.filter((c) => {
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.certificateCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCopy = (text: string, type: 'tx' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') { setCopiedTx(true); setTimeout(() => setCopiedTx(false), 2000); }
    else { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      {/* Demo indicator */}
      <div className="mb-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Dữ liệu minh họa — Chưa kết nối API thực tế</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Chứng chỉ của tôi</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi tất cả chứng chỉ đã nhận</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Award className="w-4 h-4 text-blue-600" />
          <span>Tổng: <strong className="text-slate-900">{certs.length}</strong> chứng chỉ</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã chứng chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none min-w-[160px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="verified">Đã xác thực</option>
            <option value="pending">Chờ duyệt</option>
            <option value="revoked">Đã thu hồi</option>
          </select>
        </div>
      </div>

      {/* Certificate Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Không tìm thấy chứng chỉ phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((cert) => {
            const status = statusConfig[(cert.status || 'verified').toLowerCase()] || statusConfig.verified;
            return (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                        {cert.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Building className="w-3.5 h-3.5" />
                          {cert.issuerName}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(cert.issueDate)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                          <Hash className="w-3.5 h-3.5" />
                          {cert.certificateCode}
                        </span>
                      </div>
                      {cert.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cert.description}</p>
                      )}

                      {/* Blockchain & Signature status */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {cert.txHash ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <LinkIcon className="w-3 h-3" />
                            Blockchain ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
                            <LinkIcon className="w-3 h-3" />
                            Chưa ghi chain
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Lock className="w-3 h-3" />
                          Chữ ký số
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <StatusBadge status={status.badge} dot>
                      {status.label}
                    </StatusBadge>
                    <div className="flex items-center gap-1.5 mt-0 sm:mt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Tải chứng chỉ (chưa khả dụng)"
                        onClick={() => alert('Tính năng tải chứng chỉ sẽ được kết nối với API sau.')}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => { setSelectedCert(null); setCopiedTx(false); setCopiedCode(false); }}
        title="Chi tiết chứng chỉ"
        size="lg"
      >
        {selectedCert && (() => {
          const status = statusConfig[(selectedCert.status || 'verified').toLowerCase()] || statusConfig.verified;
          return (
            <div className="space-y-6">
              {/* Demo tag */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dữ liệu minh họa — Không phải dữ liệu xác thực thực tế</span>
              </div>

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCert.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedCert.description}</p>
                </div>
                <StatusBadge status={status.badge} dot>
                  {status.label}
                </StatusBadge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Mã chứng chỉ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{selectedCert.certificateCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedCert.certificateCode, 'code')}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Người nhận</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedCert.holderName}</p>
                  <p className="text-xs text-slate-500">{selectedCert.holderEmail}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>Đơn vị cấp phát</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedCert.issuerName}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Thời hạn hiệu lực</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatDate(selectedCert.issueDate)}
                    {selectedCert.expiryDate && ` — ${formatDate(selectedCert.expiryDate)}`}
                  </p>
                </div>
              </div>

              {/* QR Code placeholder */}
              <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Mã QR xác thực</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tính năng sẽ khả dụng khi kết nối API</p>
                </div>
              </div>

              {/* Signature & Blockchain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900">Chữ ký số</span>
                  </div>
                  <p className="text-xs text-slate-600">Thuật toán: RSA-2048 / SHA-256</p>
                  <p className="text-xs text-emerald-700 font-medium mt-1">✓ Đã ký hợp lệ (minh họa)</p>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-900">Blockchain</span>
                  </div>
                  {selectedCert.txHash ? (
                    <>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-xs text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[180px]">
                          {truncateHash(selectedCert.txHash)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedCert.txHash!, 'tx')}
                          className="p-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {copiedTx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${selectedCert.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-0.5 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-blue-700 font-medium mt-1">✓ Đã ghi trên Blockchain (minh họa)</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">Chưa ghi nhận trên Blockchain</p>
                  )}
                </div>
              </div>

              {/* PDF Preview placeholder */}
              <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="text-center">
                  <Eye className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Xem trước PDF chứng chỉ</p>
                  <p className="text-xs text-slate-400 mt-1">Tính năng xem trước PDF sẽ khả dụng khi kết nối API</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                    onClick={() => alert('Tính năng tải chứng chỉ sẽ được kết nối với API sau.')}
                  >
                    <Download className="w-4 h-4" />
                    Tải chứng chỉ PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default MyCertificates;
