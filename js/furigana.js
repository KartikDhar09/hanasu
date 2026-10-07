// Furigana: lines a kana reading up against a Japanese line and puts each kanji run's reading above it as <ruby>.
// Kana, punctuation and [grammar brackets] must appear unchanged in both strings; everything between them
// (kanji, digits, Latin letters) takes the matching stretch of the reading.
// Returns null when the two can't be lined up exactly, so callers can show the reading on its own line instead.
import { READINGS } from './kanji-readings.js';

const LIT = 'ぁ-ゖゝゞァ-ヺーヽヾ・、。！？「」『』（）…〜～：　 !?,.:()\\[\\]';
const SPLIT = new RegExp(`[${LIT}]+|[^${LIT}]+`, 'g');
const IS_LIT = new RegExp(`^[${LIT}]+$`);
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Splitting a kanji word's reading per kanji (日本 → 日 に + 本 ほん). Each kanji's known readings are tried,
// allowing the usual sound changes inside words: voicing (時々 とき+どき) and small っ (一緒 いっ+しょ).
// A split is used only when exactly one exists; otherwise the reading stays over the whole word, marked as a group
// (今日 きょう, 大人 おとな are read as a unit).
const VOICED = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };
const HALF = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
function variants(r, first, last) {
  const out = new Set([r]);
  if (!first) { if (VOICED[r[0]]) out.add(VOICED[r[0]] + r.slice(1)); if (HALF[r[0]]) out.add(HALF[r[0]] + r.slice(1)); }
  if (!last && r.length > 1 && /[つちくき]$/.test(r)) for (const x of [...out]) out.add(x.slice(0, -1) + 'っ');
  return out;
}
export function splitReading(chars, reading) {
  const found = new Map();
  const walk = (i, pos, acc) => {
    if (found.size > 1) return;
    if (i === chars.length) { if (pos === reading.length) found.set(acc.join('|'), acc); return; }
    const ch = chars[i] === '々' && i ? chars[i - 1] : chars[i];
    const rs = READINGS[ch];
    if (!rs) return;
    const tried = new Set();
    for (const base of rs.split(',')) for (const r of variants(base, i === 0, i === chars.length - 1)) {
      if (tried.has(r) || !reading.startsWith(r, pos)) continue;
      tried.add(r); walk(i + 1, pos + r.length, [...acc, r]);
    }
  };
  walk(0, 0, []);
  return found.size === 1 ? [...found.values()][0] : null;
}

// lit renders the kana/punctuation stretches (default: escaped as-is); esc escapes kanji and readings.
export function furigana(jp, kana, esc, lit = esc, { split = true } = {}) {
  if (!jp || !kana || jp === kana) return null;
  const parts = jp.match(SPLIT) || [];
  if (parts.every(p => IS_LIT.test(p))) return null;
  const m = new RegExp('^' + parts.map(p => IS_LIT.test(p) ? reEsc(p) : '(.+?)').join('') + '$', 'u').exec(kana);
  if (!m) return null;
  let g = 1;
  const out = [];
  for (const p of parts) {
    if (IS_LIT.test(p)) { out.push(lit(p)); continue; }
    const reading = m[g++];
    if (/[^ぁ-ゖァ-ヺー]/.test(reading) || reading.length > 6 * [...p].length) return null; // misaligned
    const chars = [...p];
    const parts2 = split && chars.length > 1 ? splitReading(chars, reading) : null;
    if (parts2) out.push(chars.map((c, i) => `<ruby>${esc(c)}<rt>${esc(parts2[i])}</rt></ruby>`).join(''));
    else out.push(`<ruby${chars.length > 1 ? ' class="grp"' : ''}>${esc(p)}<rt>${esc(reading)}</rt></ruby>`);
  }
  return out.join('');
}

// Grammar examples mark the taught pattern in [brackets]; this renders those as <mark> inside the furigana line.
export const markBrackets = esc => s => esc(s).replace(/\[/g, '<mark>').replace(/\]/g, '</mark>');
