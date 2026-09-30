/**
 * Kemenag (equran.id) API client & audio URL builder.
 */

import { SurahDetail } from '../types';
import { fallbackSurahs } from '../data/fallbackAyats';

const API_BASE = 'https://equran.id/api/v2/surat';
const AUDIO_CDN_BASE = 'https://equran.nos.wjv-1.neo.id/audio-ayat';

const pad = (n: number, len: number) => String(n).padStart(len, '0');

/**
 * Fetch surah detail from the Kemenag API.
 * Falls back to local offline data when the API is unreachable,
 * and only throws when both the API and the fallback are unavailable.
 */
export async function fetchSurahDetail(num: number): Promise<SurahDetail> {
  try {
    const res = await fetch(`${API_BASE}/${num}`);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const payload = await res.json();
    if (payload && payload.code === 200 && payload.data) {
      return payload.data as SurahDetail;
    }
    throw new Error('Format respons API tidak valid');
  } catch (err: any) {
    console.warn(`Fetch surah ${num} failed (${err.message}). Loading offline fallback...`);
    const fallback = fallbackSurahs[num];
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}

/**
 * Build the streaming URL for a single ayah using the preferred reciter code.
 * Prefers the URL embedded in the loaded surah detail, otherwise falls back
 * to the predictable CDN path pattern.
 */
export function buildAudioUrl(opts: {
  surahNum: number;
  ayahNum: number;
  reciterCode: string;
  surahDetail: SurahDetail | null;
}): string {
  const { surahNum, ayahNum, reciterCode, surahDetail } = opts;

  if (surahDetail && surahDetail.nomor === surahNum) {
    const ayah = surahDetail.ayat.find((a) => a.nomorAyat === ayahNum);
    const url = ayah?.audio?.[reciterCode];
    if (url) {
      if (url.includes('/audio-ayat/')) {
        // Normalize any malformed Kemenag placeholder directory to the selected reciter folder
        return url.replace(/\/audio-ayat\/[^/]+\//, `/audio-ayat/${reciterCode}/`);
      }
      return url;
    }
  }

  return `${AUDIO_CDN_BASE}/${reciterCode}/${pad(surahNum, 3)}${pad(ayahNum, 3)}.mp3`;
}
