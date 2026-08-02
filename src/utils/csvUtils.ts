// CSV Utility functions for CBT Application

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVString(csvText: string): string[][] {
  const lines = csvText.split(/\r\n|\n/);
  const result: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    result.push(row);
  }

  return result;
}

export function downloadTemplate(type: 'guru' | 'siswa' | 'mapel' | 'soal') {
  if (type === 'guru') {
    const headers = ['username', 'password', 'nama_lengkap', 'email', 'nip'];
    const sampleRow = ['guru_fisika', 'pass123', 'Drs. H. Mulyadi', 'mulyadi@sekolah.sch.id', '198105112005011002'];
    exportToCSV('template_import_guru.csv', headers, [sampleRow]);
  } else if (type === 'siswa') {
    const headers = ['username', 'password', 'nama_lengkap', 'email', 'nisn', 'kelas', 'rombel'];
    const sampleRows = [
      ['siswa10', 'pass123', 'Ahmad Ridwan', 'ahmad@siswa.sch.id', '0054321010', 'X-IPA-1', 'A'],
      ['siswa11', 'pass123', 'Bunga Citra', 'bunga@siswa.sch.id', '0054321011', 'X-IPA-1', 'A'],
    ];
    exportToCSV('template_import_siswa.csv', headers, sampleRows);
  } else if (type === 'mapel') {
    const headers = ['kode_mapel', 'nama_mapel', 'tingkat', 'kelompok'];
    const sampleRows = [
      ['BIO-X', 'Biologi', '10', 'Peminatan'],
      ['KIM-X', 'Kimia', '10', 'Peminatan'],
    ];
    exportToCSV('template_import_mapel.csv', headers, sampleRows);
  } else if (type === 'soal') {
    const headers = ['tipe_soal', 'pertanyaan', 'bobot', 'jawaban_kunci_atau_opsi'];
    const sampleRows = [
      ['pilihan_ganda', 'Apa ibu kota Indonesia?', '10', 'A:Jakarta|B:Bandung|C:Surabaya|D:Medan|KUNCI:A'],
      ['isian_singkat', 'Proses fotosintesis menghasilkan zat utama yaitu...', '10', 'Oksigen|KUNCI:oksigen,o2'],
    ];
    exportToCSV('template_import_soal.csv', headers, sampleRows);
  }
}
