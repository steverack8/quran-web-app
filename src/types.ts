/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah' | string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends Surah {
  ayat: Ayah[];
  suratSelanjutnya: SurahLink | false;
  suratSebelumnya: SurahLink | false;
}

export interface SurahLink {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface AIInsight {
  surahNumber: number;
  ayahNumber: number;
  summary: string;
  tags: string[];
  contemporaryContext: string;
  timestamp: number;
}

export interface Bookmark {
  id: string; // "surah:ayah" format, e.g., "2:155"
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber: number;
  teksArab: string;
  teksIndonesia: string;
  addedAt: number;
}

export interface UserPrefs {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  lastRead: {
    surahNumber: number;
    ayahNumber: number;
    surahNameLatin: string;
  } | null;
  preferredReciter: string; // "01", "02", "03", "04", "05"
  showTajweed: boolean;
}

export interface SemanticSearchResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  matchingText: string; // Highlighted relevance
  reason: string; // Why Gemini thinks it matches
  textArab: string;
  textIndonesia: string;
}

export interface Feedback {
  id: string; // "surah:ayah"
  type: 'up' | 'down';
  timestamp: number;
}
