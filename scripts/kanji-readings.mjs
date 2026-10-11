// Builds js/kanji-readings.js: the readings each kanji in the app's content can take, used to split furigana per kanji.
// Sources: KANJIDIC2 (on/kun readings; © EDRDG, CC BY-SA 4.0, https://www.edrdg.org/edrdg/licence.html),
// the app's own kanji-data.js, single-kanji readings the content confirms (来ます → 来 = き), and a few irregular ones below.
// Run: curl -LO https://www.edrdg.org/kanjidic/kanjidic2.xml.gz && node scripts/kanji-readings.mjs kanjidic2.xml.gz
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

// Readings the dictionary forms don't give but common words use.
const EXTRA = { 日: ['に'], 本: ['ぽん'], 何: ['なん'], 一: ['いっ'], 八: ['はっ'], 十: ['じゅっ', 'じっ'], 六: ['ろっ'], 切: ['きっ'], 中: ['じゅう'] };
const I_ROW = { う: 'い', く: 'き', ぐ: 'ぎ', す: 'し', つ: 'ち', ぬ: 'に', ぶ: 'び', む: 'み', る: 'り' };

// Parses KANJIDIC2 into { kanji: [readings] }. Kun readings mark okurigana with '.', e.g. う.ける:
// compounds use the stem (う) or the stem plus the first okurigana kana (受付 = うけ + つけ).
export function parseKanjidic(xml) {
  const hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const out = {};
  for (const [, body] of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const ch = /<literal>(.+?)<\/literal>/.exec(body)?.[1];
    if (!ch) continue;
    const rs = new Set();
    for (const [, type, val] of body.matchAll(/<reading r_type="ja_(on|kun)">([^<]+)<\/reading>/g)) {
      const v = hira(val.replace(/-/g, ''));
      if (type === 'on') { rs.add(v); continue; }
      const [stem, oku = ''] = v.split('.');
      rs.add(stem);
      if (oku) { rs.add(stem + oku[0]); if (oku.length === 1 && I_ROW[oku]) rs.add(stem + I_ROW[oku]); } // 踏む → ふみ (踏切)
    }
    out[ch] = [...rs].filter(Boolean);
  }
  return out;
}

export async function buildReadings(dic = {}) {
  const { KANJI } = await import('../js/kanji-data.js');
  const { CARDS, UNITS } = await import('../js/data.js');
  const { WORDS } = await import('../js/vocab-data.js');
  const { GRAMMAR } = await import('../js/jlpt-data.js');
  const { furigana, forgetFurigana } = await import('../js/furigana.js');
  const hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const map = new Map();
  const add = (k, r) => { if (!r) return; (map.get(k) || map.set(k, new Set()).get(k)).add(r); };
  for (const k of KANJI) {
    for (const r of (k.on || '').split('・')) add(k.ch, hira(r.trim()));
    for (const r of (k.kun || '').split('・')) add(k.ch, r.replace(/\(.*\)/, '').replace(/[-.]/g, '').trim());
  }
  for (const [k, rs] of Object.entries(EXTRA)) rs.forEach(r => add(k, r));
  // Only kanji the app shows need readings.
  const used = new Set(JSON.stringify([CARDS, UNITS, WORDS, GRAMMAR, KANJI]).match(/\p{Script=Han}/gu));
  for (const ch of used) (dic[ch] || []).forEach(r => add(ch, r));
  // Single-kanji runs in the content are unambiguous (okurigana fixes the boundary), so they're safe to learn from.
  const pairs = [...CARDS.map(c => [c.jp, c.kana]), ...UNITS.flatMap(u => (u.dialogue || []).map(l => [l[1], l[2]])),
    ...WORDS.map(w => [w.jp, w.kana]), ...GRAMMAR.flatMap(g => g.ex.map(e => [e[0], e[1]])), ...KANJI.flatMap(k => (k.ex || []).map(e => [e[0], e[1]]))];
  for (const [jp, kana] of pairs) {
    const html = furigana(jp, kana, s => s, s => s, { split: false });
    if (!html) continue;
    for (const [, base, rt] of html.matchAll(/<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g)) if ([...base].length === 1 && /\p{Script=Han}/u.test(base)) add(base, rt);
  }
  for (const k of [...map.keys()]) if (!used.has(k)) map.delete(k);
  const full = Object.fromEntries([...map].map(([k, v]) => [k, [...v].filter(Boolean).sort().join(',')]));
  return minimise(full, pairs, furigana, forgetFurigana);
}

