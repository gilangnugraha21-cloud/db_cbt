export const MYSQL_DDL_SCHEMA = `-- ============================================================
-- SKEMA DATABASE MYSQL UNTUK APLIKASI CBT SEKOLAH
-- Mendukung 3 Role (Admin, Guru, Siswa) & 6 Tipe Soal:
-- 1. Pilihan Ganda (PG)
-- 2. Pilihan Ganda Kompleks (PGK)
-- 3. Benar / Salah (BS)
-- 4. Menjodohkan (MATCHING)
-- 5. Isian Singkat (SHORT)
-- 6. Esai / Uraian (ESSAY)
-- ============================================================

CREATE DATABASE IF NOT EXISTS cbt_sekolah DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cbt_sekolah;

-- 1. TABEL ROLES
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE, -- 'admin', 'guru', 'siswa'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'guru'), (3, 'siswa');

-- 2. TABEL USERS
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    role_id INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    nip_nisn VARCHAR(30) UNIQUE, -- NIP untuk Guru, NISN untuk Siswa
    kelas VARCHAR(20), -- Khusus Siswa (misal: X-IPA-1)
    rombel VARCHAR(20), -- Khusus Siswa
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. TABEL MATA PELAJARAN
CREATE TABLE mata_pelajaran (
    id VARCHAR(36) PRIMARY KEY,
    kode_mapel VARCHAR(20) NOT NULL UNIQUE,
    nama_mapel VARCHAR(100) NOT NULL,
    tingkat VARCHAR(10) NOT NULL, -- '10', '11', '12'
    kelompok ENUM('Umum', 'Peminatan', 'Kejuruan') DEFAULT 'Umum',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. TABEL BANK SOAL
CREATE TABLE bank_soal (
    id VARCHAR(36) PRIMARY KEY,
    kode_bank VARCHAR(30) NOT NULL UNIQUE,
    nama_bank VARCHAR(100) NOT NULL,
    mapel_id VARCHAR(36) NOT NULL,
    guru_id VARCHAR(36) NOT NULL,
    total_soal INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. TABEL SOAL (Mendukung 6 Tipe Soal)
CREATE TABLE soal (
    id VARCHAR(36) PRIMARY KEY,
    bank_soal_id VARCHAR(36) NOT NULL,
    tipe_soal ENUM(
        'pilihan_ganda',
        'pilihan_ganda_kompleks',
        'benar_salah',
        'menjodohkan',
        'isian_singkat',
        'esai'
    ) NOT NULL,
    pertanyaan TEXT NOT NULL,
    bobot FLOAT DEFAULT 1.0,
    rubrik_esai TEXT NULL, -- Petunjuk penilaian esai untuk Guru
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_soal_id) REFERENCES bank_soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. TABEL OPSI JAWABAN (Untuk Pilihan Ganda & PG Kompleks)
CREATE TABLE opsi_jawaban (
    id VARCHAR(36) PRIMARY KEY,
    soal_id VARCHAR(36) NOT NULL,
    label_opsi VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D', 'E'
    teks_opsi TEXT NOT NULL,
    is_correct TINYINT(1) DEFAULT 0, -- 1 = Benar, 0 = Salah
    FOREIGN KEY (soal_id) REFERENCES soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. TABEL PERNYATAAN BENAR/SALAH
CREATE TABLE pernyataan_benar_salah (
    id VARCHAR(36) PRIMARY KEY,
    soal_id VARCHAR(36) NOT NULL,
    pernyataan TEXT NOT NULL,
    jawaban_benar TINYINT(1) NOT NULL, -- 1 = Benar, 0 = Salah
    FOREIGN KEY (soal_id) REFERENCES soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. TABEL PASANGAN MENJODOHKAN
CREATE TABLE pasangan_menjodohkan (
    id VARCHAR(36) PRIMARY KEY,
    soal_id VARCHAR(36) NOT NULL,
    item_kiri TEXT NOT NULL, -- Pertanyaan / Konsep Kiri
    item_kanan_cocok TEXT NOT NULL, -- Pasangan Kanan yang Benar
    FOREIGN KEY (soal_id) REFERENCES soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. TABEL KUNCI ISIAN SINGKAT
CREATE TABLE kunci_isian_singkat (
    id VARCHAR(36) PRIMARY KEY,
    soal_id VARCHAR(36) NOT NULL,
    jawaban_valid VARCHAR(255) NOT NULL, -- Kunci jawaban string (misal: 'fotosintesis')
    FOREIGN KEY (soal_id) REFERENCES soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. TABEL UJIAN & SCHEDULE
CREATE TABLE ujian (
    id VARCHAR(36) PRIMARY KEY,
    kode_ujian VARCHAR(30) NOT NULL UNIQUE,
    nama_ujian VARCHAR(100) NOT NULL,
    mapel_id VARCHAR(36) NOT NULL,
    bank_soal_id VARCHAR(36) NOT NULL,
    guru_id VARCHAR(36) NOT NULL,
    waktu_mulai DATETIME NOT NULL,
    waktu_selesai DATETIME NOT NULL,
    durasi_menit INT NOT NULL,
    acak_soal TINYINT(1) DEFAULT 1,
    acak_opsi TINYINT(1) DEFAULT 1,
    target_kelas TEXT NOT NULL, -- JSON String e.g. ["X-IPA-1","X-IPA-2"]
    status ENUM('Draf', 'Aktif', 'Selesai') DEFAULT 'Draf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mapel_id) REFERENCES mata_pelajaran(id),
    FOREIGN KEY (bank_soal_id) REFERENCES bank_soal(id),
    FOREIGN KEY (guru_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 11. TABEL TOKEN UJIAN
CREATE TABLE token_ujian (
    id VARCHAR(36) PRIMARY KEY,
    ujian_id VARCHAR(36) NOT NULL,
    token_code VARCHAR(6) NOT NULL, -- e.g., 'CBT2026'
    is_active TINYINT(1) DEFAULT 1,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ujian_id) REFERENCES ujian(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. TABEL HASIL & ABSEN UJIAN
CREATE TABLE hasil_ujian (
    id VARCHAR(36) PRIMARY KEY,
    ujian_id VARCHAR(36) NOT NULL,
    siswa_id VARCHAR(36) NOT NULL,
    waktu_mulai_kerja DATETIME NOT NULL,
    waktu_selesai_kerja DATETIME NULL,
    durasi_pengerjaan_detik INT DEFAULT 0,
    status ENUM('Sedang Mengerjakan', 'Selesai', 'Terkunci Pelanggaran') DEFAULT 'Sedang Mengerjakan',
    jumlah_pelanggaran INT DEFAULT 0,
    nilai_total FLOAT DEFAULT 0.0,
    nilai_esai_pending TINYINT(1) DEFAULT 0, -- 1 = Perlu Koreksi Esai Guru
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ujian_id) REFERENCES ujian(id) ON DELETE CASCADE,
    FOREIGN KEY (siswa_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. TABEL JAWABAN SISWA
CREATE TABLE jawaban_siswa (
    id VARCHAR(36) PRIMARY KEY,
    hasil_ujian_id VARCHAR(36) NOT NULL,
    soal_id VARCHAR(36) NOT NULL,
    jawaban_json JSON NOT NULL, -- Menyimpan payload jawaban siswa (PG, PGK, BS, Matching, Isian, Esai)
    skor_diperoleh FLOAT DEFAULT 0.0,
    is_graded TINYINT(1) DEFAULT 0, -- Untuk soal esai
    catatan_guru TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hasil_ujian_id) REFERENCES hasil_ujian(id) ON DELETE CASCADE,
    FOREIGN KEY (soal_id) REFERENCES soal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. TABEL LOG PELANGGARAN SISWA (ANTI-CHEAT)
CREATE TABLE log_pelanggaran_siswa (
    id VARCHAR(36) PRIMARY KEY,
    ujian_id VARCHAR(36) NOT NULL,
    siswa_id VARCHAR(36) NOT NULL,
    jenis_pelanggaran ENUM('TAB_SWITCH', 'FULLSCREEN_EXIT', 'COPY_PASTE', 'CONTEXT_MENU', 'KEYBOARD_SHORTCUT') NOT NULL,
    keterangan VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ujian_id) REFERENCES ujian(id) ON DELETE CASCADE,
    FOREIGN KEY (siswa_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`;

