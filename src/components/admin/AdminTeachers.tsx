import React, { useState } from 'react';
import { User, MataPelajaran } from '../../types/cbt';
import { Users, Plus, Upload, Download, Edit, Trash2, KeyRound, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { CSVImportModal } from '../common/CSVImportModal';
import { exportToCSV } from '../../utils/csvUtils';

interface Props {
  users: User[];
  mapelList: MataPelajaran[];
  onAddTeacher: (user: User) => void;
  onUpdateTeacher: (user: User) => void;
  onDeleteTeacher: (id: string) => void;
  onBatchImportTeachers: (teachers: User[]) => void;
}

export const AdminTeachers: React.FC<Props> = ({
  users,
  mapelList,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onBatchImportTeachers,
}) => {
  const teachers = users.filter((u) => u.role === 'guru');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    email: '',
    nip: '',
    mapelIds: [] as string[],
  });

  const [notification, setNotification] = useState<string | null>(null);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ username: '', nama: '', email: '', nip: '', mapelIds: [] });
    setShowAddModal(true);
  };

  const openEditModal = (t: User) => {
    setEditId(t.id);
    setFormData({
      username: t.username,
      nama: t.nama,
      email: t.email,
      nip: t.nipNisn || '',
      mapelIds: t.mataPelajaranPengampu || [],
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.nama) return;

    if (editId) {
      const existing = teachers.find((t) => t.id === editId);
      if (existing) {
        onUpdateTeacher({
          ...existing,
          username: formData.username,
          nama: formData.nama,
          email: formData.email,
          nipNisn: formData.nip,
          mataPelajaranPengampu: formData.mapelIds,
        });
        setNotification('Data Guru berhasil diperbarui');
      }
    } else {
      const newTeacher: User = {
        id: `user-guru-${Date.now()}`,
        username: formData.username,
        nama: formData.nama,
        email: formData.email || `${formData.username}@sekolah.sch.id`,
        role: 'guru',
        nipNisn: formData.nip,
        mataPelajaranPengampu: formData.mapelIds,
      };
      onAddTeacher(newTeacher);
      setNotification('Guru baru berhasil ditambahkan');
    }

    setShowAddModal(false);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Username', 'Nama Lengkap Guru', 'NIP', 'Email', 'Mata Pelajaran Pengampu'];
    const rows = teachers.map((t) => {
      const mapelNames = (t.mataPelajaranPengampu || [])
        .map((mId) => mapelList.find((m) => m.id === mId)?.namaMapel)
        .filter(Boolean)
        .join('; ');
      return [t.id, t.username, t.nama, t.nipNisn || '-', t.email, mapelNames || '-'];
    });
    exportToCSV('daftar_guru_cbt.csv', headers, rows);
  };

  const handleImportCSVData = (rows: string[][]) => {
    const newTeachers: User[] = rows.map((row, idx) => ({
      id: `user-guru-import-${Date.now()}-${idx}`,
      username: row[0] || `guru_${idx}`,
      nama: row[2] || `Guru ${idx}`,
      email: row[3] || `guru${idx}@sekolah.sch.id`,
      role: 'guru',
      nipNisn: row[4] || '',
      mataPelajaranPengampu: [],
    }));
    onBatchImportTeachers(newTeachers);
    setNotification(`Berhasil mengimpor ${newTeachers.length} akun Guru`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Kelola Data Guru Pengampu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen akun guru, NIP, serta mata pelajaran yang diampu
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Guru
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Lengkap Guru</th>
                <th className="py-3 px-4">NIP / NIK</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mata Pelajaran Diampu</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {teachers.map((teacher) => {
                const assignedMapel = (teacher.mataPelajaranPengampu || [])
                  .map((mId) => mapelList.find((m) => m.id === mId)?.namaMapel)
                  .filter(Boolean);

                return (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{teacher.nama}</td>
                    <td className="py-3 px-4 font-mono">{teacher.nipNisn || '-'}</td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-semibold">{teacher.username}</td>
                    <td className="py-3 px-4">{teacher.email}</td>
                    <td className="py-3 px-4">
                      {assignedMapel.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedMapel.map((mName, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-2xs font-semibold"
                            >
                              {mName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-2xs">Belum diatur</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => alert(`Password Guru '${teacher.username}' di-reset menjadi guru123`)}
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(teacher)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Guru"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus akun guru ${teacher.nama}?`)) {
                              onDeleteTeacher(teacher.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">{editId ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="guru_math"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / NIK</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="198203152008011005"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Bambang Sukarno, S.Pd."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Guru</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="bambang@sekolah.sch.id"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran Pengampu</label>
                <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50">
                  {mapelList.map((m) => {
                    const isChecked = formData.mapelIds.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, mapelIds: [...formData.mapelIds, m.id] });
                            } else {
                              setFormData({
                                ...formData,
                                mapelIds: formData.mapelIds.filter((id) => id !== m.id),
                              });
                            }
                          }}
                          className="rounded-xs text-blue-600"
                        />
                        <span>{m.namaMapel} ({m.kodeMapel})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        type="guru"
        title="Akun Guru"
        onImportData={handleImportCSVData}
      />
    </div>
  );
};
