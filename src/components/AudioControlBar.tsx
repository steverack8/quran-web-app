/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Disc, RefreshCw } from 'lucide-react';
import { RECITERS } from '../constants/reciters';

interface AudioControlBarProps {
  currentSurahName: string;
  currentAyahNumber: number | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  preferredReciter: string;
  onReciterChange: (id: string) => void;
  autoPlayNext: boolean;
  onToggleAutoPlayNext: () => void;
}

export default function AudioControlBar({
  currentSurahName,
  currentAyahNumber,
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrev,
  volume,
  onVolumeChange,
  preferredReciter,
  onReciterChange,
  autoPlayNext,
  onToggleAutoPlayNext,
}: AudioControlBarProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  return (
    <div
      id="global-audio-player"
      className="bg-white/95 dark:bg-[#121824] border-t border-slate-200 dark:border-slate-800/80 p-3 sm:p-4 md:py-5 md:px-6 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-2 md:gap-4 transition-all"
    >
      {/* 1. Track Information / Badge */}
      <div className="flex items-center gap-3 min-w-0 flex-1 order-1">
        <div className={`hidden sm:flex w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 items-center justify-center text-emerald-600 dark:text-emerald-400 ${isPlaying ? 'animate-spin duration-[12s]' : ''}`}>
          <Disc className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 min-w-0">
            <span className="truncate">{currentSurahName}</span>
            {currentAyahNumber && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 shrink-0">
                Ayat {currentAyahNumber}
              </span>
            )}
          </div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            Kemenag CDN Audio Streaming
          </div>
        </div>
      </div>

      {/* 2. Audio Control Controls */}
      <div className="flex items-center gap-3 sm:gap-4 w-full md:flex-1 justify-center order-3 md:order-2">
        <button
          id="btn-player-skip-prev"
          onClick={onSkipPrev}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900 transition-all cursor-pointer"
          title="Ayat Sebelumnya"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          id="btn-player-play-pause"
          onClick={onPlayPause}
          className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md dark:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? "Jeda" : "Mainkan"}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>

        <button
          id="btn-player-skip-next"
          onClick={onSkipNext}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900 transition-all cursor-pointer"
          title="Ayat Selanjutnya"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Autoplay toggle option */}
        <button
          id="btn-player-toggle-autoplay"
          onClick={onToggleAutoPlayNext}
          className={`p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer ${
            autoPlayNext
              ? 'bg-emerald-500/12 text-emerald-600 border border-emerald-500/20'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
          title="Putar Otomatis Ayat Selanjutnya setelah selesai"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoPlayNext ? 'animate-spin duration-[10s]' : ''}`} />
          <span className="hidden sm:inline">Putar Otomatis</span>
        </button>
      </div>

      {/* 3. Volumetrics and Reciter Selection (shares line 1 with track info on mobile) */}
      <div className="flex items-center gap-2 sm:gap-5 min-w-0 md:flex-1 md:justify-end order-2 md:order-3">
        {/* Reciter Select Dropdown */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-medium text-slate-400 hidden xl:inline">Qari:</span>
          <select
            id="qari-reciter-select"
            value={preferredReciter}
            onChange={(e) => onReciterChange(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[42vw] sm:max-w-none truncate"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-player-mute-toggle"
            onClick={toggleMute}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
            title="Mute/Unmute"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            id="player-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setIsMuted(false);
              onVolumeChange(parseFloat(e.target.value));
            }}
            className="hidden sm:block w-20 tracking-wide h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
