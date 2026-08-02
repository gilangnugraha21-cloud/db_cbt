import {
  User,
  MataPelajaran,
  BankSoal,
  Soal,
  Ujian,
  HasilUjian,
  AbsenUjian,
  AppSettings,
} from '../types/cbt';

export const INITIAL_SETTINGS: AppSettings = {
  namaAplikasi: 'CBT SEKOLAH PRO',
  subJudulAplikasi: 'High Density Computer Based Test Platform',
  logoDashboardUrl: '',
  logoLoginUrl: '',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    nama: 'Dr. H. Ahmad Wijaya, M.Pd.',
    email: 'admin@sekolah.sch.id',
    role: 'admin',
    nipNisn: '197508122000031001',
  },
  {
    id: 'user-guru-1',
    username: 'guru_math',
    nama: 'Bambang Sukarno, S.Pd.',
    email: 'bambang.math@sekolah.sch.id',
    role: 'guru',
    nipNisn: '198203152008011005',
    mataPelajaranPengampu: ['mapel-1'],
  },
  {
    id: 'user-guru-2',
    username: 'guru_indo',
    nama: 'Siti Nurhaliza, M.Hum.',
    email: 'siti.indo@sekolah.sch.id',
    role: 'guru',
    nipNisn: '198611202010012012',
    mataPelajaranPengampu: ['mapel-2'],
  },
  {
    id: 'user-siswa-1',
    username: 'siswa01',
    nama: 'Andi Pratama',
    email: 'andi.p@siswa.sch.id',
    role: 'siswa',
    nipNisn: '0054321001',
    kelas: 'X-IPA-1',
    rombel: 'A',
  },
  {
    id: 'user-siswa-2',
    username: 'siswa02',
    nama: 'Dewi Lestari',
    email: 'dewi.l@siswa.sch.id',
    role: 'siswa',
    nipNisn: '0054321002',
    kelas: 'X-IPA-1',
    rombel: 'A',
  },
  {
    id: 'user-siswa-3',
    username: 'siswa03',
    nama: 'Rizky Febrian',
    email: 'rizky.f@siswa.sch.id',
    role: 'siswa',
    nipNisn: '0054321003',
    kelas: 'X-IPA-2',
    rombel: 'B',
  },
];

export const INITIAL_MAPEL: MataPelajaran[] = [
  {
    id: 'mapel-1',
    kodeMapel: 'MAT-X',
    namaMapel: 'Matematika Umum',
    tingkat: '10',
    kelompok: 'Umum',
  },
  {
    id: 'mapel-2',
    kodeMapel: 'BINDO-X',
    namaMapel: 'Bahasa Indonesia',
    tingkat: '10',
    kelompok: 'Umum',
  },
  {
    id: 'mapel-3',
    kodeMapel: 'FIS-X',
    namaMapel: 'Fisika Dasar',
    tingkat: '10',
    kelompok: 'Peminatan',
  },
];

export const INITIAL_BANK_SOAL: BankSoal[] = [
  {
    id: 'bank-1',
    kodeBank: 'BANK-MAT-01',
    namaBank: 'Bank Soal Penilaian Akhir Semester Matematika X',
    mapelId: 'mapel-1',
    guruId: 'user-guru-1',
    totalSoal: 6,
  },
  {
    id: 'bank-2',
    kodeBank: 'BANK-BINDO-01',
    namaBank: 'Bank Soal Bahasa Indonesia Bab Teks Laporan Hasil Observasi',
    mapelId: 'mapel-2',
    guruId: 'user-guru-2',
    totalSoal: 4,
  },
];

