/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_MAPEL,
  INITIAL_BANK_SOAL,
  INITIAL_SOAL,
  INITIAL_UJIAN,
  INITIAL_HASIL_UJIAN,
  INITIAL_ABSEN,
  INITIAL_SETTINGS,
} from './data/initialData';

import {
  User,
  MataPelajaran,
  BankSoal,
  Soal,
  Ujian,
  HasilUjian,
  AbsenUjian,
  JawabanSiswa,
  AppSettings,
} from './types/cbt';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAdmins } from './components/admin/AdminAdmins';
import { AdminTeachers } from './components/admin/AdminTeachers';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminSubjects } from './components/admin/AdminSubjects';
import { AdminQuestionBanks } from './components/admin/AdminQuestionBanks';
import { AdminExams } from './components/admin/AdminExams';
import { AdminExamResults } from './components/admin/AdminExamResults';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminSettings } from './components/admin/AdminSettings';
import { LoginPage } from './components/common/LoginPage';

import { GuruDashboard } from './components/guru/GuruDashboard';

import { SiswaExamList } from './components/siswa/SiswaExamList';
import { SiswaExamRoom } from './components/siswa/SiswaExamRoom';
import { SiswaExamHistory } from './components/siswa/SiswaExamHistory';
import { SiswaProfile } from './components/siswa/SiswaProfile';

function getInitialState<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`cbt_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Failed to read localStorage key cbt_${key}:`, err);
    return fallback;
  }
}

