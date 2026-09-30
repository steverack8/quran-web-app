/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Bookmark as BookmarkIcon,
  HelpCircle,
  Menu,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';
import logoQuran from '../assets/logo-quran.png';

interface HeaderProps {
  bookmarksCount: number;
  showBookmarksView: boolean;
  showPreferencesMenu: boolean;
  showDocModal: boolean;
  isDark: boolean;
  onToggleBookmarks: () => void;
  onToggleTheme: () => void;
  onTogglePreferences: () => void;
  onToggleDoc: () => void;
  onToggleMobileMenu: () => void;
}

export default function Header({
  bookmarksCount,
  showBookmarksView,
  showPreferencesMenu,
  showDocModal,
  isDark,
  onToggleBookmarks,
  onToggleTheme,
  onTogglePreferences,
  onToggleDoc,
  onToggleMobileMenu,
}: HeaderProps) {
  const iconButton =
    'p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200';
  const activeIconButton =
    'p-1.5 sm:p-2 rounded-xl transition-all duration-200 border cursor-pointer bg-emerald-600 border-emerald-600 text-white shadow-sm';
  const inactiveIconButton =
    'p-1.5 sm:p-2 rounded-xl transition-all duration-200 border cursor-pointer bg-slate-100 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#121824] border-b border-slate-200/80 dark:border-[#232d3f] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3.5 group cursor-default min-w-0">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-0.5 shrink-0">
          <img src={logoQuran} alt="Quran Logo" className="w-full h-full object-contain drop-shadow-sm relative z-10" />
          <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500 blur-xl -z-10"></div>
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center font-sans bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
            Al-Quran
          </h1>
          <span className="text-[9px] font-extrabold tracking-[0.25em] uppercase text-emerald-600/70 dark:text-emerald-400/70 -mt-0.5">
            Digital
          </span>
        </div>
      </div>

      {/* Configurations Actions bar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile: Surah directory drawer toggle */}
        <button
          id="nav-mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          className={`lg:hidden ${iconButton}`}
          title="Buka Daftar Surah"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Main Bookmarks Overlay toggle */}
        <button
          id="nav-bookmarks-icon"
          onClick={onToggleBookmarks}
          className={`relative ${
            showBookmarksView
              ? 'p-1.5 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer bg-amber-500 text-white shadow-sm'
              : iconButton
          }`}
          title="Daftar Bookmarked"
        >
          <BookmarkIcon className="w-4.5 h-4.5" />
          {bookmarksCount > 0 && !showBookmarksView && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center animate-bounce">
              {bookmarksCount}
            </span>
          )}
        </button>

        {/* Theme Quick Toggle */}
        <button
          id="nav-theme-toggle"
          onClick={onToggleTheme}
          className={iconButton}
          title="Ganti Mode Tampilan (Terang / Gelap)"
        >
          {isDark ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
        </button>

        {/* FontSize / Qari configs slider menu toggle */}
        <button
          id="nav-prefs-menu-toggle"
          onClick={onTogglePreferences}
          className={showPreferencesMenu ? activeIconButton : inactiveIconButton}
          title="Konfigurasi Pembaca & Huruf"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>

        {/* Documentation Info Modal Trigger */}
        <button
          id="nav-doc-toggle"
          onClick={onToggleDoc}
          className={showDocModal ? activeIconButton : inactiveIconButton}
          title="Dokumentasi Sumber API"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
