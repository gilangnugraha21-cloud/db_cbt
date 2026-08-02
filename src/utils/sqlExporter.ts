import { User, MataPelajaran, BankSoal, Soal, Ujian, HasilUjian, AppSettings } from '../types/cbt';
import { MYSQL_DDL_SCHEMA } from '../data/technicalDocs';

/**
 * Escapes strings for safe MySQL INSERT statements
 */
function escapeSqlString(str: string | undefined | null): string {
  if (str === undefined || str === null) return 'NULL';
  const escaped = String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  return `'${escaped}'`;
}

/**
 * Generates a complete MySQL database dump (.sql) with DDL Schema + INSERT Data Statements
 */
export function generateMySQLDumpScript(
  users: User[],
  mapels: MataPelajaran[],
  bankSoals: BankSoal[],
  ujians: Ujian[],
  hasilUjians: HasilUjian[],
  appSettings?: AppSettings,
  soalList: Soal[] = []
): string {
  const timestamp = new Date().toISOString();

  let sql = `-- ==========================================================================\n`;
  sql += `-- MYSQL DATABASE EXPORT DUMP - CBT SEKOLAH PRO\n`;
  sql += `-- Generated on: ${timestamp}\n`;
  sql += `-- Application: ${appSettings?.namaAplikasi || 'CBT SEKOLAH PRO'}\n`;
  sql += `-- Format: MySQL 5.7+ / 8.0+ / MariaDB Compatible\n`;
  sql += `-- ==========================================================================\n\n`;

  // Include base DDL Schema
  sql += MYSQL_DDL_SCHEMA + `\n\n`;

  sql += `-- ==========================================================================\n`;
  sql += `-- DATA INSERTS FOR SIMULATION & INITIAL DATABASE POPULATION\n`;
  sql += `-- ==========================================================================\n\n`;

  // 1. Users
  if (users && users.length > 0) {
    sql += `-- Data Users (${users.length} data)\n`;
    users.forEach((u) => {
      const roleId = u.role === 'admin' ? 1 : u.role === 'guru' ? 2 : 3;
      const nipNisn = u.nipNisn ? escapeSqlString(u.nipNisn) : 'NULL';
      const kelas = u.kelas ? escapeSqlString(u.kelas) : 'NULL';
      const rombel = u.rombel ? escapeSqlString(u.rombel) : 'NULL';
      sql += `INSERT INTO users (id, role_id, username, password_hash, nama_lengkap, email, nip_nisn, kelas, rombel, status) VALUES (${escapeSqlString(u.id)}, ${roleId}, ${escapeSqlString(u.username)}, ${escapeSqlString(u.password || '123456')}, ${escapeSqlString(u.nama)}, ${escapeSqlString(u.email)}, ${nipNisn}, ${kelas}, ${rombel}, 'aktif') ON DUPLICATE KEY UPDATE nama_lengkap = VALUES(nama_lengkap);\n`;
    });
    sql += `\n`;
  }

  // 2. Mata Pelajaran
  if (mapels && mapels.length > 0) {
    sql += `-- Data Mata Pelajaran (${mapels.length} data)\n`;
    mapels.forEach((m) => {
      sql += `INSERT INTO mata_pelajaran (id, kode_mapel, nama_mapel, tingkat, kelompok) VALUES (${escapeSqlString(m.id)}, ${escapeSqlString(m.kodeMapel)}, ${escapeSqlString(m.namaMapel)}, ${escapeSqlString(m.tingkat)}, ${escapeSqlString(m.kelompok)}) ON DUPLICATE KEY UPDATE nama_mapel = VALUES(nama_mapel);\n`;
    });
    sql += `\n`;
  }

  // 3. Bank Soal & Soal
  if (bankSoals && bankSoals.length > 0) {
    sql += `-- Data Bank Soal (${bankSoals.length} bank)\n`;
    bankSoals.forEach((b) => {
      const soalsForBank = soalList.filter((s) => s.bankSoalId === b.id);
      const totalSoalCount = b.totalSoal || soalsForBank.length;
      sql += `INSERT INTO bank_soal (id, kode_bank, nama_bank, mapel_id, guru_id, total_soal) VALUES (${escapeSqlString(b.id)}, ${escapeSqlString(b.kodeBank)}, ${escapeSqlString(b.namaBank)}, ${escapeSqlString(b.mapelId)}, ${escapeSqlString(b.guruId)}, ${totalSoalCount}) ON DUPLICATE KEY UPDATE total_soal = VALUES(total_soal);\n`;

      // Soal list
      soalsForBank.forEach((s) => {
        const rubrik = s.rubrikEsai ? escapeSqlString(s.rubrikEsai) : 'NULL';
        sql += `  INSERT INTO soal (id, bank_soal_id, tipe_soal, pertanyaan, bobot, rubrik_esai) VALUES (${escapeSqlString(s.id)}, ${escapeSqlString(b.id)}, ${escapeSqlString(s.tipeSoal)}, ${escapeSqlString(s.pertanyaan)}, ${s.bobot || 1.0}, ${rubrik}) ON DUPLICATE KEY UPDATE pertanyaan = VALUES(pertanyaan);\n`;

        // Opsi PG / PGK
        if (s.opsiPG) {
          s.opsiPG.forEach((o) => {
            const isCorrect = o.isCorrect ? 1 : 0;
            sql += `    INSERT INTO opsi_jawaban (id, soal_id, label_opsi, teks_opsi, is_correct) VALUES (${escapeSqlString(o.id)}, ${escapeSqlString(s.id)}, ${escapeSqlString(o.label)}, ${escapeSqlString(o.teks)}, ${isCorrect}) ON DUPLICATE KEY UPDATE teks_opsi = VALUES(teks_opsi);\n`;
          });
        }

        // Pernyataan Benar/Salah
        if (s.pernyataanBenarSalah) {
          s.pernyataanBenarSalah.forEach((p) => {
            const isTrue = p.jawabanBenar ? 1 : 0;
            sql += `    INSERT INTO pernyataan_benar_salah (id, soal_id, pernyataan, jawaban_benar) VALUES (${escapeSqlString(p.id)}, ${escapeSqlString(s.id)}, ${escapeSqlString(p.pernyataan)}, ${isTrue}) ON DUPLICATE KEY UPDATE jawaban_benar = VALUES(jawaban_benar);\n`;
          });
        }

        // Pasangan Menjodohkan
        if (s.pasanganMenjodohkan) {
          s.pasanganMenjodohkan.forEach((pas) => {
            sql += `    INSERT INTO pasangan_menjodohkan (id, soal_id, item_kiri, item_kanan_cocok) VALUES (${escapeSqlString(pas.id)}, ${escapeSqlString(s.id)}, ${escapeSqlString(pas.pertanyaan)}, ${escapeSqlString(pas.jawabanCorrect)}) ON DUPLICATE KEY UPDATE item_kanan_cocok = VALUES(item_kanan_cocok);\n`;
          });
        }

        // Kunci Isian Singkat
        if (s.kunciIsianSingkat && s.kunciIsianSingkat.length > 0) {
          s.kunciIsianSingkat.forEach((kunci, idx) => {
            sql += `    INSERT INTO kunci_isian_singkat (id, soal_id, jawaban_valid) VALUES (${escapeSqlString(s.id + '_k_' + idx)}, ${escapeSqlString(s.id)}, ${escapeSqlString(kunci)}) ON DUPLICATE KEY UPDATE jawaban_valid = VALUES(jawaban_valid);\n`;
          });
        }
      });
    });
    sql += `\n`;
  }

  // 4. Ujian & Token
  if (ujians && ujians.length > 0) {
    sql += `-- Data Ujian & Jadwal (${ujians.length} ujian)\n`;
    ujians.forEach((u) => {
      const targetKelasJson = JSON.stringify(u.targetKelas || []);
      sql += `INSERT INTO ujian (id, kode_ujian, nama_ujian, mapel_id, bank_soal_id, guru_id, waktu_mulai, waktu_selesai, durasi_menit, acak_soal, acak_opsi, target_kelas, status) VALUES (${escapeSqlString(u.id)}, ${escapeSqlString(u.kodeUjian)}, ${escapeSqlString(u.namaUjian)}, ${escapeSqlString(u.mapelId)}, ${escapeSqlString(u.bankSoalId)}, ${escapeSqlString(u.guruId)}, ${escapeSqlString(u.waktuMulai)}, ${escapeSqlString(u.waktuSelesai)}, ${u.durasiMenit}, ${u.acakSoal ? 1 : 0}, ${u.acakOpsi ? 1 : 0}, ${escapeSqlString(targetKelasJson)}, ${escapeSqlString(u.status)}) ON DUPLICATE KEY UPDATE status = VALUES(status);\n`;

      if (u.tokenCode) {
        sql += `  INSERT INTO token_ujian (id, ujian_id, token_code, is_active) VALUES (${escapeSqlString('token_' + u.id)}, ${escapeSqlString(u.id)}, ${escapeSqlString(u.tokenCode)}, ${u.tokenActive ? 1 : 0}) ON DUPLICATE KEY UPDATE token_code = VALUES(token_code);\n`;
      }
    });
    sql += `\n`;
  }

  // 5. Hasil Ujian
  if (hasilUjians && hasilUjians.length > 0) {
    sql += `-- Data Hasil Ujian Siswa (${hasilUjians.length} data)\n`;
    hasilUjians.forEach((h) => {
      const wSelesai = h.waktuSelesaiKerja ? escapeSqlString(h.waktuSelesaiKerja) : 'NULL';
      sql += `INSERT INTO hasil_ujian (id, ujian_id, siswa_id, waktu_mulai_kerja, waktu_selesai_kerja, durasi_pengerjaan_detik, status, jumlah_pelanggaran, nilai_total, nilai_esai_pending, ip_address) VALUES (${escapeSqlString(h.id)}, ${escapeSqlString(h.ujianId)}, ${escapeSqlString(h.siswaId)}, ${escapeSqlString(h.waktuMulaiKerja)}, ${wSelesai}, ${h.durasiPengerjaanDetik || 0}, ${escapeSqlString(h.status)}, ${h.jumlahPelanggaran || 0}, ${h.nilaiTotal || 0}, ${h.nilaiEsaiPending ? 1 : 0}, '127.0.0.1') ON DUPLICATE KEY UPDATE nilai_total = VALUES(nilai_total);\n`;
    });
    sql += `\n`;
  }

  sql += `-- ==========================================================================\n`;
  sql += `-- END OF MYSQL DATABASE DUMP FILE\n`;
  sql += `-- ==========================================================================\n`;

  return sql;
}

/**
 * Triggers a browser file download for .sql file
 */
export function downloadSQLFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
