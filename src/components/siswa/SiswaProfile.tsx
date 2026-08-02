import React, { useState } from 'react';
import { User } from '../../types/cbt';
import {
  User as UserIcon,
  Lock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  IdCard,
} from 'lucide-react';

interface Props {
  currentStudent: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const SiswaProfile: React.FC<Props> = ({
  currentStudent,
  onUpdateUser,
}) => {
  // Profile Identity States
  const [nama, setNama] = useState(currentStudent.nama);
  const [nipNisn, setNipNisn] = useState(currentStudent.nipNisn || '');
  const [email, setEmail] = useState(currentStudent.email || '');
  const [noHp, setNoHp] = useState(currentStudent.noHp || '');

  // Password Update States
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Visibility & Message States
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!nama.trim()) {
      setErrorMessage('Nama lengkap siswa tidak boleh kosong.');
      return;
    }

    // Password Validation if user wants to change password
    let updatedPassword = currentStudent.password || '123456';

    if (newPassword || confirmPassword || currentPasswordInput) {
      if (currentPasswordInput !== (currentStudent.password || '123456')) {
        setErrorMessage('Password saat ini tidak cocok dengan kata sandi akun Anda.');
        return;
      }

      if (newPassword.length < 4) {
        setErrorMessage('Password baru minimal terdiri dari 4 karakter.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('Konfirmasi password baru tidak cocok.');
        return;
      }

      updatedPassword = newPassword;
    }

    const updatedUser: User = {
      ...currentStudent,
      nama: nama.trim(),
      nipNisn: nipNisn.trim(),
      email: email.trim(),
      noHp: noHp.trim(),
      password: updatedPassword,
    };

    onUpdateUser(updatedUser);

    // Reset password fields
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');

    setSuccessMessage('Profil identitas dan password akun siswa berhasil diperbarui!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {nama.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">{nama || 'Nama Siswa'}</h2>
            <p className="text-xs text-slate-500 font-medium">
              NISN: <span className="font-mono font-bold text-slate-700">{nipNisn || '-'}</span> | Email: <span className="font-bold text-indigo-600">{email || '-'}</span>
            </p>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold inline-block mt-1">
              Akun Siswa Aktif
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-2xs space-y-1 text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Keamanan Akun
          </div>
          <p>Ubah identitas atau kata sandi secara berkala untuk menjaga kerahasiaan sesi ujian.</p>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Identitas Siswa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <IdCard className="w-4 h-4 text-indigo-600" /> Identitas Profil Siswa
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Masukkan nama lengkap..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NISN / Nomor Induk Siswa
              </label>
              <input
                type="text"
                value={nipNisn}
                onChange={(e) => setNipNisn(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Contoh: 0054321001"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Contoh: siswa@sekolah.sch.id"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. Handphone / WhatsApp
              </label>
              <input
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pengaturan Password Akun */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <KeyRound className="w-4 h-4 text-emerald-600" /> Pengaturan Kata Sandi / Password Akun
          </div>

          <p className="text-xs text-slate-500">
            Biarkan kolom password kosong jika Anda hanya ingin memperbarui data profil identitas siswa tanpa mengganti kata sandi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Saat Ini
              </label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Masukkan password lama..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pr-10 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Password baru..."
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Ulangi password baru..."
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan Profil & Password
          </button>
        </div>
      </form>
    </div>
  );
};
