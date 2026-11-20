/**
 * HKDN Certificate Verification System - TypeScript Type Definitions
 */

export type CertificateStatus = 'valid' | 'verified' | 'revoked' | 'pending' | 'expired';

export interface Certificate {
  id: string;
  title: string;
  certificateCode: string;
  code?: string; // Alias for certificateCode
  issuerName?: string;
  issuer?: string; // Alias for issuerName
  holderName?: string;
  recipientName?: string; // Alias for holderName
  studentName?: string; // Alias for holderName
  holderEmail?: string;
  recipientEmail?: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  expirationDate?: string;
  status: CertificateStatus | string;
  txHash?: string;
  blockchainHash?: string;
  blockchainNetwork?: string;
  blockNumber?: number;
  qrCodeUrl?: string;
  grade?: string;
  classification?: string;
  metadata?: Record<string, unknown>;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'issuer' | 'verifier' | 'student';
  avatarUrl?: string;
  department?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type MaterialSignatureStatus = 'signed' | 'unsigned' | 'invalid';

export interface MaterialVersion {
  version: string;
  uploadDate: string;
  uploaderName: string;
  fileSize: number;
  signatureStatus: MaterialSignatureStatus;
}

export interface Material {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  uploaderName: string;
  version: string;
  versions: MaterialVersion[];
  signatureStatus: MaterialSignatureStatus;
  description?: string;
  fileUrl?: string;
  txHash?: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  code: string;
  author: string;
  category: string;
  description?: string;
  fileUrl?: string;
  fileSize?: string;
  hash?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  txHash?: string;
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  verifiedAt: string;
  blockchainVerified: boolean;
  signatureVerified: boolean;
  message: string;
}

export interface DashboardStats {
  totalCertificates: number;
  totalMaterials: number;
  totalUsers: number;
  verifiedCertificates?: number;
  totalVerifications?: number;
  certificateTrend?: { value: number; isPositive: boolean };
  materialsTrend?: { value: number; isPositive: boolean };
  usersTrend?: { value: number; isPositive: boolean };
  verificationsTrend?: { value: number; isPositive: boolean };
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  certificates?: number;
  materials?: number;
  [key: string]: unknown;
}
