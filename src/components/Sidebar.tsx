import React from 'react';
import { Role } from '../types/cbt';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  GraduationCap,
  BookOpen,
  FileQuestion,
  CalendarClock,
  BarChart3,
  ClipboardList,
  Settings,
  History,
  UserCog,
  LogOut,
} from 'lucide-react';

interface Props {
  role: Role;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  role,
  activeMenu,
  onSelectMenu,
  onLogout,
}) => {
  const getMenuItems = () => {
    if (role === 'admin') {
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
    } else if (role === 'guru') {
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

  return (
    <aside className="w-64 bg-[#1e293b] border-r border-slate-700 shrink-0 hidden md:flex flex-col min-h-[calc(100vh-3.5rem)] select-none">
      {/* Role Title Header */}
      <div className="p-3.5 bg-[#0f172a] border-b border-slate-700">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Panel Pengguna</div>
        <div className="text-xs font-bold text-slate-100 capitalize mt-0.5 flex items-center justify-between">
          <span>{role === 'admin' ? 'Super Administrator' : role === 'guru' ? 'Guru Pengampu' : 'Siswa Peserta'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="text-[10px] uppercase text-slate-400 px-3 py-1.5 font-bold mt-2">Menu Utama</div>
      <nav className="flex-1 px-2.5 py-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMenu(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button at bottom */}
      {onLogout && (
        <div className="p-2.5 bg-[#0f172a] border-t border-slate-700">
          <button
            onClick={onLogout}
            className="w-full p-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 rounded-md text-rose-200 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold shadow-xs"
          >
            <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};
