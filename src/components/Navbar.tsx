import React, { useState } from 'react';
import { User, Role, AppSettings } from '../types/cbt';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShieldAlert,
  Users,
  BookOpen,
  FileQuestion,
  CalendarClock,
  BarChart3,
  ClipboardList,
  Settings,
  History,
  UserCog,
  ChevronRight,
  Sparkles,
  User as UserIcon,
  BadgeCheck,
  Mail,
  Phone,
} from 'lucide-react';

interface Props {
  currentUser: User;
  allUsers: User[];
  settings?: AppSettings;
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
  onSwitchUser: (user: User) => void;
  onResetData: () => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  allUsers,
  settings,
  activeMenu = 'dashboard',
  onSelectMenu,
  onSwitchUser,
  onResetData,
  onOpenLogin,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);

  const getMenuItems = () => {
    if (currentUser.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'kelola_admin', label: 'Kelola Admin', icon: ShieldAlert },
        { id: 'kelola_guru', label: 'Kelola Guru', icon: Users },
        { id: 'kelola_siswa', label: 'Kelola Siswa', icon: GraduationCap },
        { id: 'kelola_mapel', label: 'Kelola Mata Pelajaran', icon: BookOpen },
        { id: 'bank_soal', label: 'Kelola Bank Soal', icon: FileQuestion },
        { id: 'kelola_ujian', label: 'Kelola Ujian & Token', icon: CalendarClock },
        { id: 'hasil_ujian', label: 'Hasil Ujian & Nilai', icon: BarChart3 },
        { id: 'absen_ujian', label: 'Absen Ujian & Pelanggaran', icon: ClipboardList },
        { id: 'pengaturan', label: 'Pengaturan Aplikasi', icon: Settings },
      ];
    } else if (currentUser.role === 'guru') {
      return [
        { id: 'dashboard', label: 'Dashboard Guru', icon: LayoutDashboard },
        { id: 'bank_soal', label: 'Bank Soal Saya', icon: FileQuestion },
        { id: 'kelola_ujian', label: 'Jadwal & Token Ujian', icon: CalendarClock },
        { id: 'hasil_ujian', label: 'Hasil & Koreksi Esai', icon: BarChart3 },
        { id: 'absen_ujian', label: 'Absen & Kehadiran', icon: ClipboardList },
      ];
    } else {
      return [
        { id: 'siswa_ujian', label: 'Ruang Ujian Siswa', icon: CalendarClock },
        { id: 'riwayat_ujian', label: 'Riwayat Ujian Siswa', icon: History },
        { id: 'edit_profil', label: 'Edit Profil & Password', icon: UserCog },
      ];
    }
  };

  const menuItems = getMenuItems();
  const activeMenuItem = menuItems.find((m) => m.id === activeMenu) || menuItems[0];

  const handleMenuClick = (menuId: string) => {
    if (onSelectMenu) {
      onSelectMenu(menuId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-[#0f172a] border-b border-slate-800 text-white sticky top-0 z-40 h-14 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-400 border border-slate-700 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all shadow-xs"
              aria-label="Buka Menu Utama Mobile"
              title="Buka Pop Up Menu Utama"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4 text-blue-400" />}
              <span className="text-[11px] text-white">Menu</span>
            </button>

            {settings?.logoDashboardUrl ? (
              <img
                src={settings.logoDashboardUrl}
                alt="Logo Dashboard"
                className="w-8 h-8 object-contain rounded bg-white/10 p-0.5 border border-white/20 shrink-0"
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
              <h1 className="text-xs font-black tracking-wider text-white flex items-center gap-1.5 uppercase truncate">
                {settings?.namaAplikasi || 'CBT SEKOLAH'}{' '}
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-bold font-mono">v2.5</span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block leading-none truncate">
                {settings?.subJudulAplikasi || 'High Density Computer Based Test Platform'}
              </p>
            </div>
          </div>

          {/* Right Section Actions & Active Account Info */}
          <div className="flex items-center gap-2">
            {/* Active Account Info Button */}
            <button
              onClick={() => setIsAccountInfoOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs group"
              title="Klik untuk melihat detail Informasi Akun Aktif"
            >
              <div
                className={`p-1 rounded text-xs font-bold ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-900/80 text-purple-300 border border-purple-700'
                    : currentUser.role === 'guru'
                    ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                    : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-slate-400 font-medium leading-none uppercase tracking-wider">
                  Akun Aktif
                </div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate max-w-[130px]">
                  {currentUser.nama}
                </div>
              </div>
              <span className="sm:hidden text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold border border-blue-500/30">
                Info Akun
              </span>
            </button>

            {/* Reset System Data */}
            <button
              onClick={() => {
                if (confirm('Atur ulang seluruh data simulasi ke kondisi awal?')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 border border-slate-700 rounded text-xs font-medium transition-colors"
              title="Reset Data Simulasi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">Reset</span>
            </button>
          </div>
        </div>
      </header>



      {/* Mobile Pop-Up Bar Overlay Modal for Main Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] border-2 border-slate-700 rounded-3xl p-5 w-full max-w-lg mx-auto shadow-2xl space-y-4 max-h-[85vh] flex flex-col overflow-hidden text-white relative">
            {/* Pop-Up Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">
                    POP UP MENU UTAMA
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Navigasi Cepat Panel {currentUser.role === 'admin' ? 'Super Admin' : currentUser.role === 'guru' ? 'Guru' : 'Siswa'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                aria-label="Tutup Pop Up Menu"
              >
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            {/* Current User Card */}
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAccountInfoOpen(true);
              }}
              className="bg-[#0f172a] hover:bg-slate-900 cursor-pointer p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-2 shrink-0 transition-colors group"
              title="Lihat Informasi Akun Aktif"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div
                  className={`p-2 rounded-xl text-xs font-bold shrink-0 ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                      : currentUser.role === 'guru'
                      ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                      : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                    {currentUser.nama}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                    <span>
                      {currentUser.role === 'admin'
                        ? 'Super Administrator'
                        : currentUser.role === 'guru'
                        ? 'Guru Pengampu'
                        : `Siswa (${currentUser.kelas || 'Umum'})`}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg font-bold border border-blue-500/30 shrink-0">
                Info Akun
              </span>
            </div>

            {/* Menu Items Grid / List */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-1.5 py-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1">
                DAFTAR MENU APLIKASI
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/30'
                          : 'bg-[#0f172a]/60 hover:bg-[#0f172a] text-slate-300 hover:text-white border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons Bottom Footer */}
            {onLogout && (
              <div className="pt-3 border-t border-slate-700/80 shrink-0">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-xl text-2xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Informasi Akun Aktif */}
      {isAccountInfoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 text-white relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Informasi Akun Aktif</h3>
                  <p className="text-xs text-slate-400">Detail identitas & hak akses pengguna</p>
                </div>
              </div>
              <button
                onClick={() => setIsAccountInfoOpen(false)}
                className="p-2 bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Account Card */}
            <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-md shrink-0 ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                      : currentUser.role === 'guru'
                      ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                      : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  }`}
                >
                  {currentUser.nama.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-black text-white truncate">{currentUser.nama}</h4>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : currentUser.role === 'guru'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {currentUser.role === 'admin'
                        ? 'Super Administrator'
                        : currentUser.role === 'guru'
                        ? 'Guru Pengampu'
                        : 'Siswa Peserta Ujian'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Sesi Aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>Username</span>
                </div>
                <span className="font-mono font-bold text-slate-200">@{currentUser.username}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <BadgeCheck className="w-4 h-4 text-amber-400" />
                  <span>NIP / NISN</span>
                </div>
                <span className="font-mono font-bold text-slate-200">{currentUser.nipNisn || '-'}</span>
              </div>

              {currentUser.role === 'siswa' && (
                <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Kelas & Rombel</span>
                  </div>
                  <span className="font-bold text-slate-200">
                    {currentUser.kelas ? `${currentUser.kelas} ${currentUser.rombel ? `(${currentUser.rombel})` : ''}` : '-'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Email</span>
                </div>
                <span className="font-bold text-slate-200 truncate max-w-[200px]">
                  {currentUser.email || '-'}
                </span>
              </div>

              {currentUser.noHp && (
                <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4 text-rose-400" />
                    <span>No. Handphone</span>
                  </div>
                  <span className="font-mono font-bold text-slate-200">{currentUser.noHp}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              {onLogout && (
                <button
                  onClick={() => {
                    setIsAccountInfoOpen(false);
                    onLogout();
                  }}
                  className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Keluar / Logout</span>
                </button>
              )}
              <button
                onClick={() => setIsAccountInfoOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

