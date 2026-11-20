import React, { useState, useMemo, useRef } from 'react';
import {
  Upload,
  Search,
  Eye,
  FileText,
  Sparkles,
  BookOpen,
  Calendar,
  User as UserIcon,
  HardDrive,
  FileUp,
  X,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { Material, MaterialVersion } from '../types/types';
import { mockMaterials } from '../data/mockMaterials';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import PageHeader from '../components/common/PageHeader';

const SUBJECT_OPTIONS = [
  'Tất cả',
  'Lập trình Web',
  'Cơ sở dữ liệu',
  'Mạng máy tính',
  'Trí tuệ nhân tạo',
  'An toàn thông tin',
  'Toán rời rạc',
  'Kỹ thuật Blockchain',
  'Kiến trúc phần mềm',
  'Cấu trúc dữ liệu',
  'Kinh tế đại cương',
  'Phát triển ứng dụng di động',
];

/**
 * Format bytes into human-readable format (KB, MB, GB)
 */
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date string to Vietnamese date format (DD/MM/YYYY)
 */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
};

/**
 * Render signature status badge according to requirements
 */
const renderSignatureBadge = (status: Material['signatureStatus']) => {
  switch (status) {
    case 'signed':
      return (
        <StatusBadge status="success" dot>
          Đã ký
        </StatusBadge>
      );
    case 'unsigned':
      return (
        <StatusBadge status="warning" dot>
          Chưa ký
        </StatusBadge>
      );
    case 'invalid':
      return (
        <StatusBadge status="danger" dot>
          Không hợp lệ
        </StatusBadge>
      );
    default:
      return <StatusBadge status="default">Chưa xác định</StatusBadge>;
  }
};

