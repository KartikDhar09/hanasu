// Verb conjugation and kana → romaji. Pure functions, no DOM.
// Groups: 1 = u-verbs (godan), 2 = ru-verbs (ichidan), 3 = irregular (する, 来る and 〜する compounds).

// Godan ending → [i-row (ます stem), a-row (ない), te, ta]
const GODAN = {
  'う': ['い', 'わ', 'って', 'った'], 'つ': ['ち', 'た', 'って', 'った'], 'る': ['り', 'ら', 'って', 'った'],
  'む': ['み', 'ま', 'んで', 'んだ'], 'ぶ': ['び', 'ば', 'んで', 'んだ'], 'ぬ': ['に', 'な', 'んで', 'んだ'],
  'く': ['き', 'か', 'いて', 'いた'], 'ぐ': ['ぎ', 'が', 'いで', 'いだ'], 'す': ['し', 'さ', 'して', 'した'],
};

export const FORMS = [
  { id: 'dict', label: 'Dictionary', jp: '辞書形', en: 'plain “do” (casual)', hg: 'karna (casual)' },
  { id: 'masu', label: 'ます', jp: 'ます形', en: 'polite “do / will do”', hg: 'karta hoon (polite)' },
  { id: 'masen', label: 'ません', jp: 'ません', en: 'polite “don’t”', hg: 'nahi karta' },
  { id: 'mashita', label: 'ました', jp: 'ました', en: 'polite “did”', hg: 'kiya (polite)' },
  { id: 'mashou', label: 'ましょう', jp: 'ましょう', en: '“let’s…”', hg: 'chalo, karte hain' },
  { id: 'tai', label: 'たいです', jp: 'たい', en: '“I want to…”', hg: 'karna chahta hoon' },
  { id: 'te', label: 'て', jp: 'て形', en: 'て-form: “please…”, “…ing”, linking', hg: 'karke / kar rahe' },
  { id: 'nai', label: 'ない', jp: 'ない形', en: 'plain “don’t” (casual)', hg: 'nahi karna (casual)' },
  { id: 'ta', label: 'た', jp: 'た形', en: 'plain “did” (casual)', hg: 'kiya (casual)' },
];

// Returns { form: [kanji, kana] } for every form in FORMS.
export function conjugate(verb) {
  const { jp, kana, group } = verb;
  // Each conjugation is built from a (kanji stem, kana stem) pair plus a kana ending.
  const out = {};
  const put = (id, [ks, rs], end) => { out[id] = [ks + end, rs + end]; };

  if (group === 3) {
    const isKuru = kana.endsWith('くる') && jp.endsWith('来る');
    const ks = jp.slice(0, -(isKuru ? 2 : 2)), rs = kana.slice(0, -2); // drop する / くる (来る is 2 chars too)
    if (isKuru) {
      const k = ks + '来';
      for (const [id, r, end] of [['masu', 'き', 'ます'], ['masen', 'き', 'ません'], ['mashita', 'き', 'ました'], ['mashou', 'き', 'ましょう'],
        ['tai', 'き', 'たいです'], ['te', 'き', 'て'], ['nai', 'こ', 'ない'], ['ta', 'き', 'た']]) out[id] = [k + end, rs + r + end];
      out.dict = [jp, kana];
      return out;
    }
    for (const [id, end] of [['masu', 'します'], ['masen', 'しません'], ['mashita', 'しました'], ['mashou', 'しましょう'],
      ['tai', 'したいです'], ['te', 'して'], ['nai', 'しない'], ['ta', 'した']]) out[id] = [ks + end, rs + end];
    out.dict = [jp, kana];
    return out;
  }

  const last = kana.slice(-1);
  const stem = [jp.slice(0, -1), kana.slice(0, -1)];
  let iStem, aStem, te, ta;
  if (group === 2) {
    if (last !== 'る') throw new Error(`group 2 verb must end in る: ${jp}`);
    iStem = ''; aStem = ''; te = 'て'; ta = 'た';
  } else {
    const row = GODAN[last];
    if (!row) throw new Error(`unknown godan ending: ${jp}`);
    [iStem, aStem, te, ta] = row;
    if (kana === 'いく' || kana.endsWith('いく') && jp.endsWith('行く')) { te = 'って'; ta = 'った'; } // 行く is the one exception
  }
  out.dict = [jp, kana];
  put('masu', stem, iStem + 'ます');
  put('masen', stem, iStem + 'ません');
  put('mashita', stem, iStem + 'ました');
  put('mashou', stem, iStem + 'ましょう');
  put('tai', stem, iStem + 'たいです');
  put('te', stem, te);
  put('ta', stem, ta);
  // ある has no ない stem: its negative is just ない.
  if (kana === 'ある') out.nai = ['ない', 'ない'];
  else put('nai', stem, aStem + 'ない');
  return out;
}

// ---- Kana → Hepburn romaji (with macrons for long vowels) ----
const BASE = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo', だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo', ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
};
const SMALL_Y = { ゃ: 'a', ゅ: 'u', ょ: 'o' };
const MACRON = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };

const toHira = s => s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));

// keepFinalU: don't merge a word-final う into a long vowel (思う is omou, not omō).
export function toRomaji(kana, { keepFinalU = false } = {}) {
  const s = toHira(kana);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i], next = s[i + 1];
    if (ch === 'っ') { const r = BASE[next] || ''; out += r === 'chi' ? 't' : r[0] || ''; continue; }
    if (ch === 'ー') { const v = out.slice(-1); out = out.slice(0, -1) + (MACRON[v] || v); continue; }
    if (ch === 'ん') { out += /^[aiueoy]/.test(BASE[next] || '') ? "n'" : 'n'; continue; }
    let r = BASE[ch];
    if (r === undefined) { out += ch; continue; }
    if (SMALL_Y[next]) { r = r.endsWith('i') ? (/^(shi|chi|ji)$/.test(r) ? r.slice(0, -1) : r.slice(0, -1) + 'y') + SMALL_Y[next] : r; i++; }
    // Long vowels: おう / おお → ō, うう → ū, ああ → ā (but ei and ii stay as written).
    const v = out.slice(-1);
    const isFinal = i === s.length - 1;
    if (r === 'u' && (v === 'o' || v === 'u') && !(keepFinalU && isFinal)) { out = out.slice(0, -1) + MACRON[v]; continue; }
    if ((r === 'o' && v === 'o' && ch === 'お') || (r === 'a' && v === 'a' && ch === 'あ')) { out = out.slice(0, -1) + MACRON[v]; continue; }
    out += r;
  }
  return out;
}
