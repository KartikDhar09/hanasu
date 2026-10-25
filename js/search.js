// Search across everything: phrases, words, kanji, grammar points, particles, counters and units.
// Matches Japanese (kanji or kana, hiragana and katakana alike), romaji with or without long-vowel marks,
// English and Hinglish. The index is built the first time the screen opens.
import { CARDS, UNITS } from './data.js';
import { WORDS } from './vocab-data.js';
import { KANJI } from './kanji-data.js';
import { GRAMMAR } from './jlpt-data.js';
import { PARTICLES } from './particles-data.js';
import { COUNTERS } from './counters-data.js';
import { toRomaji } from './conjugate.js';
import { fill, sayable } from './core.js';

const PROFILE = { name: 'スミス', nameRo: 'Sumisu', country: 'インド', countryKana: 'インド', countryRo: 'Indo', countryEn: 'India', countryHi: 'Bharat' };
const toHira = s => s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
// Romaji compared loosely: no spaces or marks, long vowels folded (ō, ou, oo → o).
const foldRo = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')
  .replace(/ou|oo/g, 'o').replace(/uu/g, 'u').replace(/aa/g, 'a').replace(/ii/g, 'i').replace(/ee/g, 'e');
const foldJa = s => toHira(s).replace(/[\s、。！？「」・…〜[\]（）()]/g, '');
const foldEn = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const isJa = q => /[ぁ-ゖァ-ヺ一-龯々]/.test(q);

export const KINDS = [
  ['phrase', 'Phrases'], ['word', 'Words'], ['kanji', 'Kanji'], ['grammar', 'Grammar points'],
  ['particle', 'Particles'], ['counter', 'Counters'], ['unit', 'Units'],
];

let INDEX = null;
// Each entry: kind, title (Japanese), sub (reading), en, hg, ja/ro/text (folded haystacks), go (where it opens), say.
function buildIndex() {
  const out = [];
  const add = (e, ja, ro, text) => out.push({ ...e, ja: ja.map(foldJa).join('|'), ro: ro.map(foldRo).join('|'), text: '|' + text.map(foldEn).join('|') + '|' });
  const unitOf = id => UNITS.find(u => u.id === id);
  for (const c of CARDS) {
    const jp = fill(c.jp, PROFILE), kana = fill(c.kana, PROFILE), u = unitOf(c.unit);
    add({ kind: 'phrase', title: jp, sub: '', en: fill(c.en, PROFILE), hg: fill(c.hi, PROFILE), go: 'unit/' + c.unit, say: jp, where: u?.title },
      [jp, kana, c.casual ? fill(c.casual.jp, PROFILE) : ''], [fill(c.ro, PROFILE)], [fill(c.en, PROFILE), fill(c.hi, PROFILE)]);
  }
  for (const w of WORDS) add({ kind: 'word', title: w.jp, sub: w.kana !== w.jp ? w.kana : '', en: w.en, hg: w.hg, pic: w.pic, go: 'jlpt/vocab/' + w.level, say: sayable(w.jp, w.kana), where: w.level === 'life' ? 'Life & work' : w.level.toUpperCase() },
    [w.jp, w.kana], [w.ro || toRomaji(w.kana)], [w.en, w.hg]);
  for (const k of KANJI) {
    const readings = [k.on, k.kun].filter(Boolean).join('・').replace(/[()]/g, '');
    add({ kind: 'kanji', title: k.ch, sub: readings, en: k.en, hg: k.hg, go: 'kanji/' + k.ch, where: k.level.toUpperCase() },
      [k.ch, ...readings.split('・')], readings.split('・').map(r => toRomaji(toHira(r))), [k.en, k.hg]);
  }
  for (const g of GRAMMAR) add({ kind: 'grammar', title: g.pattern, sub: '', en: g.en, hg: g.hg, go: 'jlpt/g/' + g.id, where: g.level.toUpperCase() },
    [g.pattern], [], [g.en, g.hg, g.id]);
  for (const p of PARTICLES) add({ kind: 'particle', title: p.p, sub: p.ro, en: p.title, hg: p.hg, go: 'particle/' + p.id },
    [p.p], [p.ro], [p.title, p.hg]);
  for (const c of COUNTERS) add({ kind: 'counter', title: c.c, sub: c.kana, en: c.title, hg: c.hg, go: 'counter/' + c.id },
    [c.c, c.kana], [toRomaji(c.kana)], [c.title, c.hg, c.use]);
  for (const u of UNITS) add({ kind: 'unit', title: u.title, sub: u.jp, en: '', hg: u.hi, go: 'unit/' + u.id },
    [u.jp], [], [u.title, u.hi]);
  return out;
}

