/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Ayah } from './types';
import { usePrefs } from './hooks/usePrefs';
import { useBookmarks } from './hooks/useBookmarks';
import { useSurahData } from './hooks/useSurahData';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import Header from './components/Header';
import PreferencesPanel from './components/PreferencesPanel';
import SurahSidebar from './components/SurahSidebar';
import BookmarksView from './components/BookmarksView';
import VerseReader from './components/VerseReader';
import AudioControlBar from './components/AudioControlBar';
import DocModal from './components/DocModal';

export default function App() {
  // --- State & domain logic (custom hooks) ---
  const { prefs, setPrefs, saveLastRead } = usePrefs();
  const { bookmarks, toggleBookmark, removeBookmark } = useBookmarks();
  const { surahNum, setSurahNum, surah, isLoading, error, reload } = useSurahData();
  const player = useAudioPlayer({
    surahNum,
    surah,
    reciterCode: prefs.preferredReciter,
    onGoToSurah: setSurahNum,
  });

  // --- UI toggles ---
  const [showBookmarksView, setShowBookmarksView] = useState(false);
  const [showPreferencesMenu, setShowPreferencesMenu] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isDark = prefs.theme === 'dark';

  // --- Handlers ---
  const handleSelectSurah = (num: number) => {
    setShowBookmarksView(false);
    setSurahNum(num);
    setShowMobileMenu(false);
  };

  const handleOpenBookmarks = () => {
    setShowBookmarksView(true);
    setShowMobileMenu(false);
  };

  const handleToggleBookmark = (ayah: Ayah) =>
    toggleBookmark(ayah, surahNum, surah?.namaLatin || 'Surah');

  const handleSaveLastRead = (ayahNum: number) => {
    if (!surah) return;
    saveLastRead({
      surahNumber: surahNum,
      surahNameLatin: surah.namaLatin,
      ayahNumber: ayahNum,
    });
  };

  // Jump to a specific ayat (triggered from the bookmarks view)
  const jumpToSpecificVerse = (targetSurahNum: number, ayahNum: number) => {
    setShowBookmarksView(false);
    setSurahNum(targetSurahNum);

    const checkAndFocus = () => {
      const el = document.getElementById(`verse-card-${ayahNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTimeout(checkAndFocus, 100);
      }
    };
    setTimeout(checkAndFocus, 300);
  };

  return (
    <div
      className={`h-dvh flex flex-col font-sans transition-colors duration-300 ${
        isDark ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* 1. Global Header Navigation */}
      <Header
        bookmarksCount={bookmarks.length}
        showBookmarksView={showBookmarksView}
        showPreferencesMenu={showPreferencesMenu}
        showDocModal={showDocModal}
        isDark={isDark}
        onToggleBookmarks={() => setShowBookmarksView((v) => !v)}
        onToggleTheme={() =>
          setPrefs((p) => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))
        }
        onTogglePreferences={() => setShowPreferencesMenu((v) => !v)}
        onToggleDoc={() => setShowDocModal((v) => !v)}
        onToggleMobileMenu={() => setShowMobileMenu((v) => !v)}
      />

      {/* 2. Slide Down Preferences Configurations Panel */}
      {showPreferencesMenu && <PreferencesPanel prefs={prefs} onChange={setPrefs} />}

      {/* 3. Main Body Split Workspace */}
      <main className="flex-1 min-h-0 flex overflow-hidden">
        <SurahSidebar
          selectedSurahNum={surahNum}
          lastRead={prefs.lastRead}
          bookmarksCount={bookmarks.length}
          onSelectSurah={handleSelectSurah}
          onOpenBookmarks={handleOpenBookmarks}
          showMobileMenu={showMobileMenu}
          onCloseMobileMenu={() => setShowMobileMenu(false)}
        />

        {/* Reading canvas: bookmarks registry or verse view */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-white dark:bg-[#070b13]">
          {showBookmarksView ? (
            <BookmarksView
              bookmarks={bookmarks}
              onClose={() => setShowBookmarksView(false)}
              onJump={jumpToSpecificVerse}
              onRemove={removeBookmark}
            />
          ) : (
            <VerseReader
              surah={surah}
              isLoading={isLoading}
              error={error}
              surahNum={surahNum}
              isDark={isDark}
              fontSize={prefs.fontSize}
              showTajweed={prefs.showTajweed}
              bookmarks={bookmarks}
              isPlaying={player.isPlaying}
              playingSurahNum={player.playingSurahNum}
              playingAyahNum={player.playingAyahNum}
              onRetry={reload}
              onPrevSurah={() => setSurahNum((n) => n - 1)}
              onNextSurah={() => setSurahNum((n) => n + 1)}
              onPlayAyah={player.playAyah}
              onToggleBookmark={handleToggleBookmark}
              onSaveLastRead={handleSaveLastRead}
            />
          )}
        </section>
      </main>

      {/* 4. Bottom Global Audio Player Control Bar */}
      <AudioControlBar
        currentSurahName={surah?.namaLatin || 'Al-Quran'}
        currentAyahNumber={player.playingAyahNum}
        isPlaying={player.isPlaying}
        onPlayPause={player.togglePlayPause}
        onSkipNext={player.skipNext}
        onSkipPrev={player.skipPrev}
        volume={player.volume}
        onVolumeChange={player.setVolume}
        preferredReciter={prefs.preferredReciter}
        onReciterChange={(id) => setPrefs((p) => ({ ...p, preferredReciter: id }))}
        autoPlayNext={player.autoPlayNext}
        onToggleAutoPlayNext={() => player.setAutoPlayNext((v) => !v)}
      />

      {/* 5. Documentation modal */}
      {showDocModal && <DocModal onClose={() => setShowDocModal(false)} />}
    </div>
  );
}
