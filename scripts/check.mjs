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

// 5. Lesson content is well-formed, and no Devanagari is left anywhere (the app uses Hinglish).
for (const f of readdirSync('js')) if (/[\u0900-\u097f]/.test(read('js/' + f))) fail(`js/${f} still contains Devanagari`);
const { UNITS, CARDS, TRACKS, COUNTRIES } = await import('../js/data.js');
const KANJI = /[一-龯]/;
const KEYS = new Set(['name', 'nameRo', 'country', 'countryKana', 'countryRo', 'countryEn', 'countryHi']);
const LATIN = /^[^\u0900-\u097f\u3040-\u30ff]*[a-z][^\u0900-\u097f\u3040-\u30ff]*$/i; // Hinglish: Roman letters, no Devanagari or kana
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
    if (!LATIN.test(hi)) fail(`${where}: Hinglish meaning must be Roman letters: ${hi}`);
    for (const s of [jp, kana, ro, en, hi]) for (const [, p] of s.matchAll(/\{(\w+)\}/g)) if (!KEYS.has(p)) fail(`${where}: unknown placeholder {${p}}`);
  };
  u.phrases.forEach((p, i) => {
    check(p, `${u.id} phrase ${i}`, 0);
    if (p.length > 7) fail(`${u.id} phrase ${i}: too many fields`);
    const c = p[6];
    if (c && (c.length !== 3 || !c.every(x => typeof x === 'string' && x.trim()) || KANJI.test(c[1]))) fail(`${u.id} phrase ${i}: bad casual version`);
  });
  if (!TRACKS.find(t => t.id === u.track)?.hi || !u.hi) fail(`${u.id}: missing Hinglish title`);
  u.dialogue.forEach((l, i) => {
    if (!['you', 'them'].includes(l[0])) fail(`${u.id} line ${i}: who must be you/them`);
    check(l, `${u.id} line ${i}`, 1);
  });
}
for (const c of COUNTRIES) {
  if (c.length !== 5 || KANJI.test(c[1])) fail(`country ${c[3]} needs [jp, kana, romaji, english, hindi]`);
  if (!LATIN.test(c[4])) fail(`country ${c[3]}: Hinglish name missing`);
}
if (new Set(CARDS.map(c => c.id)).size !== CARDS.length) fail('duplicate card ids');

// 5b. Particles, verbs and kanji content.
const { PARTICLES, CONFUSABLE } = await import('../js/particles-data.js');
const { VERBS } = await import('../js/verbs-data.js');
const { KANJI: KANJI_LIST } = await import('../js/kanji-data.js');
const { conjugate, toRomaji, FORMS } = await import('../js/conjugate.js');
const romajiOk = (r, where) => { if (/[\u3040-\u30ff\u4e00-\u9faf\u0900-\u097f]/.test(r)) fail(`${where}: romaji contains non-Latin: ${r}`); };
const exOk = (e, where) => {
  if (e.length !== 5 || !e.every(x => typeof x === 'string' && x.trim())) return fail(`${where}: example needs [jp, kana, romaji, en, hinglish]`);
  if (/[\u4e00-\u9faf]/.test(e[1])) fail(`${where}: kana contains kanji: ${e[1]}`);
  romajiOk(e[2], where);
  if (!LATIN.test(e[4])) fail(`${where}: Hinglish must be Roman letters: ${e[4]}`);
};
for (const p of PARTICLES) {
  if (!(p.p in CONFUSABLE)) fail(`particle ${p.p} missing from CONFUSABLE`);
  if (p.examples.length < 2) fail(`particle ${p.p}: needs at least 2 examples`);
  for (const [i, e] of p.examples.entries()) {
    exOk(e, `particle ${p.p} ex ${i}`);
    for (const k of [0, 1, 2]) {
      const m = [...e[k].matchAll(/\[(.+?)\]/g)];
      if (m.length !== 1) fail(`particle ${p.p} ex ${i}: field ${k} must mark the particle exactly once`);
    }
    if (e[0].match(/\[(.+?)\]/)?.[1] !== p.p || e[1].match(/\[(.+?)\]/)?.[1] !== p.p) fail(`particle ${p.p} ex ${i}: marked particle is not ${p.p}`);
  }
}
for (const v of VERBS) {
  exOk(v.ex, `verb ${v.jp}`);
  try {
    const c = conjugate(v);
    for (const f of FORMS) if (!c[f.id]?.[0] || /[\u4e00-\u9faf]/.test(c[f.id][1])) fail(`verb ${v.jp}: bad ${f.id} form`);
  } catch (e) { fail(`verb ${v.jp}: ${e.message}`); }
}
if (new Set(VERBS.map(v => v.jp)).size !== VERBS.length) fail('duplicate verbs');
for (const k of KANJI_LIST) {
  if (!k.en || !LATIN.test(k.hg) || k.ex.length < 2) fail(`kanji ${k.ch}: needs meaning, Hinglish and 2 examples`);
  if (k.on && /[\u3040-\u309f]/.test(k.on)) fail(`kanji ${k.ch}: on’yomi should be katakana`);
  if (k.kun && /[\u30a1-\u30f6]/.test(k.kun)) fail(`kanji ${k.ch}: kun’yomi should be hiragana`);
  for (const [i, e] of k.ex.entries()) { exOk(e, `kanji ${k.ch} ex ${i}`); if (!e[0].includes(k.ch)) fail(`kanji ${k.ch} ex ${i}: word ${e[0]} doesn’t use it`); }
}
if (new Set(KANJI_LIST.map(k => k.ch)).size !== KANJI_LIST.length) fail('duplicate kanji');
if (KANJI_LIST.length < 250) fail('kanji should cover the full N5 + N4 list (250+)');

