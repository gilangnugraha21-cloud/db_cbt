import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Music,
  Video,
  Upload,
  Link as LinkIcon,
  X,
  Sparkles,
  Play,
  FileText,
} from 'lucide-react';

interface QuestionMediaEditorProps {
  gambarUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  onChangeGambar: (url: string | undefined) => void;
  onChangeAudio: (url: string | undefined) => void;
  onChangeVideo: (url: string | undefined) => void;
}

export const QuestionMediaEditor: React.FC<QuestionMediaEditorProps> = ({
  gambarUrl,
  audioUrl,
  videoUrl,
  onChangeGambar,
  onChangeAudio,
  onChangeVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'gambar' | 'audio' | 'video'>('gambar');
  const [inputUrl, setInputUrl] = useState('');

  // Sample Preset Media Links for Instant Testing
  const sampleImages = [
    {
      title: 'Diagram Segitiga & Sudut',
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Grafik Fungsi Kuadrat',
      url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Struktur Sel Biologi',
      url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const sampleAudios = [
    {
      title: 'Listening English Dialog',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      title: 'Percakapan Bahasa Indonesia',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
  ];

  const sampleVideos = [
    {
      title: 'Simulasi Fisika & Mekanika',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      title: 'Animasi Tata Surya',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
  ];

  // Helper for File Upload to Data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'gambar' | 'audio' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'gambar') onChangeGambar(dataUrl);
      if (type === 'audio') onChangeAudio(dataUrl);
      if (type === 'video') onChangeVideo(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (type: 'gambar' | 'audio' | 'video') => {
    if (!inputUrl.trim()) return;
    if (type === 'gambar') onChangeGambar(inputUrl.trim());
    if (type === 'audio') onChangeAudio(inputUrl.trim());
    if (type === 'video') onChangeVideo(inputUrl.trim());
    setInputUrl('');
  };

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-3.5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <span>Lampiran Media Soal (Upload / Embed)</span>
          <span className="text-[10px] text-slate-500 font-normal">
            (Dukung Gambar, Rekaman Audio Listening, & Video Pembelajaran)
          </span>
        </div>

        {/* Media Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded">
          <button
            type="button"
            onClick={() => setActiveTab('gambar')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'gambar'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Gambar {gambarUrl && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'audio'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audio {audioUrl && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'video'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-600" />
            <span>Video {videoUrl && '✓'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Gambar */}
      {activeTab === 'gambar' && (
        <div className="space-y-3">
          {gambarUrl ? (
            <div className="relative group bg-slate-900 rounded-lg p-2 border border-slate-300 max-w-md">
              <img
                src={gambarUrl}
                alt="Soal Attachment"
                className="max-h-52 w-auto mx-auto rounded object-contain bg-black/40"
              />
              <button
                type="button"
                onClick={() => onChangeGambar(undefined)}
                className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                title="Hapus Gambar"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-[10px] text-slate-300 text-center mt-1 font-mono truncate">
                Gambar Terpasang ({gambarUrl.startsWith('data:') ? 'File Lokal' : 'External Link'})
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-blue-400 hover:border-blue-600 rounded-lg cursor-pointer transition-colors text-xs text-blue-700 font-semibold shadow-2xs">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Pilih & Upload File Gambar dari Perangkat</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'gambar')}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Atau tempelkan URL Gambar (https://...)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyUrl('gambar')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Tempel
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Contoh Preset Gambar Siap Pakai:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeGambar(s.url)}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded text-[11px] text-slate-700 font-medium transition-colors"
                    >
                      + {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Audio */}
      {activeTab === 'audio' && (
        <div className="space-y-3">
          {audioUrl ? (
            <div className="bg-emerald-950/90 text-white rounded-lg p-3 border border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Music className="w-4 h-4 text-emerald-400" />
                  <span>File Audio Listening Terpasang</span>
                </div>
                <button
                  type="button"
                  onClick={() => onChangeAudio(undefined)}
                  className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                  title="Hapus Audio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <audio controls src={audioUrl} className="w-full h-9 rounded-md" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-emerald-400 hover:border-emerald-600 rounded-lg cursor-pointer transition-colors text-xs text-emerald-700 font-semibold shadow-2xs">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Pilih & Upload File Audio (MP3/WAV/OGG)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'audio')}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Atau tempelkan URL Audio (https://...mp3)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyUrl('audio')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Tempel
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Contoh Preset Audio Listening:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {sampleAudios.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeAudio(s.url)}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded text-[11px] text-slate-700 font-medium transition-colors"
                    >
                      + {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Video */}
      {activeTab === 'video' && (
        <div className="space-y-3">
          {videoUrl ? (
            <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Media Video Pembelajaran Terpasang</span>
                </div>
                <button
                  type="button"
                  onClick={() => onChangeVideo(undefined)}
                  className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                  title="Hapus Video"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <video
                controls
                src={videoUrl}
                className="w-full max-h-56 rounded bg-black object-contain"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-purple-400 hover:border-purple-600 rounded-lg cursor-pointer transition-colors text-xs text-purple-700 font-semibold shadow-2xs">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>Pilih & Upload File Video (MP4/WebM)</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Atau tempelkan URL Video (https://...mp4)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyUrl('video')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Tempel
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  Contoh Preset Video Pembelajaran:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {sampleVideos.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeVideo(s.url)}
                      className="px-2 py-1 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded text-[11px] text-slate-700 font-medium transition-colors"
                    >
                      + {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
