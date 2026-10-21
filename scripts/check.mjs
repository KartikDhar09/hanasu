// Static checks and logic tests, run with `npm test` before every deploy.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const errors = [];
const fail = msg => errors.push(msg);
const read = p => readFileSync(p, 'utf8');

// 1. Every script parses.
for (const f of [...readdirSync('js').map(f => 'js/' + f), 'sw.js', 'middleware.js', ...readdirSync('api').map(f => 'api/' + f)]) {
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
  for (const f of ['index.html', 'login.html']) if (/<script(?![^>]*\bsrc=)/i.test(read(f))) fail(`${f} has an inline <script>`);
  for (const f of ['index.html', 'login.html', ...readdirSync('js').map(f => 'js/' + f)]) {
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

// 5f3. Counters: 10 readings in kana, a way to ask, examples that use the counter.
const CN = await import('../js/counters-data.js');
if (new Set(CN.COUNTERS.map(c => c.id)).size !== CN.COUNTERS.length) fail('duplicate counter ids');
for (const c of CN.COUNTERS) {
  const where = `counter ${c.c}`;
  if (!CN.COUNTER_GROUPS.some(g => g.id === c.group) || !['n5', 'n4'].includes(c.level)) fail(`${where}: bad group or level`);
  if (c.n.length !== 10 || !c.n.every(r => /^[ぁ-ゖー]+$/.test(r))) fail(`${where}: needs 10 readings in hiragana`);
  if (!/^[ぁ-ゖ]+$/.test(c.ask[1]) || !c.use || !LATIN.test(c.useHg) || !LATIN.test(c.hg) || c.items.length < 1) fail(`${where}: needs ask (kana), use, Hinglish and items`);
  if (c.ex.length < 2) fail(`${where}: needs 2 examples`);
  for (const e of c.ex) {
    if (e.length !== 5 || !LATIN.test(e[4]) || /[ぁ-ゖ]/.test(e[1].replace(/[ぁ-ゖ、。！？ー]/g, '')) === false && /[一-龯]/.test(e[1])) fail(`${where}: example needs [jp, kana, romaji, en, hinglish]: ${e[0]}`);
    if (!e[0].includes(c.c) && !c.nums?.some(x => e[0].includes(x)) && !e[0].includes(c.ask[0])) fail(`${where}: example doesn't use the counter: ${e[0]}`);
    romajiOk(e[2], where);
  }
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
  for (const f of ['index.html', 'login.html', 'css/app.css', 'sw.js', 'vercel.json']) assert.ok(!/googleapis|gstatic|https?:\/\/(?!rsms\.me)[a-z]/.test(readFileSync(f, 'utf8').replace(/https:\/\/(www\.)?w3\.org[^"' ]*/g, '')), `${f} references another origin`);
});
test('.vercelignore publishes only app files', () => {
  const lines = readFileSync('.vercelignore', 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
  assert.equal(lines[0], '/*', 'must start by ignoring everything');
  for (const bad of ['scripts', '.github', 'README.md', 'package.json']) assert.ok(!lines.some(l => l.includes(bad)), `${bad} must stay private`);
  // Without these the deploy silently drops the login wall: the app would go out with no middleware at all.
  for (const need of ['!/login.html', '!/middleware.js', '!/api']) assert.ok(lines.includes(need), `${need} must be deployed`);
});
test('nothing but display settings and path levels is stored', () => {
  for (const f of readdirSync('js').filter(f => f.endsWith('.js'))) {
    const src = readFileSync('js/' + f, 'utf8');
    if (f !== 'app.js') assert.ok(!/localStorage|indexedDB|sessionStorage|document\.cookie/.test(src), `${f} touches storage`);
    assert.ok(!/practised\(|bumpStreak|quizBest|kanjiProgress|vocabProgress|readBest|listenDone|S\(\)\.(progress|spoken|mocks|intro|builder|jlptLevel)/.test(src), `${f} still tracks the learner`);
  }
  const app = readFileSync('js/app.js', 'utf8');
  // Saved: display settings and one level number per path (the user's choice, 2026-10-18). Nothing else.
  assert.match(app, /JSON\.stringify\(\{ settings: state\.settings, path: state\.path \}\)/);
  assert.match(app, /s\.path = Object\.fromEntries\(PATH_IDS\.map\(p => \[p, Math\.round\(num\(/, 'path levels are sanitised to numbers');
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
const KANA_MOD = await import('../js/kana-data.js');
test('every kanji and basic kana has stroke-order data with only drawing commands (run scripts/strokes.mjs)', () => {
  const { strokeFile } = strokeMod;
  const chars = [...KANJI_LIST.map(k => k.ch), ...KANA_MOD.BASIC_HIRA, ...KANA_MOD.BASIC_KATA];
  assert.equal(KANA_MOD.BASIC_HIRA.length, 46, '46 basic hiragana');
  for (const ch of chars) {
    const f = strokeFile(ch);
    assert.ok(existsSync(f), `no stroke data for ${ch}`);
    const d = JSON.parse(readFileSync(f, 'utf8'));
    assert.ok(d.p.length > 0 && d.p.every(p => /^[MmCcSsLlHhVvZz0-9.,\s-]+$/.test(p)), `bad stroke data for ${ch}`);
  }
  assert.equal(readdirSync('strokes').length, chars.length, 'stroke files for characters the app no longer has');
});
// "More ways to say it": tracks done so far (all will be covered when the batches finish).
const WAYS_TRACKS = ['n5', 'office', 'corp'];
const DLG_TRACKS = ['n5', 'office', 'corp']; // role-play lines done so far
const GRAMMAR_WAYS = ['n5', 'n4']; // grammar levels done so far
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
  // Grammar examples: g5:/g4:<grammar id>:<example>.
  const GRW = new Map(J.GRAMMAR.filter(g => GRAMMAR_WAYS.includes(g.level)).flatMap(g => g.ex.map((x, j) => [`g${g.level[1]}:${g.id}:${j}`, { jp: x[0].replace(/[[\]]/g, ''), g, keep: /\[(.+?)\]/.exec(x[0])[1] }])));
  for (const [id, w] of WAYS) {
    const c = CARDS.find(x => x.id === id) || DLG.get(id) || QAW.get(id) || PTW.get(id) || GRW.get(id);
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
  const missingGr = [...GRW.keys()].filter(id => !WAYS.has(id));
  assert.ok(!missingGr.length, `grammar examples without other ways: ${missingGr.slice(0, 10).join(', ')}`);
  // Grammar versions keep the pattern being taught: the [bracketed] words, or for points whose brackets hold
  // ordinary words (an adjective, a noun), a check of the pattern itself.
  const PATTERN = {
    iadj: /い(です|ね|よ)|かった|くない/, naadj: /な[一-龯ぁ-ゖァ-ヺ]|じゃない|ではありません|じゃなかった/, adjnoun: /[いな]([一-龯ァ-ヺ]|かばん)/,
    relative: /(る|た|だ|ている|ない)[一-龯ァ-ヺ]|いる方|る方/, plain: /[うくぐすつぬぶむるだいた][？。]$/, 'no-one': /いのを|いのは/, momo: /も.*も/,
    naru: /[くに]なり/, nisuru: /にし|にいたし/, kute: /くて|で[一-龯ぁ-ゖ]/, kata: /方/, chuu: /中/, tachi: /たち/,
    counters: /何[人名枚本個台回階時冊杯匹]/, waga: /は.*が/, freq: /に.*回/, 'ka-or': /か/, formalneg: /くありません|ではありません/,
    kosoado: /[こそあど](れ|の|こ|ちら)/, donna: /どんな|どう|いかが/, adverb: /く[^な]|に/, kusuru: /[くに]し/, why: /どうして|なぜ/,
    nanika: /(何|どこ|誰)か/, nanimo: /(何|誰|どこ|どなた)(へ|に)?も/, desu: /です|でございます|じゃない|ではありません/,
    deshita: /でした|じゃなかった|ではありませんでした/, tai: /たい/, teiru: /[てで](います|おります)/, temoii: /[てで]も(いい|よろしい)/, aru: /あります|います|ございます/, tari: /[たど]り/, ikaga: /(いかが|どう)ですか/,
    // N4
    potential: /(られ|[えけせてねべめれげ])(ます|ません|る|ない)|でき(ます|る)/, takotogaaru: /[ただ]ことが(あり|ござい)/, nakereba: /なければ|なきゃ/,
    teshimau: /[てで]しま|ちゃ|じゃっ/, teoku: /[てで]おき/, temiru: /[てで]み/, giving: /くれ|もら|あげ|いただ|くださ/,
    passive: /れ(ました|ます|た)/, causative: /せて/, ndesu: /んです|のです/, volitional: /[おこそとのほもろよ]うと思/,
    mitai: /みたい|よう/, sa: /[一-龯]さ[はがにをで]/, causpass: /され|させられ/, okininaru: /お[一-龯]+[ぁ-ゖ]*になり|ご覧になり/,
    osuru: /[おご][一-龯]+[ぁ-ゖ]*(し|いたし)ます/, sonkeigo: /いらっしゃ|召し上が|おっしゃ|ご覧|お待ちになって/, kenjougo: /伺|拝見|参り|存じ/,
    sasete: /せて(ください|いただ)/, 'rareru-respect': /(られ|[かさたなまらわがば]れ)(ます|ました)/,
    imperative: /([えけせてねべめれげ]|ろ|い)！/, hajimeru: /始め|終わ/, tsuzukeru: /続け/, garu: /がって/, teikukuru: /[てで](き|い|まいり)/,
    tearu: /[てで](あり|ござい)/, darou: /だろう|でしょう/, 'mo-emph': /[一二三四五六七八九十百千]\S{0,4}も/, tokoro: /ところ/,
    itteita: /と(言って|おっしゃって)/, kamawanai: /もかまいません/, toomou: /と思/, 'na-prohib': /[うくぐすつぬぶむる]な[！。]/,
    'to-cond': /[うくぐすつぬぶむる]と、/, tara: /[ただ]ら/, ba: /ば/, nominal: /(の|こと)[がはで]|ことです/,
    tehoshii: /ほしい|いただきたい/, embedq: /か、/, youniiu: /ように/, taradou: /[ただ]ら(どう|いかが)/, dekiru: /こと(が|は)でき/, nakutemo: /なくても/, sugiru: /すぎ/, yotei: /予定/,
    younisuru: /ように(し|いたし)/, wokudasai: /ください|お願いします/, jidoushi: /[がを].*(開|閉|始|消|付|止|入)/, gari: /がり/,
    okudasai: /[おご][一-龯]+[ぁ-ゖ]*ください/, teita: /[てで](いました|おりました|いた)/, nimieru: /見え/, teyaru: /[てで]?やり/,
    youna: /ような|みたいな/, janaika: /じゃない(ですか|か)|ではない(でしょうか|か)/, hitsuyou: /必要/, tte: /って|とは|だそう/,
    teyokatta: /[てで]よかった/, tesumimasen: /[てで](すみません|申し訳)/, taraiidesuka: /[ただ]ら(いい|よろしい)/, toka: /とか.*とか/,
    tokiita: /と(聞き|伺い)/, karatsukuru: /(から|で)作/, sonnani: /そんなに|それほど/, nikigatsuku: /に気がつき/, hazuganai: /はずが(ない|ありません|ございません)/, kotonisuru: /ことに(し|いたし)/, temo: /[てで]も/, niyoruto: /によると|によりますと|によれば/, kotogaaru: /ことが(あり|ござい)/, hoshii: /がほしい/, takunai: /たくない/, suki: /が(お)?(好き|上手)/,
  };
  const BIZ_FREE = new Set(['plain']); // the point is the casual form, so the business version can't keep it
  const lost = [];
  for (const [id, c] of GRW) {
    const w = WAYS.get(id);
    const lines = [...(w.biz === 'same' || BIZ_FREE.has(c.g.id) ? [] : [w.biz]), ...w.alt];
    for (const l of lines) if (!(PATTERN[c.g.id] ? PATTERN[c.g.id].test(l.jp) : l.jp.includes(c.keep))) lost.push(`${id}: "${l.jp}" (${PATTERN[c.g.id] || c.keep})`);
  }
  assert.ok(!lost.length, `${lost.length} grammar versions don't keep the pattern:\n  ${lost.join('\n  ')}`);
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

// ---------- Book tab (Nihongo Fun & Easy) ----------
{
  const BK = { ...(await import('../js/book-data.js')) };
  BK.PAGES = await BK.allPages();
  {
    const idx = await (await import('./book-index.mjs')).buildBookIndex();
    if (readFileSync('js/book-index.js', 'utf8') !== idx) fail('js/book-index.js is out of date: run node scripts/book-index.mjs');
    const files = readdirSync('js').filter(f => /^book-.+\.js$/.test(f) && !['book-data.js', 'book-kit.js', 'book-index.js', 'book-pics.js'].includes(f));
    const listed = new Set(BK.BOOK_INDEX.map(p => `book-${p.id}.js`));
    for (const f of files) if (!listed.has(f)) fail(`js/${f} is not in the Book contents (scripts/book-index.mjs ORDER)`);
  }
  test('listening answers match the book’s answer key (pp.186–191)', () => {
    // Unit → answers to Q1–Q4, as numbered in the book (1–3).
    const KEY = { u1: [1, 3, 1, 3], u2: [1, 2, 1, 2], u3: [3, 2, 2, 1], u4: [3, 1, 1, 2], u5: [1, 3, 2, 2], u6: [1, 3, 1, 2],
      u7: [2, 2, 3, 2], u8: [3, 1, 1, 2], u9: [1, 2, 3, 1], u10: [3, 2, 3, 2], u11: [3, 1, 1, 2], u12: [2, 1, 2, 3] };
    for (const [id, want] of Object.entries(KEY)) {
      const qs = BK.PAGES.find(p => p.id === id).sections.flatMap(s => s.blocks).filter(b => b.t === 'listen');
      assert.deepEqual(qs.map(q => q.answer + 1), want, `${id} listening answers`);
    }
  });
  const JPC = /[ぁ-ゖァ-ヺ一-龯々]/;
  test('book pages are well-formed', () => {
    const ids = BK.PAGES.map(p => p.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate page ids');
    for (const p of BK.PAGES) {
      assert.ok(p.title && p.icon && p.sections.length, `${p.id}: missing title, icon or sections`);
      if (p.n) assert.ok(p.jp && p.ro && p.topic && p.goals.length >= 2, `unit ${p.n}: needs jp, romaji, topic and its goals`);
      for (const s of p.sections) for (const b of s.blocks) {
        const at = `${p.id} / ${s.h} / ${b.t}`;
        if (b.t === 'words' || b.t === 'lines') for (const w of b.items) assert.ok(w.length >= 3 && w.every(x => typeof x === 'string' && x), `${at}: word needs jp, romaji, english`);
        if (b.t === 'talk' || b.t === 'listen') for (const l of b.lines || b.script) {
          assert.ok(l.length === 4 && JPC.test(l[1]) && l[2] && l[3], `${at}: line needs speaker, japanese, romaji, english: ${l[1]}`);
          assert.ok(!/[ぁ-ゖ一-龯]/.test(l[2]) && !/[ぁ-ゖ一-龯]/.test(l[3]), `${at}: romaji/english column has Japanese: ${l[1]}`);
        }
        if (b.t === 'listen') assert.ok(b.options.length === 3 && b.answer >= 0 && b.answer < 3, `${at}: needs 3 options and a valid answer`);
        if (b.t === 'role') assert.ok(b.a && b.b, `${at}: role needs A and B`);
      }
    }
  });
  {
    const { PIC_SIZE } = await import('../js/book-pics.js');
    const { picSizes } = await import('./book-images.mjs');
    test('Book pictures exist, are sized and stay small', () => {
      assert.equal(readFileSync('js/book-pics.js', 'utf8'), picSizes(), 'js/book-pics.js is out of date: run scripts/book-images.mjs');
      const want = [...Object.values(BK.FOOD_PIC).map(f => `food/${f}`)];
      for (const p of BK.PAGES) for (const s of p.sections) for (const b of s.blocks) {
        if (b.t === 'img') want.push(b.file);
        if (b.t === 'scenes') b.items.forEach((_, i) => want.push(`${b.unit}/remember-${i + 1}`));
      }
      // Pictures not cropped yet show a placeholder; food photos must all be there.
      const missing = want.filter(f => f.startsWith('food/') && !PIC_SIZE[f]);
      assert.ok(!missing.length, `food pictures missing: ${missing.join(', ')}`);
      // Maps and menus are opened full size, so they may be bigger than the rest.
      const big = Object.keys(PIC_SIZE).filter(f => statSync(`img/book/${f}.jpg`).size > (/(map|menu|seasons|weather|material)$/.test(f) ? 240 : 80) * 1024);
      assert.ok(!big.length, `pictures too big: ${big.join(', ')}`);
      const sw = readFileSync('sw.js', 'utf8');
      assert.ok(!/'\/img\//.test(sw.match(/const SHELL = \[([\s\S]*?)\];/)[1]), 'pictures must not be precached');
    });
  }
  test('book speech text drops marks and skips blanks', () => {
    assert.equal(BK.spoken('〈ジョン〉さん、(1)お国は？'), 'ジョンさん、お国は？');
    assert.equal(BK.spoken('はい、＿＿と＿＿がいます。'), null);
    assert.equal(BK.spoken('茶色／ブラウン'), '茶色、ブラウン');
    assert.equal(BK.spoken('私も好きです。／私はあまり好きじゃありません。'), '私も好きです。私はあまり好きじゃありません。');
    assert.equal(BK.spoken('(お*)仕事'), 'お仕事');
  });
}

// ---------- Paths: levels, coverage, level tests ----------
const PATHMOD = await import('../js/path.js');
{
  const KG = (await import('../js/kanji-data.js')).ALL_KANJI_GROUPS;
  const { UNIT_INDEX: UI } = await import('../js/units-index.js');
  const QA_LIST = (await import('../js/speaking-data.js')).QA;
  const allJs = readdirSync('js').filter(f => f.endsWith('.js')).map(f => readFileSync('js/' + f, 'utf8')).join('\n');
  const ACTIONS = new Set([...allJs.matchAll(/^\s+'?([a-z][a-z0-9-]*)'?: (?:\([^)]*\)|[a-z]+) =>/gm)].map(m => m[1]));
  const HASH = /^#(unit\/[\w-]+|particles?(\/\w+)?|verbs|counters|kanji(\/n4)?|write(\/(hira|kata))?|study|speak(\/\w+)?|jlpt(\/(kana|grammar\/n[45]|vocab\/(n5|n4|life)|reading\/n[45]|listening\/n[45]|mock\/n[45]))?|path\/\w+)$/;
  const JP = /[ぁ-ゖァ-ヺ一-龯々]/, NOJP = /^[^ぁ-ゖァ-ヺ一-龯々]*$/;
  const KANA = /^[ぁ-ゖァ-ヺー、。！？「」・\[\] 　]+$/;
  for (const [pid, P] of Object.entries(PATHMOD.PATHS)) {
    const seen = { particles: new Map(), grammar: new Map(), kanji: new Map(), vocab: new Map(), units: new Map(), qa: new Map() };
    if (new Set(P.levels.map(l => l.id)).size !== P.levels.length) fail(`path ${pid}: duplicate level ids`);
    if (!LATIN.test(P.intro.hg)) fail(`path ${pid}: intro Hinglish`);
    for (const l of P.levels) {
      const at = `path ${pid}/${l.id}`;
      for (const k of ['icon', 'title', 'part', 'time', 'goal', 'tip']) if (!l[k]) fail(`${at}: missing ${k}`);
      for (const k of ['goalHg', 'tipHg']) if (!LATIN.test(l[k] || '')) fail(`${at}: ${k} must be Roman-letter Hinglish`);
      if (l.steps.length < 3 || l.daily.length < 3) fail(`${at}: needs 3+ steps and 3+ daily items`);
      for (const [icon, title, how, t] of l.steps) {
        if (!icon || !title || !how) fail(`${at}: step missing text`);
        if (t && !(t.startsWith('#') ? HASH.test(t) : ACTIONS.has(t.split(':')[0]))) fail(`${at}: step target ${t} doesn't exist`);
        if (t?.startsWith('#unit/') && !UI.some(u => u.id === t.slice(6))) fail(`${at}: no unit ${t}`);
      }
      for (const [kind, ids] of Object.entries(l.study || {})) {
        if (kind === 'qa') continue; // checked below
        const exists = { particles: id => PARTICLES.some(x => x.id === id), grammar: id => J.GRAMMAR.some(g => g.id === id),
          kanji: id => KG.some(g => g.id === id), vocab: id => V.VOCAB.some(t => t.id === id), units: id => UI.some(u => u.id === id) }[kind];
        if (!exists) { fail(`${at}: unknown study kind ${kind}`); continue; }
        for (const id of ids) {
          if (!exists(id)) fail(`${at}: ${kind} ${id} doesn't exist`);
          if (seen[kind].has(id)) fail(`${at}: ${kind} ${id} is already in ${seen[kind].get(id)}`);
          seen[kind].set(id, l.id);
        }
      }
      for (const k of PATHMOD.parseKit(l.kit)) {
        if (!JP.test(k.jp) || !KANA.test(k.kana.replace(/[〜～…]/g, '')) || !k.ro || !k.en || !LATIN.test(k.hg || '')) fail(`${at}: key phrase "${k.jp}" needs jp|kana|romaji|English|Hinglish`);
      }
      for (const m of l.missions || []) if (!m.trim()) fail(`${at}: empty mission`);
      for (const d of l.drill || []) if (d.length !== 3 || !LATIN.test(d[1]) || !JP.test(d[2])) fail(`${at}: drill topic needs [English, Hinglish, Japanese hints]`);
      for (const n of l.study?.qa || []) if (!QA_LIST[n]) fail(`${at}: no QA ${n}`); else if (seen.qa.has(n)) fail(`${at}: QA ${n} already in ${seen.qa.get(n)}`); else seen.qa.set(n, l.id);
      const T = l.test;
      if (T.mock) { if (!['n5', 'n4'].includes(T.mock)) fail(`${at}: bad mock`); continue; }
      if (T.speak) {
        const items = PATHMOD.parseSpeak(T.speak);
        if (items.length < 10) fail(`${at}: speaking test needs 10+ items`);
        const taught = new Set(P.levels.slice(0, P.levels.indexOf(l) + 1).flatMap(x => x.study?.units || []));
        items.forEach((x, n) => {
          const w = `${at} speak ${n + 1} (${x.t})`;
          if (x.bad) return fail(`${w}: unknown item: ${x.bad}`);
          if (x.t === 'u') {
            const c = CARDS.find(c => c.id === x.card);
            if (!c) return fail(`${w}: no phrase ${x.card}`);
            if (!taught.has(c.unit)) fail(`${w}: ${x.card} is from a unit not taught by this level`);
            if (/\{name\}/.test(c.jp)) fail(`${w}: ${x.card} contains the learner's name, which the mic can't match`);
          } else {
            if (!JP.test(x.jp) || !KANA.test(x.kana.replace(/[〜～…]/g, '')) || !x.ro || !x.en) fail(`${w}: needs jp, kana, romaji, English`);
            for (const a of x.alts || []) if (!JP.test(a)) fail(`${w}: alternative "${a}" isn't Japanese`);
          }
          if (x.t !== 'a' && (!x.say || !NOJP.test(x.say.replace(/“[^”]*”/g, '')))) fail(`${w}: situation must be in English`);
        });
        continue;
      }
      if (!(T.pass >= 60 && T.pass <= 100)) fail(`${at}: pass mark`);
      const qs = PATHMOD.parseQs(T.qs);
      if ((T.n || 0) + qs.length < 15) fail(`${at}: level test needs 15+ questions`);
      if (T.kana && !['hira', 'kata'].includes(T.kana)) fail(`${at}: kana must be hira or kata`);
      qs.forEach((q, i) => {
        const w = `${at} q${i + 1} (${q.t})`;
        if (q.bad) return fail(`${w}: unknown question type: ${q.bad}`);
        if (!q.right || q.wrong.length !== 3) return fail(`${w}: needs a right answer and exactly 3 wrong ones`);
        const opts = [q.right, ...q.wrong];
        if (new Set(opts).size !== 4 || opts.some(o => !o.trim())) fail(`${w}: options must be 4 different, non-empty`);
        if (q.t === 'g') {
          if ((q.jp.match(/\[/g) || []).length !== 1 || (q.kana.match(/\[/g) || []).length !== 1) fail(`${w}: mark the answer once in both lines`);
          if (!KANA.test(q.kana.replace(/[A-Za-zＡ-Ｚ０-９]/g, ''))) fail(`${w}: kana line has kanji: ${q.kana}`);
          if (!NOJP.test(q.en)) fail(`${w}: English has Japanese`);
        }
        if (q.t === 'r' && !opts.every(o => KANA.test(o))) fail(`${w}: readings must be kana`);
        if ((q.t === 'm' || q.t === 'l') && !opts.every(o => NOJP.test(o))) fail(`${w}: meanings must be English`);
        if ((q.t === 'w' || q.t === 'p') && !opts.every(o => JP.test(o))) fail(`${w}: options must be Japanese`);
        if (q.t === 'w' && !NOJP.test(q.en)) fail(`${w}: English has Japanese`);
        if (['g', 'r', 'm', 'l'].includes(q.t) && !JP.test(q.jp)) fail(`${w}: no Japanese`);
      });
    }
    if (pid === 'jlpt') {
      const need = { particles: PARTICLES.map(x => x.id), grammar: J.GRAMMAR.map(g => g.id), kanji: KG.map(g => g.id),
        vocab: V.VOCAB.filter(t => t.level !== 'life').map(t => t.id) };
      for (const [kind, ids] of Object.entries(need)) {
        const missing = ids.filter(id => !seen[kind].has(id));
        if (missing.length) fail(`path jlpt: ${missing.length} ${kind} not in any level: ${missing.slice(0, 8).join(', ')}`);
      }
      for (const lv of ['n5', 'n4']) if (!P.levels.some(l => l.test.mock === lv)) fail(`path jlpt: no level ends with the ${lv} mock`);
    }
    if (pid === 'talk') {
      const missingU = UI.map(u => u.id).filter(id => !seen.units.has(id));
      if (missingU.length) fail(`path talk: units not in any level: ${missingU.join(', ')}`);
      const missingQ = QA_LIST.map((_, n) => n).filter(n => !seen.qa.has(n));
      if (missingQ.length) fail(`path talk: Q&A questions not in any level: ${missingQ.join(', ')}`);
      if (!P.levels.every(l => l.test.speak)) fail('path talk: every level needs a speaking test');
    }
  }
}

test('speaking-path tests: each target and its alternatives pass the mic check; no item accepts another item’s answer', () => {
  core.useReadings(readingsMod.READINGS);
  const P = { name: 'スミス', nameRo: 'Sumisu', country: 'インド', countryKana: 'インド', countryRo: 'Indo', countryEn: 'India', countryHi: 'Bharat' };
  const f = t => core.fill(t, P);
  for (const l of PATHMOD.PATHS.talk.levels) {
    const items = PATHMOD.parseSpeak(l.test.speak).map(x => {
      if (x.t !== 'u') return { ...x, alts: (x.alts || []).map(a => [a]) };
      const c = CARDS.find(c => c.id === x.card), w = WAYS_ALL.get(x.card);
      const alts = w ? [...(w.biz && w.biz !== 'same' ? [w.biz] : []), ...w.alt].map(a => [f(a.jp), f(a.kana)]) : [];
      return { ...x, jp: f(c.jp), kana: f(c.kana), alts: [...(c.casual ? [[f(c.casual.jp), f(c.casual.kana)]] : []), ...alts] };
    });
    for (const q of items) {
      const sc = h => core.matchScore([h], q.jp, q.kana, q.alts.flat());
      for (const h of [q.jp, q.kana, ...q.alts.map(a => a[0])]) assert.ok(sc(h) >= core.PASS, `${l.id}: “${h}” should pass for ${q.jp}`);
      for (const o of items) if (o !== q) assert.ok(sc(o.jp) < core.PASS, `${l.id}: ${q.jp} also accepts ${o.jp}`);
    }
  }
});

test('passing a full mock completes that exam level in the JLPT path (and only moves forward)', () => {
  const levels = { jlpt: 2 }, calls = [];
  const mod = PATHMOD.initPath({ S: () => ({ settings: {} }), esc: x => x, render() {}, speak() {}, shuffle: a => a, bar: () => '', back: () => '',
    go() {}, clearSess() {}, run() {}, canListen: () => false, level: p => levels[p] || 0,
    setLevel: (p, n) => { calls.push([p, n]); if (n > (levels[p] || 0)) levels[p] = n; } });
  mod.mockPassed('n5');
  const n5 = PATHMOD.PATHS.jlpt.levels.findIndex(l => l.test.mock === 'n5');
  assert.deepEqual(calls, [['jlpt', n5 + 1]]);
  assert.equal(levels.jlpt, n5 + 1);
  mod.mockPassed('n4');
  assert.equal(levels.jlpt, PATHMOD.PATHS.jlpt.levels.length, 'passing the N4 mock completes the path');
  const exam = readFileSync('js/exam.js', 'utf8');
  assert.match(exam, /if \(s\.passed && full\) ctx\.mockPassed\(lv\)/, 'exam.js reports a passed full mock');
  assert.match(exam, /full = st\.mode !== 'quick'/, 'quick mocks never count');
});

const SEARCH = await import('../js/search.js');
test('search finds things by Japanese, kana, romaji (with or without long-vowel marks), English and Hinglish', () => {
  const has = (q, kind, pred) => assert.ok(SEARCH.search(q, 50)[kind].some(pred), `“${q}” should find a ${kind}`);
  has('arigatou', 'phrase', e => e.title === 'ありがとうございます。');
  has('ありがとう', 'phrase', e => e.title === 'ありがとうございます。');
  has('アリガトウ', 'phrase', e => e.title === 'ありがとうございます。');
  has('eki', 'word', e => e.title === '駅');
  has('station', 'word', e => e.title === '駅');
  has('paani', 'word', e => e.title === '水');
  has('日', 'kanji', e => e.title === '日');
  has('てください', 'grammar', e => e.go === 'jlpt/g/tekudasai');
  has('wa', 'particle', e => e.title === 'は');
  has('本', 'counter', e => e.title === '本');
  has('greetings', 'unit', e => e.go === 'unit/greet');
  const top = SEARCH.search('water').word[0];
  assert.equal(top.title, '水', 'exact English match ranks first');
  assert.equal(SEARCH.search('zzqxv').total, 0);
  assert.equal(SEARCH.search('   ').total, undefined, 'empty query searches nothing');
});

// 7. Login wall (middleware.js, api/). Runs the real code against an in-memory database, so no Upstash is needed.
const atest = async (name, fn) => { try { await fn(); } catch (e) { fail(`test "${name}": ${e.message}`); } };
{
  const session = await import('../api/_session.js');
  const { memoryStore, useStore } = await import('../api/_store.js');
  const { handle } = await import('../api/auth.js');
  const account = await import('../api/_account.js');
  const env = { SESSION_SECRET: 's'.repeat(40), INVITE_CODE: 'sakura-2026' };
  const db = memoryStore();
  useStore(db);
  const post = (body, headers = {}) => handle(new Request('https://hanasu.test/api/auth', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '1.2.3.4', ...headers }, body: JSON.stringify(body),
  }), env);
  const cookieOf = res => (res.headers.get('set-cookie') || '').split(';')[0];
  const me = cookie => handle(new Request('https://hanasu.test/api/auth', { headers: { cookie } }), env);

  await atest('session cookies: valid, tampered, expired, wrong secret', async () => {
    const t = await session.sign('kartik', env);
    assert.equal(await session.verify(t, env), 'kartik');
    const [body, sig] = t.split('.');
    const forged = Buffer.from(JSON.stringify({ u: 'friend', exp: 9e9 })).toString('base64url');
    assert.equal(await session.verify(`${forged}.${sig}`, env), null, 'a changed name must not verify');
    assert.equal(await session.verify(`${body}.${sig.slice(0, -2)}AA`, env), null, 'a changed signature must not verify');
    assert.equal(await session.verify(t, { SESSION_SECRET: 't'.repeat(40) }), null, 'another secret must not verify');
    assert.equal(await session.verify(t, env, Date.now() + (session.DAYS + 1) * 86400e3), null, 'expired');
    assert.equal(await session.verify(t, { SESSION_SECRET: 'short' }), null, 'a too-short secret locks everyone out');
    for (const junk of ['', 'a.b', 'a.b.c', null, undefined]) assert.equal(await session.verify(junk, env), null);
  });

  await atest('names are unique ignoring case, spaces and full-width letters', async () => {
    assert.equal(account.nameKey('  Kartik  '), 'kartik');
    assert.equal(account.nameKey('ＫＡＲＴＩＫ'), 'kartik');
    assert.equal(account.displayName('Ravi   Kumar'), 'Ravi Kumar');
    for (const bad of ['', 'a', ' ', '😀😀', 'x'.repeat(21), '-kartik', 'kar<b>tik']) assert.ok(account.nameProblem(bad), `${JSON.stringify(bad)} should be refused`);
    for (const ok of ['Kartik', 'Ravi Kumar', 'ラビ', 'k.d_09']) assert.equal(account.nameProblem(ok), null, `${ok} should be allowed`);
  });

  await atest('passwords are hashed with scrypt and checked', async () => {
    const h = await account.hashPassword('correct horse');
    assert.match(h, /^scrypt\$16384\$8\$1\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
    assert.notEqual(h, await account.hashPassword('correct horse'), 'salted: same password, different hash');
    assert.ok(await account.checkPassword('correct horse', h));
    assert.ok(!await account.checkPassword('correct horsf', h));
  });

  await atest('sign up needs the invite code and a free name', async () => {
    assert.equal((await post({ action: 'signup', name: 'Kartik', password: 'password1', invite: 'wrong' })).status, 403);
    assert.equal((await post({ action: 'signup', name: 'Kartik', password: 'password1', invite: '' })).status, 403);
    // Closed sign-up (INVITE_CODE set): the login page is told to show the code field.
    assert.equal((await (await me('')).json()).invite, true);
    assert.equal((await post({ action: 'signup', name: 'K', password: 'password1', invite: 'sakura-2026' })).status, 400, 'name too short');
    assert.equal((await post({ action: 'signup', name: 'Kartik', password: 'short', invite: 'sakura-2026' })).status, 400, 'password too short');
    const ok = await post({ action: 'signup', name: ' Kartik ', password: 'password1', invite: ' sakura-2026 ' });
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { name: 'Kartik' });
    assert.match(ok.headers.get('set-cookie'), /^hanasu_session=[^;]+; Path=\/; Max-Age=7776000; HttpOnly; Secure; SameSite=Lax$/);
    assert.ok(!JSON.stringify([...db.users.values()]).includes('password1'), 'the password itself is never stored');
    for (const same of ['kartik', 'KARTIK', 'ＫＡＲＴＩＫ', '  Kartik'])
      assert.equal((await post({ action: 'signup', name: same, password: 'password2', invite: 'sakura-2026' })).status, 409, `${same} is the same name`);
    assert.ok(await account.checkPassword('password1', db.users.get('kartik').hash), 'a refused sign-up never overwrites the owner');
  });

  await atest('open sign-up when no INVITE_CODE is set (the default)', async () => {
    const open = { SESSION_SECRET: env.SESSION_SECRET };
    const call = (init = {}) => handle(new Request('https://hanasu.test/api/auth', { headers: { 'x-forwarded-for': '5.5.5.5' }, ...init }), open);
    assert.equal((await (await call()).json()).invite, false, 'the login page hides the code field');
    const ok = await call({ method: 'POST', body: JSON.stringify({ action: 'signup', name: 'Ravi', password: 'password1' }) });
    assert.equal(ok.status, 200, 'anyone with the link can create an account');
    const again = await call({ method: 'POST', body: JSON.stringify({ action: 'signup', name: 'RAVI', password: 'password2' }) });
    assert.equal(again.status, 409, 'names stay unique with open sign-up');
  });

  await atest('log in, who-am-I, log out', async () => {
    assert.equal((await post({ action: 'login', name: 'kartik', password: 'nope-nope' })).status, 401);
    const wrongName = await post({ action: 'login', name: 'nobody', password: 'password1' });
    assert.equal(wrongName.status, 401);
    assert.equal((await wrongName.json()).error, 'Name or password is wrong.', 'same message for a wrong name and a wrong password');
    const ok = await post({ action: 'login', name: 'KARTIK', password: 'password1' });
    assert.equal(ok.status, 200);
    const who = await me(cookieOf(ok));
    assert.equal(who.status, 200);
    assert.deepEqual(await who.json(), { name: 'Kartik' });
    assert.equal((await me('')).status, 401);
    const out = await post({ action: 'logout' });
    assert.match(out.headers.get('set-cookie'), /^hanasu_session=; .*Max-Age=0/);
    db.users.delete('kartik');
    assert.equal((await me(cookieOf(ok))).status, 401, 'a deleted account is logged out');
    assert.equal((await post({ action: 'login', name: 'x', password: 'y' }, { origin: 'https://evil.example' })).status, 403, 'other sites cannot post');
  });

  await atest('repeated guessing is blocked', async () => {
    const fresh = memoryStore();
    useStore(fresh);
    let last;
    for (let i = 0; i < 11; i++) last = await post({ action: 'login', name: 'friend', password: 'guess' + i }, { 'x-forwarded-for': '9.9.9.' + i });
    assert.equal(last.status, 429, 'per-name limit');
    for (let i = 0; i < 21; i++) last = await post({ action: 'login', name: 'n' + i, password: 'guess' }, { 'x-forwarded-for': '8.8.8.8' });
    assert.equal(last.status, 429, 'per-address limit');
    useStore(db);
  });

  await atest('middleware lets in only logged-in users and the login page', async () => {
    const { default: mw, PUBLIC } = await import('../middleware.js');
    const saved = process.env.SESSION_SECRET;
    process.env.SESSION_SECRET = env.SESSION_SECRET;
    try {
      const req = (path, headers = {}) => mw(new Request('https://hanasu.test' + path, { headers }));
      const passes = r => r.headers.get('x-middleware-next') === '1';
      for (const p of ['/login.html', '/js/login.js', '/css/app.css', '/sw.js', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/robots.txt', '/api/auth'])
        assert.ok(passes(await req(p)), `${p} must be public`);
      for (const p of ['/', '/index.html', '/js/app.js', '/js/book-u1.js', '/js/login.js.map', '/audio/silence.m4a', '/img/book/food/aburaage.jpg', '/strokes/065e5.json', '/login.html.bak', '/css/app.css/x'])
        assert.ok(!PUBLIC.test(p), `${p} must need a login`);
      const page = await req('/js/book-u1.js?x=1', { accept: 'text/html' });
      assert.equal(page.status, 302);
      assert.equal(page.headers.get('location'), '/login.html?next=%2Fjs%2Fbook-u1.js%3Fx%3D1');
      assert.equal((await req('/', { 'sec-fetch-mode': 'navigate' })).headers.get('location'), '/login.html');
      assert.equal((await req('/js/app.js')).status, 401, 'files get a bare 401, never the login page');
      const cookie = `${session.COOKIE}=${await session.sign('kartik', env)}`;
      assert.ok(passes(await req('/js/book-u1.js', { cookie })), 'a logged-in user gets everything');
      assert.equal((await req('/js/app.js', { cookie: `${session.COOKIE}=forged.token` })).status, 401);
      delete process.env.SESSION_SECRET;
      assert.equal((await req('/js/app.js', { cookie })).status, 401, 'no SESSION_SECRET in Vercel = locked, not open');
    } finally { if (saved === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = saved; }
  });

  test('login page: only safe redirects after logging in', () => {
    const src = read('js/login.js');
    const rule = new RegExp(src.match(/return \/(.+)\/\.test\(next\)/)[1]);
    for (const ok of ['/', '/#book', '/js/x.js?a=1']) assert.ok(rule.test(ok), ok);
    for (const bad of ['//evil.com', '/\\evil.com', 'https://evil.com', 'javascript:alert(1)', '']) assert.ok(!rule.test(bad), bad);
  });

  test('service worker never caches the login wall', () => {
    const sw = read('sw.js');
    assert.match(sw, /url\.pathname === '\/login\.html' \|\| url\.pathname\.startsWith\('\/api\/'\)\) return;/);
    assert.match(sw, /res\.ok && !res\.redirected/);
    // Devices with a copy from before the wall: logged out, the new worker must take over and wipe every cache.
    assert.match(sw, /if \(on === false\) return self\.skipWaiting\(\);/);
    assert.match(sw, /keys\.filter\(k => out \|\|/);
    assert.match(sw, /c\.navigate\('\/login\.html'\)/);
    const vc = JSON.parse(read('vercel.json'));
    const audioCache = vc.headers.find(h => h.source === '/audio/(.*)').headers.find(h => h.key === 'Cache-Control').value;
    assert.match(audioCache, /^private/, 'clips must not sit in shared caches where a logged-out visitor could get them');
  });
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`✓ All checks passed (${UNITS.length} units, ${CARDS.length} phrases, ${PARTICLES.length} particles, ${VERBS.length} verbs, ${KANJI_LIST.length} kanji, ${J.GRAMMAR.length} grammar points, ${V.WORDS.length} words)`);
