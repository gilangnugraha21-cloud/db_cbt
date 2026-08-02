import React, { useState } from 'react';
import {
  MYSQL_DDL_SCHEMA,
  RECOMMENDED_FOLDER_STRUCTURE,
  ANTI_CHEAT_JS_CODE,
  BACKEND_CSV_PHP_CODE,
} from '../data/technicalDocs';
import { Database, FolderTree, ShieldAlert, FileCode2, Copy, Check, X, Download } from 'lucide-react';
import { downloadSQLFile, generateMySQLDumpScript } from '../utils/sqlExporter';
import { User, MataPelajaran, BankSoal, Soal, Ujian, HasilUjian, AppSettings } from '../types/cbt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users?: User[];
  mapels?: MataPelajaran[];
  bankSoals?: BankSoal[];
  soalList?: Soal[];
  ujians?: Ujian[];
  hasilUjians?: HasilUjian[];
  appSettings?: AppSettings;
}

export const TechnicalDocsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  users = [],
  mapels = [],
  bankSoals = [],
  soalList = [],
  ujians = [],
  hasilUjians = [],
  appSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'folder' | 'anticheat' | 'backend'>('sql');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSql = () => {
    const fullSql = generateMySQLDumpScript(
      users,
      mapels,
      bankSoals,
      ujians,
      hasilUjians,
      appSettings,
      soalList
    );
    downloadSQLFile('cbt_sekolah_database_mysql.sql', fullSql);
  };

  const getCode = () => {
    switch (activeTab) {
      case 'sql':
        return MYSQL_DDL_SCHEMA;
      case 'folder':
        return RECOMMENDED_FOLDER_STRUCTURE;
      case 'anticheat':
        return ANTI_CHEAT_JS_CODE;
      case 'backend':
        return BACKEND_CSV_PHP_CODE;
    }
  };

  const handleCopy = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopied(tabName);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold">Dokumentasi Teknis & Rancangan Sistem CBT</h2>
              <p className="text-xs text-slate-400">Skema SQL DDL, Struktur Folder, Logika Anti-Cheat, dan Backend CSV Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" /> Rancangan Database (SQL DDL)
          </button>
          <button
            onClick={() => setActiveTab('folder')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'folder'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-4 h-4" /> Struktur Folder & Alur Kerja
          </button>
          <button
            onClick={() => setActiveTab('anticheat')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'anticheat'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Script Anti-Cheat (JavaScript)
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'backend'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4" /> Logika Import/Export Backend
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-6 flex-1 overflow-y-auto bg-slate-950 text-slate-100 font-mono text-xs relative">
          <div className="absolute top-6 right-6 flex items-center gap-2">
            {activeTab === 'sql' && (
              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-sans font-bold shadow-md transition-colors"
                title="Download File Database MySQL (.sql)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File .SQL (MySQL)</span>
              </button>
            )}

            <button
              onClick={() => handleCopy(getCode(), activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-sans transition-colors"
            >
              {copied === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Salin Kode
                </>
              )}
            </button>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed pt-8 pr-16">{getCode()}</pre>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-600">
          <span>
            {activeTab === 'sql' && '✅ 14 Tabel terelasi lengkap mendukung 6 tipe soal dan log pelanggaran'}
            {activeTab === 'folder' && '📂 Arsitektur modular Controller-Model-View & Public Assets'}
            {activeTab === 'anticheat' && '🔒 Deteksi Fullscreen, Tab Switch, Key Shortcut, & Anti-Copy'}
            {activeTab === 'backend' && '📊 Contoh penanganan file CSV & streaming response'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
