import React, { useState } from 'react';
import { AbsenUjian, Ujian } from '../../types/cbt';
import { ClipboardList, ShieldAlert, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/csvUtils';

interface Props {
  absenList: AbsenUjian[];
  ujianList: Ujian[];
}

export const AdminAttendance: React.FC<Props> = ({
  absenList,
  ujianList,
}) => {
  const [selectedUjianId, setSelectedUjianId] = useState<string>(ujianList[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const selectedUjian = ujianList.find((u) => u.id === selectedUjianId);

  const filteredAbsen = absenList.filter((a) => {
    const matchesUjian = !selectedUjianId || a.ujianId === selectedUjianId;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesUjian && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = [
      'Ujian',
      'Nama Siswa',
      'NISN',
      'Kelas',
      'Status Kehadiran',
      'Waktu Login',
      'Waktu Selesai',
      'IP Address',
      'Jumlah Pelanggaran',
    ];

    const rows = filteredAbsen.map((a) => [
      selectedUjian?.namaUjian || '-',
      a.namaSiswa,
      a.nisn,
      a.kelas,
      a.status,
      a.waktuLogin || '-',
      a.waktuSelesai || '-',
      a.ipAddress || '192.168.1.100',
      a.jumlahPelanggaran,
    ]);

    exportToCSV(`rekap_absen_ujian_${selectedUjian?.kodeUjian || 'semua'}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" /> Rekap Absen Ujian & Log Pelanggaran Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau kehadiran siswa secara real-time, status pengerjaan, waktu login, & riwayat kecurangan
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" /> Export Absen CSV
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Ujian:</span>
          <select
            value={selectedUjianId}
            onChange={(e) => setSelectedUjianId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none w-full sm:w-80"
          >
            {ujianList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.namaUjian} ({u.kodeUjian})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600">Status Kehadiran:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Belum Login">Belum Login</option>
            <option value="Sedang Mengerjakan">Sedang Mengerjakan</option>
            <option value="Selesai">Selesai</option>
            <option value="Terkunci">Terkunci Pelanggaran</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Status Ujian</th>
                <th className="py-3 px-4">Waktu Login</th>
                <th className="py-3 px-4">Waktu Selesai</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-center">Log Pelanggaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredAbsen.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Tidak ada rekap kehadiran ditemukan
                  </td>
                </tr>
              ) : (
                filteredAbsen.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{a.namaSiswa}</td>
                    <td className="py-3 px-4 font-mono">{a.nisn}</td>
                    <td className="py-3 px-4 font-semibold">{a.kelas}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-2xs font-bold rounded-full ${
                          a.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'Sedang Mengerjakan'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : a.status === 'Terkunci'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-2xs">{a.waktuLogin || '-'}</td>
                    <td className="py-3 px-4 font-mono text-2xs">{a.waktuSelesai || '-'}</td>
                    <td className="py-3 px-4 font-mono text-2xs text-slate-500">{a.ipAddress || '192.168.1.100'}</td>
                    <td className="py-3 px-4 text-center">
                      {a.jumlahPelanggaran > 0 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-2xs font-bold inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> {a.jumlahPelanggaran} Pelanggaran
                        </span>
                      ) : (
                        <span className="text-2xs text-emerald-600 font-semibold">Clean (0)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
