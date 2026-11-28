import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Search,
  Hash,
  QrCode,
  FileUp,
  Lock,
  Link as LinkIcon,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  LogIn,
  FileText,
  Sparkles,
  Calendar,
  User,
  Building,
  Award,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import StatusBadge from '../components/common/StatusBadge';
import BrandLogo from '../components/common/BrandLogo';

type VerifyTab = 'code' | 'qr' | 'pdf';

/**
 * Format bytes into readable string
 */
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

import { Loader2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import {
  verifyByCode,
  verifyByPdf,
  type VerificationResult,
  type VerificationStatus,
} from '../services/verification';

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'default';

/** Nhan hien thi cho tung ket qua xac thuc. */
const STATUS_VIEW: Record<VerificationStatus, { label: string; badge: BadgeStatus; detail: string }> = {
  VALID: {
    label: 'Chứng chỉ hợp lệ',
    badge: 'success',
    detail: 'Chữ ký số và mã băm tài liệu đều khớp. Chứng chỉ do hệ thống cấp và chưa bị chỉnh sửa.',
  },
  UNVERIFIED: {
    label: 'Không xác thực được',
    badge: 'danger',
    detail: 'Chữ ký số hoặc mã băm không khớp. Tài liệu có thể đã bị chỉnh sửa sau khi phát hành.',
  },
  REVOKED: {
    label: 'Đã bị thu hồi',
    badge: 'danger',
    detail: 'Chứng chỉ này đã bị đơn vị cấp thu hồi và không còn giá trị.',
  },
  PENDING: {
    label: 'Chưa phát hành',
    badge: 'warning',
    detail: 'Chứng chỉ đã được tạo nhưng chưa hoàn tất phát hành.',
  },
  NOT_FOUND: {
    label: 'Không tìm thấy',
    badge: 'default',
    detail: 'Không có chứng chỉ nào khớp với mã hoặc tài liệu bạn cung cấp.',
  },
  INVALID: {
    label: 'Dữ liệu không hợp lệ',
    badge: 'danger',
    detail: 'Không đọc được tài liệu. Vui lòng kiểm tra lại file PDF.',
  },
};

/** Hien thi ngay gio theo gio Viet Nam. */
const formatDateTime = (value: string | null): string => {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

export const VerifyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VerifyTab>('code');
  const [certCodeInput, setCertCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  // PDF Tab state
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Ket qua xac thuc that tu backend
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [showTechnical, setShowTechnical] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const runVerification = async (request: () => Promise<VerificationResult>) => {
    setLoading(true);
    setRequestError('');
    setResult(null);
    setShowTechnical(false);
    try {
      setResult(await request());
    } catch {
      setRequestError('Không kết nối được máy chủ xác thực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Mo trang voi /verify?code=... (lien ket chia se, ma QR) thi tu dong xac thuc
  React.useEffect(() => {
    const codeFromUrl = new URLSearchParams(window.location.search).get('code');
    if (codeFromUrl && codeFromUrl.trim()) {
      setCertCodeInput(codeFromUrl);
      void runVerification(() => verifyByCode(codeFromUrl));
    }
  }, []);

  // Handle Verify by Code
  const handleVerifyByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCodeInput.trim()) {
      setCodeError('Vui lòng nhập mã chứng chỉ cần xác thực');
      return;
    }
    setCodeError('');
    void runVerification(() => verifyByCode(certCodeInput));
  };

  // Handle Verify by PDF
  const handleVerifyByPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPdf) return;
    void runVerification(() => verifyByPdf(selectedPdf));
  };

  const view = result ? STATUS_VIEW[result.status] ?? STATUS_VIEW.INVALID : null;
  const hasCertificate = Boolean(result?.code);
  const shareLink = result?.code
    ? `${window.location.origin}/verify?code=${encodeURIComponent(result.code)}`
    : '';

  // Copy helpers
  const handleCopy = (text: string, type: 'tx' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return;
      }
      setSelectedPdf(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col justify-between font-sans text-slate-900">
      {/* 1. CUSTOM HEADER */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Cổng tra cứu công khai
            </span>
          </div>

          {/* Link to login */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-3.5 py-2 rounded-lg hover:bg-slate-100"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Đăng nhập hệ thống</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Title and Subtitle */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs mb-1">
            <ShieldCheck className="w-7 h-7 stroke-[2]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Xác thực Chứng chỉ
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Kiểm tra tính xác thực của chứng chỉ và học liệu số thông qua chữ ký số và Blockchain
          </p>
        </div>

        {/* Verification Methods Card with Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/60 p-1.5 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span>Nhập mã chứng chỉ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Quét mã QR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Upload PDF</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8">
            {/* 1. Nhập mã chứng chỉ tab */}
            {activeTab === 'code' && (
              <form onSubmit={handleVerifyByCode} className="space-y-4">
                <div className="space-y-1.5">
                  <Input
                    label="Mã chứng chỉ số"
                    placeholder="Nhập mã chứng chỉ (VD: CERT-2024-001)"
                    icon={<Hash className="w-4 h-4 text-slate-400" />}
                    value={certCodeInput}
                    onChange={(e) => {
                      setCertCodeInput(e.target.value);
                      if (codeError) setCodeError('');
                    }}
                    error={codeError}
                  />
                  <p className="text-xs text-slate-500">
                    Mã chứng chỉ được in trên văn bằng hoặc cung cấp qua email xác nhận.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Xác thực
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setCertCodeInput('CERT-2024-001');
                      setCodeError('');
                    }}
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    Dùng mã mẫu: CERT-2024-001
                  </button>
                </div>
              </form>
            )}

            {/* 2. Quét mã QR tab */}
            {activeTab === 'qr' && (
              <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 w-full max-w-md bg-slate-50/50 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <QrCode className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-2">
                      Tính năng thử nghiệm
                    </span>
                    <p className="text-base font-semibold text-slate-700">
                      Chức năng quét QR đang phát triển
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Vui lòng sử dụng phương thức tra cứu bằng mã chứng chỉ hoặc tải lên tệp PDF.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Upload PDF tab */}
            {activeTab === 'pdf' && (
              <form onSubmit={handleVerifyByPdf} className="space-y-4">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                />

                {!selectedPdf ? (
                  <div
                    onClick={() => pdfInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 bg-slate-50/40 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center">
                      <FileUp className="w-7 h-7 stroke-[1.8]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-800">
                        Chọn file PDF để xác thực
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Hỗ trợ file PDF chứng chỉ số có nhúng chữ ký số điện tử
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {selectedPdf.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatFileSize(selectedPdf.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => pdfInputRef.current?.click()}
                        className="text-xs text-blue-600 hover:bg-blue-100"
                      >
                        Đổi file
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPdf(null);
                          if (pdfInputRef.current) pdfInputRef.current.value = '';
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="Xóa file đã chọn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={!selectedPdf}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Xác thực tài liệu
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 3. RESULT AREA */}
        <section className="space-y-4" aria-label="Khu vực kết quả xác thực" aria-live="polite">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Kết quả xác thực
            </h2>
            {result && hasCertificate && (
              <button
                type="button"
                onClick={() => setShowTechnical((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors p-1 rounded cursor-pointer"
              >
                {showTechnical ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ẩn chi tiết kỹ thuật</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem chi tiết kỹ thuật</span>
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            /* Dang xac thuc */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Đang kiểm tra chữ ký số và mã băm tài liệu...</p>
            </div>
          ) : requestError ? (
            /* Loi ket noi */
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{requestError}</p>
            </div>
          ) : !result || !view ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Nhập mã chứng chỉ hoặc upload tài liệu để bắt đầu xác thực
              </p>
              <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Kết quả được kiểm tra bằng chữ ký số RSA-2048 và mã băm SHA-256
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Tong ket */}
              <div
                className={`rounded-2xl border p-5 flex items-start justify-between gap-3 shadow-xs ${
                  result.status === 'VALID'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : view.badge === 'danger'
                      ? 'border-red-200 bg-red-50 text-red-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.status === 'VALID' ? (
                    <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
                  ) : view.badge === 'danger' ? (
                    <XCircle className="w-6 h-6 shrink-0 text-red-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <p className="font-bold">{view.label}</p>
                    <p className="text-sm mt-0.5">{view.detail}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="p-1 rounded hover:bg-black/5 transition-colors"
                  aria-label="Đóng kết quả"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {hasCertificate && (
                <>
                  {/* 1. Thong tin chung chi */}
                  <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Award className="w-5 h-5 stroke-[2]" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Thông tin Chứng chỉ</h3>
                      </div>
                      <StatusBadge status={view.badge} dot>
                        {view.label}
                      </StatusBadge>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Tên chứng chỉ
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                        {result.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mã chứng chỉ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-900">{result.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(result.code ?? '', 'code')}
                            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                            title="Sao chép mã"
                          >
                            {copiedCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={shareLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                            title="Mở liên kết xác thực của chứng chỉ này"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Người nhận</span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{result.recipientName}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>Đơn vị cấp phát</span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{result.issuerName}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Thời hạn hiệu lực</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatDateTime(result.issuedAt)} – {result.expiresAt ? formatDateTime(result.expiresAt) : 'Không thời hạn'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Trang thai chu ky so */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                          <Lock className="w-5 h-5 stroke-[2]" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900">Trạng thái Chữ ký số</h4>
                      </div>
                      <StatusBadge status={result.signatureValid ? 'success' : 'danger'} dot>
                        {result.signatureValid ? 'Chữ ký hợp lệ' : 'Chữ ký không hợp lệ'}
                      </StatusBadge>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                        <span className="text-slate-500">Mã băm tài liệu (SHA-256):</span>
                        <StatusBadge status={result.hashValid ? 'success' : 'danger'}>
                          {result.hashValid ? 'Khớp với bản gốc' : 'Không khớp'}
                        </StatusBadge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                        <span className="text-slate-500">Thuật toán:</span>
                        <span className="font-semibold text-slate-800">RSA-2048 / SHA-256</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 gap-1">
                        <span className="text-slate-500 inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Thời điểm phát hành:
                        </span>
                        <span className="font-medium text-slate-800 font-mono text-xs">
                          {formatDateTime(result.issuedAt)}
                        </span>
                      </div>
                      {showTechnical && result.contentHash && (
                        <div className="flex flex-col gap-1 pt-2">
                          <span className="text-slate-500">Mã băm lưu khi phát hành:</span>
                          <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 break-all">
                            {result.contentHash}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Trang thai Blockchain */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                          <LinkIcon className="w-5 h-5 stroke-[2]" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900">Trạng thái Blockchain</h4>
                      </div>
                      <StatusBadge status={result.blockchainTxHash ? 'info' : 'default'} dot>
                        {result.blockchainTxHash ? 'Đã ghi nhận on-chain' : 'Chưa có dữ liệu'}
                      </StatusBadge>
                    </div>
                    {result.blockchainTxHash ? (
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                        <span className="truncate">{result.blockchainTxHash}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.blockchainTxHash ?? '', 'tx')}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                          title="Sao chép TxHash"
                        >
                          {copiedTx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-500">
                        Chứng chỉ chưa được ghi lên Blockchain.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </main>

      {/* 4. FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p>
            EduCertify — Hệ thống Xác thực Chứng chỉ và Học liệu số © 2024
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Ứng dụng công nghệ chữ ký số PKI và Hợp đồng thông minh trên nền tảng Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VerifyPage;
