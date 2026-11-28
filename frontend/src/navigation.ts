import { Award, BookOpen, Home, LayoutDashboard, ShieldCheck, User, Users, type LucideIcon } from 'lucide-react';
import type { RoleCode } from './auth/AuthContext';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  role?: RoleCode;
}

const verify: NavItem = { name: 'Xác thực chứng chỉ', href: '/verify', icon: ShieldCheck };
const studentDashboard: NavItem = {
  name: 'Tổng quan sinh viên', href: '/student/dashboard', icon: LayoutDashboard, role: 'STUDENT', exact: true,
};
const adminDashboard: NavItem = {
  name: 'Quản trị', href: '/dashboard', icon: LayoutDashboard, role: 'ADMIN', exact: true,
};

const portalItems: NavItem[] = [
  { name: 'Trang chủ', href: '/home', icon: Home, exact: true },
  studentDashboard,
  { name: 'Chứng chỉ của tôi', href: '/student/certificates', icon: Award, role: 'STUDENT' },
  { name: 'Thư viện học liệu', href: '/student/materials', icon: BookOpen, role: 'STUDENT' },
  verify,
  adminDashboard,
];

const accountItems: NavItem[] = [
  { name: 'Thông tin cá nhân', href: '/student/profile', icon: User, role: 'STUDENT' },
  studentDashboard,
  adminDashboard,
];

export const adminMenu: NavItem[] = [
  { ...adminDashboard, name: 'Tổng quan' },
  { name: 'Quản lý chứng chỉ', href: '/dashboard/certificates', icon: Award },
  { name: 'Quản lý học liệu', href: '/dashboard/materials', icon: BookOpen },
  { name: 'Quản lý tài khoản', href: '/dashboard/users', icon: Users },
  verify,
];

export function getPortalMenu(hasRole: (role: RoleCode) => boolean) {
  const visible = (item: NavItem) => !item.role || hasRole(item.role);
  return { main: portalItems.filter(visible), account: accountItems.filter(visible) };
}
