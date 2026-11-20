import type { DashboardStats, ChartDataPoint } from '../types/types';

// Dữ liệu minh họa — Chỉ phục vụ thiết kế giao diện
export const mockStats: DashboardStats = {
  totalCertificates: 1247,
  totalMaterials: 856,
  totalUsers: 3421,
  verifiedCertificates: 1089,
  totalVerifications: 1089,
  certificateTrend: { value: 12.5, isPositive: true },
  materialsTrend: { value: 8.3, isPositive: true },
  usersTrend: { value: 15.2, isPositive: true },
  verificationsTrend: { value: 9.8, isPositive: true },
};

export const mockMonthlyData: ChartDataPoint[] = [
  { name: 'T1', certificates: 45, materials: 28, value: 73 },
  { name: 'T2', certificates: 52, materials: 35, value: 87 },
  { name: 'T3', certificates: 68, materials: 42, value: 110 },
  { name: 'T4', certificates: 74, materials: 50, value: 124 },
  { name: 'T5', certificates: 86, materials: 58, value: 144 },
  { name: 'T6', certificates: 95, materials: 64, value: 159 },
  { name: 'T7', certificates: 108, materials: 72, value: 180 },
  { name: 'T8', certificates: 115, materials: 80, value: 195 },
  { name: 'T9', certificates: 128, materials: 92, value: 220 },
  { name: 'T10', certificates: 142, materials: 105, value: 247 },
  { name: 'T11', certificates: 158, materials: 112, value: 270 },
  { name: 'T12', certificates: 176, materials: 118, value: 294 },
];

export const mockCategoryData: ChartDataPoint[] = [
  { name: 'CNTT', value: 465 },
  { name: 'Kinh tế', value: 295 },
  { name: 'Ngoại ngữ', value: 190 },
  { name: 'Kỹ thuật', value: 135 },
  { name: 'Khoa học', value: 105 },
  { name: 'Khác', value: 57 },
];
