import React, { useState, useEffect } from 'react';
import { User, BankSoal, Ujian, HasilUjian, MataPelajaran } from '../../types/cbt';
import { FileQuestion, CalendarClock, BarChart3, Edit3, Key, Download, RefreshCw, Copy, Check } from 'lucide-react';

interface Props {
  currentGuru: User;
  bankSoalList: BankSoal[];
  ujianList: Ujian[];
  hasilUjianList: HasilUjian[];
  mapelList: MataPelajaran[];
  onNavigate: (menu: string) => void;
}

export const GuruDashboard: React.FC<Props> = ({
  currentGuru,
  bankSoalList,
  ujianList,
  hasilUjianList,
  mapelList,
  onNavigate,
}) => {
  const [now, setNow] = useState(Date.now());
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const handleCopyToken = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  useEffect(() => {
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

  const myBankList = bankSoalList.filter((b) => b.guruId === currentGuru.id);
  const myUjianList = ujianList.filter((u) => u.guruId === currentGuru.id);

  // Filter exams that have pending essay items to grade
  const pendingEssayCount = hasilUjianList.filter((h) => h.nilaiEsaiPending).length;

  return (
    <div className="space-y-6">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-2xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
            Panel Pengampu Guru
          </span>
          <h2 className="text-xl font-bold mt-2">Selamat Datang, {currentGuru.nama}</h2>
          <p className="text-xs text-slate-300 mt-1">
            NIP: <strong className="text-white font-mono">{currentGuru.nipNisn || '-'}</strong> | Kelola bank soal, jadwal ujian, serta koreksi esai
          </p>
        </div>

        <button
          onClick={() => onNavigate('bank_soal')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/30 transition-all shrink-0 flex items-center gap-2"
        >
          <FileQuestion className="w-4 h-4" /> Kelola Bank Soal Saya
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('bank_soal')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-slate-500 uppercase">Bank Soal Saya</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-2">{myBankList.length}</div>
          <p className="text-2xs text-slate-500 mt-1">Sesuai Mata Pelajaran Diampu</p>
        </div>

        <div
          onClick={() => onNavigate('kelola_ujian')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-slate-500 uppercase">Jadwal Ujian Saya</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CalendarClock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-2">{myUjianList.length}</div>
          <p className="text-2xs text-slate-500 mt-1">Sesi Ujian Aktif & Draf</p>
        </div>

        <div
          onClick={() => onNavigate('hasil_ujian')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold text-slate-500 uppercase">Koreksi Esai Pending</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Edit3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">{pendingEssayCount}</div>
          <p className="text-2xs text-slate-500 mt-1">Membutuhkan Penilaian Manual</p>
        </div>
      </div>

      {/* Teacher's Active Exams Token Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-blue-600" /> Sesi Ujian Saya & Status Token
          </h3>
          <button onClick={() => onNavigate('kelola_ujian')} className="text-xs text-blue-600 font-semibold hover:underline">
            Kelola Jadwal &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {myUjianList.map((u) => {
            const mapel = mapelList.find((m) => m.id === u.mapelId);

            return (
              <div
                key={u.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-2xs font-bold rounded-md font-mono">
                      {u.kodeUjian}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{u.namaUjian}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mapel: {mapel?.namaMapel} | Kelas: {u.targetKelas.join(', ')} | Durasi: {u.durasiMenit} m
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-slate-400 font-semibold uppercase">TOKEN SISWA</span>
                      {u.status === 'Aktif' && u.tokenActive && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Auto 5m: {getRotationCountdown(u.tokenGeneratedAt)}
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold tracking-widest text-slate-900 font-mono">
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
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      u.tokenActive ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
                    }`}
                    title={u.tokenActive ? 'Token Aktif' : 'Token Nonaktif'}
                  ></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
