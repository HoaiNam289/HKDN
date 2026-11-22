import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Shield,
  Hash,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { mockCurrentStudent } from '../../data/mockStudentData';
import { useAuth } from '../../auth/AuthContext';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const student = { ...mockCurrentStudent, fullName: user?.fullName ?? '', email: user?.email ?? '' };

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
    department: student.department,
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveProfile = () => {
    // Chưa kết nối API — chỉ hiển thị thông báo
    alert('Tính năng cập nhật thông tin sẽ được kết nối với API sau.');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới không khớp.');
      return;
    }
    alert('Tính năng đổi mật khẩu sẽ được kết nối với API sau.');
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      {/* Demo indicator */}
      <div className="mb-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Dữ liệu minh họa — Chưa kết nối API thực tế</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Thông tin cá nhân</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý hồ sơ và bảo mật tài khoản</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 border border-white/30 rounded-full" />
              <div className="absolute bottom-2 left-8 w-16 h-16 border border-white/20 rounded-full" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 sm:px-8 pb-6 -mt-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50">
                  {student.fullName.split(' ').map(w => w[0]).slice(-2).join('')}
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-slate-900">{student.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <Shield className="w-3 h-3" />
                      Sinh viên
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSaveProfile}>
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <h3 className="text-base font-bold text-slate-900 mb-6">Thông tin chi tiết</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {isEditing ? (
              <>
                <Input
                  label="Họ và tên"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  icon={<Mail className="w-4 h-4" />}
                  disabled
                  helperText="Email không thể thay đổi"
                />
                <Input
                  label="Số điện thoại"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  icon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Khoa / Phòng ban"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  icon={<Building className="w-4 h-4" />}
                  disabled
                  helperText="Liên hệ quản trị viên để thay đổi"
                />
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Họ và tên</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{student.fullName}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{student.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Mã số sinh viên</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{student.studentId}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Số điện thoại</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{student.phone}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>Khoa / Phòng ban</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{student.department}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ngày tham gia</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(student.createdAt))}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Bảo mật tài khoản</h3>
              <p className="text-xs text-slate-500 mt-0.5">Thay đổi mật khẩu đăng nhập</p>
            </div>
            {!showPasswordForm && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Lock className="w-4 h-4" />}
                onClick={() => setShowPasswordForm(true)}
              >
                Đổi mật khẩu
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <div className="space-y-4 max-w-md">
              <Input
                label="Mật khẩu hiện tại"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                icon={<Lock className="w-4 h-4" />}
                rightIcon={showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onRightIconClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              />
              <Input
                label="Mật khẩu mới"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                icon={<Lock className="w-4 h-4" />}
                rightIcon={showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onRightIconClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              />
              <Input
                label="Xác nhận mật khẩu mới"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                icon={<Lock className="w-4 h-4" />}
                rightIcon={showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onRightIconClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              />
              <div className="flex items-center gap-2 pt-2">
                <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleChangePassword}>
                  Cập nhật mật khẩu
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Đăng xuất</h3>
              <p className="text-xs text-slate-500 mt-0.5">Thoát khỏi tài khoản hiện tại</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
