/**
 * User preferences state: loading, persistence and theme handling.
 */

import { useEffect, useState } from 'react';
import { UserPrefs } from '../types';

const PREFS_KEY = 'quran_reader_prefs_v2';
const LEGACY_THEME_FLAG_KEY = 'quran_theme_force_light_v2';

const DEFAULT_PREFS: UserPrefs = {
  theme: 'light',
  fontSize: 'base',
  lastRead: null,
  preferredReciter: '05', // Default: Mishary Rashid Al-Afasy
  showTajweed: true,
};

function loadPrefs(): UserPrefs {
  localStorage.removeItem(LEGACY_THEME_FLAG_KEY);

  try {
    const saved = localStorage.getItem(PREFS_KEY);
    if (!saved) return DEFAULT_PREFS;
    const parsed = JSON.parse(saved);
    if (!parsed) return DEFAULT_PREFS;
    return {
      ...DEFAULT_PREFS,
      ...parsed,
      // Any legacy theme value (e.g. 'sepia') is normalized to light
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      showTajweed: parsed.showTajweed !== false,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(loadPrefs);

  // Apply theme class on <html> and persist prefs on every change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const saveLastRead = (lastRead: UserPrefs['lastRead']) => {
    setPrefs((prev) => ({ ...prev, lastRead }));
  };

  return { prefs, setPrefs, saveLastRead };
}
