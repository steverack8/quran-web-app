/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
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
  theme: 'light' | 'dark';
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  lastRead: {
    surahNumber: number;
    ayahNumber: number;
    surahNameLatin: string;
  } | null;
  preferredReciter: string; // "01", "02", "03", "04", "05"
  showTajweed: boolean;
}
