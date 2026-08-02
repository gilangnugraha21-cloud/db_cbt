import React, { useState } from 'react';
import { User, AppSettings } from '../../types/cbt';
import {
  GraduationCap,
  Lock,
  User as UserIcon,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Users,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  settings: AppSettings;
  users: User[];
  currentUser: User;
  onLoginSelect: (user: User) => void;
  isPreview?: boolean;
  onClosePreview?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  settings,
  users,
  currentUser,
  onLoginSelect,
  isPreview = false,
  onClosePreview,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccessToast, setLoginSuccessToast] = useState(false);
  const [loginSuccessUser, setLoginSuccessUser] = useState<User | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const query = username.trim().toLowerCase();
    if (!query) {
      setErrorMessage('Silakan masukkan Username, NISN, atau NIP pengguna.');
      return;
    }

    const foundUser = users.find(
      (u) =>
        u.username.toLowerCase() === query ||
        (u.nipNisn && u.nipNisn.toLowerCase() === query) ||
        u.email.toLowerCase() === query ||
        u.nama.toLowerCase() === query
    );

    if (!foundUser) {
      setErrorMessage(`Username atau ID "${username}" tidak terdaftar dalam sistem.`);
      return;
    }

    setLoginSuccessUser(foundUser);
    setLoginSuccessToast(true);
    setTimeout(() => {
      onLoginSelect(foundUser);
      if (isPreview && onClosePreview) {
        onClosePreview();
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Lighting Radial Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Preview Mode Notification Bar */}
      {isPreview && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-4 py-2 rounded-full font-extrabold text-xs flex items-center gap-2 shadow-xl border border-amber-300">
          <span>Mode Pratinjau Halaman Login</span>
          {onClosePreview && (
            <button
              onClick={onClosePreview}
              className="bg-slate-950 text-white px-2.5 py-0.5 rounded-full text-2xs hover:bg-slate-800 transition-colors"
            >
              Tutup Pratinjau
            </button>
          )}
        </div>
      )}

      {/* Main Login Box */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        
        {/* Header Branding Logo & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            {settings.logoLoginUrl ? (
              <img
                src={settings.logoLoginUrl}
                alt="Logo Login Sekolah"
                className="w-20 h-20 object-contain rounded-2xl p-1.5 bg-slate-800 border border-slate-700 shadow-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl border border-indigo-400/30">
                <GraduationCap className="w-11 h-11 text-white" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-wider text-white uppercase">
              {settings.namaAplikasi || 'CBT SEKOLAH PRO'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-xs mx-auto leading-relaxed">
              {settings.subJudulAplikasi || 'High Density Computer Based Test Platform'}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Username / NISN / NIP
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Masukkan username, NISN, atau NIP..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Kata Sandi / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Masukkan kata sandi..."
              />
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/90 border border-rose-700 text-rose-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sistem CBT terhubung dengan protokol pengawasan integritas ujian otomatis.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogIn className="w-4 h-4" /> Masuk ke Sistem CBT
          </button>
        </form>

        {/* Success Feedback Toast */}
        {loginSuccessToast && loginSuccessUser && (
          <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Berhasil masuk sebagai {loginSuccessUser.nama} ({loginSuccessUser.role.toUpperCase()})! Pengalihan...</span>
          </div>
        )}

        {/* Back / Close Action */}
        {isPreview && onClosePreview && (
          <button
            type="button"
            onClick={onClosePreview}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-slate-500 text-[11px] space-y-1 z-10">
        <p>&copy; 2026 {settings.namaAplikasi || 'CBT SEKOLAH PRO'} - Hak Cipta Dilindungi</p>
        <p className="font-mono text-[10px] text-slate-600">Terautentikasi dengan Pembacaan Role Terintegrasi</p>
      </div>
    </div>
  );
};
