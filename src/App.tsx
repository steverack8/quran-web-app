/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Bookmark as BookmarkIcon,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Settings,
  Flame,
  AlertCircle,
  BookMarked,
  Play,
  Search,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { surahList, SurahListItem } from './data/surahList';
import { fallbackSurahs } from './data/fallbackAyats';
import { SurahDetail, Ayah, Bookmark, UserPrefs } from './types';
import { TAJWEED_LEGEND } from './utils/tajweed';
import SurahListCard from './components/SurahList';
import VerseCard from './components/VerseCard';
import AudioControlBar from './components/AudioControlBar';
import logoQuran from './assets/logo-quran.png';

export default function App() {
  // --- Standard Local State Configurations ---
  const [surahs, setSurahs] = useState<SurahListItem[]>(surahList);
  const [currentSurahNum, setCurrentSurahNum] = useState<number>(1); // Default to Al-Fatihah
  const [currentSurahDetail, setCurrentSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(true);
  const [surahError, setSurahError] = useState<string | null>(null);

  // Persistence: Bookmarks List
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('ai_enhanced_explorer_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence: User Preferences
  const [userPrefs, setUserPrefs] = useState<UserPrefs>(() => {
    const saved = localStorage.getItem('quran_reader_prefs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (!localStorage.getItem('quran_theme_force_light_v2')) {
            parsed.theme = 'light';
            localStorage.setItem('quran_theme_force_light_v2', 'true');
            localStorage.setItem('quran_reader_prefs_v2', JSON.stringify(parsed));
          }
          if (parsed.theme === 'sepia') {
            parsed.theme = 'light';
          }
          if (parsed.showTajweed === undefined) {
            parsed.showTajweed = true;
          }
          return parsed;
        }
      } catch (e) {
        // Fallback to default
      }
    }
    localStorage.setItem('quran_theme_force_light_v2', 'true');
    return {
      theme: 'light',
      fontSize: 'base',
      lastRead: null,
      preferredReciter: '05', // Default: Mishary Rashid Al-Afasy
      showTajweed: true,
    };
  });

  const [themeRenderKey, setThemeRenderKey] = useState<number>(0);

  // Search/Filters toggles & Sidebars
  const [showBookmarksView, setShowBookmarksView] = useState<boolean>(false);
  const [showPreferencesMenu, setShowPreferencesMenu] = useState<boolean>(false);
  const [showTajweedLegend, setShowTajweedLegend] = useState<boolean>(false);
  const [showDocModal, setShowDocModal] = useState<boolean>(false);

  // Selected Verse Details for tracking focus
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);

  // --- Audio State Engine & Player Ref ---
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingSurahNum, setPlayingSurahNum] = useState<number | null>(null);
  const [playingAyahNum, setPlayingAyahNum] = useState<number | null>(null);
  const [volume, setVolume] = useState<number>(0.85);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Instantiate HTML Audio Element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio event handlers dynamically when playing status or callbacks alter
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleAudioEnded();
    };

    const handleError = (e: any) => {
      console.error("Audio playback error event:", e);
      setAudioError("Streaming gagal. CDNs sedang sibuk atau luring.");
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playingAyahNum, playingSurahNum, autoPlayNext, currentSurahDetail]);

  // Handle changes to volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Adjust theme class on HTML body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia-mode');
    if (userPrefs.theme === 'dark') {
      root.classList.add('dark');
    } else if (userPrefs.theme === 'sepia') {
      root.classList.add('sepia-mode');
    }
    localStorage.setItem('quran_reader_prefs_v2', JSON.stringify(userPrefs));
    // Explicitly force a full re-render of components when the theme changes
    setThemeRenderKey((prev) => prev + 1);
  }, [userPrefs.theme]);

  // Synchronize Bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('ai_enhanced_explorer_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Fetch surah details on surah change
  useEffect(() => {
    if (currentSurahNum) {
      fetchSurahDetails(currentSurahNum);
    }
  }, [currentSurahNum]);

  // Audio Play/Pause trigger synchronization
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const srcUrl = getAudioUrl();
      if (audioRef.current.src !== srcUrl) {
        audioRef.current.src = srcUrl;
      }
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback interrupted", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, playingAyahNum, playingSurahNum, userPrefs.preferredReciter]);

  // --- Core API Helpers ---

  // Helper to format leading zeroes for directories
  const padThree = (n: number) => String(n).padStart(3, '0');

  // Build audio streaming dynamic URL using preferred qari/reciter code (01, 02.. 05)
  const getAudioUrl = () => {
    if (!playingSurahNum || !playingAyahNum) return '';
    
    const reciterCode = userPrefs.preferredReciter || '05';
    const sStr = padThree(playingSurahNum);
    const aStr = String(playingAyahNum).padStart(3, '0');
    
    // 1. Try to find the exact, pre-loaded URL inside the current surah details
    if (currentSurahDetail && currentSurahDetail.nomor === playingSurahNum) {
      const ayahObj = currentSurahDetail.ayat.find(a => a.nomorAyat === playingAyahNum);
      if (ayahObj && ayahObj.audio && ayahObj.audio[reciterCode]) {
        let url = ayahObj.audio[reciterCode];
        // Ensure any malformed Kemenag placeholder directory structure is corrected to the selected reciter folder
        if (url && url.includes('/audio-ayat/')) {
          url = url.replace(/\/audio-ayat\/[^\/]+\//, `/audio-ayat/${reciterCode}/`);
        }
        return url;
      }
    }
    
    // 2. Reliable standalone fallback URL pattern using the active reciter's directory
    return `https://equran.nos.wjv-1.neo.id/audio-ayat/${reciterCode}/${sStr}${aStr}.mp3`;
  };

  // Skip to next verse in queue helper
  const handleAudioEnded = () => {
    if (!autoPlayNext || !currentSurahDetail || !playingAyahNum) {
      setIsPlaying(false);
      return;
    }

    const nextAyahNum = playingAyahNum + 1;
    const hasNextAyah = currentSurahDetail.ayat.some(a => a.nomorAyat === nextAyahNum);

    if (hasNextAyah) {
      setPlayingAyahNum(nextAyahNum);
    } else {
      // Loop or proceed to next surah
      const nextSurahNum = currentSurahNum + 1;
      if (nextSurahNum <= 114) {
        setCurrentSurahNum(nextSurahNum);
        setPlayingSurahNum(nextSurahNum);
        setPlayingAyahNum(1);
      } else {
        setIsPlaying(false);
        setPlayingAyahNum(null);
      }
    }
  };

  // Fetch Surah Details from Kemenag API with local offline fallback
  const fetchSurahDetails = async (num: number) => {
    setIsLoadingSurah(true);
    setSurahError(null);
    setAudioError(null);
    try {
      // 1. Attempt to fetch from equran.id API directly (CORS enabled)
      const res = await fetch(`https://equran.id/api/v2/surat/${num}`);
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      const payload = await res.json();
      if (payload && payload.code === 200 && payload.data) {
        setCurrentSurahDetail(payload.data);
        if (payload.data.ayat && payload.data.ayat.length > 0) {
          setSelectedAyah(payload.data.ayat[0]);
        }
        return;
      } else {
        throw new Error("Format respons API tidak valid");
      }
    } catch (err: any) {
      console.warn(`Fetch surah ${num} failed (${err.message}). Loading offline fallback...`);
      // 2. Load from offline fallback if available
      const fallback = fallbackSurahs[num];
      if (fallback) {
        setCurrentSurahDetail(fallback);
        if (fallback.ayat && fallback.ayat.length > 0) {
          setSelectedAyah(fallback.ayat[0]);
        }
      } else {
        setSurahError("Gagal mengambil data dari server Kemenag RI dan data offline untuk surah ini tidak tersedia.");
      }
    } finally {
      setIsLoadingSurah(false);
    }
  };

  // Toggle Verse Bookmark
  const toggleBookmark = (ayah: Ayah) => {
    const key = `${currentSurahNum}:${ayah.nomorAyat}`;
    const isBooked = bookmarks.some((b) => b.id === key);

    if (isBooked) {
      setBookmarks((prev) => prev.filter((b) => b.id !== key));
    } else {
      const newBookmark: Bookmark = {
        id: key,
        surahNumber: currentSurahNum,
        surahNameLatin: currentSurahDetail?.namaLatin || 'Surah',
        ayahNumber: ayah.nomorAyat,
        teksArab: ayah.teksArab,
        teksIndonesia: ayah.teksIndonesia,
        addedAt: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    }
  };

  // Jump to specific verse requested from Semantic Search triggers
  const jumpToSpecificVerse = async (surahNum: number, ayahNum: number) => {
    setShowBookmarksView(false);
    setCurrentSurahNum(surahNum);
    
    // Select the verse when loaded
    const checkAndFocus = () => {
      const el = document.getElementById(`verse-card-${ayahNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Style highlights or invoke target setting
        if (currentSurahDetail && currentSurahDetail.ayat) {
          const matchAyah = currentSurahDetail.ayat.find(a => a.nomorAyat === ayahNum);
          if (matchAyah) setSelectedAyah(matchAyah);
        }
      } else {
        setTimeout(checkAndFocus, 100);
      }
    };
    
    setTimeout(checkAndFocus, 300);
  };

  // Toggle Local Read reference tracker (Save Last Read)
  const saveLastReadMarker = (ayahNum: number) => {
    if (!currentSurahDetail) return;
    setUserPrefs((prev) => ({
      ...prev,
      lastRead: {
        surahNumber: currentSurahNum,
        surahNameLatin: currentSurahDetail.namaLatin,
        ayahNumber: ayahNum,
      },
    }));
  };

  // Handle playing custom ayah audio triggers on VerseCard
  const handlePlayAyah = (ayahNum: number) => {
    if (playingSurahNum === currentSurahNum && playingAyahNum === ayahNum) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingSurahNum(currentSurahNum);
      setPlayingAyahNum(ayahNum);
      setIsPlaying(true);
    }
  };

  return (
    <div key={themeRenderKey} className={`h-screen flex flex-col font-sans transition-colors duration-300 ${
      userPrefs.theme === 'dark' ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* 1. Global Pristine Header Navigation */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#121824] border-b border-slate-200/80 dark:border-[#232d3f] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5 group cursor-default">
          <div className="relative flex items-center justify-center w-12 h-12 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-0.5">
            <img src={logoQuran} alt="Quran Logo" className="w-full h-full object-contain drop-shadow-sm relative z-10" />
            <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500 blur-xl -z-10"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight flex items-center font-sans bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
              Al-Quran
            </h1>
            <span className="text-[9px] font-extrabold tracking-[0.25em] uppercase text-emerald-600/70 dark:text-emerald-400/70 -mt-0.5">
              Digital
            </span>
          </div>
        </div>

        {/* Configurations Actions bar */}
        <div className="flex items-center gap-3">
          
          {/* Main Bookmarks Overlay toggle */}
          <button
            id="nav-bookmarks-icon"
            onClick={() => setShowBookmarksView(!showBookmarksView)}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer relative ${
              showBookmarksView
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
            title="Daftar Bookmarked"
          >
            <BookmarkIcon className="w-4.5 h-4.5" />
            {bookmarks.length > 0 && !showBookmarksView && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center animate-bounce">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Theme Quick Toggle */}
          <button
            id="nav-theme-toggle"
            onClick={() =>
              setUserPrefs((p) => ({
                ...p,
                theme: p.theme === 'light' ? 'dark' : 'light',
              }))
            }
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer transitions-all duration-200"
            title="Ganti Mode Tampilan (Terang / Gelap)"
          >
            {userPrefs.theme === 'light' ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>

          {/* FontSize / Qari configs slider menu toggle */}
          <button
            id="nav-prefs-menu-toggle"
            onClick={() => setShowPreferencesMenu(!showPreferencesMenu)}
            className={`p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              showPreferencesMenu
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
            title="Konfigurasi Pembaca & Huruf"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* Documentation Info Modal Trigger */}
          <button
            id="nav-doc-toggle"
            onClick={() => setShowDocModal(!showDocModal)}
            className={`p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              showDocModal
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
            title="Dokumentasi Sumber API"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>

        </div>
      </header>

      {/* 2. Slide Down Preferences Configurations Panel (FR-04 localStorage prefs) */}
      {showPreferencesMenu && (
        <div id="prefs-panel-dropdown" className="bg-white dark:bg-[#121824] border-b border-slate-200 dark:border-[#232d3f] text-slate-800 dark:text-slate-100 p-5 px-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 animate-fade-in relative z-35 shadow-xl">
          {/* FontSize Tuner */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider block">
              Ukuran Aksara Al-Quran
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/5 gap-1">
              {(['sm', 'base', 'lg', 'xl', '2xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setUserPrefs((p) => ({ ...p, fontSize: size }))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer capitalize ${
                    userPrefs.fontSize === size
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qari Preferred Tuner */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider block">
              Qari Utama (Suara)
            </label>
            <select
              id="pref-qari-select"
              value={userPrefs.preferredReciter}
              onChange={(e) => setUserPrefs((p) => ({ ...p, preferredReciter: e.target.value }))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="05">Mishary Rashid Al-Afasy</option>
              <option value="01">Abdullah Al-Juhany</option>
              <option value="02">Abdul-Basit Abd-Us-Samad</option>
              <option value="03">Abdurrahman As-Sudais</option>
              <option value="04">Al-Minshawi</option>
            </select>
          </div>

          {/* Tajweed Switcher */}
          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider block">
                Mewarnai Tajwid Ayat
              </label>
              <button
                id="toggle-tajweed-legend"
                onClick={() => setShowTajweedLegend(!showTajweedLegend)}
                className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-0.5 rounded focus:outline-none flex items-center gap-1 cursor-pointer"
                title="Panduan Aturan Warna Tajwid"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2">Pelajari</span>
              </button>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/5 gap-1">
              <button
                id="toggle-tajweed-active"
                onClick={() => setUserPrefs((p) => ({ ...p, showTajweed: true }))}
                className={`flex-grow py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer ${
                  userPrefs.showTajweed
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                Aktif
              </button>
              <button
                id="toggle-tajweed-inactive"
                onClick={() => setUserPrefs((p) => ({ ...p, showTajweed: false }))}
                className={`flex-grow py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer ${
                  !userPrefs.showTajweed
                    ? 'bg-slate-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                Mati
              </button>
            </div>

            {/* Custom Floating Legend Pop-up */}
            {showTajweedLegend && (
              <div 
                id="tajweed-legend-popup" 
                className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1a2233] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4.5 z-50 text-slate-800 dark:text-slate-200 animate-fade-in"
              >
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2 mb-2.5">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Aturan Warna Tajwid</span>
                  <button 
                    onClick={() => setShowTajweedLegend(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xs"
                    aria-label="Tutup"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {TAJWEED_LEGEND.map((rule) => (
                    <div key={rule.id} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rule.colorHex }} />
                        <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-slate-100">{rule.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-4">{rule.description}</p>
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-white/5 text-[10px] pl-4">
                        <span className="text-slate-400 dark:text-slate-500">Contoh:</span>
                        <span className="font-arabic text-xs tracking-wide text-slate-800 dark:text-slate-200 pl-2" style={{ fontFamily: 'Meccan, Amiri, serif', direction: 'rtl' }}>
                          {rule.example}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Body Split Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left column - Surah Directory sidebar (FR-01) */}
        <aside className="w-80 shrink-0 hidden lg:block h-full">
          <SurahListCard
            surahs={surahs}
            selectedSurahNum={currentSurahNum}
            onSelectSurah={(num) => {
              setShowBookmarksView(false);
              setCurrentSurahNum(num);
            }}
            lastRead={userPrefs.lastRead}
            bookmarksCount={bookmarks.length}
            onOpenBookmarks={() => setShowBookmarksView(true)}
          />
        </aside>

        {/* Middle column - Dynamic Reading Canvas or Bookmarks View */}
        <section className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-white dark:bg-[#070b13]">
          
          {/* BOOKMARKS REGISTRY VIEW (FR-04) */}
          {showBookmarksView ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/10">
                    <BookmarkIcon className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-850 dark:text-white">
                      Arsip Penandaan (Ayat Favorit)
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Daftar ayat favorit yang disimpan secara lokal di mesin Anda
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-bookmarks"
                  onClick={() => setShowBookmarksView(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 cursor-pointer transition-all duration-200"
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
                      className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-850 bg-white dark:bg-slate-950 hover:shadow-md transition-all space-y-4 duration-300"
                    >
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-slate-100 dark:border-slate-900">
                        <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">
                          {bookmark.surahNameLatin} • Ayat {bookmark.ayahNumber}
                        </span>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => jumpToSpecificVerse(bookmark.surahNumber, bookmark.ayahNumber)}
                            className="text-[10.5px] font-bold hover:text-emerald-600 dark:hover:text-emerald-450 text-slate-400 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            Loncat ke Ayat
                          </button>
                          <button
                            onClick={() => {
                              setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
                            }}
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
          ) : (
            // NORMAL BROWSE VERSE VIEW (FR-02)
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Surah title headboard card */}
              {currentSurahDetail && (
                <div className={`relative overflow-hidden p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                  userPrefs.theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-900 via-[#1e293b] to-emerald-950 text-white border-white/5 shadow-xl'
                    : 'bg-white text-slate-800 border-slate-200/80 shadow-sm'
                }`}>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left space-y-2.5">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider ${
                          userPrefs.theme === 'dark'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          Surah {currentSurahDetail.nomor}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider ${
                          userPrefs.theme === 'dark'
                            ? 'bg-white/5 border border-white/10 text-slate-300'
                            : 'bg-slate-50 border border-slate-100 text-slate-500'
                        }`}>
                          {currentSurahDetail.tempatTurun === 'Madinah' ? 'Madaniyah' : 'Makkiyah'}
                        </span>
                      </div>
                      <h2 className={`text-2xl md:text-3.5xl font-black font-sans leading-none tracking-tight flex items-center justify-center md:justify-start gap-2 ${
                        userPrefs.theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {currentSurahDetail.namaLatin}
                      </h2>
                      <p className={`text-xs font-medium ${
                        userPrefs.theme === 'dark' ? 'text-slate-350' : 'text-slate-500'
                      }`}>
                        Artinya: <span className={`italic ${userPrefs.theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>"{currentSurahDetail.arti}"</span> • Terdiri dari {currentSurahDetail.jumlahAyat} ayat
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-center md:items-end">
                      <span className={`text-4xl md:text-5xl font-arabic font-semibold leading-normal ${
                        userPrefs.theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                      }`}>
                        {currentSurahDetail.nama}
                      </span>
                    </div>
                  </div>

                  {/* Aesthetic geometric watermark shape */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.04] rounded-full translate-x-12 -translate-y-12 shrink-0 pointer-events-none" />
                </div>
              )}

              {/* Error Warning display */}
              {surahError && (
                <div className="p-4 bg-red-500/10 text-red-650 dark:text-red-400 text-sm rounded-2xl border border-red-500/15 flex items-start gap-2 max-w-lg mx-auto">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Koneksi Kemenag Bermasalah:</h4>
                    <p className="text-xs mt-0.5">{surahError}</p>
                    <p className="text-xs mt-1.5 font-semibold text-emerald-600 hover:underline cursor-pointer" onClick={() => fetchSurahDetails(currentSurahNum)}>
                      Coba muat ulang surah.
                    </p>
                  </div>
                </div>
              )}

              {/* Loading Spinner */}
              {isLoadingSurah ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
                  <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" />
                  <p className="text-sm font-semibold text-slate-500">Membaca data Kemenag RI...</p>
                </div>
              ) : currentSurahDetail ? (
                <div className="space-y-6" id="verse-viewer-container">
                  
                  {/* Surah Bismillah banner unless it is Fatihah or Taubah */}
                  {currentSurahDetail.nomor !== 1 && currentSurahDetail.nomor !== 9 && (
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
                  {currentSurahDetail.ayat && currentSurahDetail.ayat.map((ayah) => {
                    const isBooked = bookmarks.some((b) => b.id === `${currentSurahNum}:${ayah.nomorAyat}`);
                    const isAyahAudioPlaying = isPlaying && playingSurahNum === currentSurahNum && playingAyahNum === ayah.nomorAyat;

                    return (
                      <div
                        key={ayah.nomorAyat}
                        onClick={() => {
                          setSelectedAyah(ayah);
                          // Track last read marker natively
                          saveLastReadMarker(ayah.nomorAyat);
                        }}
                        className="cursor-pointer transition-all"
                      >
                        <VerseCard
                          ayah={ayah}
                          surahNumber={currentSurahNum}
                          surahNameLatin={currentSurahDetail.namaLatin}
                          isBookmarked={isBooked}
                          onToggleBookmark={() => toggleBookmark(ayah)}
                          isPlaying={isAyahAudioPlaying}
                          onPlay={() => handlePlayAyah(ayah.nomorAyat)}
                          fontSize={userPrefs.fontSize}
                          showTajweed={userPrefs.showTajweed}
                        />
                      </div>
                    );
                  })}

                  {/* Navigation Footer for Surah */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-900">
                    <button
                      disabled={currentSurahNum === 1}
                      onClick={() => setCurrentSurahNum((n) => n - 1)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Surah Sebelumnya
                    </button>
                    <button
                      disabled={currentSurahNum === 114}
                      onClick={() => setCurrentSurahNum((n) => n + 1)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      Surah Selanjutnya
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ) : null}

            </div>
          )}

        </section>



      </main>

      {/* 4. Bottom Global Audio Player Control Bar (FR-03) */}
      <AudioControlBar
        currentSurahName={currentSurahDetail?.namaLatin || 'Al-Quran'}
        currentAyahNumber={playingAyahNum}
        isPlaying={isPlaying}
        onPlayPause={() => {
          if (!playingSurahNum || !playingAyahNum) {
            // Default select first verse on screen to start playing
            setPlayingSurahNum(currentSurahNum);
            setPlayingAyahNum(1);
          }
          setIsPlaying(!isPlaying);
        }}
        onSkipNext={() => {
          if (playingAyahNum) {
            const maxAyahNum = currentSurahDetail?.jumlahAyat || 1;
            if (playingAyahNum < maxAyahNum) setPlayingAyahNum(playingAyahNum + 1);
          }
        }}
        onSkipPrev={() => {
          if (playingAyahNum && playingAyahNum > 1) {
            setPlayingAyahNum(playingAyahNum - 1);
          }
        }}
        volume={volume}
        onVolumeChange={setVolume}
        preferredReciter={userPrefs.preferredReciter}
        onReciterChange={(id) => {
          setUserPrefs((p) => ({ ...p, preferredReciter: id }));
        }}
        autoPlayNext={autoPlayNext}
        onToggleAutoPlayNext={() => setAutoPlayNext(!autoPlayNext)}
      />

      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121824] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-105 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Dokumentasi Sumber Data</h3>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed">
              <p>
                Aplikasi Al-Quran ini dibuat menggunakan <strong>Open API Kemenag</strong> sebagai project eksplorasi dalam pembuatan platform digital.
              </p>
              
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-150 dark:border-white/5">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-250 block">1. API Detail Surah & Terjemahan</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                    Seluruh teks Arab, transliterasi Latin, dan terjemahan resmi Bahasa Indonesia berasal dari <strong>Kementerian Agama Republik Indonesia (Kemenag RI)</strong>, yang diakses secara daring melalui API publik yang disediakan oleh <a href="https://equran.id" target="_blank" rel="noreferrer" className="text-emerald-650 hover:underline font-semibold dark:text-emerald-450">equran.id</a>.
                  </p>
                </div>
                
                <div className="space-y-1 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-250 block">2. Streaming Audio Murottal</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                    File suara (audio mp3) murottal per ayat dilayani langsung dari jaringan Content Delivery Network (CDN) berkecepatan tinggi yang disediakan oleh <a href="https://equran.id" target="_blank" rel="noreferrer" className="text-emerald-650 hover:underline font-semibold dark:text-emerald-450">equran.id</a> via infrastruktur <strong>Neo CDN (wjv-1.neo.id)</strong>.
                  </p>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 text-center italic">
                Aplikasi ini murni bersifat open-source dan non-komersial, dibuat sebagai sarana tadabbur digital bagi masyarakat luas.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/10"
              >
                Tutup Dokumentasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
