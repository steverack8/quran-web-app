/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen } from 'lucide-react';

interface DocModalProps {
  onClose: () => void;
}

export default function DocModal({ onClose }: DocModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#121824] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-105 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Dokumentasi Sumber Data</h3>
          </div>
          <button
            onClick={onClose}
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
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/10"
          >
            Tutup Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
}
