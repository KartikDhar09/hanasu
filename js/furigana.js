// Furigana: lines a kana reading up against a Japanese line and puts each kanji run's reading above it as <ruby>.
// Kana, punctuation and [grammar brackets] must appear unchanged in both strings; everything between them
// (kanji, digits, Latin letters) takes the matching stretch of the reading.
// Returns null when the two can't be lined up exactly, so callers can show the reading on its own line instead.
const LIT = 'ぁ-ゖゝゞァ-ヺーヽヾ・、。！？「」『』（）…〜～：　 !?,.:()\\[\\]';
const SPLIT = new RegExp(`[${LIT}]+|[^${LIT}]+`, 'g');
const IS_LIT = new RegExp(`^[${LIT}]+$`);
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// lit renders the kana/punctuation stretches (default: escaped as-is); esc escapes kanji and readings.
export function furigana(jp, kana, esc, lit = esc) {
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
    out.push(`<ruby>${esc(p)}<rt>${esc(reading)}</rt></ruby>`);
  }
  return out.join('');
}

// Grammar examples mark the taught pattern in [brackets]; this renders those as <mark> inside the furigana line.
export const markBrackets = esc => s => esc(s).replace(/\[/g, '<mark>').replace(/\]/g, '</mark>');