export const MaterialsPage: React.FC = () => {
  // Materials state (seeded from mockMaterials)
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState(SUBJECT_OPTIONS[1]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        material.title.toLowerCase().includes(query) ||
        material.subject.toLowerCase().includes(query) ||
        material.fileName.toLowerCase().includes(query);

      const matchesSubject =
        selectedSubject === 'Tất cả' || material.subject === selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }, [materials, searchQuery, selectedSubject]);

  // Open Detail Modal
  const handleOpenDetail = (material: Material) => {
    setSelectedMaterial(material);
    setIsDetailModalOpen(true);
  };

  // Close Upload Modal and reset form
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadSubject(SUBJECT_OPTIONS[1]);
    setUploadDescription('');
    setUploadedFile(null);
    setUploadError('');
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadError('');
      // Auto-populate title if empty
      if (!uploadTitle.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setUploadTitle(nameWithoutExt);
      }
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadError('');
      if (!uploadTitle.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setUploadTitle(nameWithoutExt);
      }
    }
  };

  // Submit Upload Form (simulated: add to local state and close)
  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadTitle.trim()) {
      setUploadError('Vui lòng nhập tên tài liệu');
      return;
    }

    if (!uploadedFile) {
      setUploadError('Vui lòng chọn file tài liệu cần upload');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newVersion: MaterialVersion = {
      version: 'v1.0.0',
      uploadDate: todayStr,
      uploaderName: 'Quản trị viên EduCertify',
      fileSize: uploadedFile.size,
      signatureStatus: 'unsigned',
    };

    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      title: uploadTitle.trim(),
      subject: uploadSubject,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      uploadDate: todayStr,
      uploaderName: 'Quản trị viên EduCertify',
      version: 'v1.0.0',
      versions: [newVersion],
      signatureStatus: 'unsigned',
      description: uploadDescription.trim() || undefined,
    };

    setMaterials((prev) => [newMaterial, ...prev]);
    handleCloseUploadModal();
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Quản lý Học liệu số"
          description="Upload, quản lý và xác thực tài liệu học tập"
          action={
            <Button
              variant="primary"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload tài liệu
            </Button>
          }
        />

        {/* Filters and Search Bar Row */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Tìm kiếm tài liệu..."
                icon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Subject Select Dropdown */}
              <div className="relative min-w-[200px]">
                <label htmlFor="subject-filter" className="sr-only">
                  Lọc theo môn học
                </label>
                <select
                  id="subject-filter"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub === 'Tất cả' ? 'Tất cả môn học' : sub}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>

              {/* Dữ liệu minh họa Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                (Dữ liệu minh họa)
              </span>
            </div>
          </div>
        </div>

        {/* Materials Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Danh sách Học liệu số
              </h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium ml-1">
                {filteredMaterials.length} tài liệu
              </span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Cập nhật gần nhất: Hệ thống EduCertify
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Tên tài liệu
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Môn học
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Tên file
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Dung lượng
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center">
                    Phiên bản
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center">
                    Chữ ký số
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <p className="font-medium text-slate-700">
                          Không tìm thấy tài liệu nào
                        </p>
                        <p className="text-xs text-slate-400">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc môn học
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-slate-900 truncate max-w-xs sm:max-w-sm md:max-w-md"
                              title={material.title}
                            >
                              {material.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Đăng bởi {material.uploaderName} • {formatDate(material.uploadDate)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {material.subject}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="font-mono text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block max-w-[180px] truncate"
                          title={material.fileName}
                        >
                          {material.fileName}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                        {formatFileSize(material.fileSize)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {material.version}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderSignatureBadge(material.signatureStatus)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleOpenDetail(material)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1. UPLOAD MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        title="Upload tài liệu mới"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={handleCloseUploadModal}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Upload className="w-4 h-4" />}
              onClick={handleSubmitUpload}
            >
              Upload
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitUpload} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <Input
              label="Tên tài liệu"
              placeholder="Nhập tiêu đề hoặc tên tài liệu học tập"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <label
              htmlFor="upload-subject"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Môn học <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="upload-subject"
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {SUBJECT_OPTIONS.filter((s) => s !== 'Tất cả').map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="upload-description"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Mô tả
            </label>
            <textarea
              id="upload-description"
              rows={3}
              placeholder="Nhập thông tin giới thiệu tóm tắt nội dung tài liệu..."
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* File Upload Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tệp tài liệu <span className="text-red-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              className="hidden"
              onChange={handleFileChange}
            />

            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
                  <FileUp className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Kéo thả file vào đây hoặc{' '}
                    <span className="text-blue-600 hover:underline">
                      chọn file từ máy tính
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Định dạng hỗ trợ: PDF, DOC, DOCX, PPT, PPTX (Dung lượng tối đa 50MB)
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
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs text-blue-600 hover:bg-blue-100"
                  >
                    Đổi file
                  </Button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    aria-label="Xóa file đã chọn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* 2. MATERIAL DETAIL MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedMaterial?.title || 'Chi tiết tài liệu'}
        size="xl"
        footer={
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsDetailModalOpen(false)}
          >
            Đóng
          </Button>
        }
      >
        {selectedMaterial && (
          <div className="space-y-6">
            {/* Overview Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {/* Subject */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Môn học</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedMaterial.subject}
                </p>
              </div>

              {/* Uploader */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span>Người upload</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedMaterial.uploaderName}
                </p>
              </div>

              {/* Upload Date */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Ngày upload</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {formatDate(selectedMaterial.uploadDate)}
                </p>
              </div>

              {/* File Size */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <HardDrive className="w-4 h-4 text-blue-600" />
                  <span>Dung lượng</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {formatFileSize(selectedMaterial.fileSize)}
                </p>
              </div>

              {/* Signature Status */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Trạng thái chữ ký</span>
                </div>
                <div>{renderSignatureBadge(selectedMaterial.signatureStatus)}</div>
              </div>

              {/* Current Version */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Phiên bản hiện tại</span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {selectedMaterial.version}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedMaterial.description && (
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mô tả tài liệu
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedMaterial.description}
                </p>
              </div>
            )}

            {/* Version History Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Lịch sử phiên bản
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedMaterial.versions.length} bản ghi
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Phiên bản
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Ngày upload
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Người upload
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Dung lượng
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Trạng thái chữ ký
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedMaterial.versions.map((ver, idx) => (
                        <tr
                          key={`${ver.version}-${idx}`}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-100 border border-slate-200">
                              {ver.version}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                            {formatDate(ver.uploadDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                            {ver.uploaderName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                            {formatFileSize(ver.fileSize)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {renderSignatureBadge(ver.signatureStatus)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MaterialsPage;
