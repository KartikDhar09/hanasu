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
for (const id of ['app', 'sheet', 'toast']) if (!html.includes(`id="${id}"`)) fail(`index.html is missing #${id}`);

// 3. Service worker precaches real files, including every module.
const shell = read('sw.js').match(/const SHELL = \[([\s\S]*?)\];/)?.[1] || '';
for (const [, f] of shell.matchAll(/'\/([^']*)'/g)) if (f && !existsSync(f)) fail(`sw.js precaches missing file /${f}`);
for (const f of readdirSync('js')) if (!shell.includes(`'/js/${f}'`)) fail(`sw.js does not precache /js/${f}`);

// 4. Manifest is valid with icons present.
try {
  const m = JSON.parse(read('manifest.webmanifest'));
  for (const i of m.icons) if (!existsSync(i.src.slice(1))) fail(`manifest icon missing: ${i.src}`);
} catch (e) { fail('manifest.webmanifest: ' + e.message); }

// 4b. Security: strict CSP and no inline script anywhere (the CSP would block it).
{
  const vc = JSON.parse(read('vercel.json'));
  const all = vc.headers.flatMap(h => h.headers);
  const csp = all.find(h => h.key === 'Content-Security-Policy')?.value || '';
  for (const d of ["script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'none'"]) if (!csp.includes(d)) fail(`vercel.json CSP missing ${d}`);
  for (const k of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) if (!all.some(h => h.key === k)) fail(`vercel.json missing ${k} header`);
  if (/<script(?![^>]*\bsrc=)/i.test(html)) fail('index.html has an inline <script>');
  for (const f of ['index.html', ...readdirSync('js').map(f => 'js/' + f)]) {
    if (/\son(click|input|change|load|error|submit|key\w*|mouse\w*)=/i.test(read(f))) fail(`${f} uses an inline event handler`);
    if (/\beval\(|new Function\(/.test(read(f))) fail(`${f} uses eval`);
  }
}

// 4c. Keep crawlers and AI agents out.
{
  const robots = read('robots.txt');
  if (!/User-agent: \*\s*\nDisallow: \/\s*$/m.test(robots)) fail('robots.txt must disallow everything for *');
  for (const ua of ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Google-Extended', 'CCBot', 'PerplexityBot']) if (!robots.includes(`User-agent: ${ua}\nDisallow: /`)) fail(`robots.txt must block ${ua}`);
  const vc = JSON.parse(read('vercel.json'));
  if (!vc.headers.flatMap(h => h.headers).some(h => h.key === 'X-Robots-Tag' && h.value.includes('noindex'))) fail('vercel.json needs X-Robots-Tag noindex');
  if (!/<meta name="robots" content="noindex/.test(html)) fail('index.html needs a robots noindex meta tag');
  const r = vc.redirects?.[0];
  const re = new RegExp('^' + r.has[0].value + '$');
  for (const ua of ['Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ChatGPT-User/1.0; +https://openai.com/bot)', 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', 'Claude-User/1.0'])
    if (!re.test(ua)) fail(`AI user agent not blocked: ${ua}`);
  for (const ua of ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'curl/8.7.1'])
    if (re.test(ua)) fail(`a normal browser would be blocked: ${ua}`);
  if (new RegExp(r.source.replace('/((?!robots\\.txt$).*)', '^/((?!robots\\.txt$).*)$')).test('/robots.txt')) fail('the redirect must not apply to robots.txt (redirect loop)');
}

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
const KR = await import('../js/kanji-readings.js');
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
if (J.GRAMMAR.filter(g => g.level === 'n4').length < 65) fail('N4 grammar should be the full list (65+ points)');

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
if (V.WORDS.filter(w => w.level === 'life').length < 300) fail('Life & work vocabulary should have 300+ words');
for (const k of KANJI_LIST) if (!k.pic || !k.hint) fail(`kanji ${k.ch}: missing picture hint`);

// 5f. Reading and listening.
const E = await import('../js/exam-data.js');
const EX = await import('../js/exam.js');
if (new Set([...E.READING, ...E.LISTENING].map(x => x.id)).size !== E.READING.length + E.LISTENING.length) fail('duplicate reading/listening ids');
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
  if (E.READING.filter(r => r.level === lv).length < 10 || E.LISTENING.filter(l => l.level === lv).length < 10) fail(`${lv}: needs 10+ readings and 10+ listening items`);
}

// 5f2. Exam question types and the full mock's counts.
const T = await import('../js/exam-types.js');
const uniq = (a, where) => { if (new Set(a).size !== a.length || a.some(x => !x || !String(x).trim())) fail(`${where}: options must be 4 different, non-empty answers`); };
for (const c of T.CONTEXT) {
  if (c.length !== 8 || !['n5', 'n4'].includes(c[0]) || !c[1].includes('（　）') || !c[2].includes('（　）')) fail(`context ${c[1]}: needs [level, jp（　）, kana（　）, en, right, 3 wrong]`);
  uniq(c.slice(4), `context ${c[1]}`);
}
for (const c of T.PARAPHRASE) {
  if (c.length !== 8 || !['n5', 'n4'].includes(c[0]) || !/\[.+?\]/.test(c[1])) fail(`paraphrase ${c[1]}: needs [level, jp with [part], kana, en, right, 3 wrong]`);
  uniq(c.slice(4), `paraphrase ${c[1]}`);
}
for (const u of T.USAGE) { if (u.length !== 7) fail(`usage ${u[0]}: needs [word, kana, en, right, 3 wrong]`); uniq(u.slice(3), `usage ${u[0]}`); }
for (const p of T.PASSAGES) {
  p.blanks.forEach((b, i) => { if (!p.text.includes('（' + '１２３４５６７８'[i] + '）')) fail(`passage ${p.id}: text has no blank ${i + 1}`); uniq(b, `passage ${p.id} blank ${i + 1}`); });
}
for (const o of T.ORDER) if (o.length !== 5 || o[2].length !== 4 || new Set(o[2]).size !== 4 || !o[4]) fail(`order ${o[1]}: needs [level, before, 4 different pieces, after, en]`);
for (const lv of ['n5', 'n4']) {
  const need = {}; for (const paper of EX.FULL[lv]) for (const [t, n] of paper.parts) need[t] = n;
  const have = {
    order: T.ORDER.filter(o => o[0] === lv).length,
    context: T.CONTEXT.filter(c => c[0] === lv).length, para: T.PARAPHRASE.filter(c => c[0] === lv).length, usage: T.USAGE.length,
    passage: T.PASSAGES.filter(p => p.level === lv).reduce((n, p) => n + p.blanks.length, 0),
    read: E.READING.filter(r => r.level === lv).reduce((n, r) => n + r.qs.length, 0),
    task: E.LISTENING.filter(l => l.level === lv && ['Task-based', 'Picture question'].includes(l.kind)).length,
    point: E.LISTENING.filter(l => l.level === lv && l.kind.startsWith('Key point')).length,
    say: E.LISTENING.filter(l => l.level === lv && l.kind === 'What do you say?').length,
    quick: E.LISTENING.filter(l => l.level === lv && l.kind === 'Quick response').length,
  };
  for (const [t, n] of Object.entries(have)) if (need[t] && n < need[t]) fail(`${lv} full mock: ${t} needs ${need[t]}, bank has ${n}`);
}

// 5g. Sentence builder: every pattern × every allowed slot builds a clean sentence.
for (const p of SP.PATTERNS) {
  for (const g of [...p.x, ...(p.y || [])]) if (!SP.SLOTS[g]) fail(`pattern ${p.id}: unknown slot group ${g}`);
  if (!p.jp.includes('{X}') || !p.kana.includes('{X}') || !p.ro.includes('{X}') || !p.en.includes('{X}') || !p.hg.includes('{X}')) fail(`pattern ${p.id}: every field needs {X}`);
  for (const gx of p.x) for (const x of SP.SLOTS[gx].items) for (const y of p.y ? p.y.flatMap(g => SP.SLOTS[g].items) : [null]) {
    const l = SP.buildSentence(p, x, y);
    if (l.some(f => /[{}]/.test(f))) fail(`pattern ${p.id}: unfilled slot in ${l[0]}`);
    if (/[\u4e00-\u9faf]/.test(l[1])) fail(`pattern ${p.id}: kana has kanji: ${l[1]}`);
    romajiOk(l[2], `pattern ${p.id}`);
  }
}
for (const g of Object.values(SP.SLOTS)) for (const it of g.items) if (it.length !== 5 || /[\u4e00-\u9faf]/.test(it[1]) || !LATIN.test(it[4])) fail(`slot item ${it[0]}: needs [jp, kana, romaji, en, hinglish]`);

// 6. Logic tests.
const core = await import('../js/core.js');
const furiMod = await import('../js/furigana.js');
const WAYS_ALL = await (await import('../js/ways.js')).allWays();
const strokeMod = await import('./strokes.mjs');
const readingsMod = await import('../js/kanji-readings.js');
const test = (name, fn) => { try { fn(); } catch (e) { fail(`test "${name}": ${e.message}`); } };
test('no third-party requests (fonts are self-hosted)', () => {
  for (const f of ['index.html', 'css/app.css', 'sw.js', 'vercel.json']) assert.ok(!/googleapis|gstatic|https?:\/\/(?!rsms\.me)[a-z]/.test(readFileSync(f, 'utf8').replace(/https:\/\/(www\.)?w3\.org[^"' ]*/g, '')), `${f} references another origin`);
});
test('.vercelignore publishes only app files', () => {
  const lines = readFileSync('.vercelignore', 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
  assert.equal(lines[0], '/*', 'must start by ignoring everything');
  for (const bad of ['scripts', '.github', 'README.md', 'package.json']) assert.ok(!lines.some(l => l.includes(bad)), `${bad} must stay private`);
});
test('nothing but display settings is stored', () => {
  for (const f of readdirSync('js').filter(f => f.endsWith('.js'))) {
    const src = readFileSync('js/' + f, 'utf8');
    if (f !== 'app.js') assert.ok(!/localStorage|indexedDB|sessionStorage|document\.cookie/.test(src), `${f} touches storage`);
    assert.ok(!/practised\(|bumpStreak|quizBest|kanjiProgress|vocabProgress|readBest|listenDone|S\(\)\.(progress|spoken|mocks|intro|builder|jlptLevel)/.test(src), `${f} still tracks the learner`);
  }
  const app = readFileSync('js/app.js', 'utf8');
  assert.match(app, /JSON\.stringify\(\{ settings: state\.settings \}\)/);
});
const clipsMod = await import('../js/clips.js');
const spoken = await (await import('./audio-texts.mjs')).audioTexts();
test('every line the app speaks has a recorded clip (run scripts/make-audio.mjs)', () => {
  const missing = Object.entries(spoken).flatMap(([who, lines]) => lines.filter(t => !existsSync('.' + clipsMod.clipPath(t, who))).map(t => `${who}:${t}`));
  assert.ok(!missing.length, `${missing.length} lines have no clip, e.g. ${missing.slice(0, 5).join(' | ')}`);
  const want = new Set(Object.entries(spoken).flatMap(([who, lines]) => lines.map(t => clipsMod.clipPath(t, who))));
  const orphans = ['n', 'm', 'f'].flatMap(who => existsSync('audio/' + who) ? readdirSync('audio/' + who).map(f => `/audio/${who}/${f}`) : []).filter(p => !want.has(p));
  assert.ok(!orphans.length, `${orphans.length} clips for lines that no longer exist`);
  assert.ok(existsSync('audio/silence.m4a'));
  assert.equal(clipsMod.clipPath('おはようございます。'), clipsMod.clipPath(' おはようございます。 '), 'clip names ignore surrounding spaces');
  assert.equal(clipsMod.clipPath('私[は]学生です。'), clipsMod.clipPath('私は学生です。'), 'clip names ignore grammar brackets');
});
const idx = await (await import('./units-index.mjs')).buildIndex();
if (readFileSync('js/units-index.js', 'utf8') !== idx) fail('js/units-index.js is out of date: run node scripts/units-index.mjs');
test('text colours meet WCAG AA contrast (4.5:1) in light and dark themes', () => {
  const css = readFileSync('css/app.css', 'utf8');
  const vars = block => Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2]]));
  const light = vars(css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {'))));
  const darkStart = css.indexOf(':root {', css.indexOf('prefers-color-scheme: dark'));
  const dark = { ...light, ...vars(css.slice(darkStart, css.indexOf('}', darkStart))) };
  const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const pairs = [['ink', 'bg'], ['ink', 'surface'], ['muted', 'bg'], ['muted', 'surface'], ['muted', 'surface-2'], ['accent', 'bg'], ['accent', 'surface'],
    ['accent', 'accent-soft'], ['accent-ink', 'accent-btn'], ['ok-ink', 'ok'], ['ok', 'surface'], ['bad', 'surface'], ['warn', 'surface'], ['casual', 'surface'], ['you-ink', 'you']];
  for (const [name, t] of [['light', light], ['dark', dark]]) for (const [f, b] of pairs) {
    const r = ratio(t[f], t[b]);
    assert.ok(r >= 4.5, `${name}: --${f} on --${b} is ${r.toFixed(2)}:1`);
  }
});
if (readFileSync('js/module-deps.js', 'utf8') !== (await import('./module-deps.mjs')).buildDeps()) fail('js/module-deps.js is out of date: run node scripts/module-deps.mjs');
test('every kanji has stroke-order data with only drawing commands (run scripts/strokes.mjs)', () => {
  const { strokeFile } = strokeMod;
  for (const k of KANJI_LIST) {
    const f = strokeFile(k.ch);
    assert.ok(existsSync(f), `no stroke data for ${k.ch}`);
    const d = JSON.parse(readFileSync(f, 'utf8'));
    assert.ok(d.p.length > 0 && d.p.every(p => /^[MmCcSsLlHhVvZz0-9.,\s-]+$/.test(p)), `bad stroke data for ${k.ch}`);
  }
  assert.equal(readdirSync('strokes').length, KANJI_LIST.length, 'stroke files for kanji the app no longer has');
});
// "More ways to say it": tracks done so far (all will be covered when the batches finish).
const WAYS_TRACKS = ['n5', 'office', 'corp'];
const DLG_TRACKS = ['n5', 'office', 'corp']; // role-play lines done so far
test('every phrase has a business version and 2–3 other ways, with correct readings', () => {
  const WAYS = WAYS_ALL;
  const P = { name: 'スミス', nameRo: 'Sumisu', country: 'インド', countryKana: 'インド', countryRo: 'Indo', countryEn: 'India', countryHi: 'Bharat' };
  const f = t => core.fill(t, P);
  const norm = t => f(t).replace(/[、。！？!?…\s]/g, '');
  // Role-play lines use ids dlg:<unit>:<line index>.
  const DLG = new Map(UNITS.flatMap(u => (u.dialogue || []).map((l, i) => [`dlg:${u.id}:${i}`, { jp: l[1], unit: u.id }])));
  // Q&A answers use ids qa:<question>:<answer>; every answer is covered.
  const QAW = new Map(SP.QA.flatMap((q, i) => q.a.map((x, j) => [`qa:${i}:${j}`, { jp: x[0] }])));
  // Particle examples: pt:<particle id>:<example>; the main line's [brackets] are dropped for comparison.
  const PTW = new Map(PARTICLES.flatMap(p => p.examples.map((x, j) => [`pt:${p.id}:${j}`, { jp: x[0].replace(/[[\]]/g, '') }])));
  for (const [id, w] of WAYS) {
    const c = CARDS.find(x => x.id === id) || DLG.get(id) || QAW.get(id) || PTW.get(id);
    assert.ok(c, `ways for unknown phrase, role-play line or Q&A answer ${id}`);
    assert.ok(w.biz, `${id}: no business version (use b= if it's already right for work)`);
    assert.ok(w.alt.length >= 2 && w.alt.length <= 3, `${id}: ${w.alt.length} other ways (want 2–3)`);
    const lines = [...(w.biz === 'same' ? [] : [w.biz]), ...w.alt];
    const seen = new Set([norm(c.jp), ...(c.casual ? [norm(c.casual.jp)] : [])]);
    for (const l of lines) {
      assert.ok(!seen.has(norm(l.jp)), `${id}: "${l.jp}" repeats the phrase or another way`);
      seen.add(norm(l.jp));
      assert.match(l.kana.replace(/\{\w+\}/g, ''), /^[ぁ-ゖァ-ヺー・、。！？「」…〜\s!?.]+$/, `${id}: reading must be kana: ${l.kana}`);
      assert.ok(!/[ऀ-ॿ]/.test(l.hi), `${id}: Hinglish must be Roman letters`);
      assert.ok(!/[ぁ-ゖァ-ヺ一-龯]/.test(l.ro + l.en), `${id}: romaji/English contain Japanese`);
      if (/[一-龯々]/.test(f(l.jp))) assert.ok(furiMod.furigana(f(l.jp), f(l.kana), s => s), `${id}: reading doesn't line up with the kanji: ${l.jp} / ${l.kana}`);
    }
  }
  const missing = CARDS.filter(c => WAYS_TRACKS.includes(UNITS.find(u => u.id === c.unit).track) && !WAYS.has(c.id)).map(c => c.id);
  assert.ok(!missing.length, `phrases without other ways: ${missing.join(', ')}`);
  const missingDlg = [...DLG].filter(([id, l]) => DLG_TRACKS.includes(UNITS.find(u => u.id === l.unit).track) && !WAYS.has(id)).map(([id]) => id);
  assert.ok(!missingDlg.length, `role-play lines without other ways: ${missingDlg.join(', ')}`);
  const missingQa = [...QAW.keys()].filter(id => !WAYS.has(id));
  assert.ok(!missingQa.length, `Q&A answers without other ways: ${missingQa.join(', ')}`);
  const missingPt = [...PTW.keys()].filter(id => !WAYS.has(id));
  assert.ok(!missingPt.length, `particle examples without other ways: ${missingPt.join(', ')}`);
  // Particle alternatives keep the particle being taught, so each is another example of it.
  for (const p of PARTICLES) for (let j = 0; j < p.examples.length; j++) {
    const w = WAYS.get(`pt:${p.id}:${j}`);
    for (const l of [...(w.biz === 'same' ? [] : [w.biz]), ...w.alt]) assert.ok(l.jp.includes(p.p), `pt:${p.id}:${j}: "${l.jp}" doesn't use ${p.p}`);
  }
});
test('furigana lines readings up with kanji', () => {
  const F = furiMod.furigana, e = s => s;
  assert.equal(F('日本に来て、まだ半年です。', 'にほんにきて、まだはんとしです。', e), '<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby>に<ruby>来<rt>き</rt></ruby>て、まだ<ruby>半<rt>はん</rt></ruby><ruby>年<rt>とし</rt></ruby>です。');
  assert.equal(F('何にしますか。', 'なににしますか。', e), '<ruby>何<rt>なに</rt></ruby>にしますか。');
  assert.equal(F('私[は]学生です。', 'わたし[は]がくせいです。', e, furiMod.markBrackets(e)), '<ruby>私<rt>わたし</rt></ruby><mark>は</mark><ruby>学<rt>がく</rt></ruby><ruby>生<rt>せい</rt></ruby>です。');
  assert.equal(F('こんにちは。', 'こんにちは。', e), null, 'no kanji, no ruby');
  assert.equal(F('日本です。', 'にほんだ。', e), null, 'mismatch falls back');
  // Readings go over each kanji where the split is certain; words read as a whole keep one grouped reading.
  assert.equal(F('日本', 'にほん', e), '<ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby>');
  assert.equal(F('時々', 'ときどき', e), '<ruby>時<rt>とき</rt></ruby><ruby>々<rt>どき</rt></ruby>');
  assert.equal(F('誕生日', 'たんじょうび', e), '<ruby>誕<rt>たん</rt></ruby><ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby>');
  assert.equal(F('受付', 'うけつけ', e), '<ruby>受<rt>うけ</rt></ruby><ruby>付<rt>つけ</rt></ruby>');
  assert.equal(F('今日', 'きょう', e), '<ruby class="grp">今日<rt>きょう</rt></ruby>');
  assert.equal(F('大人', 'おとな', e), '<ruby class="grp">大人<rt>おとな</rt></ruby>');
  const used = new Set(JSON.stringify([CARDS, V.WORDS, J.GRAMMAR]).match(/\p{Script=Han}/gu));
  const missing = [...used].filter(ch => !readingsMod.READINGS[ch]);
  assert.ok(missing.length < 20, `kanji without readings (re-run scripts/kanji-readings.mjs): ${missing.join('')}`);
  // Every phrase, dialogue line, word and example either aligns or falls back; nearly all should align.
  const pairs = [...CARDS.map(c => [c.jp, c.kana]), ...V.WORDS.map(w => [w.jp, w.kana]), ...J.GRAMMAR.flatMap(g => g.ex.map(x => [x[0], x[1]]))]
    .filter(([a, b]) => a !== b && !/[{]/.test(a));
  const ok = pairs.filter(([a, b]) => F(a, b, e)).length;
  assert.ok(ok / pairs.length > 0.98, `only ${ok}/${pairs.length} lines get furigana`);
});
test('fill replaces placeholders', () => {
  const p = { name: 'スミス', nameRo: 'Sumisu', country: '中国', countryKana: 'ちゅうごく', countryRo: 'Chūgoku', countryEn: 'China', countryHi: 'China' };
  assert.equal(core.fill('Main {countryHi} se hoon', p), 'Main China se hoon');
  assert.equal(core.fill('{name}です。{country}から', p), 'スミスです。中国から');
  assert.equal(core.fill('{countryKana}から {nameRo}', p), 'ちゅうごくから Sumisu');
});
test('quiz options with the same meaning count as clashing', () => {
  assert.ok(core.sameMeaning('rice / meal', 'rice (uncooked)'));
  assert.ok(core.sameMeaning('clock / watch', 'see / watch'));
  assert.ok(!core.sameMeaning('hot (weather)', 'cold (weather)'));
});
test('words taught with two readings are spoken from their kana', () => {
  // One clip per written line, so a word with two readings (十分 じゅうぶん / じゅっぷん) must be in TWO_READINGS.
  const seen = new Map(), two = new Set();
  for (const [jp, kana] of [...V.WORDS.map(w => [w.jp, w.kana]), ...KANJI_LIST.flatMap(k => k.ex.map(e => [e[0], e[1]]))]) {
    if (seen.has(jp) && seen.get(jp) !== kana) two.add(jp);
    seen.set(jp, kana);
  }
  assert.deepEqual([...two].sort(), [...core.TWO_READINGS].sort());
});
test('speech matching accepts kanji, kana, katakana and digits', () => {
  assert.ok(core.matchScore(['おはようございます'], 'おはようございます。', 'おはようございます。') === 1);
  assert.ok(core.matchScore(['9時です'], '九時です。', 'くじです。') >= core.PASS);
  assert.ok(core.matchScore(['えきはどこですか'], '駅はどこですか。', 'えきはどこですか。') >= core.PASS);
  assert.ok(core.matchScore(['トイレはどこですか'], 'トイレはどこですか。', 'トイレはどこですか。') === 1);
  assert.ok(core.matchScore(['こんばんは'], 'おはようございます。', 'おはようございます。') < core.PASS);
  assert.equal(core.matchScore([], '駅', 'えき'), 0);
  assert.equal(core.matchScore(['ありがとう'], 'ありがとうございます。', 'ありがとうございます。', ['ありがとう。']), 1);
  // Compared as sounds: the recogniser's own kanji are read back, and long vowels / っ / small ゃゅょ count.
  core.useReadings(KR.READINGS);
  assert.ok(core.matchScore(['お願いします'], 'おねがいします。', 'おねがいします。') >= core.PASS);
  assert.ok(core.matchScore(['今日は暑いですね'], 'きょうはあついですね。', 'きょうはあついですね。') >= core.PASS);
  assert.ok(core.matchScore(['コーヒーをください'], 'こおひいをください', 'こおひいをください') === 1);
  assert.ok(core.matchScore(['おばさん'], 'おばあさん', 'おばあさん') < core.PASS);
  assert.ok(core.matchScore(['美容院'], '病院', 'びょういん') < core.PASS);
  assert.ok(core.matchScore(['切手'], '来て', 'きて') < core.PASS);
  for (const g of SP.PRONUNCIATION) for (const pair of g.pairs) for (const [a, b] of [[0, 1], [1, 0]]) {
    assert.ok(core.matchScore([pair[a][0]], pair[b][0], pair[b][0]) < core.PASS, `minimal pair ${pair[a][0]} must not pass as ${pair[b][0]}`);
  }
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