// 5c. Speaking content.
const SP = await import('../js/speaking-data.js');
for (const [i, item] of SP.QA.entries()) {
  if (!item.pic || item.a.length < 2) fail(`QA ${i}: needs a picture and 2 answers`);
  for (const l of [item.q, ...item.a]) {
    if (l.length !== 5 || !l.every(x => typeof x === 'string' && x.trim())) fail(`QA ${i}: line needs 5 fields`);
    else { if (/[\u4e00-\u9faf]/.test(l[1].replace(/\{\w+\}/g, ''))) fail(`QA ${i}: kana has kanji: ${l[1]}`); romajiOk(l[2], `QA ${i}`); if (!LATIN.test(l[4])) fail(`QA ${i}: Hinglish: ${l[4]}`); }
  }
}
for (const g of SP.PRONUNCIATION) for (const pair of g.pairs) for (const w of pair) if (w.length !== 5 || !/^[\u3040-\u309f]+$/.test(w[0])) fail(`pronunciation word ${w[0]}: needs [kana, romaji, en, hinglish, emoji]`);
for (const j of SP.JOBS) if (j.length !== 6) fail(`job ${j[0]}: needs 6 fields`);

// 5d. JLPT content.
const J = await import('../js/jlpt-data.js');
const JL = await import('../js/jlpt.js').catch(e => ({ err: e }));
if (new Set(J.GRAMMAR.map(g => g.id)).size !== J.GRAMMAR.length) fail('duplicate grammar ids');
for (const g of J.GRAMMAR) {
  if (!['n5', 'n4'].includes(g.level) || !g.pic || !g.how || !g.explain || !LATIN.test(g.hg)) fail(`grammar ${g.id}: missing fields`);
  if (g.ex.length < 2) fail(`grammar ${g.id}: needs 2 examples`);
  for (const [i, e] of g.ex.entries()) {
    exOk(e, `grammar ${g.id} ex ${i}`);
    for (const k of [0, 1, 2]) if ((e[k].match(/\[/g) || []).length !== 1) fail(`grammar ${g.id} ex ${i}: field ${k} must mark the grammar once`);
  }
}
for (const lv of ['n5', 'n4']) if (J.GRAMMAR.filter(g => g.level === lv).length < 20) fail(`${lv}: needs at least 20 grammar points`);
if (J.GRAMMAR.filter(g => g.level === 'n5').length < 60) fail('N5 grammar should be the full list (60+ points plus particles)');

// 5e. Vocabulary and kanji pictures.
const V = await import('../js/vocab-data.js');
if (new Set(V.WORDS.map(w => w.id)).size !== V.WORDS.length) fail('duplicate vocabulary ids');
for (const w of V.WORDS) {
  if (!w.en || !LATIN.test(w.hg) || /[\u4e00-\u9faf]/.test(w.kana)) fail(`word ${w.jp}: needs meaning, Hinglish, kana`);
  if (/[^\x20-\x7e\u00c0-\u017f’'-]/.test(w.ro)) fail(`word ${w.jp}: odd romaji ${w.ro}`);
  romajiOk(w.ro, `word ${w.jp}`);
}
for (const lv of ['n5', 'n4']) if (V.WORDS.filter(w => w.level === lv).length < 50) fail(`${lv}: needs at least 50 words`);
if (V.WORDS.filter(w => w.level === 'n5').length < 650) fail('N5 vocabulary should be the full list (650+ words)');
{ const ks = V.WORDS.map(w => w.jp + '|' + w.kana); if (new Set(ks).size !== ks.length) fail('a word is listed twice'); }
if (V.WORDS.filter(w => w.level === 'n4').length < 550) fail('N4 vocabulary should be the full list (550+ words)');
for (const k of KANJI_LIST) if (!k.pic || !k.hint) fail(`kanji ${k.ch}: missing picture hint`);

// 5f. Reading and listening.
const E = await import('../js/exam-data.js');
const EX = await import('../js/exam.js');
for (const r of E.READING) {
  if (!r.text || !r.en || !r.words.length || !r.qs.length) fail(`reading ${r.id}: incomplete`);
  for (const q of r.qs) if (!(q.answer >= 0 && q.answer < q.options.length) || new Set(q.options).size !== q.options.length) fail(`reading ${r.id}: bad question ${q.q}`);
}
for (const l of E.LISTENING) {
  if (!l.lines.length || !(l.answer >= 0 && l.answer < l.options.length)) fail(`listening ${l.id}: bad item`);
  for (const [who] of l.lines) if (!['m', 'f', 'n'].includes(who)) fail(`listening ${l.id}: speaker must be m/f/n`);
  for (const o of l.options) if (!o.jp || !o.en) fail(`listening ${l.id}: option needs jp + en`);
}
for (const lv of ['n5', 'n4']) {
  if (E.READING.filter(r => r.level === lv).length < 3 || E.LISTENING.filter(l => l.level === lv).length < 4) fail(`${lv}: needs 3+ readings and 4+ listening items`);
}

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
  const p = { name: 'スミス', nameRo: 'Sumisu', country: '中国', countryKana: 'ちゅうごく', countryRo: 'Chūgoku', countryEn: 'China', countryHi: 'China' };
  assert.equal(core.fill('Main {countryHi} se hoon', p), 'Main China se hoon');
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

test('conjugates group 1 verbs', () => {
  const c = conjugate({ jp: '飲む', kana: 'のむ', group: 1 });
  assert.deepEqual([c.masu[0], c.te[0], c.nai[0], c.ta[0], c.tai[0], c.mashou[1]], ['飲みます', '飲んで', '飲まない', '飲んだ', '飲みたいです', 'のみましょう']);
  const k = conjugate({ jp: '書く', kana: 'かく', group: 1 });
  assert.deepEqual([k.te[0], k.ta[0]], ['書いて', '書いた']);
  assert.deepEqual([conjugate({ jp: '急ぐ', kana: 'いそぐ', group: 1 }).te[0], conjugate({ jp: '話す', kana: 'はなす', group: 1 }).te[0]], ['急いで', '話して']);
  assert.deepEqual([conjugate({ jp: '会う', kana: 'あう', group: 1 }).nai[0], conjugate({ jp: '待つ', kana: 'まつ', group: 1 }).te[0]], ['会わない', '待って']);
  assert.deepEqual([conjugate({ jp: '帰る', kana: 'かえる', group: 1 }).masu[0], conjugate({ jp: '遊ぶ', kana: 'あそぶ', group: 1 }).te[0]], ['帰ります', '遊んで']);
});
test('conjugates the exceptions: 行く, ある, する, 来る', () => {
  const iku = conjugate({ jp: '行く', kana: 'いく', group: 1 });
  assert.deepEqual([iku.te[0], iku.ta[0], iku.masu[0]], ['行って', '行った', '行きます']);
  assert.equal(conjugate({ jp: 'ある', kana: 'ある', group: 1 }).nai[0], 'ない');
  const kuru = conjugate({ jp: '来る', kana: 'くる', group: 3 });
  assert.deepEqual([kuru.masu, kuru.nai, kuru.te], [['来ます', 'きます'], ['来ない', 'こない'], ['来て', 'きて']]);
  const benkyo = conjugate({ jp: '勉強する', kana: 'べんきょうする', group: 3 });
  assert.deepEqual([benkyo.masu[0], benkyo.te[1], benkyo.nai[0]], ['勉強します', 'べんきょうして', '勉強しない']);
});
test('conjugates group 2 verbs', () => {
  const c = conjugate({ jp: '食べる', kana: 'たべる', group: 2 });
  assert.deepEqual([c.masu[0], c.te[0], c.nai[0], c.ta[0], c.masen[0]], ['食べます', '食べて', '食べない', '食べた', '食べません']);
});
test('kana to romaji', () => {
  assert.equal(toRomaji('べんきょうします'), 'benkyōshimasu');
  assert.equal(toRomaji('のみましょう'), 'nomimashō');
  assert.equal(toRomaji('いって'), 'itte');
  assert.equal(toRomaji('まって'), 'matte');
  assert.equal(toRomaji('しゅうまつ'), 'shūmatsu');
  assert.equal(toRomaji('おおきい'), 'ōkii');
  assert.equal(toRomaji('こんいん'), "kon'in");
  assert.equal(toRomaji('おもう', { keepFinalU: true }), 'omou');
  assert.equal(toRomaji('コーヒー'), 'kōhī');
  assert.equal(toRomaji('ちゃ'), 'cha');
});

test('sentence chunks split at particles but keep words whole', () => {
  const { chunk, ALL_KANA } = JL;
  assert.deepEqual(chunk('日本で働く[ために]、日本語を勉強しています。'), ['日本で', '働くために、', '日本語を', '勉強しています。']);
  assert.deepEqual(chunk('はい、もう食べました。'), ['はい、', 'もう食べました。']);
  assert.ok(ALL_KANA.includes('きゃ') && ALL_KANA.includes('ん') && !ALL_KANA.includes('・'));
});

test('mock scoring matches JLPT pass rules', () => {
  const mk = (sec, n, ok) => Array.from({ length: n }, (_, i) => ({ section: sec, ok: i < ok }));
  const all = [...mk('vocab', 10, 10), ...mk('grammar', 10, 10), ...mk('reading', 4, 4), ...mk('listening', 4, 4)];
  const perfect = EX.scoreMock(all, 'n5');
  assert.deepEqual([perfect.langReading, perfect.listening, perfect.total, perfect.passed], [120, 60, 180, true]);
  const lowListening = EX.scoreMock([...mk('vocab', 10, 10), ...mk('grammar', 10, 10), ...mk('reading', 4, 4), ...mk('listening', 4, 1)], 'n5');
  assert.equal(lowListening.listening, 15); assert.equal(lowListening.passed, false); // 135 total but listening under 19
  const n4 = EX.scoreMock([...mk('vocab', 10, 5), ...mk('grammar', 10, 5), ...mk('reading', 4, 2), ...mk('listening', 4, 2)], 'n4');
  assert.deepEqual([n4.total, n4.passed], [90, true]);
});

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`✓ All checks passed (${UNITS.length} units, ${CARDS.length} phrases, ${PARTICLES.length} particles, ${VERBS.length} verbs, ${KANJI_LIST.length} kanji, ${J.GRAMMAR.length} grammar points, ${V.WORDS.length} words)`);
