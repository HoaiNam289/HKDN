import type { Certificate, Material } from '../types/types';

/**
 * Dữ liệu minh họa dành cho Student Portal — Chỉ phục vụ thiết kế giao diện
 * Không phải dữ liệu xác thực thực tế
 */

// Sinh viên hiện tại (mock)
export const mockCurrentStudent = {
  id: 'user-006',
  fullName: 'Đỗ Minh Quân',
  email: 'do.minh.quan@educertify.edu.vn',
  role: 'student' as const,
  department: 'Khoa Công nghệ Thông tin',
  studentId: 'SV2021001',
  phone: '0901234567',
  avatarUrl: '',
  status: 'active' as const,
  createdAt: '2023-09-05',
};

// Chứng chỉ của sinh viên hiện tại (mock)
export const mockStudentCertificates: Certificate[] = [
  {
    id: 'cert-001',
    certificateCode: 'CERT-2024-001',
    title: 'Chứng chỉ Công nghệ Thông tin Chuẩn Kỹ năng Sử dụng CNTT Nâng cao',
    holderName: 'Đỗ Minh Quân',
    holderEmail: 'do.minh.quan@educertify.edu.vn',
    issuerName: 'Trường Đại học Bách Khoa EduCertify',
    issueDate: '2024-01-15',
    expiryDate: '2029-01-15',
    status: 'verified',
    txHash: '0x9f83a4c5e6d78219b0c1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
    description: 'Chứng nhận hoàn thành xuất sắc chương trình chuẩn kỹ năng sử dụng CNTT nâng cao.',
  },
  {
    id: 'cert-002',
    certificateCode: 'CERT-2024-012',
    title: 'Chứng chỉ Tiếng Anh B2 - Khung Tham chiếu Châu Âu (CEFR)',
    holderName: 'Đỗ Minh Quân',
    holderEmail: 'do.minh.quan@educertify.edu.vn',
    issuerName: 'Trung tâm Ngoại ngữ & Hợp tác Quốc tế EduCertify',
    issueDate: '2024-02-20',
    expiryDate: '2026-02-20',
    status: 'verified',
    txHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    description: 'Chứng nhận đạt trình độ Tiếng Anh bậc 4 (B2).',
  },
  {
    id: 'cert-003',
    certificateCode: 'CERT-2024-015',
    title: 'Chứng chỉ Lập trình Blockchain & Smart Contracts',
    holderName: 'Đỗ Minh Quân',
    holderEmail: 'do.minh.quan@educertify.edu.vn',
    issuerName: 'Khoa Công nghệ Thông tin EduCertify',
    issueDate: '2024-05-10',
    expiryDate: '2027-05-10',
    status: 'pending',
    description: 'Đang chờ xác nhận giao dịch trên sổ cái Blockchain.',
  },
  {
    id: 'cert-004',
    certificateCode: 'CERT-2024-018',
    title: 'Chứng chỉ Phân tích Dữ liệu Chuyên nghiệp (Data Analytics)',
    holderName: 'Đỗ Minh Quân',
    holderEmail: 'do.minh.quan@educertify.edu.vn',
    issuerName: 'Viện Đào tạo Quốc tế EduCertify',
    issueDate: '2024-08-14',
    expiryDate: '2027-08-14',
    status: 'verified',
    txHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    description: 'Chứng chỉ năng lực phân tích dữ liệu ứng dụng với Python & SQL.',
  },
];

