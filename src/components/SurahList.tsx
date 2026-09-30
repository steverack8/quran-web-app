/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Flame, BookOpen } from 'lucide-react';
import { SurahListItem } from '../data/surahList';

interface SurahListProps {
  surahs: SurahListItem[];
  selectedSurahNum: number | null;
  onSelectSurah: (num: number) => void;
  lastRead: { surahNumber: number; surahNameLatin: string; ayahNumber: number } | null;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
}

export default function SurahList({
  surahs,
  selectedSurahNum,
  onSelectSurah,
  lastRead,
  bookmarksCount,
  onOpenBookmarks,
}: SurahListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MEKAH' | 'MADINAH'>('ALL');

  const filteredSurahs = useMemo(() => {
    return surahs.filter((s) => {
      const matchSearch =
        s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.arti.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nomor.toString() === searchTerm;

      const matchFilter =
        filterType === 'ALL' ||
        (filterType === 'MEKAH' && s.tempatTurun === 'Mekah') ||
        (filterType === 'MADINAH' && s.tempatTurun === 'Madinah');

      return matchSearch && matchFilter;
    });
  }, [surahs, searchTerm, filterType]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121824] border-r border-slate-205 dark:border-[#232d3f] backdrop-blur-sm">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#232d3f] space-y-4">
        {/* Navigation Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="btn-bookmarks-panel"
            onClick={onOpenBookmarks}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Penanda ({bookmarksCount})
          </button>
        </div>

        {/* Input search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            id="search-surah-input"
            type="text"
            placeholder="Cari Surah (cth. Al-Kahf)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Quick Filter tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl text-xs" id="surah-filter-tabs">
          {(['ALL', 'MEKAH', 'MADINAH'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {type === 'ALL' ? 'Semua' : type === 'MEKAH' ? 'Makkiyah' : 'Madaniyah'}
            </button>
          ))}
        </div>
      </div>

      {/* Last Read Marker */}
      {lastRead && (
        <div
          id="last-read-card"
          onClick={() => onSelectSurah(lastRead.surahNumber)}
          className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 hover:from-emerald-600/15 hover:to-teal-600/15 border border-emerald-500/20 rounded-xl cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            TERAKHIR DIBACA
          </div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-white">
            {lastRead.surahNameLatin} • {lastRead.ayahNumber}
          </div>
        </div>
      )}

      {/* Directory Scrollable List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin scrollbar-thumb-emerald-500">
        {filteredSurahs.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
            Surah tidak ditemukan.
          </div>
        ) : (
          filteredSurahs.map((surah) => {
            const isSelected = selectedSurahNum === surah.nomor;
            return (
              <button
                key={surah.nomor}
                id={`surah-item-${surah.nomor}`}
                onClick={() => onSelectSurah(surah.nomor)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border-l-2 border-emerald-500'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Number emblem */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected 
                      ? 'bg-emerald-650 text-white dark:bg-emerald-500' 
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-455'
                  }`}>
                    {surah.nomor}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {surah.namaLatin}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        • {surah.tempatTurun === 'Madinah' ? 'Madaniyah' : 'Makkiyah'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                      {surah.arti} • {surah.jumlahAyat} Ayat
                    </div>
                  </div>
                </div>

                {/* Right Calligraphy preview */}
                <div className="text-right">
                  <span className={`text-lg font-arabic font-semibold ${
                    isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-350'
                  }`}>
                    {surah.nama}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