export const INITIAL_SOAL: Soal[] = [
  // 1. Pilihan Ganda (Single Choice) - Math & Geometry Diagram
  {
    id: 'soal-1',
    bankSoalId: 'bank-1',
    tipeSoal: 'pilihan_ganda',
    pertanyaan: 'Diberikan persamaan kuadrat $ax^2 + bx + c = 0$. Hitunglah akar-akar persamaan kuadrat menggunakan rumus ABC berikut:\n$$x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\nJika nilai $a = 1$, $b = -5$, dan $c = 6$, tentukan nilai himpunan penyelesaian $(x_1, x_2)$!',
    bobot: 15,
    gambarUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    opsiPG: [
      { id: 'opt-1a', label: 'A', teks: '$\\{2, 3\\}$', isCorrect: true },
      { id: 'opt-1b', label: 'B', teks: '$\\{-2, -3\\}$', isCorrect: false },
      { id: 'opt-1c', label: 'C', teks: '$\\{1, 6\\}$', isCorrect: false },
      { id: 'opt-1d', label: 'D', teks: '$\\{-1, -6\\}$', isCorrect: false },
      { id: 'opt-1e', label: 'E', teks: '$\\{0, 5\\}$', isCorrect: false },
    ],
  },
  // 2. Pilihan Ganda Kompleks (Checkbox) - Audio Listening Dialogue
  {
    id: 'soal-2',
    bankSoalId: 'bank-1',
    tipeSoal: 'pilihan_ganda_kompleks',
    pertanyaan: 'Dengarkan rekaman audio di bawah ini. Berdasarkan rekaman dialog, tentukan pernyataan manakah yang BENAR! (Pilih lebih dari satu)',
    bobot: 15,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    opsiPG: [
      { id: 'opt-2a', label: 'A', teks: 'Pembicara utama membahas fenomena induksi elektromagnetik', isCorrect: true },
      { id: 'opt-2b', label: 'B', teks: 'Arus listrik bolak-balik (AC) pertama kali ditemukan oleh Thomas Edison', isCorrect: false },
      { id: 'opt-2c', label: 'C', teks: 'Frekuensi standar listrik AC yang disebutkan adalah $50\\text{ Hz}$', isCorrect: true },
      { id: 'opt-2d', label: 'D', teks: 'Tegangan efektif dihitung dengan rumus $V_{\\text{eff}} = \\frac{V_{\\max}}{\\sqrt{2}}$', isCorrect: true },
      { id: 'opt-2e', label: 'E', teks: 'Percobaan dilakukan tanpa penyiapan kumparan kawat', isCorrect: false },
    ],
  },
  // 3. Benar / Salah - Math Logarithms & Integrals
  {
    id: 'soal-3',
    bankSoalId: 'bank-1',
    tipeSoal: 'benar_salah',
    pertanyaan: 'Tentukan status kebenaran dari setiap pernyataan matematika & kalkulus berikut ini!',
    bobot: 15,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    pernyataanBenarSalah: [
      {
        id: 'bs-1',
        pernyataan: 'Nilai logaritma base 2 yaitu $^2\\log(8)$ adalah tepat sama dengan $3$.',
        jawabanBenar: true,
      },
      {
        id: 'bs-2',
        pernyataan: 'Nilai integral tentu $\\int_{0}^{\\pi} \\sin(x) dx$ bernilai $-1$.',
        jawabanBenar: false,
      },
      {
        id: 'bs-3',
        pernyataan: 'Identitas trigonometri dasar $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$ berlaku untuk semua sudut $\\theta$.',
        jawabanBenar: true,
      },
    ],
  },
  // 4. Menjodohkan
  {
    id: 'soal-4',
    bankSoalId: 'bank-1',
    tipeSoal: 'menjodohkan',
    pertanyaan: 'Pasangkanlah Nama Ibu Kota Negara dengan Negaranya di Wilayah Asia Tenggara!',
    bobot: 20,
    pasanganMenjodohkan: [
      { id: 'match-1', pertanyaan: 'Jakarta', jawabanCorrect: 'Indonesia' },
      { id: 'match-2', pertanyaan: 'Kuala Lumpur', jawabanCorrect: 'Malaysia' },
      { id: 'match-3', pertanyaan: 'Bangkok', jawabanCorrect: 'Thailand' },
      { id: 'match-4', pertanyaan: 'Manila', jawabanCorrect: 'Filipina' },
    ],
    opsiKananRandom: ['Thailand', 'Indonesia', 'Filipina', 'Malaysia'],
  },
  // 5. Isian Singkat - Biology & Chemistry Equation
  {
    id: 'soal-5',
    bankSoalId: 'bank-1',
    tipeSoal: 'isian_singkat',
    pertanyaan: 'Proses biokimia pembuatan glukosa pada tumbuhan hijau mengikuti reaksi:\n$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{cahaya}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\nProses ini dikenal dengan istilah ilmiah...',
    bobot: 15,
    kunciIsianSingkat: ['fotosintesis', 'fotosintesa', 'photosynthesis'],
  },
  // 6. Esai / Uraian (Manual Grading)
  {
    id: 'soal-6',
    bankSoalId: 'bank-1',
    tipeSoal: 'esai',
    pertanyaan: 'Jelaskan secara rinci turunan pertama fungsi $f(x) = x^3 - 3x^2 + 5x - 7$ menggunakan definisi limit diferensial:\n$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\nSebutkan titik stasioner jika ada!',
    bobot: 20,
    rubrikEsai: 'Skor 20: Langkah diferensiasi lengkap $f\'(x) = 3x^2 - 6x + 5$ dan analisis D < 0 (tidak ada titik stasioner real). Skor 10-15: Jawaban f\'(x) benar tanpa penjelasan limit.',
  },
];

