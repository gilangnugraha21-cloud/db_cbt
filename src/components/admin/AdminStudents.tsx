import React, { useState } from 'react';
import { User } from '../../types/cbt';
import { GraduationCap, Plus, Upload, Download, Edit, Trash2, KeyRound, CheckCircle2, Search, Filter } from 'lucide-react';
import { CSVImportModal } from '../common/CSVImportModal';
import { exportToCSV } from '../../utils/csvUtils';

interface Props {
  users: User[];
  onAddStudent: (user: User) => void;
  onUpdateStudent: (user: User) => void;
  onDeleteStudent: (id: string) => void;
  onBatchImportStudents: (students: User[]) => void;
}

export const AdminStudents: React.FC<Props> = ({
  users,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBatchImportStudents,
}) => {
  const students = users.filter((u) => u.role === 'siswa');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    email: '',
    nisn: '',
    kelas: 'X-IPA-1',
    rombel: 'A',
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Extract unique classes for filtering
  const availableClasses = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean))) as string[];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nipNisn && s.nipNisn.includes(searchQuery));

    const matchesClass = selectedClassFilter === 'all' || s.kelas === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  const openAddModal = () => {
    setEditId(null);
    setFormData({ username: '', nama: '', email: '', nisn: '', kelas: 'X-IPA-1', rombel: 'A' });
    setShowAddModal(true);
  };

  const openEditModal = (s: User) => {
    setEditId(s.id);
    setFormData({
      username: s.username,
      nama: s.nama,
      email: s.email,
      nisn: s.nipNisn || '',
      kelas: s.kelas || 'X-IPA-1',
      rombel: s.rombel || 'A',
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.nama) return;

    if (editId) {
      const existing = students.find((s) => s.id === editId);
      if (existing) {
        onUpdateStudent({
          ...existing,
          username: formData.username,
          nama: formData.nama,
          email: formData.email,
          nipNisn: formData.nisn,
          kelas: formData.kelas,
          rombel: formData.rombel,
        });
        setNotification('Data Siswa berhasil diperbarui');
      }
    } else {
      const newStudent: User = {
        id: `user-siswa-${Date.now()}`,
        username: formData.username,
        nama: formData.nama,
        email: formData.email || `${formData.username}@siswa.sch.id`,
        role: 'siswa',
        nipNisn: formData.nisn,
        kelas: formData.kelas,
        rombel: formData.rombel,
      };
      onAddStudent(newStudent);
      setNotification('Siswa baru berhasil ditambahkan');
    }

    setShowAddModal(false);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Username', 'Nama Lengkap Siswa', 'NISN', 'Kelas', 'Rombel', 'Email'];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.username,
      s.nama,
      s.nipNisn || '-',
      s.kelas || '-',
      s.rombel || '-',
      s.email,
    ]);
    exportToCSV('daftar_siswa_cbt.csv', headers, rows);
  };

  const handleImportCSVData = (rows: string[][]) => {
    const newStudents: User[] = rows.map((row, idx) => ({
      id: `user-siswa-import-${Date.now()}-${idx}`,
      username: row[0] || `siswa_${idx}`,
      nama: row[2] || `Siswa ${idx}`,
      email: row[3] || `siswa${idx}@siswa.sch.id`,
      role: 'siswa',
      nipNisn: row[4] || '',
      kelas: row[5] || 'X-IPA-1',
      rombel: row[6] || 'A',
    }));
    onBatchImportStudents(newStudents);
    setNotification(`Berhasil mengimpor ${newStudents.length} akun Siswa`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" /> Kelola Data Siswa Peserta Ujian
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen identitas siswa, NISN, kelas, serta rombel untuk target ujian
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
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Siswa
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NISN, nama, atau username..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-600 font-semibold">Filter Kelas:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none"
          >
            <option value="all">Semua Kelas ({students.length} Siswa)</option>
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Rombel</th>
                <th className="py-3 px-4">Username Login</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Tidak ada data siswa ditemukan
                  </td>
                </tr>
              ) : (
                filteredStudents.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{siswa.nama}</td>
                    <td className="py-3 px-4 font-mono">{siswa.nipNisn || '-'}</td>
                    <td className="py-3 px-4 font-semibold">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-2xs">
                        {siswa.kelas || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{siswa.rombel || '-'}</td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-semibold">{siswa.username}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => alert(`Password Siswa '${siswa.username}' di-reset menjadi siswa123`)}
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(siswa)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data siswa ${siswa.nama}?`)) {
                              onDeleteStudent(siswa.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">{editId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="siswa01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="0054321001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Andi Pratama"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="X-IPA-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rombel</label>
                  <input
                    type="text"
                    value={formData.rombel}
                    onChange={(e) => setFormData({ ...formData, rombel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Siswa</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="andi@siswa.sch.id"
                />
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Simpan Siswa
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
        type="siswa"
        title="Akun Siswa"
        onImportData={handleImportCSVData}
      />
    </div>
  );
};