// Best matches first: exact, then starts-with, then contains; Japanese queries search Japanese only.
export function search(query, limit = 8) {
  INDEX ||= buildIndex();
  const q = query.trim();
  const out = Object.fromEntries(KINDS.map(([k]) => [k, []]));
  if (!q) return out;
  const scored = [];
  if (isJa(q)) {
    const f = foldJa(q);
    for (const e of INDEX) {
      const parts = e.ja.split('|');
      const s = parts.includes(f) ? 3 : parts.some(p => p.startsWith(f)) ? 2 : e.ja.includes(f) ? 1 : 0;
      if (s) scored.push([s, e]);
    }
  } else {
    const r = foldRo(q), en = foldEn(q);
    if (!en) return out;
    for (const e of INDEX) {
      const parts = e.ro ? e.ro.split('|') : [];
      let s = 0;
      if (e.text.includes(`|${en}|`) || (r && parts.includes(r))) s = 4;
      else if (e.text.includes(`|${en} `) || e.text.includes(` ${en}|`) || e.text.includes(` ${en} `)) s = 3;
      else if (r.length > 2 && parts.some(p => p.startsWith(r))) s = 2;
      else if (en.length > 2 && e.text.includes(en)) s = 1;
      else if (r.length > 3 && e.ro.includes(r)) s = 1;
      if (s) scored.push([s, e]);
    }
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].title.length - b[1].title.length);
  for (const [, e] of scored) if (out[e.kind].length < limit) out[e.kind].push(e);
  out.total = scored.length;
  return out;
}

export function initSearch(ctx) {
  const { esc, render, back } = ctx;
  const S = () => ctx.S();
  let q = '';

  function page() {
    ctx.clearSess();
    render(`
      <div class="head">${back()}<h1>Search</h1></div>
      <input class="search" type="search" id="sq" data-input="search-q" placeholder="日本語, romaji, English or Hinglish" aria-label="Search everything" value="${esc(q)}" autocomplete="off" enterkeyhint="search">
      <div id="results" aria-live="polite">${results()}</div>`);
    const el = document.getElementById('sq');
    el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  }

  function results() {
    if (!q.trim()) return `<p class="muted">Search every phrase, word, kanji, grammar point, particle, counter and unit. Try <b>arigatou</b>, <b>食べる</b>, <b>station</b>, <b>pasand</b> or <b>てください</b>.</p>`;
    const r = search(q);
    if (!r.total) return `<p class="muted">Nothing found for “${esc(q)}”.</p>`;
    return KINDS.filter(([k]) => r[k].length).map(([k, label]) => `<h2 class="sec">${label}</h2>
      <ul class="phrases sresults">${r[k].map(e => `<li${e.say ? ` class="ex" data-act="say-text" data-arg="${esc(e.say)}"` : ''}>
        <div class="srow"><div class="sbody">
          <div class="jp" lang="ja">${e.pic ? `${esc(e.pic)} ` : ''}${esc(e.title)}${e.sub && S().settings.kana ? ` <span class="kana-inline">${esc(e.sub)}</span>` : ''}</div>
          ${e.en ? `<div class="en">${esc(e.en)}</div>` : ''}${S().settings.hindi && e.hg ? `<div class="hi" lang="hi-Latn">${esc(e.hg)}</div>` : ''}
          ${e.where ? `<div class="muted small">${esc(e.where)}</div>` : ''}</div>
          <a class="sopen" href="#${esc(e.go)}" aria-label="Open ${esc(e.title)}">›</a></div></li>`).join('')}</ul>`).join('');
  }

  const actions = {
    'search-q': (_, v) => { q = v; document.getElementById('results').innerHTML = results(); },
  };
  function route(h) { if (h === 'search') return page(), true; return false; }
  return { actions, route, rerender() { if (location.hash !== '#search') return false; page(); return true; }, clear() {} };
}
