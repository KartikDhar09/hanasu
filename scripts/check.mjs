// Static checks and logic tests, run with `npm test` before every deploy.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const errors = [];
const fail = msg => errors.push(msg);
const read = p => readFileSync(p, 'utf8');

// 1. Every script parses.
for (const f of [...readdirSync('js').map(f => 'js/' + f), 'sw.js']) {
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
  catch (e) { fail(`${f} has a syntax error:\n${e.stderr}`); }
}

// 2. Files referenced by index.html exist.
const html = read('index.html');
for (const [, ref] of html.matchAll(/(?:src|href)="\/([^"#?]+)"/g)) {
  if (!existsSync(ref)) fail(`index.html references missing file /${ref}`);
}
for (const id of ['app', 'sheet', 'toast', 'streak']) if (!html.includes(`id="${id}"`)) fail(`index.html is missing #${id}`);

// 3. Service worker precaches real files, including every module.
const shell = read('sw.js').match(/const SHELL = \[([\s\S]*?)\];/)?.[1] || '';
for (const [, f] of shell.matchAll(/'\/([^']*)'/g)) if (f && !existsSync(f)) fail(`sw.js precaches missing file /${f}`);
for (const f of readdirSync('js')) if (!shell.includes(`'/js/${f}'`)) fail(`sw.js does not precache /js/${f}`);

// 4. Manifest is valid with icons present.
try {
  const m = JSON.parse(read('manifest.webmanifest'));
  for (const i of m.icons) if (!existsSync(i.src.slice(1))) fail(`manifest icon missing: ${i.src}`);
} catch (e) { fail('manifest.webmanifest: ' + e.message); }

// 5. Lesson content is well-formed.
const { UNITS, CARDS, TRACKS, COUNTRIES } = await import('../js/data.js');
const KANJI = /[一-龯]/;
const KEYS = new Set(['name', 'nameRo', 'country', 'countryKana', 'countryRo', 'countryEn', 'countryHi']);
const DEVANAGARI = /[\u0900-\u097f]/;
const ids = new Set();
for (const u of UNITS) {
  if (ids.has(u.id)) fail(`duplicate unit id ${u.id}`); ids.add(u.id);
  if (!TRACKS.some(t => t.id === u.track)) fail(`${u.id}: unknown track ${u.track}`);
  if (u.phrases.length < 4) fail(`${u.id}: needs at least 4 phrases for the quiz`);
  if (!u.dialogue?.some(l => l[0] === 'you')) fail(`${u.id}: dialogue has no lines for you`);
  const check = (row, where, offset) => {
    const [jp, kana, ro, en, hi] = row.slice(offset);
    if (![jp, kana, ro, en, hi].every(s => typeof s === 'string' && s.trim())) return fail(`${where}: empty field`);
    if (KANJI.test(kana.replace(/\{\w+\}/g, ''))) fail(`${where}: kana reading contains kanji: ${kana}`);
    if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(ro)) fail(`${where}: romaji contains Japanese: ${ro}`);
    if (!DEVANAGARI.test(hi)) fail(`${where}: Hindi meaning is not in Devanagari: ${hi}`);
    for (const s of [jp, kana, ro, en, hi]) for (const [, p] of s.matchAll(/\{(\w+)\}/g)) if (!KEYS.has(p)) fail(`${where}: unknown placeholder {${p}}`);
  };
  u.phrases.forEach((p, i) => {
    check(p, `${u.id} phrase ${i}`, 0);
    if (p.length > 7) fail(`${u.id} phrase ${i}: too many fields`);
    const c = p[6];
    if (c && (c.length !== 3 || !c.every(x => typeof x === 'string' && x.trim()) || KANJI.test(c[1]))) fail(`${u.id} phrase ${i}: bad casual version`);
  });
  if (!TRACKS.find(t => t.id === u.track)?.hi || !u.hi) fail(`${u.id}: missing Hindi title`);
  u.dialogue.forEach((l, i) => {
    if (!['you', 'them'].includes(l[0])) fail(`${u.id} line ${i}: who must be you/them`);
    check(l, `${u.id} line ${i}`, 1);
  });
}
for (const c of COUNTRIES) {
  if (c.length !== 5 || KANJI.test(c[1])) fail(`country ${c[3]} needs [jp, kana, romaji, english, hindi]`);
  if (!DEVANAGARI.test(c[4])) fail(`country ${c[3]}: Hindi name missing`);
}
if (new Set(CARDS.map(c => c.id)).size !== CARDS.length) fail('duplicate card ids');

