// Pure logic: placeholder filling and speech matching. No DOM.

export function fill(text, p) {
  return text
    .replaceAll('{nameRo}', p.nameRo).replaceAll('{name}', p.name)
    .replaceAll('{countryKana}', p.countryKana).replaceAll('{countryRo}', p.countryRo)
    .replaceAll('{countryEn}', p.countryEn).replaceAll('{countryHi}', p.countryHi).replaceAll('{country}', p.country);
}

// ---- Speech matching ----
const KANJI_DIGITS = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10', 千: '1000', 百: '100' };

// Kana for each vowel row, so ー and long vowels can be compared (コーヒー → こおひい).
const ROWS = { a: 'あかさたなはまやらわがざだばぱぁゃゎ', i: 'いきしちにひみりぎじぢびぴぃ', u: 'うくすつぬふむゆるぐずづぶぷぅゅ', e: 'えけせてねへめれげぜでべぺぇ', o: 'おこそとのほもよろをごぞどぼぽぉょ' };
const VOWEL = {};
for (const [v, chars] of Object.entries(ROWS)) for (const ch of chars) VOWEL[ch] = v;
const LONG = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };

export function normalize(s) {
  return s
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)) // katakana → hiragana
    .replace(/(.)ー+/g, (m, ch) => ch + (LONG[VOWEL[ch]] || '').repeat(m.length - 1))
    .replace(/[\s。、！？!?…「」・,.〜ー～]/g, '')
    .toLowerCase();
}

// Sounds that change meaning when dropped or swapped: っ, small ゃゅょ, and a vowel that lengthens the one before
// (おばあさん ≠ おばさん, びょういん ≠ びよういん). Getting one wrong costs more than an ordinary slip.
function heavy(str, i) {
  const ch = str[i];
  if ('っゃゅょ'.includes(ch)) return true;
  const v = VOWEL[str[i - 1]];
  return !!v && (ch === LONG[v] || (ch === 'い' && v === 'e') || (ch === 'う' && v === 'o'));
}
const HEAVY = 1.5;

function distance(a, b) {
  const ca = [...a].map((_, i) => heavy(a, i) ? HEAVY : 1), cb = [...b].map((_, j) => heavy(b, j) ? HEAVY : 1);
  let row = [0];
  for (let j = 1; j <= b.length; j++) row[j] = row[j - 1] + cb[j - 1];
  for (let i = 1; i <= a.length; i++) {
    const next = [row[0] + ca[i - 1]];
    for (let j = 1; j <= b.length; j++) {
      const sub = a[i - 1] === b[j - 1] ? 0 : Math.max(ca[i - 1], cb[j - 1]);
      next[j] = Math.min(row[j] + ca[i - 1], next[j - 1] + cb[j - 1], row[j - 1] + sub);
    }
    row = next;
  }
  return row[b.length];
}

function score(a, b) {
  if (!a.length && !b.length) return 1;
  return Math.max(0, 1 - distance(a, b) / Math.max(a.length, b.length));
}
export const similarity = (a, b) => score(normalize(a), normalize(b));

// The recogniser writes kanji its own way (お願いします for おねがいします). To compare sounds, its kanji are read
// back into kana: first with the target line's own readings, then with each kanji's known readings, keeping the
// reading that comes closest to the target. Readings come from js/kanji-readings.js once speech is used.
let READINGS = null;
export const useReadings = r => { READINGS = r; };
const RUNS = /[ぁ-ゖ]+|[^ぁ-ゖ]+/g;
const VOICED = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };

// Common words read as a whole, not kanji by kanji.
const WHOLE = { 今日: 'きょう', 明日: 'あした,あす', 昨日: 'きのう', 今朝: 'けさ', 今年: 'ことし', 去年: 'きょねん', 一人: 'ひとり', 二人: 'ふたり', 一日: 'ついたち,いちにち', 二日: 'ふつか', 二十日: 'はつか', 二十歳: 'はたち', 大人: 'おとな', 上手: 'じょうず', 下手: 'へた', 部屋: 'へや', 時計: 'とけい', 眼鏡: 'めがね', 果物: 'くだもの', 土産: 'みやげ', 一昨日: 'おととい', 明後日: 'あさって', 景色: 'けしき', 真面目: 'まじめ', 八百屋: 'やおや', 一寸: 'ちょっと', 素敵: 'すてき', 美味しい: 'おいしい', 風邪: 'かぜ', 仕事: 'しごと', 下さい: 'ください', 致します: 'いたします', 兄さん: 'にいさん', 姉さん: 'ねえさん', 婆さん: 'ばあさん', 爺さん: 'じいさん', 叔母: 'おば', 叔父: 'おじ', 伯母: 'おば', 伯父: 'おじ', 迷子: 'まいご', 為替: 'かわせ', 七夕: 'たなばた', 博士: 'はかせ', 日本: 'にほん', 大和: 'やまと', 五月雨: 'さみだれ', 梅雨: 'つゆ', 玩具: 'おもちゃ', 文字化け: 'もじばけ', 息子: 'むすこ', 田舎: 'いなか', 木綿: 'もめん', 可笑しい: 'おかしい', 今週: 'こんしゅう', 今月: 'こんげつ', 今度: 'こんど', 今回: 'こんかい', 何時: 'なんじ', 何人: 'なんにん', 何回: 'なんかい', 何曜日: 'なんようび', 何歳: 'なんさい', 煙草: 'たばこ', 一昨年: 'おととし', 昨夜: 'ゆうべ', 今晩: 'こんばん', 今夜: 'こんや', 毎日: 'まいにち', 毎朝: 'まいあさ', 毎晩: 'まいばん', 一つ: 'ひとつ', 二つ: 'ふたつ', 一回: 'いっかい', 一度: 'いちど', 一杯: 'いっぱい', 一本: 'いっぽん', 三本: 'さんぼん', 一分: 'いっぷん', 十分: 'じゅっぷん,じゅうぶん', 六百: 'ろっぴゃく', 八百: 'はっぴゃく', 三百: 'さんびゃく', 三千: 'さんぜん', 婆: 'ばあ', 爺: 'じい', 切手: 'きって', 切符: 'きっぷ', 学校: 'がっこう', 結婚: 'けっこん', 一緒: 'いっしょ' };

