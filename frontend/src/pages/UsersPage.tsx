import React, { useCallback, useEffect, useState } from 'react'
import { Edit, Eye, Search, UserPlus, Users as UsersIcon } from 'lucide-react'
import api from '../services/api'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'

type Role = 'ADMIN' | 'ISSUER' | 'STUDENT'
interface UserRecord { id: string; email: string; fullName: string; enabled: boolean; locked: boolean; createdAt: string; updatedAt: string; roles: Array<{ id: number; code: Role; name: string }> }
interface PageResponse { content: UserRecord[]; number: number; size: number; totalElements: number; totalPages: number; first: boolean; last: boolean }

const roleNames: Record<Role, string> = { ADMIN: 'Admin', ISSUER: 'Issuer', STUDENT: 'Student' }
const errorMessage = (error: unknown, fallback: string) => (error as { response?: { data?: { error?: string } } })?.response?.data?.error || fallback
const initials = (value: string) => value.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U'
const isActive = (user: UserRecord) => user.enabled && !user.locked

export default function UsersPage() {
  const [page, setPage] = useState<PageResponse>({ content: [], number: 0, size: 10, totalElements: 0, totalPages: 0, first: true, last: true })
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selected, setSelected] = useState<UserRecord | null>(null)
  const [creating, setCreating] = useState(false)
  const [detail, setDetail] = useState<UserRecord | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get<PageResponse>('/admin/users', { params: { q: query || undefined, role: role || undefined, status: status || undefined, page: page.number, size: page.size, sort: 'createdAt,desc' } })
      setPage(response.data)
    } catch (error) { setMessage({ type: 'error', text: errorMessage(error, 'Không thể tải danh sách người dùng.') }) }
    finally { setLoading(false) }
  }, [page.number, page.size, query, role, status])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const save = async (payload: { email: string; fullName: string; roles: Role[]; enabled?: boolean; locked?: boolean }, user?: UserRecord) => {
    if (user && !window.confirm(`Xác nhận cập nhật tài khoản ${user.email}?`)) return
    try {
      if (user) await api.patch(`/admin/users/${user.id}`, payload)
      else await api.post('/admin/users', payload)
      setMessage({ type: 'success', text: user ? 'Đã cập nhật người dùng.' : 'Đã tạo tài khoản mới.' })
      setSelected(null); setCreating(false); await load()
    } catch (error) { setMessage({ type: 'error', text: errorMessage(error, 'Không thể lưu thông tin người dùng.') }) }
  }

  const toggleStatus = async (user: UserRecord) => {
    if (!window.confirm(`${isActive(user) ? 'Khóa' : 'Mở khóa'} tài khoản ${user.email}?`)) return
    await save({ email: user.email, fullName: user.fullName, roles: user.roles.map((item) => item.code), enabled: !isActive(user), locked: false }, user)
  }

  return <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans"><div className="max-w-7xl mx-auto space-y-6">
    <PageHeader title="Quản lý người dùng" description="Tài khoản, vai trò và trạng thái truy cập trong EduCertify" action={<Button icon={<UserPlus className="w-4 h-4" />} onClick={() => setCreating(true)}>Thêm người dùng</Button>} />
    {message && <div role="status" className={`rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{message.text}</div>}
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row gap-3"><div className="flex-1"><Input placeholder="Tìm theo họ tên hoặc email..." icon={<Search className="w-4 h-4" />} value={query} onChange={(event) => { setQuery(event.target.value); setPage((current) => ({ ...current, number: 0 })) }} /></div><select value={role} onChange={(event) => { setRole(event.target.value); setPage((current) => ({ ...current, number: 0 })) }} className="rounded-lg border border-slate-300 px-3 text-sm"><option value="">Tất cả vai trò</option><option value="ADMIN">Admin</option><option value="ISSUER">Issuer</option><option value="STUDENT">Student</option></select><select value={status} onChange={(event) => { setStatus(event.target.value); setPage((current) => ({ ...current, number: 0 })) }} className="rounded-lg border border-slate-300 px-3 text-sm"><option value="">Tất cả trạng thái</option><option value="ACTIVE">Hoạt động</option><option value="INACTIVE">Không hoạt động</option></select></div>
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"><div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2"><UsersIcon className="w-5 h-5 text-blue-600" /><h2 className="font-semibold text-slate-900">Danh sách tài khoản</h2><span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{page.totalElements}</span></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr><th className="px-6 py-3">Họ tên</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Vai trò</th><th className="px-6 py-3">Trạng thái</th><th className="px-6 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Đang tải dữ liệu...</td></tr> : page.content.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Không tìm thấy người dùng.</td></tr> : page.content.map((user) => <tr key={user.id} className="hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{initials(user.fullName)}</span><span className="font-medium text-slate-900">{user.fullName}</span></div></td><td className="px-6 py-4 font-mono text-xs text-slate-600">{user.email}</td><td className="px-6 py-4"><div className="flex flex-wrap gap-1">{user.roles.map((item) => <StatusBadge key={item.id} status={item.code === 'ADMIN' ? 'info' : 'default'}>{roleNames[item.code]}</StatusBadge>)}</div></td><td className="px-6 py-4">{isActive(user) ? <StatusBadge status="success" dot>Hoạt động</StatusBadge> : <StatusBadge status="danger" dot>Bị khóa</StatusBadge>}</td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => setDetail(user)}>Xem</Button><Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} onClick={() => setSelected(user)}>Sửa</Button><Button variant="ghost" size="sm" onClick={() => void toggleStatus(user)}>{isActive(user) ? 'Khóa' : 'Mở khóa'}</Button></div></td></tr>)}</tbody></table></div><div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500"><span>Trang {page.totalPages ? page.number + 1 : 0} / {page.totalPages || 0}</span><div className="flex gap-2"><Button variant="secondary" size="sm" disabled={page.first || loading} onClick={() => setPage((current) => ({ ...current, number: current.number - 1 }))}>Trước</Button><Button variant="secondary" size="sm" disabled={page.last || loading} onClick={() => setPage((current) => ({ ...current, number: current.number + 1 }))}>Sau</Button></div></div></div>
    <Modal isOpen={Boolean(creating)} onClose={() => setCreating(false)} title="Tạo tài khoản" size="md"><UserForm creating onCancel={() => setCreating(false)} onSave={(payload) => void save(payload)} /></Modal>
    <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Cập nhật người dùng" size="md">{selected && <UserForm user={selected} onCancel={() => setSelected(null)} onSave={(payload) => void save(payload, selected)} onReset={async (password) => { try { await api.post(`/admin/users/${selected.id}/reset-password`, { newPassword: password }); setMessage({ type: 'success', text: 'Đã đặt lại mật khẩu.' }) } catch (error) { setMessage({ type: 'error', text: errorMessage(error, 'Không thể đặt lại mật khẩu.') }) } }} />}</Modal>
    <Modal isOpen={Boolean(detail)} onClose={() => setDetail(null)} title="Chi tiết tài khoản" size="sm">{detail && <div className="space-y-3"><p><strong>Họ tên:</strong> {detail.fullName}</p><p><strong>Email:</strong> {detail.email}</p><p><strong>Vai trò:</strong> {detail.roles.map((item) => roleNames[item.code]).join(', ')}</p><p><strong>Trạng thái:</strong> {isActive(detail) ? 'Hoạt động' : 'Bị khóa'}</p><p><strong>Tạo lúc:</strong> {new Date(detail.createdAt).toLocaleString('vi-VN')}</p></div>}</Modal>
  </div></div>
}

export { UsersPage }

function UserForm({ user, creating, onCancel, onSave, onReset }: { user?: UserRecord; creating?: boolean; onCancel: () => void; onSave: (payload: { email: string; fullName: string; roles: Role[]; enabled?: boolean; locked?: boolean }) => void; onReset?: (password: string) => Promise<void> }) {
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState<Role[]>(user?.roles.map((item) => item.code) || ['STUDENT'])
  const [enabled, setEnabled] = useState(user ? user.enabled : true)
  const [locked, setLocked] = useState(user?.locked || false)
  const [error, setError] = useState('')
  const toggleRole = (value: Role) => setRoles((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!fullName.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Vui lòng nhập họ tên và email hợp lệ.'); if (creating && password.length < 12) return setError('Mật khẩu phải có ít nhất 12 ký tự.'); if (!roles.length) return setError('Tài khoản phải có ít nhất một vai trò.'); onSave({ fullName: fullName.trim(), email: email.trim(), roles, ...(creating ? {} : { enabled, locked }) }) }
  return <form onSubmit={submit} className="space-y-4"><p className="text-xs text-slate-500">Mật khẩu không được hiển thị lại và sẽ được mã hóa BCrypt.</p>{error && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>}<Input label="Họ và tên" value={fullName} onChange={(event) => setFullName(event.target.value)} required /><Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />{creating && <Input label="Mật khẩu" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} />}<fieldset><legend className="text-sm font-medium text-slate-700 mb-2">Vai trò</legend><div className="grid grid-cols-3 gap-2">{(['ADMIN', 'ISSUER', 'STUDENT'] as Role[]).map((item) => <label key={item} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={roles.includes(item)} onChange={() => toggleRole(item)} />{roleNames[item]}</label>)}</div></fieldset>{!creating && <><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />Được phép đăng nhập</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={locked} onChange={(event) => setLocked(event.target.checked)} />Khóa tài khoản</label></>}{!creating && onReset && <div className="border-t pt-4"><Input label="Mật khẩu mới (tùy chọn)" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} /><Button type="button" variant="secondary" size="sm" className="mt-2" disabled={password.length < 12} onClick={() => void onReset(password)}>Đặt lại mật khẩu</Button></div>}<div className="flex justify-end gap-2 pt-2"><Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button><Button type="submit">{creating ? 'Tạo tài khoản' : 'Lưu thay đổi'}</Button></div></form>
}