// 6. Logic tests.
const core = await import('../js/core.js');
const test = (name, fn) => { try { fn(); } catch (e) { fail(`test "${name}": ${e.message}`); } };
const DAY = 864e5, now = Date.UTC(2026, 9, 4);

test('new card graded good is due tomorrow', () => {
  const s = core.grade(undefined, core.GOOD, now);
  assert.equal(s.box, 1); assert.equal(s.due, now + DAY); assert.equal(s.seen, 1);
});
test('easy skips a box, forgot resets', () => {
  const a = core.grade(undefined, core.EASY, now); assert.equal(a.box, 2);
  const b = core.grade(a, core.AGAIN, now); assert.equal(b.box, 0); assert.ok(b.due - now < DAY);
});
test('box is capped', () => {
  let s; for (let i = 0; i < 20; i++) s = core.grade(s, core.EASY, now);
  assert.equal(s.box, core.INTERVALS.length - 1);
});
test('session puts due cards before new and respects limits', () => {
  const cards = CARDS.slice(0, 30);
  const progress = { [cards[5].id]: { box: 1, due: now - 1, seen: 1 }, [cards[6].id]: { box: 1, due: now + DAY, seen: 1 } };
  const s = core.pickSession(cards, progress, { now, newLimit: 3 });
  assert.equal(s[0].id, cards[5].id); assert.equal(s.length, 4);
  assert.ok(!s.some(c => c.id === cards[6].id));
});
test('streak counts consecutive days and resets after a gap', () => {
  const d = (n) => new Date(2026, 9, n, 12);
  let st = core.bumpStreak(null, d(1)); assert.equal(st.count, 1);
  st = core.bumpStreak(st, d(1)); assert.equal(st.count, 1);
  st = core.bumpStreak(st, d(2)); assert.equal(st.count, 2);
  assert.equal(core.liveStreak(st, d(3)), 2); assert.equal(core.liveStreak(st, d(4)), 0);
  st = core.bumpStreak(st, d(4)); assert.equal(st.count, 1);
});
test('fill replaces placeholders', () => {
  const p = { name: 'スミス', nameRo: 'Sumisu', country: '中国', countryKana: 'ちゅうごく', countryRo: 'Chūgoku', countryEn: 'China', countryHi: 'चीन' };
  assert.equal(core.fill('मैं {countryHi} से हूँ', p), 'मैं चीन से हूँ');
  assert.equal(core.fill('{name}です。{country}から', p), 'スミスです。中国から');
  assert.equal(core.fill('{countryKana}から {nameRo}', p), 'ちゅうごくから Sumisu');
});
test('speech matching accepts kanji, kana, katakana and digits', () => {
  assert.ok(core.matchScore(['おはようございます'], 'おはようございます。', 'おはようございます。') === 1);
  assert.ok(core.matchScore(['9時です'], '九時です。', 'くじです。') >= core.PASS);
  assert.ok(core.matchScore(['えきはどこですか'], '駅はどこですか。', 'えきはどこですか。') >= core.PASS);
  assert.ok(core.matchScore(['トイレはどこですか'], 'トイレはどこですか。', 'トイレはどこですか。') === 1);
  assert.ok(core.matchScore(['こんばんは'], 'おはようございます。', 'おはようございます。') < core.PASS);
  assert.equal(core.matchScore([], '駅', 'えき'), 0);
  assert.equal(core.matchScore(['ありがとう'], 'ありがとうございます。', 'ありがとうございます。', ['ありがとう。']), 1);
});

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`✓ All checks passed (${UNITS.length} units, ${CARDS.length} phrases, ${UNITS.reduce((n, u) => n + u.dialogue.length, 0)} dialogue lines)`);