// Kanji runs of the target line → their readings, by lining the line up with its kana.
function targetReadings(jp, kana) {
  const out = new Map(), parts = jp.match(RUNS) || [];
  if (parts.length > 12) return out;
  const m = new RegExp('^' + parts.map(p => /^[ぁ-ゖ]+$/.test(p) ? p : '(.+?)').join('') + '$', 'u').exec(kana);
  if (m) { let g = 1; for (const p of parts) if (!/^[ぁ-ゖ]+$/.test(p)) out.set(p, m[g++]); }
  return out;
}

// Reads the heard line left to right. At each kanji: a whole word that starts there (the target's own words, then
// common whole words) is taken as is; otherwise each of the kanji's readings is tried, with the usual sound changes
// inside a word (voicing: 時々 ときどき, half-voicing: 散歩 さんぽ, small っ: 学校 がっこう). The 20 readings
// closest to the target so far are kept at each step.
const HALF = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
const isKana = ch => /[ぁ-ゖ]/.test(ch);
export function heardAsKana(heard, jp, kana) {
  const h = [...normalize(heard)], target = normalize(kana);
  const words = [...targetReadings(normalize(jp), target), ...Object.entries(WHOLE)];
  const at = Array.from({ length: h.length + 1 }, () => []);
  at[0].push('');
  for (let pos = 0; pos < h.length; pos++) {
    const here = [...new Set(at[pos])].map(x => [x, distance(x, target.slice(0, x.length))]).sort((p, q) => p[1] - q[1]).slice(0, 20).map(p => p[0]);
    const add = (len, r) => { for (const x of here) at[pos + len].push(x + r); };
    const ch = h[pos];
    if (isKana(ch)) { add(1, ch); continue; }
    const rest = h.slice(pos).join('');
    const whole = words.filter(([w]) => rest.startsWith(w));
    if (whole.length) { for (const [w, r] of whole) for (const x of r.split(',')) add([...w].length, x); continue; }
    const rs = READINGS?.[ch === '々' && pos ? h[pos - 1] : ch]?.split(',') || [];
    if (!rs.length) { add(1, ch); continue; }
    const inWord = pos > 0 && !isKana(h[pos - 1]), beforeKanji = pos + 1 < h.length && !isKana(h[pos + 1]);
    const forms = new Set(rs.flatMap(r => [r,
      ...(inWord && VOICED[r[0]] ? [VOICED[r[0]] + r.slice(1)] : []), ...(inWord && HALF[r[0]] ? [HALF[r[0]] + r.slice(1)] : []),
      ...(beforeKanji && /[つちくき]$/.test(r) ? [r.slice(0, -1) + 'っ'] : [])]));
    for (const f of forms) add(1, f);
  }
  const ends = at[h.length];
  return ends.reduce((best, x) => score(x, target) > score(best, target) ? x : best, ends[0] ?? '');
}

// Best score (0..1) of anything the recogniser heard against the target phrase.
// Recognisers return kanji, kana or digits, so compare against each form, and also as sounds (in kana).
// `extra` holds other acceptable sayings (e.g. the casual version), as jp, kana, jp, kana…
export function matchScore(heard, jp, kana, extra = []) {
  const targets = [jp, kana, jp.replace(/[一二三四五六七八九十千百]/g, k => KANJI_DIGITS[k]), ...extra];
  const pairs = [[jp, kana]];
  for (let i = 0; i + 1 < extra.length; i += 2) pairs.push([extra[i], extra[i + 1]]);
  let best = 0;
  for (const h of heard) {
    for (const t of targets) best = Math.max(best, similarity(h, t));
    for (const [j, k] of pairs) best = Math.max(best, score(heardAsKana(h, j, k), normalize(k)));
  }
  return best;
}

export const PASS = 0.75;