// Học liệu sinh viên có thể truy cập (mock)
export const mockStudentMaterials: Material[] = [
  {
    id: 'mat-001',
    title: 'Bài giảng Lập trình Web Hiện đại với React & Spring Boot',
    subject: 'Lập trình Web',
    fileName: 'bai-giang-lap-trinh-web.pdf',
    fileSize: 12450000,
    uploadDate: '2024-02-15',
    uploaderName: 'TS. Lê Quốc Huy',
    version: 'v2.1.0',
    versions: [
      { version: 'v1.0.0', uploadDate: '2023-09-01', uploaderName: 'TS. Lê Quốc Huy', fileSize: 10200000, signatureStatus: 'signed' },
      { version: 'v2.0.0', uploadDate: '2024-01-10', uploaderName: 'TS. Lê Quốc Huy', fileSize: 11800000, signatureStatus: 'signed' },
      { version: 'v2.1.0', uploadDate: '2024-02-15', uploaderName: 'TS. Lê Quốc Huy', fileSize: 12450000, signatureStatus: 'signed' },
    ],
    signatureStatus: 'signed',
    description: 'Bộ giáo trình lý thuyết và bài tập thực hành phát triển ứng dụng Fullstack chuẩn doanh nghiệp.',
  },
  {
    id: 'mat-002',
    title: 'Đề thi và Đáp án Cuối kỳ Môn Cơ sở Dữ liệu',
    subject: 'Cơ sở dữ liệu',
    fileName: 'de-thi-cuoi-ky-csdl.pdf',
    fileSize: 2840000,
    uploadDate: '2024-03-20',
    uploaderName: 'ThS. Phạm Hải Đăng',
    version: 'v1.0.0',
    versions: [
      { version: 'v1.0.0', uploadDate: '2024-03-20', uploaderName: 'ThS. Phạm Hải Đăng', fileSize: 2840000, signatureStatus: 'signed' },
    ],
    signatureStatus: 'signed',
    description: 'Tài liệu đề thi học kỳ 1 năm học 2023-2024 kèm hướng dẫn giải chi tiết.',
  },
  {
    id: 'mat-003',
    title: 'Giáo trình Mạng Máy tính và Giao thức Mạng Nâng cao',
    subject: 'Mạng máy tính',
    fileName: 'giao-trinh-mang-may-tinh.pdf',
    fileSize: 24600000,
    uploadDate: '2024-04-05',
    uploaderName: 'PGS. TS. Trần Đức Hòa',
    version: 'v1.2.0',
    versions: [
      { version: 'v1.0.0', uploadDate: '2023-11-15', uploaderName: 'PGS. TS. Trần Đức Hòa', fileSize: 22100000, signatureStatus: 'signed' },
      { version: 'v1.2.0', uploadDate: '2024-04-05', uploaderName: 'PGS. TS. Trần Đức Hòa', fileSize: 24600000, signatureStatus: 'unsigned' },
    ],
    signatureStatus: 'unsigned',
    description: 'Bản thảo bài giảng mạng máy tính đang chờ ký số xác thực.',
  },
  {
    id: 'mat-004',
    title: 'Chuyên đề Trí tuệ Nhân tạo & Xử lý Ngôn ngữ Tự nhiên (NLP)',
    subject: 'Trí tuệ nhân tạo',
    fileName: 'tai-lieu-tri-tue-nhan-tao.pdf',
    fileSize: 38750000,
    uploadDate: '2024-04-28',
    uploaderName: 'TS. Vũ Bích Ngọc',
    version: 'v3.0.0',
    versions: [
      { version: 'v1.0.0', uploadDate: '2023-08-10', uploaderName: 'TS. Vũ Bích Ngọc', fileSize: 29500000, signatureStatus: 'signed' },
      { version: 'v2.0.0', uploadDate: '2023-12-05', uploaderName: 'TS. Vũ Bích Ngọc', fileSize: 34100000, signatureStatus: 'signed' },
      { version: 'v3.0.0', uploadDate: '2024-04-28', uploaderName: 'TS. Vũ Bích Ngọc', fileSize: 38750000, signatureStatus: 'signed' },
    ],
    signatureStatus: 'signed',
    description: 'Tập hợp các nghiên cứu, mô hình học sâu Transformer và mã nguồn mẫu ứng dụng thực tế.',
  },
  {
    id: 'mat-005',
    title: 'Sổ tay Thực hành An toàn Thông tin và Mật mã học',
    subject: 'An toàn thông tin',
    fileName: 'so-tay-thuc-hanh-attt.pdf',
    fileSize: 15200000,
    uploadDate: '2024-05-12',
    uploaderName: 'TS. Lê Quốc Huy',
    version: 'v1.1.0',
    versions: [
      { version: 'v1.0.0', uploadDate: '2024-01-22', uploaderName: 'TS. Lê Quốc Huy', fileSize: 14800000, signatureStatus: 'signed' },
      { version: 'v1.1.0', uploadDate: '2024-05-12', uploaderName: 'TS. Lê Quốc Huy', fileSize: 15200000, signatureStatus: 'signed' },
    ],
    signatureStatus: 'signed',
    description: 'Tài liệu hướng dẫn phòng chống tấn công Web và kỹ thuật mã hóa RSA/ECC.',
  },
  {
    id: 'mat-006',
    title: 'Tài liệu Kỹ thuật Lập trình Hệ thống & Hợp đồng Thông minh',
    subject: 'Kỹ thuật Blockchain',
    fileName: 'lap-trinh-blockchain-solidity.pdf',
    fileSize: 8900000,
    uploadDate: '2024-06-01',
    uploaderName: 'ThS. Nguyễn Văn Hải',
    version: 'v1.0.1',
    versions: [
      { version: 'v1.0.0', uploadDate: '2024-05-10', uploaderName: 'ThS. Nguyễn Văn Hải', fileSize: 8750000, signatureStatus: 'signed' },
      { version: 'v1.0.1', uploadDate: '2024-06-01', uploaderName: 'ThS. Nguyễn Văn Hải', fileSize: 8900000, signatureStatus: 'invalid' },
    ],
    signatureStatus: 'invalid',
    description: 'Tài liệu bị cảnh báo chữ ký số không hợp lệ do thay đổi nội dung file sau khi ký.',
  },
];

// Hoạt động gần đây (mock)
export const mockRecentActivities = [
  {
    id: 'act-1',
    type: 'certificate_received' as const,
    title: 'Nhận chứng chỉ Phân tích Dữ liệu',
    description: 'Chứng chỉ đã được ký số và ghi nhận trên Blockchain',
    timestamp: '2024-08-14T10:30:00',
  },
  {
    id: 'act-2',
    type: 'material_accessed' as const,
    title: 'Truy cập Giáo trình Trí tuệ Nhân tạo',
    description: 'Phiên bản v3.0.0 — Đã xác thực chữ ký số',
    timestamp: '2024-08-12T14:15:00',
  },
  {
    id: 'act-3',
    type: 'certificate_pending' as const,
    title: 'Chứng chỉ Blockchain đang chờ duyệt',
    description: 'Chờ xác nhận giao dịch trên sổ cái Blockchain',
    timestamp: '2024-05-10T09:00:00',
  },
  {
    id: 'act-4',
    type: 'verification' as const,
    title: 'Xác thực chứng chỉ CNTT Nâng cao',
    description: 'Xác thực thành công qua mã CERT-2024-001',
    timestamp: '2024-07-20T16:45:00',
  },
];
