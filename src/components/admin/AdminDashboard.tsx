import React, { useState } from 'react';
import { User, MataPelajaran, BankSoal, Ujian, HasilUjian, AbsenUjian } from '../../types/cbt';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileQuestion,
  CalendarClock,
  ShieldAlert,
  BarChart3,
  Key,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  users: User[];
  mapel: MataPelajaran[];
  bankSoal: BankSoal[];
  ujian: Ujian[];
  hasilUjian: HasilUjian[];
  absen: AbsenUjian[];
  onNavigate: (menu: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  users,
  mapel,
  bankSoal,
  ujian,
  hasilUjian,
  absen,
  onNavigate,
}) => {
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const handleCopyToken = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };
  const totalGuru = users.filter((u) => u.role === 'guru').length;
  const totalSiswa = users.filter((u) => u.role === 'siswa').length;
  const totalActiveExams = ujian.filter((u) => u.status === 'Aktif').length;

  // Active exam token list
  const activeExams = ujian.filter((u) => u.status === 'Aktif');

  // Total violations across all exams
  const totalViolations = absen.reduce((acc, curr) => acc + curr.jumlahPelanggaran, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner - High Density */}
      <div className="bg-[#0f172a] rounded-lg p-4 text-white shadow-xs border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
            Control Panel • High Density Mode
          </span>
          <h2 className="text-base font-bold mt-1 text-slate-100">Pusat Kendali CBT & Monitoring Real-Time</h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Sistem pengawasan ujian real-time, manajemen bank soal 6 tipe, token otomatis, serta rekapitulasi anti-cheat.
          </p>
        </div>
        <button
          onClick={() => onNavigate('kelola_ujian')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <CalendarClock className="w-3.5 h-3.5" /> Kelola Jadwal Ujian
        </button>
      </div>

      {/* Metrics Grid - High Density */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigate('kelola_guru')}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guru</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalGuru}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Pengampu Mapel</p>
        </div>

        <div
          onClick={() => onNavigate('kelola_siswa')}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Siswa</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalSiswa}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Peserta Terdaftar</p>
        </div>

        <div
          onClick={() => onNavigate('kelola_mapel')}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">{mapel.length}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Kurikulum Sekolah</p>
        </div>

        <div
          onClick={() => onNavigate('bank_soal')}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bank Soal</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileQuestion className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">{bankSoal.length}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">6 Tipe Soal</p>
        </div>

        <div
          onClick={() => onNavigate('kelola_ujian')}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ujian Aktif</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <CalendarClock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{totalActiveExams}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Sesi Berlangsung</p>
        </div>

        <div
          onClick={() => onNavigate('absen_ujian')}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pelanggaran</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">{totalViolations}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Log Anti-Cheat</p>
        </div>
      </div>

      {/* Active Exams Token Monitor & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Exam Token Live Card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Token Live Ujian Berlangsung</h3>
            </div>
            <button
              onClick={() => onNavigate('kelola_ujian')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Lihat Semua Jadwal &rarr;
            </button>
          </div>

          {activeExams.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Saat ini tidak ada sesi ujian yang sedang aktif.
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeExams.map((u) => {
                const targetMapel = mapel.find((m) => m.id === u.mapelId);
                return (
                  <div
                    key={u.id}
                    className="p-3 bg-slate-50 rounded-md border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          AKTIF
                        </span>
                        <span className="text-xs font-bold text-slate-800">{u.namaUjian}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mapel: {targetMapel?.namaMapel} | Target: {u.targetKelas.join(', ')} | Durasi: {u.durasiMenit} Menit
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 bg-white px-2.5 py-1.5 rounded border border-slate-200 shadow-2xs">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">TOKEN SISWA</div>
                        <div className="text-sm font-black tracking-widest text-slate-900 font-mono">
                          {u.tokenCode}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyToken(u.id, u.tokenCode)}
                        className={`p-1.5 rounded-lg border text-2xs font-bold transition-all flex items-center gap-1 ${
                          copiedTokenId === u.id
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                        title="Salin Token Ujian"
                      >
                        {copiedTokenId === u.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Tersalin!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Salin
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Anti-Cheat System Info Card */}
        <div className="bg-[#0f172a] rounded-lg border border-slate-800 text-white p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sistem Anti-Cheat Aktif</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Semua peserta ujian dipantau secara real-time via skrip pengawas browser:
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mode Fullscreen Wajib</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Anti Copy-Paste & Klik Kanan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Deteksi Pindah Tab (3x Lock)</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Server CBT Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
