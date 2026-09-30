/**
 * Verse bookmarks state with localStorage persistence.
 */

import { useEffect, useState } from 'react';
import { Ayah, Bookmark } from '../types';

const BOOKMARKS_KEY = 'ai_enhanced_explorer_bookmarks';

function loadBookmarks(): Bookmark[] {
  try {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (ayah: Ayah, surahNumber: number, surahNameLatin: string) => {
    const id = `${surahNumber}:${ayah.nomorAyat}`;

    if (bookmarks.some((b) => b.id === id)) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } else {
      const newBookmark: Bookmark = {
        id,
        surahNumber,
        surahNameLatin,
        ayahNumber: ayah.nomorAyat,
        teksArab: ayah.teksArab,
        teksIndonesia: ayah.teksIndonesia,
        addedAt: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    }
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return { bookmarks, toggleBookmark, removeBookmark };
}
