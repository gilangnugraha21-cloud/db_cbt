import React, { useState } from 'react';
import { User } from '../../types/cbt';
import { Plus, Trash2, Edit, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  users: User[];
  onAddAdmin: (user: User) => void;
  onUpdateAdmin: (user: User) => void;
  onDeleteAdmin: (id: string) => void;
}

export const AdminAdmins: React.FC<Props> = ({
  users,
  onAddAdmin,
  onUpdateAdmin,
  onDeleteAdmin,
}) => {
  const admins = users.filter((u) => u.role === 'admin');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    email: '',
    nipNisn: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ username: '', nama: '', email: '', nipNisn: '' });
    setShowModal(true);
  };

  const openEditModal = (u: User) => {
    setEditId(u.id);
    setFormData({
      username: u.username,
      nama: u.nama,
      email: u.email,
      nipNisn: u.nipNisn || '',
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.nama) return;

    if (editId) {
      const existing = admins.find((a) => a.id === editId);
      if (existing) {
        onUpdateAdmin({
          ...existing,
          username: formData.username,
          nama: formData.nama,
          email: formData.email,
          nipNisn: formData.nipNisn,
        });
        setNotification('Data Admin berhasil diperbarui');
      }
    } else {
      const newAdmin: User = {
        id: `user-admin-${Date.now()}`,
        username: formData.username,
        nama: formData.nama,
        email: formData.email || `${formData.username}@sekolah.sch.id`,
        role: 'admin',
        nipNisn: formData.nipNisn,
      };
      onAddAdmin(newAdmin);
      setNotification('Admin baru berhasil ditambahkan');
    }

    setShowModal(false);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleResetPassword = (username: string) => {
    alert(`Password untuk Admin '${username}' telah di-reset menjadi default: admin123`);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" /> Kelola Superuser Administrator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pengelola dengan hak akses penuh ke seluruh modul sistem CBT
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Admin Baru
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Lengkap Admin</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">NIP / Identitas</th>
                <th className="py-3 px-4 text-center">Aksi & Reset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{admin.nama}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600">{admin.username}</td>
                  <td className="py-3 px-4">{admin.email}</td>
                  <td className="py-3 px-4">{admin.nipNisn || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleResetPassword(admin.username)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-2xs font-semibold flex items-center gap-1 transition-colors"
                        title="Reset Password ke default (admin123)"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Reset Pass
                      </button>
                      <button
                        onClick={() => openEditModal(admin)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Admin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {admins.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Hapus admin ${admin.nama}?`)) {
                              onDeleteAdmin(admin.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">{editId ? 'Edit Data Admin' : 'Tambah Admin Baru'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username Admin *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="admin_utama"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Dr. H. Ahmad Wijaya, M.Pd."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="admin@sekolah.sch.id"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / Identitas Pegawai</label>
                <input
                  type="text"
                  value={formData.nipNisn}
                  onChange={(e) => setFormData({ ...formData, nipNisn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="197508122000031001"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Simpan Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
