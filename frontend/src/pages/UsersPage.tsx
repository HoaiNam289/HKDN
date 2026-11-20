import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Edit,
  Sparkles,
  Users as UsersIcon,
  Shield,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { User } from '../types/types';
import { mockUsers } from '../data/mockUsers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import PageHeader from '../components/common/PageHeader';

type RoleFilterType = 'all' | 'admin' | 'issuer' | 'student';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'issuer', label: 'Giảng viên' },
  { value: 'student', label: 'Sinh viên' },
];

/**
 * Render role badge
 */
const renderRoleBadge = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return (
        <StatusBadge status="info">
          Admin
        </StatusBadge>
      );
    case 'issuer':
      return (
        <StatusBadge status="default">
          Giảng viên
        </StatusBadge>
      );
    case 'student':
      return (
        <StatusBadge status="default">
          Sinh viên
        </StatusBadge>
      );
    default:
      return <StatusBadge status="default">{role}</StatusBadge>;
  }
};

/**
 * Render status badge
 */
const renderStatusBadge = (status: User['status']) => {
  switch (status) {
    case 'active':
      return (
        <StatusBadge status="success" dot>
          Hoạt động
        </StatusBadge>
      );
    case 'inactive':
      return (
        <StatusBadge status="danger" dot>
          Vô hiệu
        </StatusBadge>
      );
    default:
      return <StatusBadge status="default">{status}</StatusBadge>;
  }
};

/**
 * Generate avatar initials from full name
 */
const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UsersPage: React.FC = () => {
  // Local list of users
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>('all');

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFullName, setAddFullName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<'admin' | 'issuer' | 'student'>('student');
  const [addDepartment, setAddDepartment] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addError, setAddError] = useState('');

  // Edit User Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'issuer' | 'student'>('student');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');
  const [editError, setEditError] = useState('');

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.department && user.department.toLowerCase().includes(query));

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Handle Open Edit Modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditRole(user.role as 'admin' | 'issuer' | 'student');
    setEditDepartment(user.department || '');
    setEditPassword('');
    setEditStatus(user.status);
    setEditError('');
    setIsEditModalOpen(true);
  };

  // Close Add Modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddFullName('');
    setAddEmail('');
    setAddRole('student');
    setAddDepartment('');
    setAddPassword('');
    setAddError('');
  };

  // Close Edit Modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFullName('');
    setEditEmail('');
    setEditRole('student');
    setEditDepartment('');
    setEditPassword('');
    setEditStatus('active');
    setEditError('');
  };

  // Handle Add User Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!addFullName.trim()) {
      setAddError('Vui lòng nhập họ và tên');
      return;
    }
    if (!addEmail.trim() || !addEmail.includes('@')) {
      setAddError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    if (!addPassword.trim() || addPassword.length < 6) {
      setAddError('Mật khẩu tối thiểu 6 ký tự');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: addFullName.trim(),
      email: addEmail.trim().toLowerCase(),
      role: addRole,
      department: addDepartment.trim() || undefined,
      status: 'active',
      createdAt: todayStr,
    };

    setUsers((prev) => [newUser, ...prev]);
    handleCloseAddModal();
  };

  // Handle Edit User Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    if (!editFullName.trim()) {
      setEditError('Vui lòng nhập họ và tên');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      setEditError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          fullName: editFullName.trim(),
          email: editEmail.trim().toLowerCase(),
          role: editRole,
          department: editDepartment.trim() || undefined,
          status: editStatus,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    handleCloseEditModal();
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Quản lý Người dùng"
          description="Quản lý tài khoản và phân quyền người dùng"
          action={
            <Button
              variant="primary"
              size="md"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Thêm người dùng
            </Button>
          }
        />

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Tìm kiếm người dùng..."
                icon={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Role filter select */}
              <div className="relative min-w-[180px]">
                <label htmlFor="role-filter" className="sr-only">
                  Lọc theo vai trò
                </label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as RoleFilterType)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Admin</option>
                  <option value="issuer">Giảng viên</option>
                  <option value="student">Sinh viên</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Shield className="w-4 h-4" />
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

        {/* Users Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Danh sách Tài khoản
              </h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium ml-1">
                {filteredUsers.length} người dùng
              </span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Hệ thống EduCertify Identity
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Họ tên
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center">
                    Vai trò
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Phòng/Khoa
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UsersIcon className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <p className="font-medium text-slate-700">
                          Không tìm thấy người dùng nào
                        </p>
                        <p className="text-xs text-slate-400">
                          Thử tìm kiếm với tên, email hoặc thay đổi bộ lọc vai trò
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Full Name & Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                            {getInitials(user.fullName)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-slate-400">
                              Tạo ngày: {user.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono text-xs">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderRoleBadge(user.role)}
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {user.department ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-700">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            {user.department}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderStatusBadge(user.status)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => handleOpenEdit(user)}
                          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          Sửa
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

      {/* 1. ADD USER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Thêm người dùng mới"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={handleCloseAddModal}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={handleAddSubmit}
            >
              Thêm người dùng
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {addError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{addError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <Input
              label="Họ tên"
              placeholder="VD: Nguyễn Văn An"
              required
              value={addFullName}
              onChange={(e) => setAddFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="VD: an.nguyen@educertify.edu.vn"
              required
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
            />
          </div>

          {/* Role Select */}
          <div>
            <label
              htmlFor="add-role-select"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Vai trò <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="add-role-select"
                value={addRole}
                onChange={(e) =>
                  setAddRole(e.target.value as 'admin' | 'issuer' | 'student')
                }
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Shield className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <Input
              label="Phòng/Khoa"
              placeholder="VD: Khoa Công nghệ Thông tin"
              value={addDepartment}
              onChange={(e) => setAddDepartment(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              required
              value={addPassword}
              onChange={(e) => setAddPassword(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* 2. EDIT USER MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Chỉnh sửa người dùng"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={handleCloseEditModal}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handleEditSubmit}
            >
              Cập nhật
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {editError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{editError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <Input
              label="Họ tên"
              placeholder="Nhập họ và tên"
              required
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Nhập địa chỉ email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          {/* Role Select */}
          <div>
            <label
              htmlFor="edit-role-select"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Vai trò <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="edit-role-select"
                value={editRole}
                onChange={(e) =>
                  setEditRole(e.target.value as 'admin' | 'issuer' | 'student')
                }
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <Input
              label="Phòng/Khoa"
              placeholder="VD: Khoa CNTT"
              value={editDepartment}
              onChange={(e) => setEditDepartment(e.target.value)}
            />
          </div>

          {/* Password (Optional in Edit) */}
          <div>
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Để trống nếu không đổi mật khẩu"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              helperText="Để trống nếu không đổi mật khẩu"
            />
          </div>

          {/* Status Switch Toggle */}
          <div className="pt-2">
            <span className="block text-sm font-medium text-slate-700 mb-2">
              Trạng thái tài khoản
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={editStatus === 'active'}
                onClick={() =>
                  setEditStatus((prev) => (prev === 'active' ? 'inactive' : 'active'))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  editStatus === 'active' ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    editStatus === 'active' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {editStatus === 'active' ? (
                  <span className="text-emerald-700 font-semibold">
                    Hoạt động
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Vô hiệu
                  </span>
                )}
              </span>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
