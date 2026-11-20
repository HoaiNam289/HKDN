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

export const VerifyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VerifyTab>('code');
  const [certCodeInput, setCertCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  // PDF Tab state
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Demo result state (Strictly controlled, initially false)
  const [showDemoResult, setShowDemoResult] = useState<boolean>(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Handle Verify by Code
  const handleVerifyByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCodeInput.trim()) {
      setCodeError('Vui lòng nhập mã chứng chỉ cần xác thực');
      return;
    }
    setCodeError('');
    setShowDemoResult(true);
  };

  // Handle Verify by PDF
  const handleVerifyByPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPdf) return;
    setShowDemoResult(true);
  };

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
        <section className="space-y-4" aria-label="Khu vực kết quả xác thực">
          {/* Toggle Minh Họa Link/Button */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Kết quả xác thực
            </h2>
            <button
              type="button"
              onClick={() => setShowDemoResult((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors p-1 rounded cursor-pointer"
            >
              {showDemoResult ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>(Ẩn minh họa)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>(Xem minh họa)</span>
                </>
              )}
            </button>
          </div>

          {!showDemoResult ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Nhập mã chứng chỉ hoặc upload tài liệu để bắt đầu xác thực
              </p>
              <button
                type="button"
                onClick={() => setShowDemoResult(true)}
                className="mt-1 text-xs text-blue-600 hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                (Xem minh họa kết quả xác thực hợp lệ)
              </button>
            </div>
          ) : (
            /* Demo Result Display */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Mandatory Illustrative Disclaimer Alert */}
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold">
                    Kết quả minh họa — Không phải dữ liệu xác thực thực tế
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoResult(false)}
                  className="p-1 rounded text-amber-700 hover:bg-amber-100 transition-colors"
                  aria-label="Đóng minh họa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Certificate Info Card */}
              <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Award className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Thông tin Chứng chỉ
                      </h3>
                      <p className="text-xs text-slate-500">
                        Hệ thống cấp phát chứng chỉ số chuẩn quốc gia EduCertify
                      </p>
                    </div>
                  </div>

                  <StatusBadge status="success" dot>
                    Chứng chỉ Hợp lệ
                  </StatusBadge>
                </div>

                {/* Main Certificate Title */}
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Tên chứng chỉ
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                    Chứng chỉ Công nghệ Thông tin Chuẩn Kỹ năng Sử dụng CNTT Nâng cao
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Chứng nhận hoàn thành xuất sắc chương trình chuẩn kỹ năng sử dụng công nghệ thông tin nâng cao theo quy định của Bộ Giáo dục & Đào tạo.
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mã chứng chỉ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        CERT-2024-001
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('CERT-2024-001', 'code')}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                        title="Sao chép mã"
                      >
                        {copiedCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Người nhận</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      Nguyễn Văn An
                    </p>
                    <p className="text-xs text-slate-500">
                      nguyen.van.an@educertify.edu.vn
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>Đơn vị cấp phát</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">
                      Trường Đại học Bách Khoa EduCertify
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Thời hạn hiệu lực</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      15/01/2024 – 15/01/2029
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Còn hạn sử dụng
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Signature Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                      <Lock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Trạng thái Chữ ký số
                      </h4>
                      <p className="text-xs text-slate-500">
                        Chữ ký số điện tử theo tiêu chuẩn PKI
                      </p>
                    </div>
                  </div>

                  <StatusBadge status="success" dot>
                    Đã ký hợp lệ
                  </StatusBadge>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                    <span className="text-slate-500">Tổ chức ký số:</span>
                    <span className="font-semibold text-slate-900">
                      Ban Giám hiệu Trường Đại học Bách Khoa EduCertify
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                    <span className="text-slate-500">Thời điểm ký (Timestamp):</span>
                    <span className="font-medium text-slate-800 font-mono text-xs">
                      15/01/2024 09:30:15 (GMT+7)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                    <span className="text-slate-500">Thuật toán mã hóa:</span>
                    <span className="font-semibold text-slate-800">
                      RSA-2048 / SHA-256
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 gap-1">
                    <span className="text-slate-500">Chứng thư thẩm quyền:</span>
                    <span className="text-slate-700 font-medium">
                      EduCertify Root CA (Hệ thống Khóa Công khai Quốc gia)
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Blockchain Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Trạng thái Blockchain
                      </h4>
                      <p className="text-xs text-slate-500">
                        Bằng chứng bất biến trên mạng lưới phi tập trung
                      </p>
                    </div>
                  </div>

                  <StatusBadge status="info" dot>
                    Đã ghi nhận on-chain
                  </StatusBadge>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                    <span className="text-slate-500">Mạng lưới Blockchain:</span>
                    <span className="font-semibold text-slate-900">
                      Ethereum (Sepolia Testnet)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                    <span className="text-slate-500">Mã băm giao dịch (TxHash):</span>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                      <span className="truncate max-w-[200px] sm:max-w-xs">
                        0x9f83a4c5e6d78219b0c1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            '0x9f83a4c5e6d78219b0c1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
                            'tx'
                          )
                        }
                        className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                        title="Sao chép TxHash"
                      >
                        {copiedTx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href="https://sepolia.etherscan.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors p-0.5"
                        title="Xem trên Etherscan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-50 gap-1">
                    <span className="text-slate-500">Số khối xác nhận (Block):</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      #5,892,143 (14,290 xác nhận)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 gap-1">
                    <span className="text-slate-500">Mã băm dữ liệu gốc (SHA-256):</span>
                    <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[260px] sm:max-w-sm">
                      8f4e2c91b5a37d04e6c891f274a980b1352de840c6a512739fb014e7dc284915
                    </span>
                  </div>
                </div>
              </div>
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