// Ships only the readings some word in the content actually uses, then checks every line renders exactly as with
// the full table (a smaller table could make an ambiguous word look unambiguous); kanji in any differing line keep all readings.
async function minimise(full, pairs, furigana, forget) {
  const mod = await import('../js/kanji-readings.js');
  const render = table => { Object.keys(mod.READINGS).forEach(k => delete mod.READINGS[k]); Object.assign(mod.READINGS, table); forget();
    return pairs.map(([jp, kana]) => furigana(jp, kana, s => s) || ''); };
  const want = render(full);
  const keep = {};
  for (const html of want) for (const [, ch, rt] of html.matchAll(/<ruby>(\p{Script=Han})<rt>([^<]+)<\/rt><\/ruby>/gu)) (keep[ch] ||= new Set()).add(rt);
  // Readings as written include sound changes (どき for 時); map each back to the base reading it came from.
  const small = {};
  for (const [ch, list] of Object.entries(full)) small[ch] = list.split(',').filter(r => [...(keep[ch] || [])].some(x => variantsOf(r).has(x)));
  for (let round = 0; round < 10; round++) {
    const got = render(Object.fromEntries(Object.entries(small).filter(([, v]) => v.length).map(([k, v]) => [k, v.join(',')])));
    const bad = got.map((h, i) => h === want[i] ? null : pairs[i][0]).filter(Boolean);
    if (!bad.length) break;
    for (const jp of bad) for (const ch of jp.match(/\p{Script=Han}/gu) || []) if (full[ch]) small[ch] = full[ch].split(',');
  }
  const out = Object.fromEntries(Object.entries(small).filter(([, v]) => v.length).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, v.join(',')]));
  Object.keys(mod.READINGS).forEach(k => delete mod.READINGS[k]); Object.assign(mod.READINGS, out); forget();
  const final = pairs.map(([jp, kana]) => furigana(jp, kana, s => s) || '');
  const diff = final.filter((h, i) => h !== want[i]).length;
  if (diff) throw new Error(`${diff} lines differ after minimising: ${pairs.filter((p, i) => final[i] !== want[i]).map(p => p[0]).join(" ")}`);
  return out;
}
const VOICED = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };
const HALF = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
function variantsOf(r) {
  const out = new Set([r]);
  if (VOICED[r[0]]) out.add(VOICED[r[0]] + r.slice(1)); if (HALF[r[0]]) out.add(HALF[r[0]] + r.slice(1));
  for (const x of [...out]) if (x.length > 1 && /[つちくき]$/.test(x)) out.add(x.slice(0, -1) + 'っ');
  return out;
}

export const render = R => `// Generated by scripts/kanji-readings.mjs. Do not edit by hand; run the script instead.
// Readings each kanji can take (hiragana), used to put furigana over each kanji separately.
// Includes data from KANJIDIC2, © Electronic Dictionary Research and Development Group, CC BY-SA 4.0.
export const READINGS = ${JSON.stringify(R).replace(/","/g, '",\n  "').replace('{"', '{\n  "').replace('"}', '",\n}')};
`;

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.argv[2]) { console.error('usage: node scripts/kanji-readings.mjs path/to/kanjidic2.xml.gz'); process.exit(1); }
  const raw = readFileSync(process.argv[2]);
  const R = await buildReadings(parseKanjidic((raw[0] === 0x1f ? gunzipSync(raw) : raw).toString('utf8')));
  writeFileSync(new URL('../js/kanji-readings.js', import.meta.url), render(R));
  console.log(`js/kanji-readings.js: ${Object.keys(R).length} kanji`);
}
