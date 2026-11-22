import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Grid3X3,
  List,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { mockStudentMaterials } from '../../data/mockStudentData';
import type { Material } from '../../types/types';

const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const sigStatusConfig: Record<string, { label: string; badge: 'success' | 'warning' | 'danger'; icon: React.ComponentType<{ className?: string }> }> = {
  signed: { label: 'Đã ký số', badge: 'success', icon: CheckCircle2 },
  unsigned: { label: 'Chưa ký', badge: 'warning', icon: Clock },
  invalid: { label: 'Không hợp lệ', badge: 'danger', icon: AlertTriangle },
};

const MaterialLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [signatureFilter, setSignatureFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showVersions, setShowVersions] = useState<string | null>(null);

  const materials = mockStudentMaterials;
  const subjects = [...new Set(materials.map((m) => m.subject))];

  const filtered = materials.filter((m) => {
    const matchSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = subjectFilter === 'all' || m.subject === subjectFilter;
    const matchSig = signatureFilter === 'all' || m.signatureStatus === signatureFilter;
    return matchSearch && matchSubject && matchSig;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Thư viện học liệu số</h1>
          <p className="text-sm text-slate-500 mt-1">Truy cập tài liệu học tập đã được xác thực</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <BookOpen className="w-4 h-4 text-violet-600" />
          <span>Tổng: <strong className="text-slate-900">{materials.length}</strong> tài liệu</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm học liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <select
            value={signatureFilter}
            onChange={(e) => setSignatureFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="signed">Đã ký số</option>
            <option value="unsigned">Chưa ký</option>
            <option value="invalid">Không hợp lệ</option>
          </select>

          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Hiển thị dạng lưới"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Hiển thị dạng danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Materials */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Không tìm thấy tài liệu phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mat) => {
            const sigStatus = sigStatusConfig[mat.signatureStatus] || sigStatusConfig.signed;
            return (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col"
              >
                {/* Card Header */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <StatusBadge status={sigStatus.badge} dot>
                      {sigStatus.label}
                    </StatusBadge>
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 mb-2">
                    {mat.subject}
                  </span>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                    {mat.title}
                  </h3>

                  {mat.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{mat.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {mat.uploaderName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(mat.uploadDate)}
                    </span>
                    <span>{formatFileSize(mat.fileSize)}</span>
                    <span className="font-mono text-blue-600">{mat.version}</span>
                  </div>

                  {/* Versions toggle */}
                  {mat.versions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowVersions(showVersions === mat.id ? null : mat.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {showVersions === mat.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {mat.versions.length} phiên bản
                    </button>
                  )}

                  {showVersions === mat.id && (
                    <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-blue-100">
                      {mat.versions.map((v) => {
                        const vs = sigStatusConfig[v.signatureStatus] || sigStatusConfig.signed;
                        return (
                          <div key={v.version} className="text-[11px] flex items-center justify-between gap-2">
                            <span className="font-mono text-slate-600">{v.version}</span>
                            <span className="text-slate-400">{formatDate(v.uploadDate)}</span>
                            <StatusBadge status={vs.badge}>
                              {vs.label}
                            </StatusBadge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Chi tiết
                  </button>
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => alert('Tính năng tải tài liệu sẽ được kết nối với API sau.')}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải xuống
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((mat) => {
              const sigStatus = sigStatusConfig[mat.signatureStatus] || sigStatusConfig.signed;
              return (
                <div
                  key={mat.id}
                  className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{mat.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                        <span>{mat.subject}</span>
                        <span>{mat.uploaderName}</span>
                        <span>{formatDate(mat.uploadDate)}</span>
                        <span>{formatFileSize(mat.fileSize)}</span>
                        <span className="font-mono text-blue-600">{mat.version}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={sigStatus.badge} dot>
                      {sigStatus.label}
                    </StatusBadge>
                    <button
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Tải xuống"
                      onClick={() => alert('Tính năng tải tài liệu sẽ được kết nối với API sau.')}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title="Chi tiết học liệu"
        size="lg"
      >
        {selectedMaterial && (() => {
          const sigStatus = sigStatusConfig[selectedMaterial.signatureStatus] || sigStatusConfig.signed;
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dữ liệu minh họa — Không phải dữ liệu thực tế</span>
              </div>

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-50 text-violet-700 border border-violet-200 mb-2">
                    {selectedMaterial.subject}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedMaterial.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedMaterial.description}</p>
                </div>
                <StatusBadge status={sigStatus.badge} dot>
                  {sigStatus.label}
                </StatusBadge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-[11px] text-slate-500 mb-0.5">Tác giả</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedMaterial.uploaderName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-[11px] text-slate-500 mb-0.5">Ngày tải lên</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(selectedMaterial.uploadDate)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-[11px] text-slate-500 mb-0.5">Kích thước</p>
                  <p className="text-sm font-semibold text-slate-900">{formatFileSize(selectedMaterial.fileSize)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-[11px] text-slate-500 mb-0.5">Phiên bản</p>
                  <p className="text-sm font-semibold text-blue-600 font-mono">{selectedMaterial.version}</p>
                </div>
              </div>

              {/* Version History */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Lịch sử phiên bản</h4>
                <div className="space-y-2">
                  {selectedMaterial.versions.map((v, idx) => {
                    const vs = sigStatusConfig[v.signatureStatus] || sigStatusConfig.signed;
                    return (
                      <div
                        key={v.version}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          idx === 0 ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-slate-900">{v.version}</span>
                          {idx === 0 && (
                            <span className="text-[10px] font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Mới nhất</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{v.uploaderName}</span>
                          <span>{formatDate(v.uploadDate)}</span>
                          <span>{formatFileSize(v.fileSize)}</span>
                          <StatusBadge status={vs.badge}>
                            {vs.label}
                          </StatusBadge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Signature Status */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-bold text-slate-900">Trạng thái xác thực</span>
                </div>
                <StatusBadge status={sigStatus.badge} dot>
                  {sigStatus.label}
                </StatusBadge>
                <p className="text-xs text-slate-500 mt-2">
                  {selectedMaterial.signatureStatus === 'signed' && 'Tài liệu đã được ký số bởi tác giả, đảm bảo tính toàn vẹn nội dung.'}
                  {selectedMaterial.signatureStatus === 'unsigned' && 'Tài liệu chưa được ký số. Nội dung có thể đã thay đổi.'}
                  {selectedMaterial.signatureStatus === 'invalid' && 'Chữ ký số không hợp lệ. Nội dung file đã bị thay đổi sau khi ký.'}
                </p>
              </div>

              {/* Preview placeholder */}
              <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="text-center">
                  <Eye className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Xem trước tài liệu</p>
                  <p className="text-xs text-slate-400 mt-1">Tính năng xem trước sẽ khả dụng khi kết nối API</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                    onClick={() => alert('Tính năng tải tài liệu sẽ được kết nối với API sau.')}
                  >
                    <Download className="w-4 h-4" />
                    Tải tài liệu
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

export default MaterialLibrary;
