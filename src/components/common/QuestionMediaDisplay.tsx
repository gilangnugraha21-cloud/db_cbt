import React, { useState } from 'react';
import { Image as ImageIcon, Music, Video, Maximize2, X } from 'lucide-react';

interface QuestionMediaDisplayProps {
  gambarUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export const QuestionMediaDisplay: React.FC<QuestionMediaDisplayProps> = ({
  gambarUrl,
  audioUrl,
  videoUrl,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  if (!gambarUrl && !audioUrl && !videoUrl) return null;

  return (
    <div className="space-y-3 my-2">
      {/* 1. Gambar */}
      {gambarUrl && (
        <div className="relative inline-block group">
          <img
            src={gambarUrl}
            alt="Lampiran Soal"
            onClick={() => setShowImageModal(true)}
            className="max-h-64 sm:max-h-80 w-auto rounded-lg border border-slate-300 shadow-2xs object-contain cursor-pointer hover:opacity-95 transition-opacity bg-white"
          />
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="absolute bottom-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md text-[10px] font-semibold flex items-center gap-1 shadow-sm backdrop-blur-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Perbesar</span>
          </button>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {showImageModal && gambarUrl && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-xl shadow-2xl border border-slate-700">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={gambarUrl}
              alt="Lampiran Soal Full"
              className="max-h-[85vh] w-auto mx-auto rounded object-contain"
            />
          </div>
        </div>
      )}

      {/* 2. Audio */}
      {audioUrl && (
        <div className="p-3 bg-emerald-950 text-white rounded-lg border border-emerald-800 shadow-2xs space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Music className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audio Listening / Lampiran Suara</span>
          </div>
          <audio controls src={audioUrl} className="w-full h-9 rounded" />
        </div>
      )}

      {/* 3. Video */}
      {videoUrl && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 shadow-2xs overflow-hidden max-w-2xl p-2 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 px-1">
            <Video className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Video Pembelajaran Soal</span>
          </div>
          <video
            controls
            src={videoUrl}
            className="w-full max-h-80 rounded bg-black object-contain"
          />
        </div>
      )}
    </div>
  );
};
