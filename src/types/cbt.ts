export type Role = 'admin' | 'guru' | 'siswa';

export interface AppSettings {
  namaAplikasi: string;
  subJudulAplikasi: string;
  logoDashboardUrl?: string;
  logoLoginUrl?: string;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  role: Role;
  nipNisn?: string;
  kelas?: string;
  rombel?: string;
  mataPelajaranPengampu?: string[]; // mapel IDs for guru
  noHp?: string;
  password?: string;
}

export interface MataPelajaran {
  id: string;
  kodeMapel: string;
  namaMapel: string;
  tingkat: string; // e.g., '10', '11', '12'
  kelompok: 'Umum' | 'Peminatan' | 'Kejuruan';
}

export type QuestionType = 
  | 'pilihan_ganda' 
  | 'pilihan_ganda_kompleks' 
  | 'benar_salah' 
  | 'menjodohkan' 
  | 'isian_singkat' 
  | 'esai';

export interface OptionPG {
  id: string;
  label: string; // A, B, C, D, E
  teks: string;
  isCorrect?: boolean;
}

export interface BenarSalahStatement {
  id: string;
  pernyataan: string;
  jawabanBenar: boolean; // true = Benar, false = Salah
}

export interface MatchingPair {
  id: string;
  pertanyaan: string; // Item Kolom Kiri
  jawabanCorrect: string; // Item Kolom Kanan yang sesuai
}

export interface Soal {
  id: string;
  bankSoalId: string;
  tipeSoal: QuestionType;
  pertanyaan: string;
  bobot: number; // Max points
  // Media attachments (Upload Gambar, Audio, Video):
  gambarUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  // Fields per question type:
  opsiPG?: OptionPG[]; // for pilihan_ganda (1 correct) & pilihan_ganda_kompleks (>1 correct)
  pernyataanBenarSalah?: BenarSalahStatement[]; // for benar_salah
  pasanganMenjodohkan?: MatchingPair[]; // for menjodohkan
  opsiKananRandom?: string[]; // Shuffled right column choices for menjodohkan UI
  kunciIsianSingkat?: string[]; // Acceptable short text answers (case-insensitive)
  rubrikEsai?: string; // Teacher rubric for manual grading
}

export interface BankSoal {
  id: string;
  kodeBank: string;
  namaBank: string;
  mapelId: string;
  guruId: string;
  totalSoal: number;
}

export interface Ujian {
  id: string;
  kodeUjian: string;
  namaUjian: string;
  mapelId: string;
  bankSoalId: string;
  guruId: string;
  waktuMulai: string; // ISO datetime
  waktuSelesai: string; // ISO datetime
  durasiMenit: number;
  tokenActive: boolean;
  tokenCode: string; // 6 chars
  tokenGeneratedAt?: string;
  acakSoal: boolean;
  acakOpsi: boolean;
  status: 'Draf' | 'Aktif' | 'Selesai';
  targetKelas: string[]; // list of target classes e.g. ['X-IPA-1', 'X-IPA-2']
}

export interface LogPelanggaran {
  id: string;
  ujianId: string;
  siswaId: string;
  jenisPelanggaran: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'COPY_PASTE' | 'CONTEXT_MENU' | 'KEYBOARD_SHORTCUT';
  keterangan: string;
  timestamp: string;
}

export interface JawabanSiswa {
  soalId: string;
  tipeSoal: QuestionType;
  // Answer payload per type:
  jawabanPG?: string; // option ID for pilihan_ganda
  jawabanPGKompleks?: string[]; // option IDs for pilihan_ganda_kompleks
  jawabanBenarSalah?: { statementId: string; value: boolean }[];
  jawabanMenjodohkan?: { pairId: string; selectedKanan: string }[];
  jawabanIsianSingkat?: string;
  jawabanEsai?: string;
  skorDiperoleh?: number; // Auto computed or manually graded for Esai
  isGraded?: boolean; // For esai manual grading
  catatanGuru?: string;
}

export interface HasilUjian {
  id: string;
  ujianId: string;
  siswaId: string;
  namaSiswa: string;
  nisn: string;
  kelas: string;
  waktuMulaiKerja: string;
  waktuSelesaiKerja?: string;
  durasiPengerjaanDetik: number;
  status: 'Sedang Mengerjakan' | 'Selesai' | 'Terkunci Pelanggaran';
  jumlahPelanggaran: number;
  jawaban: Record<string, JawabanSiswa>; // key: soalId
  nilaiTotal: number; // 0-100 scale
  nilaiEsaiPending: boolean; // true if essay questions require manual grading
}

export interface AbsenUjian {
  id: string;
  ujianId: string;
  siswaId: string;
  namaSiswa: string;
  nisn: string;
  kelas: string;
  status: 'Belum Login' | 'Sedang Mengerjakan' | 'Selesai' | 'Terkunci';
  waktuLogin?: string;
  waktuSelesai?: string;
  sisaWaktuDetik?: number;
  jumlahPelanggaran: number;
  ipAddress?: string;
}