export default function App() {
  // State for System Data
  const [users, setUsers] = useState<User[]>(() => getInitialState('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = getInitialState<User | null>('currentUser', null);
    if (saved && users.some((u) => u.id === saved.id)) return saved;
    return INITIAL_USERS[0];
  });

  const [mapelList, setMapelList] = useState<MataPelajaran[]>(() =>
    getInitialState('mapel', INITIAL_MAPEL)
  );
  const [bankSoalList, setBankSoalList] = useState<BankSoal[]>(() =>
    getInitialState('bankSoal', INITIAL_BANK_SOAL)
  );
  const [soalList, setSoalList] = useState<Soal[]>(() =>
    getInitialState('soal', INITIAL_SOAL)
  );
  const [ujianList, setUjianList] = useState<Ujian[]>(() =>
    getInitialState('ujian', INITIAL_UJIAN)
  );
  const [hasilUjianList, setHasilUjianList] = useState<HasilUjian[]>(() =>
    getInitialState('hasilUjian', INITIAL_HASIL_UJIAN)
  );
  const [absenList, setAbsenList] = useState<AbsenUjian[]>(() =>
    getInitialState('absen', INITIAL_ABSEN)
  );
  const [appSettings, setAppSettings] = useState<AppSettings>(() =>
    getInitialState('settings', INITIAL_SETTINGS)
  );

  // Auto save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cbt_users', JSON.stringify(users));
      localStorage.setItem('cbt_currentUser', JSON.stringify(currentUser));
      localStorage.setItem('cbt_mapel', JSON.stringify(mapelList));
      localStorage.setItem('cbt_bankSoal', JSON.stringify(bankSoalList));
      localStorage.setItem('cbt_soal', JSON.stringify(soalList));
      localStorage.setItem('cbt_ujian', JSON.stringify(ujianList));
      localStorage.setItem('cbt_hasilUjian', JSON.stringify(hasilUjianList));
      localStorage.setItem('cbt_absen', JSON.stringify(absenList));
      localStorage.setItem('cbt_settings', JSON.stringify(appSettings));
    } catch (err) {
      console.warn('Failed to save state to localStorage:', err);
    }
  }, [
    users,
    currentUser,
    mapelList,
    bankSoalList,
    soalList,
    ujianList,
    hasilUjianList,
    absenList,
    appSettings,
  ]);

  // UI Navigation State
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [isLoginPageMode, setIsLoginPageMode] = useState<boolean>(false);
  const [isLoginPreviewMode, setIsLoginPreviewMode] = useState<boolean>(false);

  // Student Active Exam State
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [activeExamTaking, setActiveExamTaking] = useState<Ujian | null>(null);

  // Switch Role Handler
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin' || user.role === 'guru') {
      setActiveMenu('dashboard');
      setIsExamMode(false);
    } else {
      setActiveMenu('siswa_ujian');
      setIsExamMode(false);
    }
  };

  // Reset System Data
  const handleResetData = () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.warn('Failed to clear localStorage on reset:', err);
    }
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setMapelList(INITIAL_MAPEL);
    setBankSoalList(INITIAL_BANK_SOAL);
    setSoalList(INITIAL_SOAL);
    setUjianList(INITIAL_UJIAN);
    setHasilUjianList(INITIAL_HASIL_UJIAN);
    setAbsenList(INITIAL_ABSEN);
    setAppSettings(INITIAL_SETTINGS);
    setActiveMenu('dashboard');
    setIsExamMode(false);
    setActiveExamTaking(null);
    setIsLoginPageMode(false);
    setIsLoginPreviewMode(false);
  };

  // User CRUD Handlers
  const handleAddAdmin = (u: User) => setUsers((prev) => [...prev, u]);
  const handleUpdateAdmin = (u: User) =>
    setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
  const handleDeleteAdmin = (id: string) =>
    setUsers((prev) => prev.filter((x) => x.id !== id));

  const handleAddTeacher = (u: User) => setUsers((prev) => [...prev, u]);
  const handleUpdateTeacher = (u: User) =>
    setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
  const handleDeleteTeacher = (id: string) =>
    setUsers((prev) => prev.filter((x) => x.id !== id));
  const handleBatchImportTeachers = (newItems: User[]) =>
    setUsers((prev) => [...prev, ...newItems]);

  const handleAddStudent = (u: User) => setUsers((prev) => [...prev, u]);
  const handleUpdateStudent = (u: User) =>
    setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
  const handleDeleteStudent = (id: string) =>
    setUsers((prev) => prev.filter((x) => x.id !== id));
  const handleBatchImportStudents = (newItems: User[]) =>
    setUsers((prev) => [...prev, ...newItems]);

  const handleUpdateUserProfile = (updatedUser: User) => {
    setUsers((prev) => prev.map((x) => (x.id === updatedUser.id ? updatedUser : x)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Subject CRUD Handlers
  const handleAddMapel = (m: MataPelajaran) => setMapelList((prev) => [...prev, m]);
  const handleUpdateMapel = (m: MataPelajaran) =>
    setMapelList((prev) => prev.map((x) => (x.id === m.id ? m : x)));
  const handleDeleteMapel = (id: string) =>
    setMapelList((prev) => prev.filter((x) => x.id !== id));
  const handleBatchImportMapel = (newItems: MataPelajaran[]) =>
    setMapelList((prev) => [...prev, ...newItems]);

  // Bank Soal CRUD Handlers
  const handleAddBankSoal = (b: BankSoal) => setBankSoalList((prev) => [...prev, b]);
  const handleUpdateBankSoal = (b: BankSoal) =>
    setBankSoalList((prev) => prev.map((x) => (x.id === b.id ? b : x)));
  const handleDeleteBankSoal = (id: string) =>
    setBankSoalList((prev) => prev.filter((x) => x.id !== id));

  // Question CRUD Handlers
  const handleAddSoal = (s: Soal) => {
    setSoalList((prev) => [...prev, s]);
    // update total questions in bank
    setBankSoalList((prev) =>
      prev.map((b) => (b.id === s.bankSoalId ? { ...b, totalSoal: b.totalSoal + 1 } : b))
    );
  };
  const handleUpdateSoal = (s: Soal) =>
    setSoalList((prev) => prev.map((x) => (x.id === s.id ? s : x)));
  const handleDeleteSoal = (id: string) => {
    const target = soalList.find((x) => x.id === id);
    setSoalList((prev) => prev.filter((x) => x.id !== id));
    if (target) {
      setBankSoalList((prev) =>
        prev.map((b) =>
          b.id === target.bankSoalId ? { ...b, totalSoal: Math.max(0, b.totalSoal - 1) } : b
        )
      );
    }
  };

  const handleBatchImportSoal = (bankId: string, newSoal: Soal[]) => {
    setSoalList((prev) => [...prev, ...newSoal]);
    setBankSoalList((prev) =>
      prev.map((b) => (b.id === bankId ? { ...b, totalSoal: b.totalSoal + newSoal.length } : b))
    );
  };

  // Exam Schedule CRUD & Token Handlers
  const handleAddUjian = (u: Ujian) => setUjianList((prev) => [...prev, u]);
  const handleUpdateUjian = (u: Ujian) =>
    setUjianList((prev) => prev.map((x) => (x.id === u.id ? u : x)));
  const handleDeleteUjian = (id: string) =>
    setUjianList((prev) => prev.filter((x) => x.id !== id));

  const handleGenerateToken = (ujianId: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newToken = '';
    for (let i = 0; i < 6; i++) {
      newToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setUjianList((prev) =>
      prev.map((u) =>
        u.id === ujianId
          ? { ...u, tokenCode: newToken, tokenGeneratedAt: new Date().toISOString() }
          : u
      )
    );
  };

  const handleToggleTokenActive = (ujianId: string) => {
    setUjianList((prev) =>
      prev.map((u) => (u.id === ujianId ? { ...u, tokenActive: !u.tokenActive } : u))
    );
  };

  // Automatic Token Rotation Effect (Every 5 Minutes / 300 Seconds)
  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const generateToken = () => {
      let newToken = '';
      for (let i = 0; i < 6; i++) {
        newToken += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return newToken;
    };

    const interval = setInterval(() => {
      const now = Date.now();
      setUjianList((prev) => {
        let hasChanges = false;
        const updated = prev.map((u) => {
          if (u.status !== 'Aktif' || u.tokenActive === false) return u;
          const genTime = u.tokenGeneratedAt ? new Date(u.tokenGeneratedAt).getTime() : 0;
          if (!genTime || now - genTime >= 5 * 60 * 1000) {
            hasChanges = true;
            return {
              ...u,
              tokenCode: generateToken(),
              tokenGeneratedAt: new Date(now).toISOString(),
            };
          }
          return u;
        });
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Student Starts Exam Handler
  const handleStartExam = (ujian: Ujian, tokenEntered: string) => {
    setActiveExamTaking(ujian);
    setIsExamMode(true);

    // Record login in Absen Ujian
    const nowStr = new Date().toLocaleString('id-ID');
    setAbsenList((prev) => {
      const existing = prev.find(
        (a) => a.ujianId === ujian.id && a.siswaId === currentUser.id
      );
      if (existing) {
        return prev.map((a) =>
          a.id === existing.id
            ? { ...a, status: 'Sedang Mengerjakan', waktuLogin: nowStr }
            : a
        );
      }
      return [
        ...prev,
        {
          id: `absen-${Date.now()}`,
          ujianId: ujian.id,
          siswaId: currentUser.id,
          namaSiswa: currentUser.nama,
          nisn: currentUser.nipNisn || '0054321001',
          kelas: currentUser.kelas || 'X-IPA-1',
          status: 'Sedang Mengerjakan',
          waktuLogin: nowStr,
          jumlahPelanggaran: 0,
        },
      ];
    });
  };

  // Student Submits Exam & Auto Scoring Logic
  const handleSubmitExam = (
    studentAnswers: Record<string, JawabanSiswa>,
    timeSpentSeconds: number,
    violationCount: number,
    isLocked: boolean
  ) => {
    if (!activeExamTaking) return;

    const examQuestions = soalList.filter((s) => s.bankSoalId === activeExamTaking.bankSoalId);
    let totalScore = 0;
    let maxPossibleScore = 0;
    let hasEssay = false;

    // Evaluate answers
    const evaluatedAnswers: Record<string, JawabanSiswa> = {};

    examQuestions.forEach((q) => {
      maxPossibleScore += q.bobot;
      const ans = studentAnswers[q.id];

      if (!ans) {
        evaluatedAnswers[q.id] = {
          soalId: q.id,
          tipeSoal: q.tipeSoal,
          skorDiperoleh: 0,
        };
        return;
      }

      let scoreForThisSoal = 0;

      if (q.tipeSoal === 'pilihan_ganda') {
        const correctOpt = q.opsiPG?.find((o) => o.isCorrect);
        if (correctOpt && ans.jawabanPG === correctOpt.id) {
          scoreForThisSoal = q.bobot;
        }
      } else if (q.tipeSoal === 'pilihan_ganda_kompleks') {
        const correctIds = (q.opsiPG || []).filter((o) => o.isCorrect).map((o) => o.id);
        const studentIds = ans.jawabanPGKompleks || [];
        const isMatch =
          correctIds.length === studentIds.length &&
          correctIds.every((id) => studentIds.includes(id));
        if (isMatch) scoreForThisSoal = q.bobot;
      } else if (q.tipeSoal === 'benar_salah') {
        const statements = q.pernyataanBenarSalah || [];
        let correctCount = 0;
        statements.forEach((bs) => {
          const studentBs = ans.jawabanBenarSalah?.find((item) => item.statementId === bs.id);
          if (studentBs && studentBs.value === bs.jawabanBenar) {
            correctCount++;
          }
        });
        if (statements.length > 0) {
          scoreForThisSoal = Math.round((correctCount / statements.length) * q.bobot);
        }
      } else if (q.tipeSoal === 'menjodohkan') {
        const pairs = q.pasanganMenjodohkan || [];
        let correctCount = 0;
        pairs.forEach((p) => {
          const studentMatch = ans.jawabanMenjodohkan?.find((m) => m.pairId === p.id);
          if (studentMatch && studentMatch.selectedKanan === p.jawabanCorrect) {
            correctCount++;
          }
        });
        if (pairs.length > 0) {
          scoreForThisSoal = Math.round((correctCount / pairs.length) * q.bobot);
        }
      } else if (q.tipeSoal === 'isian_singkat') {
        const validKeys = (q.kunciIsianSingkat || []).map((k) => k.toLowerCase().trim());
        const studentText = (ans.jawabanIsianSingkat || '').toLowerCase().trim();
        if (validKeys.includes(studentText)) {
          scoreForThisSoal = q.bobot;
        }
      } else if (q.tipeSoal === 'esai') {
        hasEssay = true;
        scoreForThisSoal = 0; // Essay score pending manual teacher grading
      }

      totalScore += scoreForThisSoal;

      evaluatedAnswers[q.id] = {
        ...ans,
        skorDiperoleh: scoreForThisSoal,
      };
    });

    // Scale final score to 0-100
    const scaledScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    const nowStr = new Date().toLocaleString('id-ID');

    // Create HasilUjian Record
    const newHasilRecord: HasilUjian = {
      id: `hasil-${Date.now()}`,
      ujianId: activeExamTaking.id,
      siswaId: currentUser.id,
      namaSiswa: currentUser.nama,
      nisn: currentUser.nipNisn || '0054321001',
      kelas: currentUser.kelas || 'X-IPA-1',
      waktuMulaiKerja: new Date().toISOString(),
      waktuSelesaiKerja: new Date().toISOString(),
      durasiPengerjaanDetik: timeSpentSeconds,
      status: isLocked ? 'Terkunci Pelanggaran' : 'Selesai',
      jumlahPelanggaran: violationCount,
      jawaban: evaluatedAnswers,
      nilaiTotal: scaledScore,
      nilaiEsaiPending: hasEssay,
    };

    setHasilUjianList((prev) => [
      ...prev.filter(
        (h) => !(h.ujianId === activeExamTaking.id && h.siswaId === currentUser.id)
      ),
      newHasilRecord,
    ]);

    // Update Absen Ujian
    setAbsenList((prev) =>
      prev.map((a) =>
        a.ujianId === activeExamTaking.id && a.siswaId === currentUser.id
          ? {
              ...a,
              status: isLocked ? 'Terkunci' : 'Selesai',
              waktuSelesai: nowStr,
              jumlahPelanggaran: violationCount,
            }
          : a
      )
    );

    setIsExamMode(false);
    setActiveExamTaking(null);
    alert(
      isLocked
        ? 'UJIAN TERKUNCI! Hasil pengerjaan terakhir Anda telah dikirim ke sistem.'
        : `SELAMAT! Anda telah menyelesaikan ujian '${activeExamTaking.namaUjian}'. Nilai Sementara: ${scaledScore}/100`
    );
  };

  // Grade Essay Handler
  const handleGradeEssay = (
    hasilId: string,
    soalId: string,
    skor: number,
    catatan: string
  ) => {
    setHasilUjianList((prev) =>
      prev.map((h) => {
        if (h.id !== hasilId) return h;

        const updatedJawaban = {
          ...h.jawaban,
          [soalId]: {
            ...h.jawaban[soalId],
            skorDiperoleh: skor,
            isGraded: true,
            catatanGuru: catatan,
          },
        };

        // Recalculate total score
        const newTotal = (Object.values(updatedJawaban) as JawabanSiswa[]).reduce(
          (acc, curr) => acc + (curr.skorDiperoleh || 0),
          0
        );

        return {
          ...h,
          jawaban: updatedJawaban,
          nilaiTotal: Math.min(100, newTotal),
          nilaiEsaiPending: false,
        };
      })
    );
  };

  // Render Fullscreen Exam View if student is actively taking exam
  if (isExamMode && activeExamTaking) {
    const examQuestions = soalList.filter((s) => s.bankSoalId === activeExamTaking.bankSoalId);

    return (
      <SiswaExamRoom
        ujian={ujianList.find((u) => u.id === activeExamTaking.id) || activeExamTaking}
        questions={examQuestions}
        student={currentUser}
        onSubmitExam={handleSubmitExam}
      />
    );
  }

  // Render Fullscreen Login Screen or Login Preview Mode
  if (isLoginPageMode || isLoginPreviewMode) {
    return (
      <LoginPage
        settings={appSettings}
        users={users}
        currentUser={currentUser}
        onLoginSelect={(user) => {
          handleSwitchUser(user);
          setIsLoginPageMode(false);
          setIsLoginPreviewMode(false);
        }}
        isPreview={isLoginPreviewMode}
        onClosePreview={() => {
          setIsLoginPageMode(false);
          setIsLoginPreviewMode(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={users}
        settings={appSettings}
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        onSwitchUser={handleSwitchUser}
        onResetData={handleResetData}
        onOpenLogin={() => setIsLoginPageMode(true)}
        onLogout={() => setIsLoginPageMode(true)}
      />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          role={currentUser.role}
          activeMenu={activeMenu}
          onSelectMenu={(menu) => setActiveMenu(menu)}
          onLogout={() => setIsLoginPageMode(true)}
        />

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* ADMIN VIEWS */}
          {currentUser.role === 'admin' && (
            <>
              {activeMenu === 'dashboard' && (
                <AdminDashboard
                  users={users}
                  mapel={mapelList}
                  bankSoal={bankSoalList}
                  ujian={ujianList}
                  hasilUjian={hasilUjianList}
                  absen={absenList}
                  onNavigate={setActiveMenu}
                />
              )}
              {activeMenu === 'kelola_admin' && (
                <AdminAdmins
                  users={users}
                  onAddAdmin={handleAddAdmin}
                  onUpdateAdmin={handleUpdateAdmin}
                  onDeleteAdmin={handleDeleteAdmin}
                />
              )}
              {activeMenu === 'kelola_guru' && (
                <AdminTeachers
                  users={users}
                  mapelList={mapelList}
                  onAddTeacher={handleAddTeacher}
                  onUpdateTeacher={handleUpdateTeacher}
                  onDeleteTeacher={handleDeleteTeacher}
                  onBatchImportTeachers={handleBatchImportTeachers}
                />
              )}
              {activeMenu === 'kelola_siswa' && (
                <AdminStudents
                  users={users}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onBatchImportStudents={handleBatchImportStudents}
                />
              )}
              {activeMenu === 'kelola_mapel' && (
                <AdminSubjects
                  mapelList={mapelList}
                  onAddMapel={handleAddMapel}
                  onUpdateMapel={handleUpdateMapel}
                  onDeleteMapel={handleDeleteMapel}
                  onBatchImportMapel={handleBatchImportMapel}
                />
              )}
              {activeMenu === 'bank_soal' && (
                <AdminQuestionBanks
                  bankSoalList={bankSoalList}
                  soalList={soalList}
                  mapelList={mapelList}
                  guruList={users.filter((u) => u.role === 'guru')}
                  currentUserId={currentUser.id}
                  onAddBankSoal={handleAddBankSoal}
                  onUpdateBankSoal={handleUpdateBankSoal}
                  onDeleteBankSoal={handleDeleteBankSoal}
                  onAddSoal={handleAddSoal}
                  onUpdateSoal={handleUpdateSoal}
                  onDeleteSoal={handleDeleteSoal}
                  onBatchImportSoal={handleBatchImportSoal}
                />
              )}
              {activeMenu === 'kelola_ujian' && (
                <AdminExams
                  ujianList={ujianList}
                  bankSoalList={bankSoalList}
                  mapelList={mapelList}
                  guruList={users.filter((u) => u.role === 'guru')}
                  currentUserId={currentUser.id}
                  onAddUjian={handleAddUjian}
                  onUpdateUjian={handleUpdateUjian}
                  onDeleteUjian={handleDeleteUjian}
                  onGenerateToken={handleGenerateToken}
                  onToggleTokenActive={handleToggleTokenActive}
                />
              )}
              {activeMenu === 'hasil_ujian' && (
                <AdminExamResults
                  hasilUjianList={hasilUjianList}
                  ujianList={ujianList}
                  soalList={soalList}
                  students={users.filter((u) => u.role === 'siswa')}
                  onGradeEssay={handleGradeEssay}
                />
              )}
              {activeMenu === 'absen_ujian' && (
                <AdminAttendance
                  absenList={absenList}
                  ujianList={ujianList}
                />
              )}
              {activeMenu === 'pengaturan' && (
                <AdminSettings
                  settings={appSettings}
                  onSaveSettings={(newSettings) => setAppSettings(newSettings)}
                  onOpenLoginPreview={() => setIsLoginPreviewMode(true)}
                />
              )}
            </>
          )}

          {/* GURU VIEWS */}
          {currentUser.role === 'guru' && (
            <>
              {activeMenu === 'dashboard' && (
                <GuruDashboard
                  currentGuru={currentUser}
                  bankSoalList={bankSoalList}
                  ujianList={ujianList}
                  hasilUjianList={hasilUjianList}
                  mapelList={mapelList}
                  onNavigate={setActiveMenu}
                />
              )}
              {activeMenu === 'bank_soal' && (
                <AdminQuestionBanks
                  bankSoalList={bankSoalList.filter((b) => b.guruId === currentUser.id)}
                  soalList={soalList}
                  mapelList={mapelList}
                  guruList={users.filter((u) => u.role === 'guru')}
                  currentUserId={currentUser.id}
                  onAddBankSoal={handleAddBankSoal}
                  onUpdateBankSoal={handleUpdateBankSoal}
                  onDeleteBankSoal={handleDeleteBankSoal}
                  onAddSoal={handleAddSoal}
                  onUpdateSoal={handleUpdateSoal}
                  onDeleteSoal={handleDeleteSoal}
                  onBatchImportSoal={handleBatchImportSoal}
                />
              )}
              {activeMenu === 'kelola_ujian' && (
                <AdminExams
                  ujianList={ujianList.filter((u) => u.guruId === currentUser.id)}
                  bankSoalList={bankSoalList}
                  mapelList={mapelList}
                  guruList={users.filter((u) => u.role === 'guru')}
                  currentUserId={currentUser.id}
                  onAddUjian={handleAddUjian}
                  onUpdateUjian={handleUpdateUjian}
                  onDeleteUjian={handleDeleteUjian}
                  onGenerateToken={handleGenerateToken}
                  onToggleTokenActive={handleToggleTokenActive}
                />
              )}
              {activeMenu === 'hasil_ujian' && (
                <AdminExamResults
                  hasilUjianList={hasilUjianList}
                  ujianList={ujianList.filter((u) => u.guruId === currentUser.id)}
                  soalList={soalList}
                  students={users.filter((u) => u.role === 'siswa')}
                  onGradeEssay={handleGradeEssay}
                />
              )}
              {activeMenu === 'absen_ujian' && (
                <AdminAttendance
                  absenList={absenList}
                  ujianList={ujianList.filter((u) => u.guruId === currentUser.id)}
                />
              )}
            </>
          )}

          {/* SISWA VIEWS */}
          {currentUser.role === 'siswa' && (
            <>
              {(activeMenu === 'siswa_ujian' || activeMenu === 'dashboard') && (
                <SiswaExamList
                  currentStudent={currentUser}
                  activeExams={ujianList.filter((u) => u.status === 'Aktif')}
                  mapelList={mapelList}
                  hasilUjianList={hasilUjianList}
                  onStartExam={handleStartExam}
                />
              )}
              {activeMenu === 'riwayat_ujian' && (
                <SiswaExamHistory
                  currentStudent={currentUser}
                  hasilUjianList={hasilUjianList}
                  ujianList={ujianList}
                  mapelList={mapelList}
                  users={users}
                />
              )}
              {activeMenu === 'edit_profil' && (
                <SiswaProfile
                  currentStudent={currentUser}
                  onUpdateUser={handleUpdateUserProfile}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
