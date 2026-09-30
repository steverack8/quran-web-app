/**
 * Utility to parse and color-code Arabic script for Tajweed rules.
 * Preserves Arabic cursive ligature rendering by wrapping in precise spans.
 */

export interface TajweedRule {
  id: string;
  name: string;
  colorHex: string;
  description: string;
  example: string;
}

export const TAJWEED_LEGEND: TajweedRule[] = [
  {
    id: 'ghunnah',
    name: 'Ghunnah (Dengung)',
    colorHex: '#10b981',
    description: 'Suara mendengung kuat pada huruf Nun (نّ) atau Meem (مّ) yang memiliki tasydid.',
    example: 'إنَّ / ممَّ'
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Pantulan)',
    colorHex: '#0ea5e9',
    description: 'Bunyi memantul ketika huruf Qaf, Tah, Ba, Jeem, atau Dal (ق, ط, ب, ج, د) berharakat sukun.',
    example: 'يَقْطَعُونَ / نَعْبُدُ'
  },
  {
    id: 'mad',
    name: 'Mad Mutassil / Munfassil (Panjang)',
    colorHex: '#f43f5e',
    description: 'Memperpanjang bacaan suara huruf mad saat bertemu bendera maddah (ٓ).',
    example: 'السَّمَآءِ / جَآءَ'
  },
  {
    id: 'tanween',
    name: 'Tanwin & Ikhfa (Pewarnaan Harakat)',
    colorHex: '#f59e0b',
    description: 'Dengung samar atau peleburan pada suara tanwin (ً  ٌ  ٍ) bertemu huruf ikhfa/idgham.',
    example: 'عَلِيمٌ حَكِيمٌ'
  }
];

/**
 * Apply Tajweed rules via regex.
 * Returns an HTML string with Tailwind styles targeting CSS classes for the respective rules.
 */
export function applyTajweedColors(text: string): string {
  if (!text) return '';

  let html = text;

  // 1. Mad (Maddah Above \u0653): Highlight the letter combined with Maddah
  // We match a non-space char followed by \u0653
  html = html.replace(/([^\s]\u0653)/g, '<span class="text-rose-500 dark:text-rose-400 font-bold transition-all" title="Mad">$1</span>');

  // 2. Vertical Alif \u0670: Highlight superscript alif
  html = html.replace(/(\u0670)/g, '<span class="text-amber-500 dark:text-amber-400 transition-all font-semibold" title="Mad">$1</span>');

  // 3. Ghunnah: Noon (\u0646) or Meem (\u0645) with Shaddah (\u0651)
  html = html.replace(/([\u0646\u0645]\u0651)/g, '<span class="text-emerald-500 dark:text-emerald-400 font-bold transition-all" title="Ghunnah">$1</span>');

  // 4. Qalqalah: Letters [ق ط ب ج د] (\u0642, \u0637, \u0628, \u062c, \u062f) with Sukun (\u0652)
  html = html.replace(/([\u0642\u0637\u0628\u062c\u062f]\u0652)/g, '<span class="text-sky-500 dark:text-sky-400 font-bold transition-all" title="Qalqalah">$1</span>');

  // 5. Tanween: [ً ٌ ٍ] (\u064b, \u064c, \u064d)
  html = html.replace(/([\u064b\u064c\u064d])/g, '<span class="text-amber-500 dark:text-amber-400 font-semibold transition-all" title="Tanwin">$1</span>');

  return html;
}