export const RECOMMENDED_FOLDER_STRUCTURE = `
/cbt-sekolah-app
├── /config
│   ├── database.php            # Koneksi MySQL Database (PDO / Mysqli)
│   └── app.php                 # Environment & Config Global
├── /controllers
│   ├── AuthController.php      # Login, Logout, RBAC Middleware
│   ├── AdminController.php     # Management Admin, Guru, Siswa, Mapel
│   ├── GuruController.php      # Bank Soal, Jadwal Ujian, Koreksi Esai
│   ├── SiswaController.php     # Token Validasi, Ujian Engine, Submit
│   ├── AntiCheatController.php # Log Pelanggaran API
│   └── ImportExportController.php # Parser CSV/Excel Import Export
├── /models
│   ├── User.php
│   ├── MataPelajaran.php
│   ├── BankSoal.php
│   ├── Soal.php
│   ├── Ujian.php
│   └── HasilUjian.php
├── /views
│   ├── /auth
│   │   └── login.php
│   ├── /admin
│   │   ├── dashboard.php
│   ├── /guru
│   │   └── koreksi_esai.php
│   └── /siswa
│       ├── ruang_ujian.php    # Interface Ujian Fullscreen & 6 Tipe Soal
│       └── konfirmasi.php
├── /public
│   ├── /assets
│   │   ├── /css
│   │   └── /js
│   │       ├── anti-cheat.js   # Script Anti-Cheat Front-End
│   │       └── cbt-engine.js   # Timer, Navigation, Auto-save Jawaban
│   └── index.php
└── /templates_csv
    ├── template_guru.csv
    ├── template_siswa.csv
    ├── template_mapel.csv
    └── template_soal.csv
`;

