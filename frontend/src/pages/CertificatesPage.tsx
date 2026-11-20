import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Eye,
  Ban,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Award,
  RotateCcw,
  X,
  FileQuestion,
} from 'lucide-react';

import type { Certificate } from '../types/types';
import { mockCertificates } from '../data/mockCertificates';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import CertificateCard from '../components/certificates/CertificateCard';

export const CertificatesPage: React.FC = () => {
  // Local state for certificates list initialized from mockCertificates
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'revoked'>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [certToRevoke, setCertToRevoke] = useState<Certificate | null>(null);

  // Create form state
  const [formTitle, setFormTitle] = useState('');
  const [formHolderName, setFormHolderName] = useState('');
  const [formHolderEmail, setFormHolderEmail] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    holderName?: string;
    holderEmail?: string;
  }>({});

  // Copy hash helper state
  const [copiedTx, setCopiedTx] = useState(false);

  // Filtered certificates calculation
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      // Status filter
      if (statusFilter !== 'all') {
        const currentStatus = cert.status.toLowerCase();
        if (statusFilter === 'verified' && currentStatus !== 'verified' && currentStatus !== 'valid') {
          return false;
        }
        if (statusFilter === 'pending' && currentStatus !== 'pending') {
          return false;
        }
        if (statusFilter === 'revoked' && currentStatus !== 'revoked') {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const code = (cert.certificateCode || cert.code || cert.id).toLowerCase();
        const title = cert.title.toLowerCase();
        const holder = (cert.holderName || cert.recipientName || '').toLowerCase();
        const email = (cert.holderEmail || cert.recipientEmail || '').toLowerCase();
        const issuer = (cert.issuerName || cert.issuer || '').toLowerCase();

        return (
          code.includes(query) ||
          title.includes(query) ||
          holder.includes(query) ||
          email.includes(query) ||
          issuer.includes(query)
        );
      }

      return true;
    });
  }, [certificates, searchQuery, statusFilter]);

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

  // Handle Create Certificate submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { title?: string; holderName?: string; holderEmail?: string } = {};
    if (!formTitle.trim()) {
      errors.title = 'Vui lòng nhập tên chứng chỉ';
    }
    if (!formHolderName.trim()) {
      errors.holderName = 'Vui lòng nhập tên người nhận';
    }
    if (!formHolderEmail.trim()) {
      errors.holderEmail = 'Vui lòng nhập email người nhận';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formHolderEmail.trim())) {
      errors.holderEmail = 'Email không hợp lệ';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Generate simulated certificate (Local State only)
    const newIdNum = certificates.length + 1;
    const certCode = `CERT-2024-${String(newIdNum).padStart(3, '0')}`;
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      certificateCode: certCode,
      title: formTitle.trim(),
      holderName: formHolderName.trim(),
      holderEmail: formHolderEmail.trim(),
      issuerName: 'Trường Đại học Bách Khoa EduCertify',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'verified',
      description: formDescription.trim() || undefined,
      txHash: `0x${randomHex}`,
    };

    setCertificates([newCertificate, ...certificates]);

    // Reset form and close modal
    setFormTitle('');
    setFormHolderName('');
    setFormHolderEmail('');
    setFormDescription('');
    setFormErrors({});
    setIsCreateModalOpen(false);
  };

  // Handle Revoke Confirmation
  const handleConfirmRevoke = () => {
    if (!certToRevoke) return;

    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certToRevoke.id ? { ...c, status: 'revoked' } : c
      )
    );

    setCertToRevoke(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="Quản lý Chứng chỉ"
        description="Tạo, quản lý và theo dõi chứng chỉ số"
        action={
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Dữ liệu minh họa
            </span>
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setFormErrors({});
                setIsCreateModalOpen(true);
              }}
            >
              Tạo chứng chỉ
            </Button>
          </div>
        }
      />

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Tìm kiếm theo mã, tên chứng chỉ, người nhận..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              rightIcon={
                searchQuery ? (
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                ) : undefined
              }
              onRightIconClick={() => setSearchQuery('')}
            />
          </div>

          {/* Status Filter Dropdown & Results Counter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label
                htmlFor="status-filter-select"
                className="text-xs font-medium text-slate-600 whitespace-nowrap"
              >
                Trạng thái:
              </label>
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | 'verified' | 'pending' | 'revoked'
                  )
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
              >
                <option value="all">Tất cả</option>
                <option value="verified">Đã xác thực</option>
                <option value="pending">Chờ xử lý</option>
                <option value="revoked">Đã thu hồi</option>
              </select>
            </div>

            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar: Counter & Illustrative notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Hiển thị <span className="font-semibold text-slate-800">{filteredCertificates.length}</span> / {certificates.length} chứng chỉ
          </div>
          <div className="italic text-slate-400">
            Hệ thống quản lý dữ liệu minh họa EduCertify
          </div>
        </div>
      </div>

      {/* 3. Certificates Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th scope="col" className="py-3 px-4">
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
                <th scope="col" className="py-3 px-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert) => {
                  const isRevoked = cert.status.toLowerCase() === 'revoked';

                  return (
                    <tr
                      key={cert.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Mã */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {cert.certificateCode || cert.code || cert.id}
                        </span>
                      </td>

                      {/* Tên chứng chỉ */}
                      <td className="py-3.5 px-4">
                        <div
                          className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors max-w-sm truncate"
                          title={cert.title}
                        >
                          {cert.title}
                        </div>
                        {cert.issuerName && (
                          <div className="text-xs text-slate-400 truncate max-w-sm">
                            {cert.issuerName}
                          </div>
                        )}
                      </td>

                      {/* Người nhận */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {cert.holderName || cert.recipientName}
                        </div>
                        {(cert.holderEmail || cert.recipientEmail) && (
                          <div className="text-xs text-slate-400">
                            {cert.holderEmail || cert.recipientEmail}
                          </div>
                        )}
                      </td>

                      {/* Ngày cấp */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {formatDate(cert.issueDate)}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(cert.status)}
                      </td>

                      {/* Hành động */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedCertificate(cert)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem</span>
                          </button>

                          {!isRevoked ? (
                            <button
                              type="button"
                              onClick={() => setCertToRevoke(cert)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Thu hồi chứng chỉ"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Thu hồi</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 px-2.5 py-1 italic">
                              Đã thu hồi
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <FileQuestion className="w-6 h-6" />
                      </div>
                      <p className="text-base font-semibold text-slate-800">
                        Không tìm thấy chứng chỉ phù hợp
                      </p>
                      <p className="text-xs text-slate-500 mt-1 text-center">
                        Không có chứng chỉ nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                        onClick={handleResetFilters}
                      >
                        Đặt lại tìm kiếm
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL 1: Create Certificate Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormErrors({});
        }}
        title="Tạo chứng chỉ mới"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormErrors({});
              }}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateSubmit}
            >
              Tạo chứng chỉ
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 mb-2">
            Điền các thông tin cần thiết để khởi tạo văn bằng chứng chỉ số.
            Hệ thống sẽ cấp mã định danh và mô phỏng giao dịch ghi lên sổ cái EduCertify.
          </p>

          {/* Tên chứng chỉ */}
          <Input
            label="Tên chứng chỉ"
            required
            placeholder="Ví dụ: Chứng chỉ Lập trình Smart Contracts Nâng cao"
            value={formTitle}
            onChange={(e) => {
              setFormTitle(e.target.value);
              if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
            }}
            error={formErrors.title}
          />

          {/* Tên người nhận */}
          <Input
            label="Tên người nhận"
            required
            placeholder="Ví dụ: Nguyễn Văn An"
            value={formHolderName}
            onChange={(e) => {
              setFormHolderName(e.target.value);
              if (formErrors.holderName) setFormErrors({ ...formErrors, holderName: undefined });
            }}
            error={formErrors.holderName}
          />

          {/* Email người nhận */}
          <Input
            type="email"
            label="Email người nhận"
            required
            placeholder="Ví dụ: nguyen.van.an@educertify.edu.vn"
            value={formHolderEmail}
            onChange={(e) => {
              setFormHolderEmail(e.target.value);
              if (formErrors.holderEmail) setFormErrors({ ...formErrors, holderEmail: undefined });
            }}
            error={formErrors.holderEmail}
          />

          {/* Mô tả chứng chỉ */}
          <div className="w-full">
            <label
              htmlFor="create-cert-desc"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Mô tả
            </label>
            <textarea
              id="create-cert-desc"
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Nhập thông tin tóm tắt về khóa đào tạo hoặc nội dung công nhận..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* 5. MODAL 2: Certificate Detail Modal */}
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
            {/* Visual Certificate Card component */}
            <div className="py-2">
              <CertificateCard certificate={selectedCertificate} />
            </div>

            {/* Details Table below the card */}
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
                    {selectedCertificate.holderName || selectedCertificate.recipientName}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Email người nhận</dt>
                  <dd className="text-slate-700 mt-0.5">
                    {selectedCertificate.holderEmail || selectedCertificate.recipientEmail || '—'}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500 font-medium">Cơ quan / Đơn vị cấp</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {selectedCertificate.issuerName || selectedCertificate.issuer || 'Trường Đại học EduCertify'}
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
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
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

      {/* 6. MODAL 3: Revoke Confirmation Modal */}
      {certToRevoke && (
        <Modal
          isOpen={!!certToRevoke}
          onClose={() => setCertToRevoke(null)}
          title="Xác nhận thu hồi"
          size="sm"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCertToRevoke(null)}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmRevoke}
              >
                Thu hồi
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  Bạn có chắc chắn muốn thu hồi chứng chỉ{' '}
                  <span className="font-semibold text-slate-900">
                    "{certToRevoke.title}"
                  </span>
                  {certToRevoke.holderName && (
                    <>
                      {' '}của học viên{' '}
                      <span className="font-semibold text-slate-900">
                        {certToRevoke.holderName}
                      </span>
                    </>
                  )}
                  ? Hành động này không thể hoàn tác.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Sau khi thu hồi, chứng chỉ sẽ chuyển sang trạng thái "Đã thu hồi" và việc xác thực trên hệ thống sẽ bị vô hiệu hóa.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CertificatesPage;
