import api from './api';

/** Ket qua xac thuc tra ve tu backend (khop voi VerificationResponse.java). */
export type VerificationStatus =
  | 'VALID'
  | 'UNVERIFIED'
  | 'REVOKED'
  | 'PENDING'
  | 'NOT_FOUND'
  | 'INVALID';

export interface VerificationResult {
  status: VerificationStatus;
  signatureValid: boolean;
  hashValid: boolean;
  code: string | null;
  title: string | null;
  recipientName: string | null;
  issuerName: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  message: string;
  contentHash: string | null;
  blockchainTxHash: string | null;
}

export interface VerificationLog {
  id: string;
  certificateCode: string | null;
  method: 'CODE' | 'PDF' | null;
  result: VerificationStatus | null;
  ipAddress: string | null;
  verifiedAt: string;
}

export interface VerificationLogPage {
  items: VerificationLog[];
  total: number;
  page: number;
  size: number;
}

/** Xac thuc bang ma chung chi (cong khai, khong can dang nhap). */
export const verifyByCode = async (code: string): Promise<VerificationResult> => {
  const { data } = await api.get<VerificationResult>(
    `/public/verify/certificates/${encodeURIComponent(code.trim())}`,
  );
  return data;
};

/** Xac thuc bang file PDF chung chi (cong khai, khong can dang nhap). */
export const verifyByPdf = async (file: File): Promise<VerificationResult> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<VerificationResult>('/public/verify/pdf', form);
  return data;
};

/** Lich su xac thuc (chi Admin va Can bo dao tao). */
export const getVerificationHistory = async (
  page = 0,
  size = 20,
): Promise<VerificationLogPage> => {
  const { data } = await api.get<VerificationLogPage>('/issuer/verifications', {
    params: { page, size },
  });
  return data;
};
