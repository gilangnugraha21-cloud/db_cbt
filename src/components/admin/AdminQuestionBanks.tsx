import React, { useState } from 'react';
import {
  BankSoal,
  Soal,
  MataPelajaran,
  User,
  QuestionType,
  OptionPG,
  BenarSalahStatement,
  MatchingPair,
} from '../../types/cbt';
import {
  FileQuestion,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle2,
  Layers,
  HelpCircle,
  PlusCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { QuestionTypeBadge } from '../common/QuestionTypeBadge';
import { CSVImportModal } from '../common/CSVImportModal';
import { MathRenderer } from '../common/MathRenderer';
import { MathEquationToolbar } from '../common/MathEquationToolbar';
import { QuestionMediaEditor } from '../common/QuestionMediaEditor';
import { QuestionMediaDisplay } from '../common/QuestionMediaDisplay';

interface Props {
  bankSoalList: BankSoal[];
  soalList: Soal[];
  mapelList: MataPelajaran[];
  guruList: User[];
  currentUserId: string;
  onAddBankSoal: (bank: BankSoal) => void;
  onUpdateBankSoal: (bank: BankSoal) => void;
  onDeleteBankSoal: (id: string) => void;
  onAddSoal: (soal: Soal) => void;
  onUpdateSoal: (soal: Soal) => void;
  onDeleteSoal: (id: string) => void;
  onBatchImportSoal: (bankId: string, newSoal: Soal[]) => void;
}

export const AdminQuestionBanks: React.FC<Props> = ({
  bankSoalList,
  soalList,
  mapelList,
  guruList,
  currentUserId,
  onAddBankSoal,
  onUpdateBankSoal,
  onDeleteBankSoal,
  onAddSoal,
  onUpdateSoal,
  onDeleteSoal,
  onBatchImportSoal,
}) => {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(
    bankSoalList[0]?.id || null
  );

  const [showBankModal, setShowBankModal] = useState(false);
  const [showSoalModal, setShowSoalModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [editSoalId, setEditSoalId] = useState<string | null>(null);

  // Form State for Bank Soal
  const [bankFormData, setBankFormData] = useState({
    kodeBank: '',
    namaBank: '',
    mapelId: mapelList[0]?.id || '',
    guruId: guruList[0]?.id || '',
  });

  // Form State for Soal Editor (All 6 Types)
  const [soalType, setSoalType] = useState<QuestionType>('pilihan_ganda');
  const [pertanyaan, setPertanyaan] = useState('');
  const [bobot, setBobot] = useState(15);

  // Media Attachments
  const [gambarUrl, setGambarUrl] = useState<string | undefined>(undefined);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  // 1 & 2. PG & PG Kompleks Options
  const [opsiPG, setOpsiPG] = useState<OptionPG[]>([
    { id: 'opt-a', label: 'A', teks: '', isCorrect: true },
    { id: 'opt-b', label: 'B', teks: '', isCorrect: false },
    { id: 'opt-c', label: 'C', teks: '', isCorrect: false },
    { id: 'opt-d', label: 'D', teks: '', isCorrect: false },
  ]);

  // 3. Benar / Salah Statements
  const [pernyataanBS, setPernyataanBS] = useState<BenarSalahStatement[]>([
    { id: 'bs-1', pernyataan: '', jawabanBenar: true },
    { id: 'bs-2', pernyataan: '', jawabanBenar: false },
  ]);

  // 4. Menjodohkan Pairs
  const [pasanganMatch, setPasanganMatch] = useState<MatchingPair[]>([
    { id: 'm-1', pertanyaan: '', jawabanCorrect: '' },
    { id: 'm-2', pertanyaan: '', jawabanCorrect: '' },
  ]);

  // 5. Isian Singkat
  const [kunciIsian, setKunciIsian] = useState('');

  // 6. Esai Rubrik
  const [rubrikEsai, setRubrikEsai] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const selectedBank = bankSoalList.find((b) => b.id === selectedBankId);
  const currentSoalItems = soalList.filter((s) => s.bankSoalId === selectedBankId);

  const openAddSoalModal = () => {
    setEditSoalId(null);
    setSoalType('pilihan_ganda');
    setPertanyaan('');
    setBobot(15);
    setGambarUrl(undefined);
    setAudioUrl(undefined);
    setVideoUrl(undefined);
    setOpsiPG([
      { id: 'opt-a', label: 'A', teks: 'Opsi A', isCorrect: true },
      { id: 'opt-b', label: 'B', teks: 'Opsi B', isCorrect: false },
      { id: 'opt-c', label: 'C', teks: 'Opsi C', isCorrect: false },
      { id: 'opt-d', label: 'D', teks: 'Opsi D', isCorrect: false },
    ]);
    setPernyataanBS([
      { id: 'bs-1', pernyataan: 'Pernyataan 1', jawabanBenar: true },
      { id: 'bs-2', pernyataan: 'Pernyataan 2', jawabanBenar: false },
    ]);
    setPasanganMatch([
      { id: 'm-1', pertanyaan: 'Konsep 1', jawabanCorrect: 'Pasangan 1' },
      { id: 'm-2', pertanyaan: 'Konsep 2', jawabanCorrect: 'Pasangan 2' },
    ]);
    setKunciIsian('');
    setRubrikEsai('');
    setShowSoalModal(true);
  };

  const openEditSoalModal = (soal: Soal) => {
    setEditSoalId(soal.id);
    setSoalType(soal.tipeSoal);
    setPertanyaan(soal.pertanyaan);
    setBobot(soal.bobot);
    setGambarUrl(soal.gambarUrl);
    setAudioUrl(soal.audioUrl);
    setVideoUrl(soal.videoUrl);

    if (soal.opsiPG) setOpsiPG(soal.opsiPG);
    if (soal.pernyataanBenarSalah) setPernyataanBS(soal.pernyataanBenarSalah);
    if (soal.pasanganMenjodohkan) setPasanganMatch(soal.pasanganMenjodohkan);
    if (soal.kunciIsianSingkat) setKunciIsian(soal.kunciIsianSingkat.join(', '));
    if (soal.rubrikEsai) setRubrikEsai(soal.rubrikEsai);

    setShowSoalModal(true);
  };

  const handleSaveSoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankId || !pertanyaan.trim()) return;

    const newSoalObj: Soal = {
      id: editSoalId || `soal-${Date.now()}`,
      bankSoalId: selectedBankId,
      tipeSoal: soalType,
      pertanyaan: pertanyaan,
      bobot: Number(bobot),
      gambarUrl: gambarUrl,
      audioUrl: audioUrl,
      videoUrl: videoUrl,
    };

    if (soalType === 'pilihan_ganda' || soalType === 'pilihan_ganda_kompleks') {
      newSoalObj.opsiPG = opsiPG;
    } else if (soalType === 'benar_salah') {
      newSoalObj.pernyataanBenarSalah = pernyataanBS;
    } else if (soalType === 'menjodohkan') {
      newSoalObj.pasanganMenjodohkan = pasanganMatch;
      newSoalObj.opsiKananRandom = pasanganMatch.map((p) => p.jawabanCorrect).sort(() => Math.random() - 0.5);
    } else if (soalType === 'isian_singkat') {
      newSoalObj.kunciIsianSingkat = kunciIsian.split(',').map((k) => k.trim().toLowerCase());
    } else if (soalType === 'esai') {
      newSoalObj.rubrikEsai = rubrikEsai;
    }

    if (editSoalId) {
      onUpdateSoal(newSoalObj);
      setNotification('Soal berhasil diperbarui');
    } else {
      onAddSoal(newSoalObj);
      setNotification('Soal baru berhasil dibuat');
    }

    setShowSoalModal(false);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankFormData.kodeBank || !bankFormData.namaBank) return;

    const newBank: BankSoal = {
      id: `bank-${Date.now()}`,
      kodeBank: bankFormData.kodeBank.toUpperCase(),
      namaBank: bankFormData.namaBank,
      mapelId: bankFormData.mapelId,
      guruId: bankFormData.guruId || currentUserId,
      totalSoal: 0,
    };

    onAddBankSoal(newBank);
    setSelectedBankId(newBank.id);
    setShowBankModal(false);
    setNotification('Bank soal baru berhasil dibuat');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleImportSoalData = (rows: string[][]) => {
    if (!selectedBankId) return;

    const importedItems: Soal[] = rows.map((row, idx) => {
      const typeStr = (row[0] || 'pilihan_ganda') as QuestionType;
      const questionText = row[1] || 'Pertanyaan Soal';
      const weight = Number(row[2]) || 10;

      return {
        id: `soal-import-${Date.now()}-${idx}`,
        bankSoalId: selectedBankId,
        tipeSoal: typeStr,
        pertanyaan: questionText,
        bobot: weight,
        opsiPG: [
          { id: `opt-a-${idx}`, label: 'A', teks: 'Pilihan A', isCorrect: true },
          { id: `opt-b-${idx}`, label: 'B', teks: 'Pilihan B', isCorrect: false },
        ],
      };
    });

    onBatchImportSoal(selectedBankId, importedItems);
    setNotification(`Berhasil mengimpor ${importedItems.length} soal ke bank`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-amber-600" /> Kelola Bank Soal (6 Tipe Soal)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilihan Ganda, PG Kompleks, Benar/Salah, Menjodohkan, Isian Singkat, & Esai
          </p>
        </div>
        <button
          onClick={() => setShowBankModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Buat Bank Soal Baru
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Layout: Bank Selector (Left) & Question List / Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Bank List */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Daftar Bank Soal</span>
            <span className="text-2xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">
              {bankSoalList.length}
            </span>
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {bankSoalList.map((bank) => {
              const isSelected = bank.id === selectedBankId;
              const mapel = mapelList.find((m) => m.id === bank.mapelId);
              const totalInBank = soalList.filter((s) => s.bankSoalId === bank.id).length;

              return (
                <div
                  key={bank.id}
                  onClick={() => setSelectedBankId(bank.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {bank.kodeBank}
                    </span>
                    <span className="text-2xs text-slate-500 font-bold">{totalInBank} Soal</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">{bank.namaBank}</h4>
                  <p className="text-2xs text-slate-500 mt-1">Mapel: {mapel?.namaMapel}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Question List in Selected Bank */}
        <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          {!selectedBank ? (
            <div className="text-center py-12 text-slate-400 text-xs">Pilih atau buat bank soal terlebih dahulu</div>
          ) : (
            <>
              {/* Bank Summary Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-600 text-white font-mono font-bold text-2xs rounded-md">
                      {selectedBank.kodeBank}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{selectedBank.namaBank}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Total Butir Soal: <strong>{currentSoalItems.length} Soal</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Import Soal CSV
                  </button>
                  <button
                    onClick={openAddSoalModal}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Soal
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {currentSoalItems.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Bank Soal ini belum memiliki butir soal. Klik 'Tambah Soal' untuk membuat butir soal baru.
                  </div>
                ) : (
                  currentSoalItems.map((soal, index) => (
                    <div
                      key={soal.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <QuestionTypeBadge type={soal.tipeSoal} />
                          <span className="text-2xs bg-slate-100 font-bold px-2 py-0.5 rounded-md text-slate-600">
                            Bobot: {soal.bobot} Poin
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditSoalModal(soal)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Soal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus butir soal ini?')) {
                                onDeleteSoal(soal.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text & Media Attachments */}
                      <div className="pl-8 space-y-2">
                        <div className="text-xs font-semibold text-slate-800 leading-relaxed">
                          <MathRenderer text={soal.pertanyaan} />
                        </div>
                        <QuestionMediaDisplay
                          gambarUrl={soal.gambarUrl}
                          audioUrl={soal.audioUrl}
                          videoUrl={soal.videoUrl}
                        />
                      </div>

                      {/* Options / Answer Preview per Question Type */}
                      <div className="pl-8 text-2xs text-slate-600 space-y-1">
                        {soal.tipeSoal === 'pilihan_ganda' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded-lg">
                            {soal.opsiPG?.map((opt) => (
                              <div
                                key={opt.id}
                                className={`px-2 py-1 rounded-md border font-medium ${
                                  opt.isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                {opt.label}. <MathRenderer text={opt.teks} inline /> {opt.isCorrect && '✓ (Kunci)'}
                              </div>
                            ))}
                          </div>
                        )}

                        {soal.tipeSoal === 'pilihan_ganda_kompleks' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                            {soal.opsiPG?.map((opt) => (
                              <div
                                key={opt.id}
                                className={`px-2 py-1 rounded-md border font-medium ${
                                  opt.isCorrect
                                    ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-bold'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                [ {opt.isCorrect ? '☑' : '☐'} ] {opt.label}. <MathRenderer text={opt.teks} inline />
                              </div>
                            ))}
                          </div>
                        )}

                        {soal.tipeSoal === 'benar_salah' && (
                          <div className="space-y-1 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                            {soal.pernyataanBenarSalah?.map((bs) => (
                              <div key={bs.id} className="flex justify-between items-center text-slate-800">
                                <span>• <MathRenderer text={bs.pernyataan} inline /></span>
                                <span className={`font-bold px-2 py-0.5 rounded-md text-2xs ${
                                  bs.jawabanBenar ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                                }`}>
                                  Kunci: {bs.jawabanBenar ? 'BENAR' : 'SALAH'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {soal.tipeSoal === 'menjodohkan' && (
                          <div className="space-y-1 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                            {soal.pasanganMenjodohkan?.map((m) => (
                              <div key={m.id} className="flex items-center gap-2 text-slate-800">
                                <span className="font-semibold"><MathRenderer text={m.pertanyaan} inline /></span>
                                <span className="text-purple-600 font-bold">&rarr;</span>
                                <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md font-bold">
                                  <MathRenderer text={m.jawabanCorrect} inline />
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {soal.tipeSoal === 'isian_singkat' && (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-mono">
                            Kunci Jawaban Valid: <strong>{soal.kunciIsianSingkat?.join(' / ')}</strong>
                          </div>
                        )}

                        {soal.tipeSoal === 'esai' && (
                          <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 italic">
                            Rubrik Guru: {soal.rubrikEsai || 'Siswa menuliskan penjelasan bebas'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Create Bank Soal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">Buat Bank Soal Baru</h3>
            </div>
            <form onSubmit={handleCreateBank} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Bank Soal *</label>
                <input
                  type="text"
                  required
                  value={bankFormData.kodeBank}
                  onChange={(e) => setBankFormData({ ...bankFormData, kodeBank: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  placeholder="BANK-MAT-02"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bank Soal *</label>
                <input
                  type="text"
                  required
                  value={bankFormData.namaBank}
                  onChange={(e) => setBankFormData({ ...bankFormData, namaBank: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  placeholder="Bank Soal UTS Matematika Semester 2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={bankFormData.mapelId}
                  onChange={(e) => setBankFormData({ ...bankFormData, mapelId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {mapelList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.namaMapel} ({m.kodeMapel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guru Pembuat</label>
                <select
                  value={bankFormData.guruId}
                  onChange={(e) => setBankFormData({ ...bankFormData, guruId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Simpan Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Question (Editor 6 Tipe Soal) */}
      {showSoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">
                {editSoalId ? 'Edit Butir Soal' : 'Tambah Butir Soal Baru'}
              </h3>
              <button onClick={() => setShowSoalModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSoal} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Tipe Soal (6 Tipe)</label>
                  <select
                    value={soalType}
                    onChange={(e) => setSoalType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="pilihan_ganda">1. Pilihan Ganda (1 Jawaban Benar)</option>
                    <option value="pilihan_ganda_kompleks">2. Pilihan Ganda Kompleks (Checkbox)</option>
                    <option value="benar_salah">3. Benar / Salah (True / False Table)</option>
                    <option value="menjodohkan">4. Menjodohkan (Matching Pair)</option>
                    <option value="isian_singkat">5. Isian Singkat (Short Answer)</option>
                    <option value="esai">6. Esai / Uraian (Koreksi Manual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bobot Nilai Soal</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={bobot}
                    onChange={(e) => setBobot(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Pertanyaan Soal *</label>
                <textarea
                  required
                  rows={3}
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="Tuliskan narasi atau pertanyaan soal di sini (dukung rumus $x^2$, $\frac{a}{b}$, dll)..."
                ></textarea>
              </div>

              {/* Math Equation Toolbar Helper */}
              <MathEquationToolbar
                onInsertSymbol={(texCode) => setPertanyaan((prev) => prev + texCode)}
                previewText={pertanyaan}
              />

              {/* Question Media Attachments Editor (Upload Gambar, Audio, Video) */}
              <QuestionMediaEditor
                gambarUrl={gambarUrl}
                audioUrl={audioUrl}
                videoUrl={videoUrl}
                onChangeGambar={(url) => setGambarUrl(url)}
                onChangeAudio={(url) => setAudioUrl(url)}
                onChangeVideo={(url) => setVideoUrl(url)}
              />

              {/* Dynamic Form Sections based on Selected Question Type */}
              {(soalType === 'pilihan_ganda' || soalType === 'pilihan_ganda_kompleks') && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Opsi Jawaban ({soalType === 'pilihan_ganda' ? 'Pilih 1 Kunci' : 'Centang >1 Kunci'})
                    </label>
                  </div>
                  {opsiPG.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type={soalType === 'pilihan_ganda' ? 'radio' : 'checkbox'}
                        name="kunciPG"
                        checked={opt.isCorrect}
                        onChange={() => {
                          if (soalType === 'pilihan_ganda') {
                            setOpsiPG(opsiPG.map((o) => ({ ...o, isCorrect: o.id === opt.id })));
                          } else {
                            setOpsiPG(opsiPG.map((o) => (o.id === opt.id ? { ...o, isCorrect: !o.isCorrect } : o)));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded-xs"
                      />
                      <span className="text-xs font-bold text-slate-700 w-4">{opt.label}.</span>
                      <input
                        type="text"
                        required
                        value={opt.teks}
                        onChange={(e) =>
                          setOpsiPG(opsiPG.map((o) => (o.id === opt.id ? { ...o, teks: e.target.value } : o)))
                        }
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        placeholder={`Teks pilihan ${opt.label}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {soalType === 'benar_salah' && (
                <div className="space-y-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                  <label className="text-xs font-bold text-emerald-900">
                    Daftar Pernyataan & Kunci Benar / Salah
                  </label>
                  {pernyataanBS.map((bs, idx) => (
                    <div key={bs.id} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        value={bs.pernyataan}
                        onChange={(e) =>
                          setPernyataanBS(
                            pernyataanBS.map((b) => (b.id === bs.id ? { ...b, pernyataan: e.target.value } : b))
                          )
                        }
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        placeholder="Pernyataan..."
                      />
                      <select
                        value={bs.jawabanBenar ? 'true' : 'false'}
                        onChange={(e) =>
                          setPernyataanBS(
                            pernyataanBS.map((b) =>
                              b.id === bs.id ? { ...b, jawabanBenar: e.target.value === 'true' } : b
                            )
                          )
                        }
                        className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                      >
                        <option value="true">BENAR</option>
                        <option value="false">SALAH</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {soalType === 'menjodohkan' && (
                <div className="space-y-3 bg-purple-50/60 p-4 rounded-xl border border-purple-200">
                  <label className="text-xs font-bold text-purple-900">Pasangan Menjodohkan (Kiri & Kanan)</label>
                  {pasanganMatch.map((p, idx) => (
                    <div key={p.id} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={p.pertanyaan}
                        onChange={(e) =>
                          setPasanganMatch(
                            pasanganMatch.map((m) => (m.id === p.id ? { ...m, pertanyaan: e.target.value } : m))
                          )
                        }
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        placeholder={`Kolom Kiri #${idx + 1}`}
                      />
                      <input
                        type="text"
                        required
                        value={p.jawabanCorrect}
                        onChange={(e) =>
                          setPasanganMatch(
                            pasanganMatch.map((m) => (m.id === p.id ? { ...m, jawabanCorrect: e.target.value } : m))
                          )
                        }
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-semibold text-purple-800"
                        placeholder={`Pasangan Kanan #${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {soalType === 'isian_singkat' && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <label className="text-xs font-bold text-amber-900">
                    Kunci Jawaban Singkat (Pisahkan dengan koma jika ada variasi)
                  </label>
                  <input
                    type="text"
                    required
                    value={kunciIsian}
                    onChange={(e) => setKunciIsian(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white"
                    placeholder="misal: fotosintesis, fotosintesa, photosynthesis"
                  />
                </div>
              )}

              {soalType === 'esai' && (
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
                  <label className="text-xs font-bold text-rose-900">Rubrik Penilaian Esai Guru</label>
                  <textarea
                    rows={2}
                    value={rubrikEsai}
                    onChange={(e) => setRubrikEsai(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    placeholder="Pedoman pemberian skor untuk koreksi manual..."
                  ></textarea>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSoalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Simpan Butir Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        type="soal"
        title="Butir Soal"
        onImportData={handleImportSoalData}
      />
    </div>
  );
};
