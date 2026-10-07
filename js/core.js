// Pure logic: placeholder filling and speech matching. No DOM.

export function fill(text, p) {
  return text
    .replaceAll('{nameRo}', p.nameRo).replaceAll('{name}', p.name)
    .replaceAll('{countryKana}', p.countryKana).replaceAll('{countryRo}', p.countryRo)
    .replaceAll('{countryEn}', p.countryEn).replaceAll('{countryHi}', p.countryHi).replaceAll('{country}', p.country);
}

// ---- Speech matching ----
const KANJI_DIGITS = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10', 千: '1000', 百: '100' };

export function normalize(s) {
  return s
    .replace(/[\s。、！？!?…「」・,.〜ー～]/g, '')
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)) // katakana → hiragana
    .toLowerCase();
}

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export function similarity(a, b) {
  a = normalize(a); b = normalize(b);
  if (!a.length && !b.length) return 1;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

// Best score (0..1) of anything the recogniser heard against the target phrase.
// Recognisers return kanji, kana or digits, so compare against each form.
// `extra` holds other acceptable sayings (e.g. the casual version).
export function matchScore(heard, jp, kana, extra = []) {
  const targets = [jp, kana, jp.replace(/[一二三四五六七八九十千百]/g, k => KANJI_DIGITS[k]), ...extra];
  let best = 0;
  for (const h of heard) for (const t of targets) best = Math.max(best, similarity(h, t));
  return best;
}

export const PASS = 0.75;
