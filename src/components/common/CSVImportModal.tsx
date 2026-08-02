import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { downloadTemplate, parseCSVString } from '../../utils/csvUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'guru' | 'siswa' | 'mapel' | 'soal';
  title: string;
  onImportData: (rows: string[][]) => void;
}

export const CSVImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  title,
  onImportData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setError('Format file harus berupa CSV (.csv)');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const rows = parseCSVString(text);
        if (rows.length < 2) {
          setError('File CSV tidak memiliki baris data (hanya header atau kosong)');
          setParsedRows([]);
        } else {
          setParsedRows(rows);
        }
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleProcessImport = () => {
    if (parsedRows.length < 2) {
      setError('Belum ada data valid yang siap diimpor');
      return;
    }

    // Skip header row
    const dataRows = parsedRows.slice(1);
    onImportData(dataRows);
    setSuccessMsg(`Berhasil mengimpor ${dataRows.length} data!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setFile(null);
      setParsedRows([]);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Import {title} via CSV</h3>
              <p className="text-xs text-slate-500">Unggah file format CSV/Excel untuk memuat data secara kolektif</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Step 1: Download Template */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center justify-between">
            <div className="text-xs text-blue-900">
              <p className="font-semibold mb-0.5">Langkah 1: Unduh Format Template</p>
              <p className="text-blue-700">Gunakan format susunan kolom sesuai standar sistem</p>
            </div>
            <button
              onClick={() => downloadTemplate(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Template
            </button>
          </div>

          {/* Step 2: Upload File Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Langkah 2: Unggah File CSV Data {title}
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 mb-1">
                Pilih atau seret file CSV dari komputer Anda
              </p>
              <input
                type="file"
                accept=".csv, .txt"
                onChange={handleFileChange}
                className="hidden"
                id="csvFileInput"
              />
              <label
                htmlFor="csvFileInput"
                className="inline-block px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors mt-1"
              >
                Pilih File CSV
              </label>
              {file && (
                <p className="text-xs font-medium text-emerald-700 mt-2">
                  File terpilih: <span className="font-bold">{file.name}</span> ({parsedRows.length - 1} baris data)
                </p>
              )}
            </div>
          </div>

          {/* Status Notifications */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 px-6 py-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleProcessImport}
            disabled={!file || parsedRows.length < 2}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" /> Proses Import Data
          </button>
        </div>
      </div>
    </div>
  );
};
