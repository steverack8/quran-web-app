/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SurahDetail } from '../types';

interface SurahHeaderProps {
  surah: SurahDetail;
  isDark: boolean;
}

export default function SurahHeader({ surah, isDark }: SurahHeaderProps) {
  return (
    <div
      className={`relative overflow-hidden p-4 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-[#1e293b] to-emerald-950 text-white border-white/5 shadow-xl'
          : 'bg-white text-slate-800 border-slate-200/80 shadow-sm'
      }`}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-2.5">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider ${
              isDark
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              Surah {surah.nomor}
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider ${
              isDark
                ? 'bg-white/5 border border-white/10 text-slate-300'
                : 'bg-slate-50 border border-slate-100 text-slate-500'
            }`}>
              {surah.tempatTurun === 'Madinah' ? 'Madaniyah' : 'Makkiyah'}
            </span>
          </div>
          <h2 className={`text-2xl md:text-3.5xl font-black font-sans leading-none tracking-tight flex items-center justify-center md:justify-start gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {surah.namaLatin}
          </h2>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-350' : 'text-slate-500'}`}>
            Artinya:{' '}
            <span className={`italic ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>"{surah.arti}"</span>{' '}
            • Terdiri dari {surah.jumlahAyat} ayat
          </p>
        </div>

        <div className="text-right flex flex-col items-center md:items-end">
          <span className={`text-4xl md:text-5xl font-arabic font-semibold leading-normal ${
            isDark ? 'text-emerald-300' : 'text-emerald-600'
          }`}>
            {surah.nama}
          </span>
        </div>
      </div>

      {/* Aesthetic geometric watermark shape */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.04] rounded-full translate-x-12 -translate-y-12 shrink-0 pointer-events-none" />
    </div>
  );
}
