/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Ayah, Bookmark, SurahDetail, UserPrefs } from '../types';
import SurahHeader from './SurahHeader';
import VerseCard from './VerseCard';

interface VerseReaderProps {
  surah: SurahDetail | null;
  isLoading: boolean;
  error: string | null;
  surahNum: number;
  isDark: boolean;
  fontSize: UserPrefs['fontSize'];
  showTajweed: boolean;
  bookmarks: Bookmark[];
  isPlaying: boolean;
  playingSurahNum: number | null;
  playingAyahNum: number | null;
  onRetry: () => void;
  onPrevSurah: () => void;
  onNextSurah: () => void;
  onPlayAyah: (ayahNum: number) => void;
  onToggleBookmark: (ayah: Ayah) => void;
  onSaveLastRead: (ayahNum: number) => void;
}

export default function VerseReader({
  surah,
  isLoading,
  error,
  surahNum,
  isDark,
  fontSize,
  showTajweed,
  bookmarks,
  isPlaying,
  playingSurahNum,
  playingAyahNum,
  onRetry,
  onPrevSurah,
  onNextSurah,
  onPlayAyah,
  onToggleBookmark,
  onSaveLastRead,
}: VerseReaderProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Surah title headboard card */}
      {surah && <SurahHeader surah={surah} isDark={isDark} />}

      {/* Error Warning display */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-650 dark:text-red-400 text-sm rounded-2xl border border-red-500/15 flex items-start gap-2 max-w-lg mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Koneksi Kemenag Bermasalah:</h4>
            <p className="text-xs mt-0.5">{error}</p>
            <p className="text-xs mt-1.5 font-semibold text-emerald-600 hover:underline cursor-pointer" onClick={onRetry}>
              Coba muat ulang surah.
            </p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Membaca data Kemenag RI...</p>
        </div>
      ) : surah ? (
        <div className="space-y-6" id="verse-viewer-container">
          {/* Surah Bismillah banner unless it is Fatihah or Taubah */}
          {surah.nomor !== 1 && surah.nomor !== 9 && (
            <div className="text-center py-6 text-slate-800 dark:text-amber-50 select-none">
              <p className="font-arabic text-3xl leading-normal text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Meccan, Amiri, "Traditional Arabic", serif' }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] font-bold uppercase mt-2">
                Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
              </p>
            </div>
          )}

          {/* List of Verses */}
          {surah.ayat.map((ayah) => (
            <div
              key={ayah.nomorAyat}
              onClick={() => onSaveLastRead(ayah.nomorAyat)}
              className="cursor-pointer transition-all"
            >
              <VerseCard
                ayah={ayah}
                surahNumber={surahNum}
                surahNameLatin={surah.namaLatin}
                isBookmarked={bookmarks.some((b) => b.id === `${surahNum}:${ayah.nomorAyat}`)}
                onToggleBookmark={() => onToggleBookmark(ayah)}
                isPlaying={isPlaying && playingSurahNum === surahNum && playingAyahNum === ayah.nomorAyat}
                onPlay={() => onPlayAyah(ayah.nomorAyat)}
                fontSize={fontSize}
                showTajweed={showTajweed}
              />
            </div>
          ))}

          {/* Navigation Footer for Surah */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-900">
            <button
              disabled={surahNum === 1}
              onClick={onPrevSurah}
              className="px-3 sm:px-4 py-2 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Surah </span>Sebelumnya
            </button>
            <button
              disabled={surahNum === 114}
              onClick={onNextSurah}
              className="px-3 sm:px-4 py-2 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-all"
            >
              <span className="hidden sm:inline">Surah </span>Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
