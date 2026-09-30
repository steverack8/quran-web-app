/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Pause, Bookmark, Languages } from 'lucide-react';
import { Ayah } from '../types';
import { applyTajweedColors } from '../utils/tajweed';

interface VerseCardProps {
  ayah: Ayah;
  surahNumber: number;
  surahNameLatin: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isPlaying: boolean;
  onPlay: () => void;
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  showTajweed?: boolean;
}

export default function VerseCard({
  ayah,
  surahNumber,
  surahNameLatin,
  isBookmarked,
  onToggleBookmark,
  isPlaying,
  onPlay,
  fontSize,
  showTajweed = true,
}: VerseCardProps) {
  
  // Custom font size map for the Arabic text
  const sizeClasses = {
    sm: 'text-xl leading-loose',
    base: 'text-2xl leading-loose',
    lg: 'text-3xl leading-loose',
    xl: 'text-4xl leading-loose',
    '2xl': 'text-5xl leading-loose',
  };

  // Custom font size map for translations
  const translationSizes = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  };

  return (
    <div
      id={`verse-card-${ayah.nomorAyat}`}
      className={`p-4 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
        isPlaying
          ? 'bg-emerald-50/30 border-emerald-200 dark:bg-slate-900 dark:border-emerald-900'
          : 'bg-white border-slate-200/70 dark:bg-slate-950 dark:border-slate-850/80 shadow-sm'
      } hover:shadow-md hover:border-emerald-500/35`}
    >
      <div className="flex flex-col gap-6">
        
        {/* Top bar with verse numbering & actions */}
        <div className="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-slate-800/80 pb-4">
          {/* Verse Address */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
              {ayah.nomorAyat}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
              {surahNameLatin} • Ayat {ayah.nomorAyat}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* Play Verse Audio Button */}
            <button
              id={`btn-play-ayah-${surahNumber}-${ayah.nomorAyat}`}
              onClick={onPlay}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100/70 dark:text-slate-500 dark:hover:text-emerald-400 dark:hover:bg-slate-900/60'
              }`}
              title={isPlaying ? "Jeda Suara" : "Putar Suara"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {/* Bookmark Trigger */}
            <button
              id={`btn-bookmark-ayah-${surahNumber}-${ayah.nomorAyat}`}
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100/70 dark:text-slate-500 dark:hover:text-amber-400 dark:hover:bg-slate-900/60'
              }`}
              title="Bookmark Ayat"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>


          </div>
        </div>

        {/* Dynamic Arabic Calligraphy script */}
        <div className="text-right select-all py-2">
          <p
            className={`font-arabic text-slate-800 dark:text-slate-100 tracking-wide text-right antialiased font-semibold ${sizeClasses[fontSize]}`}
            style={{ fontFamily: 'Meccan, Amiri, "Traditional Arabic", "Times New Roman", serif', direction: 'rtl' }}
          >
            {showTajweed ? (
              <span dangerouslySetInnerHTML={{ __html: applyTajweedColors(ayah.teksArab) }} />
            ) : (
              ayah.teksArab
            )}
          </p>
        </div>

        {/* Pronunciation helpful transcription & Indonesian translations */}
        <div className="space-y-4">
          {/* Latin Transliteration */}
          {ayah.teksLatin && (
            <div className="flex gap-2 text-emerald-800/80 dark:text-emerald-450/85">
              <Languages className="w-4 h-4 mt-0.5 shrink-0" />
              <p className={`italic font-medium font-sans leading-relaxed ${translationSizes[fontSize]}`}>
                {ayah.teksLatin}
              </p>
            </div>
          )}

          {/* Core Indonesian Translation (Kemenag) */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex flex-col gap-3">
            <div className="flex items-center gap-2 justify-start">
              <div className="h-px w-6 bg-emerald-500/25"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600 dark:text-emerald-400">Terjemahan</span>
              <div className="h-px w-6 bg-emerald-500/25"></div>
            </div>
            <p className={`font-sans leading-relaxed text-slate-700 dark:text-slate-300 text-justify ${translationSizes[fontSize]}`}>
              "{ayah.teksIndonesia}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
