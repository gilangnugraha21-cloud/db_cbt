import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import { Binary, Sigma, HelpCircle, Code2, Sparkles } from 'lucide-react';

interface MathEquationToolbarProps {
  onInsertSymbol: (texCode: string) => void;
  previewText?: string;
}

export const MathEquationToolbar: React.FC<MathEquationToolbarProps> = ({
  onInsertSymbol,
  previewText,
}) => {
  const [showGuide, setShowGuide] = useState(false);

  const symbols = [
    { label: 'Pecahan', symbol: '$$\\frac{a}{b}$$', tex: '$\\frac{a}{b}$ ' },
    { label: 'Akar', symbol: '$$\\sqrt{x}$$', tex: '$\\sqrt{x}$ ' },
    { label: 'Pangkat', symbol: '$$x^2$$', tex: '$x^2$ ' },
    { label: 'Indeks (Sub)', symbol: '$$x_n$$', tex: '$x_1$ ' },
    { label: 'Integral', symbol: '$$\\int_a^b$$', tex: '$\\int_{a}^{b} x dx$ ' },
    { label: 'Sigma / Sum', symbol: '$$\\sum_{i=1}^n$$', tex: '$\\sum_{i=1}^{n} x_i$ ' },
    { label: 'Limit', symbol: '$$\\lim_{x \\to 0}$$', tex: '$\\lim_{x \\to 0}$ ' },
    { label: 'Matriks', symbol: '$$\\begin{matrix}a & b \\\\ c & d\\end{matrix}$$', tex: '$\\begin{matrix} a & b \\\\ c & d \\end{matrix}$ ' },
    { label: 'Plus Minus', symbol: '$$\\pm$$', tex: '$\\pm$ ' },
    { label: 'Sama Dengan', symbol: '$$\\neq$$', tex: '$\\neq$ ' },
    { label: 'Kurang Sama', symbol: '$$\\le$$', tex: '$\\le$ ' },
    { label: 'Lebih Sama', symbol: '$$\\ge$$', tex: '$\\ge$ ' },
    { label: 'Tak Hingga', symbol: '$$\\infty$$', tex: '$\\infty$ ' },
    { label: 'Pi (π)', symbol: '$$\\pi$$', tex: '$\\pi$ ' },
    { label: 'Alpha (α)', symbol: '$$\\alpha$$', tex: '$\\alpha$ ' },
    { label: 'Beta (β)', symbol: '$$\\beta$$', tex: '$\\beta$ ' },
    { label: 'Theta (θ)', symbol: '$$\\theta$$', tex: '$\\theta$ ' },
    { label: 'Delta (Δ)', symbol: '$$\\Delta$$', tex: '$\\Delta$ ' },
  ];

  return (
    <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800 space-y-2 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Sigma className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Bantuan Tool Equation Matematika (KaTeX / LaTeX)</span>
        </div>
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-semibold"
        >
          <HelpCircle className="w-3 h-3 text-blue-400" />
          {showGuide ? 'Sembunyikan Panduan' : 'Panduan Format'}
        </button>
      </div>

      {showGuide && (
        <div className="p-2.5 bg-slate-800/90 rounded border border-slate-700 text-[11px] text-slate-300 space-y-1">
          <p className="font-bold text-amber-300">Format Penulisan Equation Matematika:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            <li>Gunakan tanda <code className="text-amber-300 font-mono">$...$</code> untuk rumus inline (sejajar teks). Contoh: <code className="text-amber-300 font-mono">{"$f(x) = 2x + 5$"}</code></li>
            <li>Gunakan tanda <code className="text-amber-300 font-mono">$$...$$</code> untuk rumus block (tengah halaman). Contoh: <code className="text-amber-300 font-mono">{"$$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$"}</code></li>
            <li>Klik tombol simbol di bawah ini untuk langsung menyisipkan rumus ke dalam teks pertanyaan atau opsi jawaban.</li>
          </ul>
        </div>
      )}

      {/* Quick Insert Buttons */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {symbols.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsertSymbol(item.tex)}
            className="px-2 py-1 bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-200 border border-slate-700 hover:border-amber-500 rounded text-xs transition-colors flex items-center gap-1 font-mono font-semibold"
            title={`Sisipkan ${item.label}`}
          >
            <MathRenderer text={item.symbol} inline />
            <span className="text-[10px] text-slate-400 hover:text-amber-100 hidden sm:inline">({item.label})</span>
          </button>
        ))}
      </div>

      {/* Live Preview Panel if previewText is provided */}
      {previewText && (
        <div className="mt-2 p-2.5 bg-slate-950 border border-slate-800 rounded">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Pratinjau Hasil Render Equation & Teks Soal:</span>
          </div>
          <div className="text-xs text-slate-100 bg-slate-900/80 p-2 rounded border border-slate-800 min-h-[32px] leading-relaxed">
            <MathRenderer text={previewText} />
          </div>
        </div>
      )}
    </div>
  );
};
