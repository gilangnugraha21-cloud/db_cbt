import React, { useState } from 'react';
import { Ujian, User, MataPelajaran, HasilUjian } from '../../types/cbt';
import { CalendarClock, Key, ArrowRight, ShieldCheck, Clock, CheckCircle2, AlertCircle, CheckSquare } from 'lucide-react';

interface Props {
  currentStudent: User;
  activeExams: Ujian[];
  mapelList: MataPelajaran[];
  hasilUjianList?: HasilUjian[];
  onStartExam: (ujian: Ujian, tokenEntered: string) => void;
}

export const SiswaExamList: React.FC<Props> = ({
  currentStudent,
  activeExams,
  mapelList,
  hasilUjianList = [],
  onStartExam,
}) => {
  const [selectedUjian, setSelectedUjian] = useState<Ujian | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to check if student has already completed an exam
  const isExamCompleted = (ujianId: string) => {
    return hasilUjianList.some(
      (h) => h.siswaId === currentStudent.id && h.ujianId === ujianId && h.status === 'Selesai'
    );
  };

  // Filter exams matching student's class
  const studentExams = activeExams.filter((u) => {
    if (!currentStudent.kelas) return true;
    return u.targetKelas.includes(currentStudent.kelas) || u.targetKelas.length === 0;
  });

  const handleEnterExam = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedUjian) {
      setErrorMessage('Pilih jadwal ujian terlebih dahulu');
      return;
    }

    if (isExamCompleted(selectedUjian.id)) {
      setErrorMessage('Anda sudah menyelesaikan ujian ini. Setiap siswa hanya diperkenankan mengerjakan ujian 1 kali.');
      return;
    }

    if (!tokenInput.trim()) {
      setErrorMessage('Masukkan token 6 karakter ujian terlebih dahulu');
      return;
    }

    // Validate Token Case-Insensitive
    if (tokenInput.trim().toUpperCase() !== selectedUjian.tokenCode.toUpperCase()) {
      setErrorMessage('Token yang Anda masukkan SALAH atau telah kadaluarsa! Minta token terbaru kepada guru pengawas.');
      return;
    }

    if (!selectedUjian.tokenActive) {
      setErrorMessage('Token ujian saat ini NONAKTIF oleh pengawas.');
      return;
    }

    onStartExam(selectedUjian, tokenInput.trim().toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Student Welcome Card */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Ruang Peserta CBT Siswa
          </span>
          <h2 className="text-lg font-bold mt-2 text-white">
            Selamat Datang, {currentStudent.nama}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            NISN: <span className="font-mono font-bold text-slate-200">{currentStudent.nipNisn || '0054321001'}</span> | Kelas: <span className="font-bold text-slate-200">{currentStudent.kelas || 'X-IPA-1'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Sistem Anti-Cheat Aktif</span>
        </div>
      </div>

      {/* Available Exams Selection & Token Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" /> Pilih Jadwal & Masukkan Token Ujian
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Minta 6 karakter Token Ujian kepada Guru/Pengawas di ruang ujian Anda
          </p>
        </div>

        {studentExams.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Saat ini tidak ada jadwal ujian aktif untuk kelas {currentStudent.kelas}.
          </div>
        ) : (
          <form onSubmit={handleEnterExam} className="space-y-6">
            {/* Exam Select Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                1. Pilih Sesi Ujian yang Akan Dikerjakan:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studentExams.map((u) => {
                  const mapel = mapelList.find((m) => m.id === u.mapelId);
                  const isSelected = selectedUjian?.id === u.id;
                  const completed = isExamCompleted(u.id);

                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUjian(u);
                        setErrorMessage(null);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                        completed
                          ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                          : isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                          {u.kodeUjian}
                        </span>
                        {completed ? (
                          <span className="text-2xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sudah Dikerjakan (1x)
                          </span>
                        ) : (
                          <span className="text-2xs font-bold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" /> {u.durasiMenit} Menit
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 mt-2">{u.namaUjian}</h4>
                      <p className="text-2xs text-slate-500 mt-1">Mata Pelajaran: {mapel?.namaMapel}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Token Input Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" /> 2. Masukkan Token 6 Karakter Ujian:
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  placeholder="e.g. CBT2026"
                  className="w-full sm:w-64 px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-base font-extrabold tracking-widest font-mono uppercase text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs text-center"
                />
                <p className="text-2xs text-slate-500 hidden sm:block">
                  *Token bersifat sensitif dan dipublikasikan oleh pengawas
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Start Button */}
            <button
              type="submit"
              disabled={!selectedUjian || !tokenInput || (selectedUjian ? isExamCompleted(selectedUjian.id) : false)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>
                {selectedUjian && isExamCompleted(selectedUjian.id)
                  ? 'Ujian Sudah Dikerjakan (Batas Maksimal 1 Kali)'
                  : 'Mulai Kerjakan Ujian Sekarang'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Rules Information */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
        <p className="font-bold">⚠️ Peraturan Keamanan Ujian CBT:</p>
        <ul className="list-disc list-inside text-2xs space-y-0.5 text-amber-800">
          <li>Ujian wajib dikerjakan dalam Mode Layar Penuh (Fullscreen).</li>
          <li>Dilarang membuka tab/aplikasi lain, menekan F12, serta melakukan Copy-Paste.</li>
          <li>Setiap pelanggaran akan dicatat oleh sistem. Jika melanggar 3 kali, ujian akan terkunci otomatis!</li>
        </ul>
      </div>
    </div>
  );
};