export const INITIAL_UJIAN: Ujian[] = [
  {
    id: 'ujian-1',
    kodeUjian: 'UJN-PAS-MAT10',
    namaUjian: 'Penilaian Akhir Semester (PAS) Matematika Kelas X',
    mapelId: 'mapel-1',
    bankSoalId: 'bank-1',
    guruId: 'user-guru-1',
    waktuMulai: '2026-08-01T08:00:00.000Z',
    waktuSelesai: '2026-08-01T23:59:59.000Z',
    durasiMenit: 60,
    tokenActive: true,
    tokenCode: 'CBT2026',
    tokenGeneratedAt: '2026-08-01T07:30:00.000Z',
    acakSoal: true,
    acakOpsi: true,
    status: 'Aktif',
    targetKelas: ['X-IPA-1', 'X-IPA-2'],
  },
  {
    id: 'ujian-2',
    kodeUjian: 'UJN-UH-BINDO',
    namaUjian: 'Ulangan Harian Teks Laporan Hasil Observasi',
    mapelId: 'mapel-2',
    bankSoalId: 'bank-2',
    guruId: 'user-guru-2',
    waktuMulai: '2026-08-02T08:00:00.000Z',
    waktuSelesai: '2026-08-02T12:00:00.000Z',
    durasiMenit: 45,
    tokenActive: true,
    tokenCode: 'INDO99',
    tokenGeneratedAt: '2026-08-02T07:30:00.000Z',
    acakSoal: false,
    acakOpsi: false,
    status: 'Draf',
    targetKelas: ['X-IPA-1'],
  },
];

export const INITIAL_HASIL_UJIAN: HasilUjian[] = [
  {
    id: 'hasil-1',
    ujianId: 'ujian-1',
    siswaId: 'user-siswa-2',
    namaSiswa: 'Dewi Lestari',
    nisn: '0054321002',
    kelas: 'X-IPA-1',
    waktuMulaiKerja: '2026-08-01T08:05:00.000Z',
    waktuSelesaiKerja: '2026-08-01T08:52:00.000Z',
    durasiPengerjaanDetik: 2820,
    status: 'Selesai',
    jumlahPelanggaran: 0,
    nilaiTotal: 88,
    nilaiEsaiPending: false,
    jawaban: {
      'soal-1': {
        soalId: 'soal-1',
        tipeSoal: 'pilihan_ganda',
        jawabanPG: 'opt-1b',
        skorDiperoleh: 15,
      },
      'soal-2': {
        soalId: 'soal-2',
        tipeSoal: 'pilihan_ganda_kompleks',
        jawabanPGKompleks: ['opt-2a', 'opt-2b', 'opt-2d'],
        skorDiperoleh: 15,
      },
      'soal-3': {
        soalId: 'soal-3',
        tipeSoal: 'benar_salah',
        jawabanBenarSalah: [
          { statementId: 'bs-1', value: true },
          { statementId: 'bs-2', value: false },
          { statementId: 'bs-3', value: false },
        ],
        skorDiperoleh: 15,
      },
      'soal-4': {
        soalId: 'soal-4',
        tipeSoal: 'menjodohkan',
        jawabanMenjodohkan: [
          { pairId: 'match-1', selectedKanan: 'Indonesia' },
          { pairId: 'match-2', selectedKanan: 'Malaysia' },
          { pairId: 'match-3', selectedKanan: 'Thailand' },
          { pairId: 'match-4', selectedKanan: 'Filipina' },
        ],
        skorDiperoleh: 20,
      },
      'soal-5': {
        soalId: 'soal-5',
        tipeSoal: 'isian_singkat',
        jawabanIsianSingkat: 'fotosintesis',
        skorDiperoleh: 15,
      },
      'soal-6': {
        soalId: 'soal-6',
        tipeSoal: 'esai',
        jawabanEsai: 'Pemanasan global memicu pencairan es kutub yang menaikkan permukaan air laut, abrasi pantai, serta masuknya air asin ke sumber air tawar pesisir.',
        skorDiperoleh: 18,
        isGraded: true,
        catatanGuru: 'Penjelasan sangat bagus dan lengkap!',
      },
    },
  },
];

export const INITIAL_ABSEN: AbsenUjian[] = [
  {
    id: 'absen-1',
    ujianId: 'ujian-1',
    siswaId: 'user-siswa-1',
    namaSiswa: 'Andi Pratama',
    nisn: '0054321001',
    kelas: 'X-IPA-1',
    status: 'Belum Login',
    jumlahPelanggaran: 0,
  },
  {
    id: 'absen-2',
    ujianId: 'ujian-1',
    siswaId: 'user-siswa-2',
    namaSiswa: 'Dewi Lestari',
    nisn: '0054321002',
    kelas: 'X-IPA-1',
    status: 'Selesai',
    waktuLogin: '2026-08-01 08:05:12',
    waktuSelesai: '2026-08-01 08:52:10',
    jumlahPelanggaran: 0,
    ipAddress: '192.168.1.105',
  },
  {
    id: 'absen-3',
    ujianId: 'ujian-1',
    siswaId: 'user-siswa-3',
    namaSiswa: 'Rizky Febrian',
    nisn: '0054321003',
    kelas: 'X-IPA-2',
    status: 'Belum Login',
    jumlahPelanggaran: 0,
  },
];
