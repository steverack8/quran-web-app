/**
 * Current surah data: selection, fetching, loading and error state.
 */

import { useCallback, useEffect, useState } from 'react';
import { SurahDetail } from '../types';
import { fetchSurahDetail } from '../services/quranApi';

const SURAH_ERROR_MESSAGE =
  'Gagal mengambil data dari server Kemenag RI dan data offline untuk surah ini tidak tersedia.';

export function useSurahData() {
  const [surahNum, setSurahNum] = useState<number>(1); // Default to Al-Fatihah
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setSurah(await fetchSurahDetail(surahNum));
    } catch {
      setError(SURAH_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [surahNum]);

  useEffect(() => {
    load();
  }, [load]);

  return { surahNum, setSurahNum, surah, isLoading, error, reload: load };
}
