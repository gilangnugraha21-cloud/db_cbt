import React, { useState, useEffect, useRef } from 'react';
import { Ujian, Soal, User, JawabanSiswa } from '../../types/cbt';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  X,
  Lock,
} from 'lucide-react';
import { QuestionTypeBadge } from '../common/QuestionTypeBadge';
import { MathRenderer } from '../common/MathRenderer';
import { QuestionMediaDisplay } from '../common/QuestionMediaDisplay';

interface Props {
  ujian: Ujian;
  questions: Soal[];
  student: User;
  onSubmitExam: (
    answers: Record<string, JawabanSiswa>,
    timeSpentSeconds: number,
    violationCount: number,
    isLocked: boolean
  ) => void;
}

export const SiswaExamRoom: React.FC<Props> = ({
  ujian,
  questions,
  student,
  onSubmitExam,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, JawabanSiswa>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(ujian.durasiMenit * 60);

  // Anti-Cheat State
  const [violationCount, setViolationCount] = useState(0);
  const [violationsInCurrentPhase, setViolationsInCurrentPhase] = useState(0);
  const [hasBeenSuspended, setHasBeenSuspended] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspendTimer, setSuspendTimer] = useState(60); // 1 minute countdown
  const [reEntryTokenInput, setReEntryTokenInput] = useState('');
  const [reEntryTokenError, setReEntryTokenError] = useState('');

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningReason, setWarningReason] = useState('');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const lastViolationTimeRef = useRef<number>(0);

  const currentSoal = questions[currentQuestionIndex];

  // Request Fullscreen on Mount
  useEffect(() => {
    const requestFS = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
    };
    requestFS();

    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && !isSuspended) {
        triggerViolation('FULLSCREEN_EXIT', 'Keluar dari Mode Layar Penuh (Fullscreen)');
      }
    };

    document.addEventListener('fullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
    };
  }, [isSuspended]);

  // Anti-Cheat Global Listeners (Web & Android ExamBrowser)
  useEffect(() => {
    if (isSuspended) return;

    // 1. Contextmenu Disable (Right Click & Android Long Tap)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('CONTEXT_MENU', 'Mencoba membuka Klik Kanan / Menu Konteks');
    };

    // 2. Anti Copy, Cut, Paste, Select
    const handleCopyPaste = (e: Event) => {
      e.preventDefault();
      triggerViolation('COPY_PASTE', `Mencoba tindakan ${e.type.toUpperCase()}`);
    };

    // 3. Key Shortcuts & Screenshot Prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44;
      const isMacScreenshot = e.metaKey && e.shiftKey && ['3', '4', '5', 'Digit3', 'Digit4', 'Digit5'].includes(e.key || e.code);
      const isWinScreenshot = e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key?.toLowerCase() === 's' || e.code === 'KeyS');

      if (isPrintScreen || isMacScreenshot || isWinScreenshot) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation('SCREENSHOT', 'Mencoba mengambil tangkapan layar (Screenshot / Tangkap Layar)');
        return;
      }

      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 67 || e.keyCode === 86))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation('KEYBOARD_SHORTCUT', 'Mencoba menggunakan tombol kombinasi terlarang');
      }
    };

    // 3b. Screenshot KeyUp Listener (Catches OS-level PrintScreen key release)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(''); // Clear clipboard content
        }
        triggerViolation('SCREENSHOT', 'Mencoba mengambil tangkapan layar (Screenshot / Tangkap Layar)');
      }
    };

    // 4. Tab Switch & Android App Switch Detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('TAB_SWITCH', 'Membuka tab/jendela lain atau berpindah aplikasi (Android ExamBrowser)');
      }
    };

    // 5. Window Blur (Android Split Screen / Floating Window / Pull Down Notification Bar)
    const handleWindowBlur = () => {
      triggerViolation('WINDOW_BLUR', 'Fokus pengerjaan terlepas (Split screen / Floating app / Fitur layar Android)');
    };

    // 6. Android Back Button Trap
    window.history.pushState({ page: 'exam' }, '', window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState({ page: 'exam' }, '', window.location.href);
      triggerViolation('ANDROID_BACK', 'Mencoba menekan tombol Kembali (Back Button) Android/Browser');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    ['copy', 'cut', 'paste', 'selectstart'].forEach((evt) =>
      document.addEventListener(evt, handleCopyPaste)
    );
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      ['copy', 'cut', 'paste', 'selectstart'].forEach((evt) =>
        document.removeEventListener(evt, handleCopyPaste)
      );
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isSuspended, hasBeenSuspended]);

  // Exam Main Duration Countdown
  useEffect(() => {
    if (isSuspended) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(false); // Auto Submit on Timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuspended]);

  // Suspension Timer Countdown Effect (60 Seconds = 1 Minute)
  useEffect(() => {
    if (!isSuspended || suspendTimer <= 0) return;

    const interval = setInterval(() => {
      setSuspendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuspended, suspendTimer]);

  const triggerViolation = (type: string, reason: string) => {
    if (isSuspended) return;

    // Debounce duplicate events fired simultaneously
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 1200) {
      return;
    }
    lastViolationTimeRef.current = now;

    setViolationCount((prevTotal) => prevTotal + 1);
    setWarningReason(reason);

    setViolationsInCurrentPhase((prevPhase) => {
      const nextPhase = prevPhase + 1;
      const limit = hasBeenSuspended ? 1 : 3;

      if (nextPhase >= limit) {
        // Trigger 1-minute suspension!
        setIsSuspended(true);
        setSuspendTimer(60);
        setHasBeenSuspended(true);
        setShowWarningModal(false);
        setReEntryTokenInput('');
        setReEntryTokenError('');
        return 0; // reset phase counter
      } else {
        setShowWarningModal(true);
        return nextPhase;
      }
    });
  };

  const handleVerifyTokenAndResume = (e: React.FormEvent) => {
    e.preventDefault();
    setReEntryTokenError('');

    if (suspendTimer > 0) {
      setReEntryTokenError(`Harap tunggu hingga timer hitungan mundur 1 menit selesai (${suspendTimer} detik lagi).`);
      return;
    }

    const expectedToken = (ujian.tokenCode || '').trim().toUpperCase();
    const entered = reEntryTokenInput.trim().toUpperCase();

    if (!entered) {
      setReEntryTokenError('Masukkan 6 karakter token ujian yang aktif dari pengawas.');
      return;
    }

    if (entered === expectedToken) {
      setIsSuspended(false);
      setReEntryTokenInput('');
      setReEntryTokenError('');
      // Request Fullscreen again
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
    } else {
      setReEntryTokenError('Token tidak cocok! Pastikan Anda memasukkan token ujian resmi dari pengawas.');
    }
  };

  const handleFinalSubmit = (locked: boolean = false) => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    onSubmitExam(answers, elapsed, violationCount, locked);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Answer Handlers for 6 Types
  const updateSinglePG = (soalId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [soalId]: {
        soalId,
        tipeSoal: 'pilihan_ganda',
        jawabanPG: optionId,
      },
    }));
  };

  const updateComplexPG = (soalId: string, optionId: string) => {
    const existing = answers[soalId]?.jawabanPGKompleks || [];
    const updated = existing.includes(optionId)
      ? existing.filter((id) => id !== optionId)
      : [...existing, optionId];

    setAnswers((prev) => ({
      ...prev,
      [soalId]: {
        soalId,
        tipeSoal: 'pilihan_ganda_kompleks',
        jawabanPGKompleks: updated,
      },
    }));
  };

  const updateBenarSalah = (soalId: string, statementId: string, val: boolean) => {
    const existing = answers[soalId]?.jawabanBenarSalah || [];
    const updated = existing.some((item) => item.statementId === statementId)
      ? existing.map((item) => (item.statementId === statementId ? { statementId, value: val } : item))
      : [...existing, { statementId, value: val }];

    setAnswers((prev) => ({
      ...prev,
      [soalId]: {
        soalId,
        tipeSoal: 'benar_salah',
        jawabanBenarSalah: updated,
      },
    }));
  };

  const updateMatching = (soalId: string, pairId: string, selectedKanan: string) => {
    const existing = answers[soalId]?.jawabanMenjodohkan || [];
    const updated = existing.some((item) => item.pairId === pairId)
      ? existing.map((item) => (item.pairId === pairId ? { pairId, selectedKanan } : item))
      : [...existing, { pairId, selectedKanan }];

    setAnswers((prev) => ({
      ...prev,
      [soalId]: {
        soalId,
        tipeSoal: 'menjodohkan',
        jawabanMenjodohkan: updated,
      },
    }));
  };

  const updateIsian = (soalId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [soalId]: {
        soalId,
        tipeSoal: 'isian_singkat',
        jawabanIsianSingkat: text,
      },
    }));
  };

  const updateEsai = (soalId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [soalId]: {
        soalId,
        tipeSoal: 'esai',
        jawabanEsai: text,
      },
    }));
  };

  const answeredCount = Object.keys(answers).length;

  if (isSuspended) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white select-none">
        <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl relative overflow-hidden">
          {/* Header Icon */}
          <div className="p-4 bg-rose-600/20 border-2 border-rose-500/50 rounded-full w-20 h-20 mx-auto flex items-center justify-center animate-pulse">
            <Lock className="w-10 h-10 text-rose-500" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-wider px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-full inline-block mb-2 uppercase">
              🛡️ Anti-Cheat Android & Web ExamBrowser Active
            </span>
            <h2 className="text-lg sm:text-xl font-black text-rose-400 uppercase tracking-tight">
              SESI UJIAN DIBEKUKAN / TER-SUSPEND (1 MENIT)
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {warningReason || 'Anda terdeteksi melakukan pelanggaran aturan ujian (berpindah tab/aplikasi/keluar layar).'}{' '}
              Sistem secara otomatis membekukan pengerjaan Anda selama 1 menit.
            </p>
          </div>

          {/* Countdown Timer Display */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Timer Pembekuan Sesi Ujian
            </div>
            <div className="text-4xl font-black font-mono text-amber-400 tracking-wider">
              {formatTimer(suspendTimer)}
            </div>
            <p className="text-[11px] text-slate-400">
              {suspendTimer > 0
                ? 'Harap tunggu hingga hitungan mundur selesai untuk memasukkan token re-entry.'
                : 'Hitungan mundur selesai. Masukkan token ujian di bawah ini untuk melanjutkan.'}
            </p>
          </div>

          {/* Token Form */}
          <form onSubmit={handleVerifyTokenAndResume} className="space-y-3 pt-1 text-left">
            <div>
              <label className="block text-2xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Token Ujian Re-Entry ( Minta ke Guru / Pengawas )
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={reEntryTokenInput}
                  onChange={(e) => {
                    setReEntryTokenInput(e.target.value.toUpperCase());
                    setReEntryTokenError('');
                  }}
                  disabled={suspendTimer > 0}
                  placeholder={suspendTimer > 0 ? 'Tunggu timer 00:00...' : 'Ketik 6 karakter token...'}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono font-bold tracking-widest text-amber-300 placeholder-slate-600 focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50 text-center uppercase"
                />
              </div>
            </div>

            {reEntryTokenError && (
              <div className="p-3 bg-rose-950/80 border border-rose-700 text-rose-300 rounded-xl text-2xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{reEntryTokenError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={suspendTimer > 0 || !reEntryTokenInput.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Verifikasi Token & Lanjutkan Ujian</span>
            </button>
          </form>

          {/* Rule Note for Subsequent Violations */}
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-2xs text-amber-300/90 text-center leading-normal">
            ⚠️ <strong>Aturan Setelah Masuk Kembali:</strong> Toleransi pelanggaran menjadi <strong>hanya 1 kali</strong>. Setiap 1 kali pelanggaran berikutnya akan langsung terkena suspend 1 menit kembali!
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleFinalSubmit(true)}
              className="text-2xs text-slate-500 hover:text-slate-300 underline font-semibold"
            >
              Kirim Jawaban Seadanya & Akhiri Ujian
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSoal || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="w-14 h-14 bg-amber-950/80 border border-amber-700/80 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Soal Ujian Belum Tersedia</h2>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Bank soal untuk paket ujian ini belum memiliki daftar pertanyaan yang aktif. Silakan hubungi pengawas ujian atau guru mata pelajaran.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleFinalSubmit(false)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            Kembali ke Halaman Ujian
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* Top Fixed Exam Banner */}
      <header className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">{ujian.namaUjian}</h1>
          <p className="text-2xs text-slate-400 mt-0.5">
            Peserta: <strong className="text-slate-200">{student.nama}</strong> ({student.kelas})
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Violation Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-2xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>
              Pelanggaran: {violationsInCurrentPhase} / {hasBeenSuspended ? '1 (Strict)' : '3'} (Total: {violationCount})
            </span>
          </div>

          {/* Countdown Timer Badge */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-amber-300 font-mono font-extrabold text-sm shadow-inner">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Selesai & Submit
          </button>
        </div>
      </header>

      {/* Main Exam Interface Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Question Content Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  {currentQuestionIndex + 1}
                </span>
                <QuestionTypeBadge type={currentSoal.tipeSoal} />
              </div>
              <span className="text-2xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-md">
                Bobot: {currentSoal.bobot} Poin
              </span>
            </div>

            {/* Question Statement & Media Attachments */}
            <div className="space-y-3">
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
                <MathRenderer text={currentSoal.pertanyaan} />
              </div>
              <QuestionMediaDisplay
                gambarUrl={currentSoal.gambarUrl}
                audioUrl={currentSoal.audioUrl}
                videoUrl={currentSoal.videoUrl}
              />
            </div>

            {/* Render Options according to 6 Types */}
            <div className="space-y-3 pt-2">
              {/* Type 1: Pilihan Ganda (Single Choice) */}
              {currentSoal.tipeSoal === 'pilihan_ganda' && (
                <div className="space-y-2">
                  {currentSoal.opsiPG?.map((opt) => {
                    const isSelected = answers[currentSoal.id]?.jawabanPG === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => updateSinglePG(currentSoal.id, opt.id)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">
                          <MathRenderer text={opt.teks} inline />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 2: Pilihan Ganda Kompleks (Checkbox) */}
              {currentSoal.tipeSoal === 'pilihan_ganda_kompleks' && (
                <div className="space-y-2">
                  <p className="text-2xs text-indigo-700 font-bold italic mb-2">
                    *Pilih satu atau lebih jawaban yang benar
                  </p>
                  {currentSoal.opsiPG?.map((opt) => {
                    const selectedList = answers[currentSoal.id]?.jawabanPGKompleks || [];
                    const isChecked = selectedList.includes(opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => updateComplexPG(currentSoal.id, opt.id)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 text-indigo-600 mt-0.5"
                        />
                        <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">
                          {opt.label}. <MathRenderer text={opt.teks} inline />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 3: Benar / Salah */}
              {currentSoal.tipeSoal === 'benar_salah' && (
                <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                  <p className="text-2xs font-bold text-emerald-900 mb-1">
                    Tentukan kebenaran dari setiap pernyataan berikut:
                  </p>
                  {currentSoal.pernyataanBenarSalah?.map((bs) => {
                    const currentAnswerItem = answers[currentSoal.id]?.jawabanBenarSalah?.find(
                      (item) => item.statementId === bs.id
                    );

                    return (
                      <div key={bs.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">
                          <MathRenderer text={bs.pernyataan} />
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateBenarSalah(currentSoal.id, bs.id, true)}
                            className={`flex-1 py-1.5 rounded-lg text-2xs font-bold transition-all border ${
                              currentAnswerItem?.value === true
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50'
                            }`}
                          >
                            BENAR
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBenarSalah(currentSoal.id, bs.id, false)}
                            className={`flex-1 py-1.5 rounded-lg text-2xs font-bold transition-all border ${
                              currentAnswerItem?.value === false
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50'
                            }`}
                          >
                            SALAH
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 4: Menjodohkan */}
              {currentSoal.tipeSoal === 'menjodohkan' && (
                <div className="space-y-3 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                  <p className="text-2xs font-bold text-purple-900 mb-1">
                    Pilih pasangan yang tepat di kolom kanan untuk tiap item di kolom kiri:
                  </p>
                  {currentSoal.pasanganMenjodohkan?.map((p) => {
                    const currentMatch = answers[currentSoal.id]?.jawabanMenjodohkan?.find(
                      (m) => m.pairId === p.id
                    );

                    return (
                      <div key={p.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-slate-800">
                          <MathRenderer text={p.pertanyaan} />
                        </div>
                        <select
                          value={currentMatch?.selectedKanan || ''}
                          onChange={(e) => updateMatching(currentSoal.id, p.id, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-purple-900"
                        >
                          <option value="">-- Pilih Pasangan Kanan --</option>
                          {currentSoal.opsiKananRandom?.map((rightOpt, idx) => (
                            <option key={idx} value={rightOpt}>
                              {rightOpt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 5: Isian Singkat */}
              {currentSoal.tipeSoal === 'isian_singkat' && (
                <div className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                  <label className="block text-xs font-bold text-amber-900">
                    Tuliskan Jawaban Singkat Anda di Sini:
                  </label>
                  <input
                    type="text"
                    value={answers[currentSoal.id]?.jawabanIsianSingkat || ''}
                    onChange={(e) => updateIsian(currentSoal.id, e.target.value)}
                    placeholder="Ketik jawaban singkat Anda..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Type 6: Esai */}
              {currentSoal.tipeSoal === 'esai' && (
                <div className="space-y-2 bg-rose-50/50 p-4 rounded-xl border border-rose-200">
                  <label className="block text-xs font-bold text-rose-900">
                    Tuliskan Penjelasan Lengkap Jawaban Esai Anda:
                  </label>
                  <textarea
                    rows={5}
                    value={answers[currentSoal.id]?.jawabanEsai || ''}
                    onChange={(e) => updateEsai(currentSoal.id, e.target.value)}
                    placeholder="Uraikan jawaban esai secara lengkap dan rinci..."
                    className="w-full p-4 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-rose-500"
                  ></textarea>
                </div>
              )}
            </div>

            {/* Question Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>

              <button
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
              >
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette Navigator Grid */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Navigasi Soal</span>
              <span className="text-2xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {answeredCount} / {questions.length} Dijawab
              </span>
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answers[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                        : isAnswered
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-2xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span>
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-blue-600 inline-block"></span>
                <span>Sedang Dilihat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-200 inline-block"></span>
                <span>Belum Dijawab</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal popup on Violation */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-rose-500 space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ⚠️ PERINGATAN PELANGGARAN ({violationsInCurrentPhase} / {hasBeenSuspended ? 1 : 3})
            </h3>
            <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {warningReason}
            </p>
            <p className="text-2xs text-slate-500 leading-relaxed">
              {hasBeenSuspended
                ? 'PERHATIAN: Anda sudah pernah ter-suspend. 1 kali pelanggaran lagi akan langsung membekukan pengerjaan ujian selama 1 menit!'
                : `Pelanggaran ${violationsInCurrentPhase} dari batas 3 kali. Jika mencapai 3 kali, pengerjaan ujian akan ter-suspend selama 1 menit!`}
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Saya Mengerti & Kembali ke Ujian
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Selesai Ujian</h3>
            <p className="text-xs text-slate-600">
              Anda telah menjawab <strong>{answeredCount}</strong> dari total <strong>{questions.length}</strong> soal.
            </p>
            {answeredCount < questions.length && (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-2xs">
                ⚠️ Masih ada {questions.length - answeredCount} soal yang belum Anda jawab.
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Kembali Periksa
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleFinalSubmit(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Ya, Selesai & Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
