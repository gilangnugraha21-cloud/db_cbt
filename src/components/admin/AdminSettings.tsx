import React, { useState } from 'react';
import { AppSettings } from '../../types/cbt';
import {
  Sliders,
  Building2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  Eye,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Award,
  School,
  Sparkles,
  Database,
  Download,
  Code2,
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onOpenLoginPreview?: () => void;
}

export const AdminSettings: React.FC<Props> = ({
  settings,
  onSaveSettings,
  onOpenLoginPreview,
}) => {
  const [namaAplikasi, setNamaAplikasi] = useState(settings.namaAplikasi);
  const [subJudulAplikasi, setSubJudulAplikasi] = useState(settings.subJudulAplikasi);
  const [logoDashboardUrl, setLogoDashboardUrl] = useState(settings.logoDashboardUrl || '');
  const [logoLoginUrl, setLogoLoginUrl] = useState(settings.logoLoginUrl || '');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Preset sample logo assets
  const PRESET_LOGOS = [
    {
      name: 'Simbol Topi Toga (Emas/Biru)',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lambang Sekolah / Gedung',
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Buku Ilmu / Education Badge',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Perisai Garuda Ujian',
      url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'dashboard' | 'login'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file gambar melebihi 3MB. Silakan pilih gambar yang lebih kecil.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'dashboard') {
          setLogoDashboardUrl(base64);
        } else {
          setLogoLoginUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      namaAplikasi: namaAplikasi.trim() || 'CBT SEKOLAH PRO',
      subJudulAplikasi: subJudulAplikasi.trim() || 'High Density Computer Based Test Platform',
      logoDashboardUrl: logoDashboardUrl.trim(),
      logoLoginUrl: logoLoginUrl.trim(),
    });

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Atur ulang pengaturan nama dan logo aplikasi ke kondisi default?')) {
      setNamaAplikasi('CBT SEKOLAH PRO');
      setSubJudulAplikasi('High Density Computer Based Test Platform');
      setLogoDashboardUrl('');
      setLogoLoginUrl('');
      onSaveSettings({
        namaAplikasi: 'CBT SEKOLAH PRO',
        subJudulAplikasi: 'High Density Computer Based Test Platform',
        logoDashboardUrl: '',
        logoLoginUrl: '',
      });
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pengaturan Identitas & Branding Aplikasi</h2>
            <p className="text-xs text-slate-500">
              Kustomisasi nama aplikasi, logo header dashboard, dan logo halaman login sekolah
            </p>
          </div>
        </div>

        {onOpenLoginPreview && (
          <button
            type="button"
            onClick={onOpenLoginPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <Eye className="w-4 h-4 text-amber-400" /> Pratinjau Halaman Login
          </button>
        )}
      </div>

      {/* Success Notification Toast */}
      {isSavedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan nama dan logo aplikasi berhasil diperbarui! Perubahan diterapkan secara langsung ke seluruh tampilan sistem.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: App Name & Tagline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600" /> Identitas & Nama Aplikasi
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Utama Aplikasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={namaAplikasi}
                onChange={(e) => setNamaAplikasi(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Contoh: CBT SMA NEGERI 1 JAKARTA"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ditampilkan pada navbar header dashboard, judul halaman login, dan dokumen cetak.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub Judul / Tagline Aplikasi
              </label>
              <input
                type="text"
                value={subJudulAplikasi}
                onChange={(e) => setSubJudulAplikasi(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Contoh: Sistem Ujian Berbasis Komputer & Asesmen Digital"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Keterangan singkat yang muncul di bawah nama aplikasi.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Dashboard Header Logo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ImageIcon className="w-4 h-4 text-indigo-600" /> Logo Aplikasi untuk Dashboard Header
            </div>
            {logoDashboardUrl && (
              <button
                type="button"
                onClick={() => setLogoDashboardUrl('')}
                className="text-2xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Gunakan Logo Default
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input Options */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload File Gambar Logo Dashboard
                </label>
                <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700">
                  <Upload className="w-4 h-4 text-indigo-600" /> Pilih File Gambar (PNG/JPG/SVG)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'dashboard')}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atau Masukkan URL Gambar Logo
                </label>
                <input
                  type="text"
                  value={logoDashboardUrl}
                  onChange={(e) => setLogoDashboardUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="https://domain.com/logo-sekolah.png"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Atau Pilih Contoh Preset Logo:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_LOGOS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoDashboardUrl(item.url)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-2xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <img src={item.url} alt={item.name} className="w-4 h-4 rounded object-cover" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Card (Navbar header simulator) */}
            <div className="md:col-span-5 bg-slate-900 p-4 rounded-xl border border-slate-800 text-white space-y-2">
              <div className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Pratinjau Tampilan Header Dashboard
              </div>
              <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                {logoDashboardUrl ? (
                  <img
                    src={logoDashboardUrl}
                    alt="Logo Dashboard"
                    className="w-8 h-8 object-contain rounded bg-white/10 p-0.5 border border-white/20"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white shadow-xs shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="text-xs font-black tracking-wider text-white uppercase truncate flex items-center gap-1">
                    {namaAplikasi || 'CBT SEKOLAH PRO'}
                    <span className="text-[9px] px-1 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-bold font-mono">
                      v2.5
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {subJudulAplikasi || 'High Density Computer Based Test Platform'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Login Page Logo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ImageIcon className="w-4 h-4 text-emerald-600" /> Logo Aplikasi untuk Halaman Login
            </div>
            {logoLoginUrl && (
              <button
                type="button"
                onClick={() => setLogoLoginUrl('')}
                className="text-2xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Gunakan Logo Default
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input Options */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload File Gambar Logo Halaman Login
                </label>
                <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700">
                  <Upload className="w-4 h-4 text-emerald-600" /> Pilih File Gambar Logo (PNG/JPG/SVG)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'login')}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atau Masukkan URL Gambar Logo Login
                </label>
                <input
                  type="text"
                  value={logoLoginUrl}
                  onChange={(e) => setLogoLoginUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="https://domain.com/logo-login-sekolah.png"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Atau Pilih Contoh Preset Logo:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_LOGOS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoLoginUrl(item.url)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg text-2xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <img src={item.url} alt={item.name} className="w-4 h-4 rounded object-cover" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Card (Login screen card simulator) */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-indigo-900 text-white space-y-3 shadow-md">
              <div className="text-2xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Pratinjau Card Halaman Login
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center space-y-2">
                <div className="flex justify-center">
                  {logoLoginUrl ? (
                    <img
                      src={logoLoginUrl}
                      alt="Logo Login"
                      className="w-14 h-14 object-contain rounded-xl bg-white/20 p-1 border border-white/30 shadow-md"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg border border-indigo-400/30">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black tracking-wide uppercase text-white">
                    {namaAplikasi || 'CBT SEKOLAH PRO'}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-medium">
                    {subJudulAplikasi || 'High Density Computer Based Test Platform'}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="w-full py-1.5 bg-indigo-600/80 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    Tombol Masuk Ujian (Simulasi)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MySQL Database Configuration & Export Card */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">
                  FORMAT DATABASE MYSQL & DDL
                </h3>
                <p className="text-2xs text-slate-400">
                  Aplikasi CBT ini dirancang 100% kompatibel dengan skema database MySQL 5.7+ / 8.0+ & MariaDB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-amber-400">1. Nama Database MySQL</div>
              <div className="font-mono text-2xs text-slate-300">cbt_sekolah</div>
              <p className="text-[10px] text-slate-400">Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-emerald-400">2. Total Tabel Relasi</div>
              <div className="font-mono text-2xs text-slate-300">14 Tabel InnoDB with Foreign Keys</div>
              <p className="text-[10px] text-slate-400">Mendukung 6 Tipe Soal & Anti-Cheat Log</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-indigo-400">3. Backend Connection (PHP/Node)</div>
              <div className="font-mono text-2xs text-slate-300">PDO / mysqli_connect()</div>
              <p className="text-[10px] text-slate-400">Siap di-host di cPanel / Linux VPS / Docker</p>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" /> Atur Ulang ke Default
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Simpan Pengaturan Aplikasi
          </button>
        </div>
      </form>
    </div>
  );
};
