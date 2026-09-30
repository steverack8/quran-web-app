/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X } from 'lucide-react';
import { surahList } from '../data/surahList';
import SurahListCard from './SurahList';

interface SurahSidebarProps {
  selectedSurahNum: number;
  lastRead: { surahNumber: number; surahNameLatin: string; ayahNumber: number } | null;
  bookmarksCount: number;
  onSelectSurah: (num: number) => void;
  onOpenBookmarks: () => void;
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
}

/**
 * Surah directory: fixed panel on desktop, slide-in drawer on mobile.
 */
export default function SurahSidebar({
  selectedSurahNum,
  lastRead,
  bookmarksCount,
  onSelectSurah,
  onOpenBookmarks,
  showMobileMenu,
  onCloseMobileMenu,
}: SurahSidebarProps) {
  const listProps = {
    surahs: surahList,
    selectedSurahNum,
    onSelectSurah,
    lastRead,
    bookmarksCount,
    onOpenBookmarks,
  };

  return (
    <>
      {/* Desktop panel */}
      <aside className="w-80 shrink-0 hidden lg:block h-full">
        <SurahListCard {...listProps} />
      </aside>

      {/* Mobile drawer */}
      {showMobileMenu && (
        <>
          <div
            id="mobile-menu-backdrop"
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={onCloseMobileMenu}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] flex flex-col bg-white dark:bg-[#121824] shadow-2xl lg:hidden animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#232d3f] shrink-0">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Daftar Surah
              </span>
              <button
                id="btn-close-mobile-menu"
                onClick={onCloseMobileMenu}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                title="Tutup Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <SurahListCard {...listProps} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