export const ANTI_CHEAT_JS_CODE = `/**
 * ANTI-CHEAT & SECURITY MODULE UNTUK CBT SEKOLAH
 * Menangani Mode Fullscreen, Mencegah Copy-Paste, Klik Kanan, Shortcuts, & Deteksi Pindah Tab
 */

(function initAntiCheatSystem() {
  let violationCount = 0;
  const MAX_VIOLATIONS = 3;
  let isExamLocked = false;

  function recordViolation(jenis, keterangan) {
    if (isExamLocked) return;
    violationCount++;
    console.warn(\`[ANTI-CHEAT WARNING \${violationCount}/\${MAX_VIOLATIONS}]\`, jenis, keterangan);

    // Kirim AJAX Log Pelanggaran ke Backend
    fetch('/api/log-pelanggaran', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenisPelanggaran: jenis,
        keterangan: keterangan,
        violationCount: violationCount,
        timestamp: new Date().toISOString()
      })
    });

    // Alert UI Modal Warning
    showWarningModal(jenis, keterangan, violationCount, MAX_VIOLATIONS);

    // Kunci Otomatis Ujian jika melebihi batas
    if (violationCount >= MAX_VIOLATIONS) {
      lockExamAutomatically();
    }
  }

  // 1. NONAKTIFKAN KLIK KANAN (CONTEXT MENU)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    recordViolation('CONTEXT_MENU', 'Siswa mencoba membuka Klik Kanan / Context Menu');
    return false;
  });

  // 2. MENCEGAH COPY, CUT, PASTE, & SELECT TEXT
  ['copy', 'cut', 'paste', 'selectstart', 'dragstart'].forEach(function (eventType) {
    document.addEventListener(eventType, function (e) {
      e.preventDefault();
      recordViolation('COPY_PASTE', \`Siswa mencoba aksi \${eventType.toUpperCase()}\`);
      return false;
    });
  });

  // 3. MENCEGAH KEYBOARD SHORTCUTS (F12, Ctrl+C, Ctrl+V, Ctrl+U, Alt+Tab, PrintScreen)
  document.addEventListener('keydown', function (e) {
    if (
      e.keyCode === 123 || // F12 (DevTools)
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
      (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 65)) || // Ctrl+U, S, C, V, A
      e.keyCode === 44 // PrintScreen
    ) {
      e.preventDefault();
      e.stopPropagation();
      recordViolation('KEYBOARD_SHORTCUT', \`Penggunaan Kombinasi Tombol Terlarang (Keycode: \${e.keyCode})\`);
      return false;
    }
  });

  // 4. DETEKSI PINDAH TAB / BROWSER OUT OF FOCUS
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      recordViolation('TAB_SWITCH', 'Siswa berpindah tab atau meminimalkan browser');
    }
  });

  window.addEventListener('blur', function () {
    recordViolation('TAB_SWITCH', 'Jendela browser siswa kehilangan fokus (Out of focus)');
  });

  // 5. DETEKSI / WAJIB FULLSCREEN MODE
  function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
      recordViolation('FULLSCREEN_EXIT', 'Siswa keluar dari Mode Layar Penuh (Fullscreen)');
    }
  });

  function lockExamAutomatically() {
    isExamLocked = true;
    alert('PERINGATAN KERAS! Anda telah melanggar aturan ujian sebanyak 3 kali. Ujian Anda telah dikunci otomatis oleh sistem.');
    // Redirect atau Force Submit Ujian
    window.location.href = '/siswa/ujian-terkunci';
  }

  function showWarningModal(jenis, keterangan, current, max) {
    const modal = document.getElementById('antiCheatModal');
    if (modal) {
      modal.innerHTML = \`
        <div style="background: red; color: white; padding: 20px; border-radius: 8px;">
          <h3>⚠️ Peringatan Pelanggaran (\${current}/\${max})</h3>
          <p>\${keterangan}</p>
          <p>Jika mencapai \${max} kali pelanggaran, ujian akan dikunci otomatis!</p>
        </div>
      \`;
      modal.style.display = 'block';
    }
  }
})();
`;

