import React, { useState, useMemo } from 'react';
import { HasilUjian, Ujian, User, MataPelajaran } from '../../types/cbt';
import {
  History,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Clock,
  BookOpen,
  FileText,
  AlertTriangle,
  Eye,
  X,
  Sparkles,
  BarChart2,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentStudent: User;
  hasilUjianList: HasilUjian[];
  ujianList: Ujian[];
  mapelList: MataPelajaran[];
  users: User[];
}

export const SiswaExamHistory: React.FC<Props> = ({
  currentStudent,
  hasilUjianList,
  ujianList,
  mapelList,
  users,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [selectedMapelId, setSelectedMapelId] = useState('all');
  const [selectedHasilModal, setSelectedHasilModal] = useState<HasilUjian | null>(null);

  // Student's own finished exam results
  const studentResults = useMemo(() => {
    return hasilUjianList.filter(
      (h) => h.siswaId === currentStudent.id && h.status === 'Selesai'
    );
  }, [hasilUjianList, currentStudent.id]);

  // Filtered student results based on search & date filter
  const filteredResults = useMemo(() => {
    return studentResults.filter((hasil) => {
      const parentUjian = ujianList.find((u) => u.id === hasil.ujianId);
      const parentMapel = mapelList.find((m) => m.id === parentUjian?.mapelId);

      // Search match (Nama Ujian, Kode Ujian, Nama Mapel)
      const matchesSearch =
        searchQuery.trim() === '' ||
        (parentUjian?.namaUjian || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parentUjian?.kodeUjian || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parentMapel?.namaMapel || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Mapel match
      const matchesMapel =
        selectedMapelId === 'all' || parentUjian?.mapelId === selectedMapelId;

      // Date match (Compare YYYY-MM-DD from waktuMulaiKerja or waktuSelesaiKerja)
      let matchesDate = true;
      const examDateStr = (hasil.waktuSelesaiKerja || hasil.waktuMulaiKerja || '').substring(0, 10);

      if (startDateFilter) {
        matchesDate = matchesDate && examDateStr >= startDateFilter;
      }
      if (endDateFilter) {
        matchesDate = matchesDate && examDateStr <= endDateFilter;
      }

      return matchesSearch && matchesMapel && matchesDate;
    });
  }, [studentResults, ujianList, mapelList, searchQuery, selectedMapelId, startDateFilter, endDateFilter]);

  // Calculate statistics
  const totalCompleted = studentResults.length;

  // Preset Date Handlers
  const handleSetTodayFilter = () => {
    const today = new Date().toISOString().substring(0, 10);
    setStartDateFilter(today);
    setEndDateFilter(today);
  };

  const handleSetThisMonthFilter = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .substring(0, 10);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .substring(0, 10);
    setStartDateFilter(firstDay);
    setEndDateFilter(lastDay);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStartDateFilter('');
    setEndDateFilter('');
    setSelectedMapelId('all');
  };

  const formatDateString = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <History className="w-3.5 h-3.5" /> Riwayat Ujian Siswa
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white mt-2">
            Rekapitulasi Riwayat Ujian - {currentStudent.nama}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            NISN: <span className="font-mono font-bold text-slate-200">{currentStudent.nipNisn || '-'}</span> | Email: <span className="font-bold text-slate-200">{currentStudent.email || '-'}</span>
          </p>
        </div>

        {/* Stats Mini Cards */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Ujian Selesai</div>
            <div className="text-lg font-black text-indigo-400 mt-0.5">{totalCompleted} Ujian</div>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Status Jawaban</div>
            <div className="text-xs font-black text-emerald-400 mt-1.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar with Date Picker Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-600" /> Filter & Pencarian Riwayat Ujian
          </div>
          {(startDateFilter || endDateFilter || searchQuery || selectedMapelId !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-2xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <label className="block text-2xs font-bold uppercase text-slate-500 mb-1">Cari Ujian / Mapel:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama ujian, kode, atau mapel..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mapel Dropdown Filter */}
          <div>
            <label className="block text-2xs font-bold uppercase text-slate-500 mb-1">Mata Pelajaran:</label>
            <select
              value={selectedMapelId}
              onChange={(e) => setSelectedMapelId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Semua Mata Pelajaran</option>
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.namaMapel}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Quick Presets */}
          <div>
            <label className="block text-2xs font-bold uppercase text-slate-500 mb-1">Preset Tanggal:</label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleSetTodayFilter}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-2xs font-bold text-slate-700 transition-colors"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={handleSetThisMonthFilter}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-2xs font-bold text-slate-700 transition-colors"
              >
                Bulan Ini
              </button>
            </div>
          </div>
        </div>

        {/* Date Filter Inputs (Tanggal Ujian) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" /> Filter Tanggal Ujian:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-2xs font-semibold text-slate-500">Dari:</span>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <span className="text-slate-400 font-bold">-</span>

            <div className="flex items-center gap-1.5">
              <span className="text-2xs font-semibold text-slate-500">Sampai:</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Finished Exam Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Daftar Ujian Selesai ({filteredResults.length})
          </h3>
        </div>

        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
            <History className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 text-sm">Tidak ada riwayat ujian yang ditemukan.</p>
            <p className="text-slate-400">
              {studentResults.length === 0
                ? 'Anda belum pernah menyelesaikan sesi ujian.'
                : 'Coba ubah kata kunci atau rentang tanggal filter ujian.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((hasil) => {
              const ujian = ujianList.find((u) => u.id === hasil.ujianId);
              const mapel = mapelList.find((m) => m.id === ujian?.mapelId);
              const guru = users.find((u) => u.id === ujian?.guruId);

              const durationMinutes = Math.round((hasil.durasiPengerjaanDetik || 0) / 60);

              return (
                <div
                  key={hasil.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Exam Header Tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xs font-mono font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                        {ujian?.kodeUjian || 'UJIAN'}
                      </span>
                      <span className="text-2xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                      </span>
                    </div>

                    {/* Title & Subject */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {ujian?.namaUjian || 'Sesi Ujian CBT'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> {mapel?.namaMapel || 'Mata Pelajaran'}
                        {guru && <span className="text-slate-400">({guru.nama})</span>}
                      </p>
                    </div>

                    {/* Time & Duration Info */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-2xs space-y-1 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>Dikerjakan: {formatDateString(hasil.waktuSelesaiKerja || hasil.waktuMulaiKerja)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Durasi Pengerjaan: {durationMinutes} Menit ({hasil.durasiPengerjaanDetik || 0} Detik)</span>
                      </div>
                      {hasil.jumlahPelanggaran > 0 && (
                        <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>Tercatat {hasil.jumlahPelanggaran} kali indikasi pelanggaran tab</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Footer & Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Status Hasil Jawaban</div>
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-0.5 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai Dikerjakan
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedHasilModal(hasil)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> Rincian Ujian
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail Rincian Hasil Ujian */}
      {selectedHasilModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn space-y-0">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">Rincian Pengerjaan Ujian</h3>
                  <p className="text-2xs text-slate-400">{selectedHasilModal.namaSiswa} ({selectedHasilModal.kelas})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHasilModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {(() => {
                const u = ujianList.find((uj) => uj.id === selectedHasilModal.ujianId);
                const m = mapelList.find((mp) => mp.id === u?.mapelId);

                return (
                  <>
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl space-y-2 text-indigo-950">
                      <div className="text-2xs font-bold uppercase tracking-wider text-indigo-600">Informasi Ujian</div>
                      <div className="text-sm font-bold text-slate-900">{u?.namaUjian}</div>
                      <div className="text-xs text-slate-600 font-medium">Mata Pelajaran: {m?.namaMapel}</div>
                      <div className="text-2xs font-mono text-slate-500">Kode Ujian: {u?.kodeUjian}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Waktu Pengerjaan</div>
                        <div className="text-xs font-bold text-slate-800">
                          {formatDateString(selectedHasilModal.waktuSelesaiKerja || selectedHasilModal.waktuMulaiKerja)}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Durasi Pengerjaan</div>
                        <div className="text-xs font-bold text-slate-800">
                          {Math.round((selectedHasilModal.durasiPengerjaanDetik || 0) / 60)} Menit
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                      <div className="text-2xs text-slate-400 uppercase font-bold tracking-wider">Status Lembar Jawaban</div>
                      <div className="text-base font-extrabold text-emerald-400 flex items-center justify-center gap-1.5 py-1">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Selesai Dikerjakan & Tersimpan
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium">
                        Seluruh jawaban ujian Anda telah berhasil direkam dan dikirim ke sistem.
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="text-2xs font-bold text-slate-700 uppercase">Status Pengawasan & Catatan Integrity</div>
                      <div className="text-xs text-slate-600">
                        {selectedHasilModal.jumlahPelanggaran === 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sesi ujian bersih, tidak ditemukan kecurangan tab.
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> Tercatat {selectedHasilModal.jumlahPelanggaran} kali berpindah tab/layar saat ujian berlangsung.
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHasilModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Tutup Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
