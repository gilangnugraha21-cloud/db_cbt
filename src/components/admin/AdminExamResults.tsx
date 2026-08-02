import React, { useState, useMemo } from 'react';
import { HasilUjian, Ujian, Soal, User, JawabanSiswa } from '../../types/cbt';
import {
  BarChart3,
  Download,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Edit3,
  X,
  FileSpreadsheet,
  Filter,
} from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';

interface Props {
  hasilUjianList: HasilUjian[];
  ujianList: Ujian[];
  soalList: Soal[];
  students: User[];
  onGradeEssay: (
    hasilId: string,
    soalId: string,
    skor: number,
    catatan: string
  ) => void;
}

export const AdminExamResults: React.FC<Props> = ({
  hasilUjianList,
  ujianList,
  soalList,
  students,
  onGradeEssay,
}) => {
  const [selectedUjianId, setSelectedUjianId] = useState<string>(
    ujianList[0]?.id || 'all'
  );
  const [selectedKelas, setSelectedKelas] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHasilForGrading, setSelectedHasilForGrading] =
    useState<HasilUjian | null>(null);

  // Essay Grading Drawer State
  const [essayScores, setEssayScores] = useState<Record<string, { skor: number; catatan: string }>>({});

  const selectedUjian = ujianList.find((u) => u.id === selectedUjianId);

  // Calculate available classes based on selected exam or all data
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    if (selectedUjianId && selectedUjianId !== 'all') {
      if (selectedUjian?.targetKelas) {
        selectedUjian.targetKelas.forEach((k) => set.add(k));
      }
    } else {
      ujianList.forEach((u) => {
        u.targetKelas?.forEach((k) => set.add(k));
      });
    }
    hasilUjianList.forEach((h) => {
      if (
        (!selectedUjianId || selectedUjianId === 'all' || h.ujianId === selectedUjianId) &&
        h.kelas
      ) {
        set.add(h.kelas);
      }
    });
    students.forEach((s) => {
      if (s.kelas) set.add(s.kelas);
    });

    return Array.from(set).sort();
  }, [selectedUjian, selectedUjianId, ujianList, hasilUjianList, students]);

  const filteredResults = hasilUjianList.filter((h) => {
    const matchesUjian = !selectedUjianId || selectedUjianId === 'all' || h.ujianId === selectedUjianId;
    const matchesKelas = selectedKelas === 'all' || h.kelas === selectedKelas;
    const matchesSearch =
      (h.namaSiswa || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.nisn || '').includes(searchQuery) ||
      (h.kelas || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUjian && matchesKelas && matchesSearch;
  });

  // Calculate statistics
  const scores = filteredResults.map((r) => r.nilaiTotal);
  const avgScore =
    scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;

  const handleExportCSV = () => {
    const headers = [
      'Ujian',
      'Kode Ujian',
      'Nama Siswa',
      'NISN',
      'Kelas',
      'Status Pengerjaan',
      'Waktu Mulai',
      'Waktu Selesai',
      'Durasi (Detik)',
      'Pelanggaran Anti-Cheat',
      'Nilai Akhir (0-100)',
    ];

    const rows = filteredResults.map((h) => {
      const u = ujianList.find((uj) => uj.id === h.ujianId);
      return [
        u?.namaUjian || selectedUjian?.namaUjian || '-',
        u?.kodeUjian || selectedUjian?.kodeUjian || '-',
        h.namaSiswa,
        h.nisn,
        h.kelas,
        h.status,
        h.waktuMulaiKerja,
        h.waktuSelesaiKerja || '-',
        h.durasiPengerjaanDetik,
        h.jumlahPelanggaran,
        h.nilaiTotal,
      ];
    });

    const classSuffix = selectedKelas === 'all' ? 'semua_kelas' : selectedKelas.replace(/[^a-zA-Z0-9]/g, '_');
    const examSuffix =
      selectedUjianId && selectedUjianId !== 'all'
        ? selectedUjian?.kodeUjian || 'ujian'
        : 'semua_ujian';

    exportToCSV(`laporan_nilai_${examSuffix}_${classSuffix}.csv`, headers, rows);
  };

  const openGradingDrawer = (hasil: HasilUjian) => {
    setSelectedHasilForGrading(hasil);
    // Initialize essay scores state
    const initialGradingState: Record<string, { skor: number; catatan: string }> = {};
    (Object.entries(hasil.jawaban) as [string, JawabanSiswa][]).forEach(([soalId, ans]) => {
      if (ans.tipeSoal === 'esai') {
        initialGradingState[soalId] = {
          skor: ans.skorDiperoleh || 0,
          catatan: ans.catatanGuru || '',
        };
      }
    });
    setEssayScores(initialGradingState);
  };

  const handleSaveGrading = () => {
    if (!selectedHasilForGrading) return;

    Object.entries(essayScores).forEach(([soalId, data]) => {
      const typedData = data as { skor: number; catatan: string };
      onGradeEssay(selectedHasilForGrading.id, soalId, typedData.skor, typedData.catatan);
    });

    alert('Nilai esai dan catatan umpan balik guru berhasil disimpan!');
    setSelectedHasilForGrading(null);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Hasil & Analisis Nilai Ujian Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi perolehan skor, koreksi manual soal esai, & statistik item
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" /> Download Laporan (CSV/Excel)
        </button>
      </div>

      {/* Filter & Analytics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Sesi Ujian:
              </label>
              <select
                value={selectedUjianId}
                onChange={(e) => setSelectedUjianId(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Sesi Ujian</option>
                {ujianList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.namaUjian} ({u.kodeUjian})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Kelas:
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Semua Kelas ({availableClasses.length} Kelas)</option>
                {availableClasses.map((kelas) => (
                  <option key={kelas} value={kelas}>
                    Kelas {kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa, NISN, atau kelas..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Stats Pill Cards */}
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
          <div className="text-2xs text-slate-400 font-semibold uppercase">Rata-Rata Nilai</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{avgScore} / 100</div>
          <div className="text-2xs text-slate-400 mt-1">
            Peserta ({selectedKelas === 'all' ? 'Semua Kelas' : `Kelas ${selectedKelas}`}): {filteredResults.length} Siswa
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
          <div className="text-2xs text-slate-500 font-semibold uppercase">Rentang Skor Terendah / Tertinggi</div>
          <div className="text-lg font-bold text-slate-800 mt-1">
            <span className="text-rose-600">{minScore}</span> - <span className="text-emerald-600">{maxScore}</span>
          </div>
          <div className="text-2xs text-slate-500 mt-1">Skala Penilaian 0-100</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Status Pengerjaan</th>
                <th className="py-3 px-4">Pelanggaran</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Koreksi Esai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Belum ada data hasil ujian untuk sesi ini
                  </td>
                </tr>
              ) : (
                filteredResults.map((h) => {
                  const hasEssayToGrade = (Object.values(h.jawaban) as JawabanSiswa[]).some((ans) => ans.tipeSoal === 'esai');

                  return (
                    <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{h.namaSiswa}</td>
                      <td className="py-3 px-4 font-mono">{h.nisn}</td>
                      <td className="py-3 px-4 font-semibold">{h.kelas}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-2xs font-bold rounded-md ${
                            h.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : h.status === 'Terkunci Pelanggaran'
                              ? 'bg-rose-100 text-rose-800 font-bold'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {h.jumlahPelanggaran > 0 ? (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold text-2xs flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" /> {h.jumlahPelanggaran} Pelanggaran
                          </span>
                        ) : (
                          <span className="text-slate-400 text-2xs">0 (Bersih)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-extrabold text-sm text-blue-600 font-mono">
                        {h.nilaiTotal}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasEssayToGrade ? (
                          <button
                            onClick={() => openGradingDrawer(h)}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-2xs font-bold flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Koreksi Esai
                          </button>
                        ) : (
                          <span className="text-2xs text-slate-400 italic">Otomatis (Non-Esai)</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Essay Grading Drawer Modal */}
      {selectedHasilForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Koreksi Manual Soal Esai Siswa</h3>
                <p className="text-2xs text-slate-400">
                  {selectedHasilForGrading.namaSiswa} ({selectedHasilForGrading.kelas})
                </p>
              </div>
              <button
                onClick={() => setSelectedHasilForGrading(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {(Object.entries(selectedHasilForGrading.jawaban) as [string, JawabanSiswa][])
                .filter(([_, ans]) => ans.tipeSoal === 'esai')
                .map(([soalId, ans]) => {
                  const soal = soalList.find((s) => s.id === soalId);
                  const currentData = essayScores[soalId] || {
                    skor: ans.skorDiperoleh || 0,
                    catatan: ans.catatanGuru || '',
                  };

                  return (
                    <div
                      key={soalId}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="text-xs font-bold text-slate-900">
                        Pertanyaan Esai (Bobot Max: {soal?.bobot || 20} Poin)
                      </div>
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {soal?.pertanyaan}
                      </p>

                      {soal?.rubrikEsai && (
                        <div className="text-2xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 italic">
                          Rubrik Guru: {soal.rubrikEsai}
                        </div>
                      )}

                      <div className="text-xs font-bold text-blue-900">Jawaban Teks Siswa:</div>
                      <div className="text-xs text-slate-800 bg-blue-50/50 p-3 rounded-lg border border-blue-200 font-serif leading-relaxed">
                        "{ans.jawabanEsai || 'Siswa tidak mengisi jawaban esai'}"
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">
                            Beri Skor (0-{soal?.bobot || 20}):
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={soal?.bobot || 20}
                            value={currentData.skor}
                            onChange={(e) =>
                              setEssayScores({
                                ...essayScores,
                                [soalId]: { ...currentData, skor: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-2xs font-bold text-slate-700 mb-1">
                            Catatan Umpan Balik Guru:
                          </label>
                          <input
                            type="text"
                            value={currentData.catatan}
                            onChange={(e) =>
                              setEssayScores({
                                ...essayScores,
                                [soalId]: { ...currentData, catatan: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                            placeholder="Penjelasan penilaian untuk siswa..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-end gap-2 px-6 py-3 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setSelectedHasilForGrading(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveGrading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Simpan Penilaian Esai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