export const BACKEND_CSV_PHP_CODE = `<?php
// ============================================================
// LOGIKA BACKEND PHP FOR CSV IMPORT & EXPORT SOAL & DATA SISWA
// ============================================================

namespace App\\Controllers;

use App\\Models\\User;
use App\\Models\\Soal;
use PDO;

class ImportExportController {

    // 1. DOWLOAD TEMPLATE CSV SISWA
    public function downloadTemplateSiswa() {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=template_import_siswa.csv');
        
        $output = fopen('php://output', 'w');
        fputcsv($output, ['username', 'password', 'nama_lengkap', 'email', 'nisn', 'kelas', 'rombel']);
        fputcsv($output, ['siswa01', 'pass123', 'Budi Santoso', 'budi@sekolah.sch.id', '0012345678', 'X-IPA-1', 'A']);
        fputcsv($output, ['siswa02', 'pass123', 'Siti Rahma', 'siti@sekolah.sch.id', '0012345679', 'X-IPA-1', 'A']);
        fclose($output);
        exit();
    }

    // 2. IMPORT SISWA VIA CSV
    public function importSiswaFromCSV($filePath) {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            return ['status' => false, 'message' => 'File CSV tidak ditemukan!'];
        }

        $handle = fopen($filePath, 'r');
        $header = fgetcsv($handle, 1000, ',');
        $importedCount = 0;

        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            if (count($data) < 7) continue;

            $username  = trim($data[0]);
            $password  = password_hash(trim($data[1]), PASSWORD_BCRYPT);
            $nama      = trim($data[2]);
            $email     = trim($data[3]);
            $nisn      = trim($data[4]);
            $kelas     = trim($data[5]);
            $rombel    = trim($data[6]);

            // Query Insert ke DB MySQL
            $db = Database::getConnection();
            $stmt = $db->prepare("INSERT INTO users (id, role_id, username, password_hash, nama_lengkap, email, nip_nisn, kelas, rombel) 
                                  VALUES (UUID(), 3, :username, :password, :nama, :email, :nisn, :kelas, :rombel)
                                  ON DUPLICATE KEY UPDATE nama_lengkap = :nama, kelas = :kelas");
            $stmt->execute([
                ':username' => $username,
                ':password' => $password,
                ':nama'     => $nama,
                ':email'    => $email,
                ':nisn'     => $nisn,
                ':kelas'    => $kelas,
                ':rombel'   => $rombel
            ]);

            $importedCount++;
        }

        fclose($handle);
        return ['status' => true, 'message' => "Berhasil mengimpor $importedCount data siswa."];
    }

    // 3. EXPORT HASIL UJIAN KEPADA EXCEL / CSV
    public function exportHasilUjianCSV($ujianId) {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT u.nama_lengkap, u.nip_nisn, u.kelas, h.waktu_mulai_kerja, h.waktu_selesai_kerja, 
                   h.durasi_pengerjaan_detik, h.status, h.jumlah_pelanggaran, h.nilai_total
            FROM hasil_ujian h
            JOIN users u ON h.siswa_id = u.id
            WHERE h.ujian_id = :ujian_id
            ORDER BY u.kelas ASC, u.nama_lengkap ASC
        ");
        $stmt->execute([':ujian_id' => $ujianId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: text/csv; charset=utf-8');
        header("Content-Disposition: attachment; filename=hasil_ujian_$ujianId.csv");

        $output = fopen('php://output', 'w');
        fputcsv($output, ['Nama Siswa', 'NISN', 'Kelas', 'Waktu Mulai', 'Waktu Selesai', 'Durasi (detik)', 'Status', 'Pelanggaran', 'Nilai Total']);

        foreach ($results as $row) {
            fputcsv($output, [
                $row['nama_lengkap'],
                $row['nip_nisn'],
                $row['kelas'],
                $row['waktu_mulai_kerja'],
                $row['waktu_selesai_kerja'] ?? '-',
                $row['durasi_pengerjaan_detik'],
                $row['status'],
                $row['jumlah_pelanggaran'],
                $row['nilai_total']
            ]);
        }

        fclose($output);
        exit();
    }
}
`;

