import React, { useState } from 'react';
import { Ujian, BankSoal, MataPelajaran, User } from '../../types/cbt';
import {
  CalendarClock,
  Plus,
  Key,
  RefreshCw,
  Power,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Shuffle,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  ujianList: Ujian[];
  bankSoalList: BankSoal[];
  mapelList: MataPelajaran[];
  guruList: User[];
  currentUserId: string;
  onAddUjian: (u: Ujian) => void;
  onUpdateUjian: (u: Ujian) => void;
  onDeleteUjian: (id: string) => void;
  onGenerateToken: (ujianId: string) => void;
  onToggleTokenActive: (ujianId: string) => void;
}

export const AdminExams: React.FC<Props> = ({
  ujianList,
  bankSoalList,
  mapelList,
  guruList,
  currentUserId,
  onAddUjian,
  onUpdateUjian,
  onDeleteUjian,
  onGenerateToken,
  onToggleTokenActive,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kodeUjian: '',
    namaUjian: '',
    mapelId: mapelList[0]?.id || '',
    bankSoalId: bankSoalList[0]?.id || '',
    guruId: guruList[0]?.id || '',
    waktuMulai: new Date().toISOString().slice(0, 16),
    waktuSelesai: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    durasiMenit: 60,
    acakSoal: true,
    acakOpsi: true,
    targetKelas: 'X-IPA-1, X-IPA-2',
    status: 'Aktif' as 'Draf' | 'Aktif' | 'Selesai',
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const handleCopyToken = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRotationCountdown = (genAtStr?: string) => {
    if (!genAtStr) return '05:00';
    const genTime = new Date(genAtStr).getTime();
    const elapsedSec = Math.floor((now - genTime) / 1000);
    const remSec = Math.max(0, 300 - (elapsedSec % 300));
    const m = Math.floor(remSec / 60).toString().padStart(2, '0');
    const s = (remSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      kodeUjian: `UJN-${Math.floor(1000 + Math.random() * 9000)}`,
      namaUjian: '',
      mapelId: mapelList[0]?.id || '',
      bankSoalId: bankSoalList[0]?.id || '',
      guruId: guruList[0]?.id || '',
      waktuMulai: new Date().toISOString().slice(0, 16),
      waktuSelesai: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      durasiMenit: 60,
      acakSoal: true,
      acakOpsi: true,
      targetKelas: 'X-IPA-1, X-IPA-2',
      status: 'Aktif',
    });
    setShowModal(true);
  };

  const openEditModal = (u: Ujian) => {
    setEditId(u.id);
    setFormData({
      kodeUjian: u.kodeUjian,
      namaUjian: u.namaUjian,
      mapelId: u.mapelId,
      bankSoalId: u.bankSoalId,
      guruId: u.guruId,
      waktuMulai: u.waktuMulai.slice(0, 16),
      waktuSelesai: u.waktuSelesai.slice(0, 16),
      durasiMenit: u.durasiMenit,
      acakSoal: u.acakSoal,
      acakOpsi: u.acakOpsi,
      targetKelas: u.targetKelas.join(', '),
      status: u.status,
    });
    setShowModal(true);
  };

  const generate6CharToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kodeUjian || !formData.namaUjian) return;

    const classArray = formData.targetKelas.split(',').map((c) => c.trim()).filter(Boolean);

    if (editId) {
      const existing = ujianList.find((u) => u.id === editId);
      if (existing) {
        onUpdateUjian({
          ...existing,
          kodeUjian: formData.kodeUjian,
          namaUjian: formData.namaUjian,
          mapelId: formData.mapelId,
          bankSoalId: formData.bankSoalId,
          guruId: formData.guruId,
          waktuMulai: new Date(formData.waktuMulai).toISOString(),
          waktuSelesai: new Date(formData.waktuSelesai).toISOString(),
          durasiMenit: Number(formData.durasiMenit),
          acakSoal: formData.acakSoal,
          acakOpsi: formData.acakOpsi,
          targetKelas: classArray,
          status: formData.status,
        });
        setNotification('Jadwal Ujian berhasil diperbarui');
      }
    } else {
      const newUjian: Ujian = {
        id: `ujian-${Date.now()}`,
        kodeUjian: formData.kodeUjian,
        namaUjian: formData.namaUjian,
        mapelId: formData.mapelId,
        bankSoalId: formData.bankSoalId,
        guruId: formData.guruId || currentUserId,
        waktuMulai: new Date(formData.waktuMulai).toISOString(),
        waktuSelesai: new Date(formData.waktuSelesai).toISOString(),
        durasiMenit: Number(formData.durasiMenit),
        tokenActive: true,
        tokenCode: generate6CharToken(),
        tokenGeneratedAt: new Date().toISOString(),
        acakSoal: formData.acakSoal,
        acakOpsi: formData.acakOpsi,
        status: formData.status,
        targetKelas: classArray,
      };
      onAddUjian(newUjian);
      setNotification('Jadwal Ujian baru berhasil dibuat');
    }

    setShowModal(false);
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" /> Kelola Jadwal & Token Ujian
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan tanggal pelaksanaan, durasi, alokasi kelas, & rilis token 6 karakter
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Buat Jadwal Ujian Baru
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Exam Schedule Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ujianList.map((u) => {
          const mapel = mapelList.find((m) => m.id === u.mapelId);
          const bank = bankSoalList.find((b) => b.id === u.bankSoalId);
          const guru = guruList.find((g) => g.id === u.guruId);

          return (
            <div
              key={u.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-2xs rounded-md">
                      {u.kodeUjian}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-2xs font-bold rounded-full ${
                        u.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'Selesai'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Ujian"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus jadwal ujian ${u.namaUjian}?`)) {
                          onDeleteUjian(u.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Ujian"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">{u.namaUjian}</h3>

                <div className="mt-3 grid grid-cols-2 gap-2 text-2xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Mata Pelajaran</span>
                    <strong className="text-slate-800">{mapel?.namaMapel || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Guru Pengampu</span>
                    <strong className="text-slate-800">{guru?.nama || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Bank Soal Terkait</span>
                    <strong className="text-slate-800">{bank?.namaBank || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Durasi Pengerjaan</span>
                    <strong className="text-slate-800">{u.durasiMenit} Menit</strong>
                  </div>
                </div>

                <div className="mt-3 text-2xs text-slate-500 space-y-1">
                  <p>🎯 Target Kelas: <strong className="text-slate-800">{u.targetKelas.join(', ')}</strong></p>
                  <p className="flex items-center gap-1">
                    <Shuffle className="w-3 h-3 text-slate-400" /> Pengacakan:
                    <span>Soal ({u.acakSoal ? 'Ya' : 'Tidak'})</span> | <span>Opsi ({u.acakOpsi ? 'Ya' : 'Tidak'})</span>
                  </p>
                </div>
              </div>

              {/* Token Control Banner */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-slate-400 font-semibold uppercase">TOKEN SISWA</span>
                      {u.status === 'Aktif' && u.tokenActive && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800 flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Auto-Rotate 5m: {getRotationCountdown(u.tokenGeneratedAt)}
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold tracking-widest font-mono text-amber-300">
                      {u.tokenCode}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopyToken(u.id, u.tokenCode)}
                    className={`p-1.5 rounded-lg text-2xs font-semibold border transition-colors flex items-center gap-1 ${
                      copiedTokenId === u.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                    }`}
                    title="Salin Token Ujian"
                  >
                    {copiedTokenId === u.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Token</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onGenerateToken(u.id)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-2xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                    title="Rilis Token Baru Manual"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Acak Sekarang
                  </button>
                  <button
                    onClick={() => onToggleTokenActive(u.id)}
                    className={`p-1.5 rounded-lg text-2xs font-semibold transition-colors flex items-center gap-1 ${
                      u.tokenActive
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700'
                    }`}
                    title="Aktifkan/Nonaktifkan Token"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{u.tokenActive ? 'Aktif' : 'Mati'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Exam */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">{editId ? 'Edit Jadwal Ujian' : 'Buat Jadwal Ujian Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Ujian *</label>
                  <input
                    type="text"
                    required
                    value={formData.kodeUjian}
                    onChange={(e) => setFormData({ ...formData, kodeUjian: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="UJN-PAS-MAT10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Sesi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Aktif">Aktif (Bisa Diunduh/Diakses)</option>
                    <option value="Draf">Draf (Belum Aktif)</option>
                    <option value="Selesai">Selesai (Tutup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ujian / Evaluasi *</label>
                <input
                  type="text"
                  required
                  value={formData.namaUjian}
                  onChange={(e) => setFormData({ ...formData, namaUjian: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Penilaian Akhir Semester (PAS) Matematika Kelas X"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.mapelId}
                    onChange={(e) => setFormData({ ...formData, mapelId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.namaMapel}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Soal Digunakan</label>
                  <select
                    value={formData.bankSoalId}
                    onChange={(e) => setFormData({ ...formData, bankSoalId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {bankSoalList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.namaBank}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Mulai Ujian</label>
                  <input
                    type="datetime-local"
                    value={formData.waktuMulai}
                    onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Selesai Ujian</label>
                  <input
                    type="datetime-local"
                    value={formData.waktuSelesai}
                    onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Pengerjaan (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    max={360}
                    value={formData.durasiMenit}
                    onChange={(e) => setFormData({ ...formData, durasiMenit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Kelas (Pisah Koma)</label>
                  <input
                    type="text"
                    value={formData.targetKelas}
                    onChange={(e) => setFormData({ ...formData, targetKelas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="X-IPA-1, X-IPA-2"
                  />
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acakSoal}
                    onChange={(e) => setFormData({ ...formData, acakSoal: e.target.checked })}
                    className="rounded-xs text-blue-600"
                  />
                  <span>Acak Urutan Soal</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acakOpsi}
                    onChange={(e) => setFormData({ ...formData, acakOpsi: e.target.checked })}
                    className="rounded-xs text-blue-600"
                  />
                  <span>Acak Pilihan Opsi</span>
                </label>
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
                  Simpan Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
