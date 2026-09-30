/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dispatch, SetStateAction, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { UserPrefs } from '../types';
import { TAJWEED_LEGEND } from '../utils/tajweed';
import { RECITERS } from '../constants/reciters';

interface PreferencesPanelProps {
  prefs: UserPrefs;
  onChange: Dispatch<SetStateAction<UserPrefs>>;
}

export default function PreferencesPanel({ prefs, onChange }: PreferencesPanelProps) {
  const [showTajweedLegend, setShowTajweedLegend] = useState(false);

  return (
    <div
      id="prefs-panel-dropdown"
      className="bg-white dark:bg-[#121824] border-b border-slate-200 dark:border-[#232d3f] text-slate-800 dark:text-slate-100 p-4 sm:p-5 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6 animate-fade-in relative z-35 shadow-xl"
    >
      {/* FontSize Tuner */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider block">
          Ukuran Aksara Al-Quran
        </label>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/5 gap-1">
          {(['sm', 'base', 'lg', 'xl', '2xl'] as const).map((size) => (
            <button
              key={size}
              onClick={() => onChange((p) => ({ ...p, fontSize: size }))}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer capitalize ${
                prefs.fontSize === size
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
          value={prefs.preferredReciter}
          onChange={(e) => onChange((p) => ({ ...p, preferredReciter: e.target.value }))}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
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
            onClick={() => setShowTajweedLegend((v) => !v)}
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
            onClick={() => onChange((p) => ({ ...p, showTajweed: true }))}
            className={`flex-grow py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer ${
              prefs.showTajweed
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            Aktif
          </button>
          <button
            id="toggle-tajweed-inactive"
            onClick={() => onChange((p) => ({ ...p, showTajweed: false }))}
            className={`flex-grow py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer ${
              !prefs.showTajweed
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
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#1a2233] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4.5 z-50 text-slate-800 dark:text-slate-200 animate-fade-in"
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
  );
}
