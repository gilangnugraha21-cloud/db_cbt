import React, { useState } from 'react';
import { MataPelajaran } from '../../types/cbt';
import { BookOpen, Plus, Upload, Download, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { CSVImportModal } from '../common/CSVImportModal';
import { exportToCSV } from '../../utils/csvUtils';

interface Props {
  mapelList: MataPelajaran[];
  onAddMapel: (m: MataPelajaran) => void;
  onUpdateMapel: (m: MataPelajaran) => void;
  onDeleteMapel: (id: string) => void;
  onBatchImportMapel: (mapel: MataPelajaran[]) => void;
}

export const AdminSubjects: React.FC<Props> = ({
  mapelList,
  onAddMapel,
  onUpdateMapel,
  onDeleteMapel,
  onBatchImportMapel,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kodeMapel: '',
    namaMapel: '',
    tingkat: '10',
    kelompok: 'Umum' as 'Umum' | 'Peminatan' | 'Kejuruan',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ kodeMapel: '', namaMapel: '', tingkat: '10', kelompok: 'Umum' });
    setShowAddModal(true);
  };

  const openEditModal = (m: MataPelajaran) => {
    setEditId(m.id);
    setFormData({
      kodeMapel: m.kodeMapel,
      namaMapel: m.namaMapel,
      tingkat: m.tingkat,
      kelompok: m.kelompok,
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kodeMapel || !formData.namaMapel) return;

    if (editId) {
      const existing = mapelList.find((m) => m.id === editId);
      if (existing) {
        onUpdateMapel({
          ...existing,
          kodeMapel: formData.kodeMapel,
          namaMapel: formData.namaMapel,
          tingkat: formData.tingkat,
          kelompok: formData.kelompok,
        });
        setNotification('Mata pelajaran berhasil diperbarui');
      }
    } else {
      const newMapel: MataPelajaran = {
        id: `mapel-${Date.now()}`,
        kodeMapel: formData.kodeMapel,
        namaMapel: formData.namaMapel,
        tingkat: formData.tingkat,
        kelompok: formData.kelompok,
      };
      onAddMapel(newMapel);
      setNotification('Mata pelajaran baru berhasil ditambahkan');
    }

    setShowAddModal(false);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Kode Mapel', 'Nama Mata Pelajaran', 'Tingkat Kelas', 'Kelompok Kurikulum'];
    const rows = mapelList.map((m) => [m.id, m.kodeMapel, m.namaMapel, m.tingkat, m.kelompok]);
    exportToCSV('daftar_mata_pelajaran_cbt.csv', headers, rows);
  };

  const handleImportCSVData = (rows: string[][]) => {
    const newItems: MataPelajaran[] = rows.map((row, idx) => ({
      id: `mapel-import-${Date.now()}-${idx}`,
      kodeMapel: row[0] || `MAPEL-${idx}`,
      namaMapel: row[1] || `Mata Pelajaran ${idx}`,
      tingkat: row[2] || '10',
      kelompok: (row[3] as 'Umum' | 'Peminatan' | 'Kejuruan') || 'Umum',
    }));
    onBatchImportMapel(newItems);
    setNotification(`Berhasil mengimpor ${newItems.length} mata pelajaran`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" /> Kelola Daftar Mata Pelajaran
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan kurikulum, kode mapel, tingkat kelas, serta kelompok mata pelajaran
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
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Mapel
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Mapel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mapelList.map((m) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-2xs font-mono font-bold">
                  {m.kodeMapel}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{m.namaMapel}</h3>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-2xs font-semibold">
                Kelas {m.tingkat}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-2xs text-slate-500 font-medium">Kelompok: <strong className="text-slate-800">{m.kelompok}</strong></span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(m)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Mapel"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus mata pelajaran ${m.namaMapel}?`)) {
                      onDeleteMapel(m.id);
                    }
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Hapus Mapel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">{editId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Mapel *</label>
                <input
                  type="text"
                  required
                  value={formData.kodeMapel}
                  onChange={(e) => setFormData({ ...formData, kodeMapel: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  placeholder="MAT-X"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={formData.namaMapel}
                  onChange={(e) => setFormData({ ...formData, namaMapel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  placeholder="Matematika Umum"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white"
                  >
                    <option value="10">Kelas 10 (X)</option>
                    <option value="11">Kelas 11 (XI)</option>
                    <option value="12">Kelas 12 (XII)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelompok</label>
                  <select
                    value={formData.kelompok}
                    onChange={(e) => setFormData({ ...formData, kelompok: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none bg-white"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Peminatan">Peminatan</option>
                    <option value="Kejuruan">Kejuruan</option>
                  </select>
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Simpan Mapel
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
        type="mapel"
        title="Mata Pelajaran"
        onImportData={handleImportCSVData}
      />
    </div>
  );
};
