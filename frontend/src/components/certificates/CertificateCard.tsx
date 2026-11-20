import React, { useState } from 'react';
import type { Certificate } from '../../types/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
} from 'lucide-react';

export interface CertificateCardProps {
  certificate: Certificate;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  valid: {
    label: 'Hợp lệ',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  revoked: {
    label: 'Đã thu hồi',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: XCircle,
  },
  pending: {
    label: 'Chờ duyệt',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  expired: {
    label: 'Đã hết hạn',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
    icon: AlertTriangle,
  },
};

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Normalize certificate fields
  const issuer =
    certificate.issuerName ||
    certificate.issuer ||
    'ĐẠI HỌC QUỐC GIA - HỆ THỐNG XÁC THỰC EduCertify';
  const holder =
    certificate.holderName ||
    certificate.recipientName ||
    certificate.studentName ||
    'Chưa cập nhật người nhận';
  const certCode =
    certificate.certificateCode || certificate.code || certificate.id;
  const statusKey = (certificate.status || 'valid').toLowerCase();
  const statusInfo = statusConfig[statusKey] || statusConfig.valid;
  const StatusIcon = statusInfo.icon;

  const truncateHash = (hash: string) => {
    if (!hash || hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const handleCopyTx = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa xác định';
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

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      {/* Outer Card Container with 2px border-blue-200 and subtle gradient */}
      <div className="relative rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-xl p-6 sm:p-10 md:p-12 overflow-hidden">
        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
          <ShieldCheck className="w-96 h-96 text-blue-900" />
        </div>

          {/* Decorative Corner Ornaments */}
          <div
            className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl-sm pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-blue-500 rounded-tr-sm pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-blue-500 rounded-bl-sm pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-blue-500 rounded-br-sm pointer-events-none"
            aria-hidden="true"
          />

          {/* Inner Decorative Border Frame */}
          <div className="relative border border-blue-200/80 rounded-xl p-5 sm:p-8 md:p-10">
            {/* Illustrative data badge / Note */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100/70 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Dữ liệu minh họa
              </span>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{statusInfo.label}</span>
              </div>
            </div>

            {/* Header: University / Issuer with Shield Icon */}
            <header className="text-center pb-6 border-b border-blue-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-3">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-blue-900/90">
                {issuer}
              </h2>
              <p className="text-[11px] tracking-wider text-slate-500 uppercase mt-0.5">
                Hệ thống Quản lý và Xác thực Văn bằng Chứng chỉ Số EduCertify
              </p>
            </header>

            {/* Body Section */}
            <div className="py-8 text-center space-y-4">
              <div className="inline-block">
                <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-blue-600 uppercase border-b-2 border-blue-300 pb-1">
                  CHỨNG NHẬN
                </span>
              </div>

              {/* Certificate Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight px-2">
                {certificate.title}
              </h1>

              <div className="pt-2">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Trân trọng cấp cho:
                </p>
                <div className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 tracking-wide">
                  {holder}
                </div>
              </div>

              {/* Certificate Description */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed pt-1 px-4">
                {certificate.description ||
                  'Đã hoàn thành xuất sắc chương trình đào tạo và đạt các chuẩn đầu ra theo quy định của hệ thống EduCertify.'}
              </p>
            </div>

            {/* Footer Section: Issue date, certificate code, status, blockchain hash */}
            <footer className="pt-6 border-t border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {/* Left Column: Dates & Code */}
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-500 font-medium">
                    Ngày cấp:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(certificate.issueDate)}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">
                    Mã chứng chỉ:
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200">
                      {certCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(certCode)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Sao chép mã chứng chỉ"
                      aria-label="Sao chép mã chứng chỉ"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Issuer Seal / Blockchain Tx */}
              <div className="space-y-2 sm:text-right flex flex-col sm:items-end justify-between">
                {/* Digital Verification Seal */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-800">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold">
                    Xác thực số EduCertify Blockchain
                  </span>
                </div>

                {/* Blockchain Transaction Hash (if available) */}
                {certificate.txHash ? (
                  <div className="mt-2 text-xs">
                    <span className="text-slate-500 block mb-0.5">
                      Giao dịch Blockchain (TxHash):
                    </span>
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-mono text-slate-700">
                      <span>{truncateHash(certificate.txHash)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyTx(certificate.txHash!)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Sao chép TxHash"
                        aria-label="Sao chép TxHash"
                      >
                        {copiedTx ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${certificate.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Xem trên Blockchain Explorer"
                        aria-label="Xem trên Blockchain Explorer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    Chữ ký điện tử nội bộ EduCertify
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
  );
};

export default CertificateCard;
