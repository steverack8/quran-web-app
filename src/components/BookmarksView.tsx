/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bookmark as BookmarkIcon, BookMarked } from 'lucide-react';
import { Bookmark } from '../types';

interface BookmarksViewProps {
  bookmarks: Bookmark[];
  onClose: () => void;
  onJump: (surahNumber: number, ayahNumber: number) => void;
  onRemove: (id: string) => void;
}

export default function BookmarksView({ bookmarks, onClose, onJump, onRemove }: BookmarksViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-slate-200 dark:border-slate-800 gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
            <BookmarkIcon className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-850 dark:text-white">
              Arsip Penandaan (Ayat Favorit)
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Daftar ayat favorit yang disimpan secara lokal di mesin Anda
            </p>
          </div>
        </div>

        <button
          id="btn-close-bookmarks"
          onClick={onClose}
          className="self-start sm:self-auto shrink-0 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 cursor-pointer transition-all duration-200"
        >
          Kembali Membaca
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-2xl space-y-3">
          <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-705 dark:text-slate-300">
            Belum ada Penanda disimpan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[260px] mx-auto leading-relaxed">
            Klik ikon penanda pada setiap baris ayat ketika membaca Surah untuk menyimpannya di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4" id="bookmarks-grid">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-850 bg-white dark:bg-slate-950 hover:shadow-md transition-all space-y-4 duration-300"
            >
              <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-slate-100 dark:border-slate-900">
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">
                  {bookmark.surahNameLatin} • Ayat {bookmark.ayahNumber}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => onJump(bookmark.surahNumber, bookmark.ayahNumber)}
                    className="text-[10.5px] font-bold hover:text-emerald-600 dark:hover:text-emerald-450 text-slate-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Loncat ke Ayat
                  </button>
                  <button
                    onClick={() => onRemove(bookmark.id)}
                    className="text-[10.5px] font-bold hover:text-red-500 text-slate-400 cursor-pointer transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <p
                className="text-right text-lg md:text-xl font-arabic font-semibold text-slate-900 dark:text-slate-100 leading-loose select-all"
                style={{ direction: 'rtl' }}
              >
                {bookmark.teksArab}
              </p>

              <p className="text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed text-justify">
                "{bookmark.teksIndonesia}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
