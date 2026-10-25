// Stroke order for every N5/N4 kanji and the 46 basic hiragana and katakana. Watch the strokes drawn in order and step through them one at
// a time. Stroke data: KanjiVG (CC BY-SA 3.0), one small file per kanji in
// /strokes, made by scripts/strokes.mjs and loaded only when that kanji is opened.
import { KANJI, ALL_KANJI_GROUPS } from './kanji-data.js';
import { KANA_ROWS, BASIC_HIRA, BASIC_KATA, toKata } from './kana-data.js';
import { toRomaji } from './conjugate.js';
import { icon } from './icons.js';

// Kana as stroke-order entries: the romaji is the meaning line.
const KANA = { hira: BASIC_HIRA, kata: BASIC_KATA };
const scriptOf = ch => BASIC_HIRA.includes(ch) ? 'hira' : BASIC_KATA.includes(ch) ? 'kata' : null;
const kanaRomaji = ch => { const r = toRomaji(ch.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))); return ch === 'を' || ch === 'ヲ' ? 'o (wo)' : r; };
const LEVELS = ['n5', 'n4', 'hira', 'kata'];
const LABEL = { n5: 'N5', n4: 'N4', hira: 'ひらがな', kata: 'カタカナ' };

const SVG = 'http://www.w3.org/2000/svg';
const SAFE_PATH = /^[MmCcSsLlHhVvZz0-9.,\s-]+$/;
const fileFor = ch => `/strokes/${ch.codePointAt(0).toString(16).padStart(5, '0')}.json`;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const cache = new Map();

// Fetches a kanji's strokes; paths are checked so only drawing commands reach the page.
function loadStrokes(ch) {
  if (!cache.has(ch)) cache.set(ch, fetch(fileFor(ch)).then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !Array.isArray(d.p) || !d.p.every(p => typeof p === 'string' && SAFE_PATH.test(p))) return null;
    return { p: d.p, n: Array.isArray(d.n) && d.n.length === d.p.length ? d.n : [] };
  }).catch(() => null));
  return cache.get(ch);
}

export function initStrokes(ctx) {
  const { esc, render, back } = ctx;
  const S = () => ctx.S();
  let level = 'n5';      // chosen level, for this visit only
  let st = null;         // { ch, data, step, numbers, playing, isPlaying }

  // ================= Grid =================
  function grid() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('study')}<h1>Stroke order <span lang="ja">書き順</span></h1></div>
      <div class="intro">Kanji and kana are written in a fixed order: top to bottom, left to right, horizontal before vertical. Pick one to watch it drawn stroke by stroke.${S().settings.hindi ? '<div class="hi intro-hg" lang="hi-Latn">Har kanji aur kana ka likhne ka ek tarika hai. Dekho aur seekho.</div>' : ''}</div>
      <div class="seg">${LEVELS.map(l => `<button class="${l === level ? 'on' : ''}" data-act="stroke-level" data-arg="${l}"${l.length === 4 ? ' lang="ja"' : ''}>${LABEL[l]}</button>`).join('')}</div>
      ${KANA[level] ? `<p class="muted small">${level === 'hira' ? 'Hiragana' : 'Katakana'}: the 46 basic shapes. Voiced sounds (が, ぱ…) are the same shapes with the two dots or the small circle added last, top right.</p>
        <div class="kchart">${KANA_ROWS.map(r => r.split('').map(ch => ch === '・' ? '<span class="kcell empty"></span>'
          : `<button class="kcell" data-act="stroke-open" data-arg="${level === 'kata' ? toKata(ch) : ch}"><b lang="ja">${level === 'kata' ? toKata(ch) : ch}</b><small>${kanaRomaji(ch)}</small></button>`).join('')).join('')}</div>`
      : ALL_KANJI_GROUPS.filter(g => g.level === level).map(g => `
        <h2 class="sec">${esc(g.title)}</h2>
        <div class="kgrid">${g.kanji.map(k => `<button class="ktile" data-act="stroke-open" data-arg="${k[0]}" aria-label="${esc(k[0])}: ${esc(k[3])}">
          <span lang="ja">${k[0]}</span><small>${esc(k[3].split(' /')[0])}</small></button>`).join('')}</div>`).join('')}`);
  }

  // ================= One kanji =================
  async function one(ch) {
    const script = scriptOf(ch);
    const k = script ? { ch, level: script, en: kanaRomaji(ch), kana: true } : KANJI.find(x => x.ch === ch);
    if (!k) return grid();
    ctx.clearSess();
    st = { ch, data: null, step: 0, numbers: true, playing: 0 };
    level = k.level;
    const list = script ? KANA[script].map(c => ({ ch: c })) : KANJI.filter(x => x.level === k.level), i = list.findIndex(x => x.ch === ch);
    render(`
      <div class="head">${back('stroke-tab')}<h1>Stroke order</h1><span class="pill" lang="ja">${k.kana ? LABEL[k.level] : k.level.toUpperCase()}</span></div>
      <div class="card stroke-card">
        <div class="kmean">${esc(k.en)}</div>
        <div class="muted small" lang="ja">${k.kana ? (k.level === 'hira' ? 'ひらがな · hiragana' : 'カタカナ · katakana') : esc([k.on, k.kun].filter(Boolean).join(' · '))}</div>
        <div class="board" id="board" aria-label="Stroke order of ${esc(k.ch)}" role="img">
          <svg viewBox="0 0 109 109" id="strokes" aria-hidden="true"><path class="guide-line" d="M54.5 0V109M0 54.5H109"/></svg>
        </div>
        <div class="stroke-count" id="count" aria-live="polite">Loading…</div>
        <div class="row center stroke-controls">
          <button class="btn icon" data-act="stroke-prev" aria-label="Previous stroke">‹</button>
          <button class="btn primary" data-act="stroke-play" id="play">${icon('start')} Play</button>
          <button class="btn icon" data-act="stroke-next" aria-label="Next stroke">›</button>
        </div>
        <div class="row center">
          <button class="btn small ghost" data-act="stroke-numbers" id="nums">${icon('numbers')} Hide numbers</button>
          ${k.kana ? `<button class="btn small ghost" data-act="say-text" data-arg="${esc(k.ch)}">${icon('play')} Hear it</button>` : `<button class="btn small ghost" data-act="kanji-one" data-arg="${esc(k.ch)}">漢 Kanji page</button>`}
        </div>
      </div>
      <div class="row">
        <button class="btn" data-act="stroke-open" data-arg="${list[i - 1]?.ch || ''}" ${i ? '' : 'disabled'}>‹ ${list[i - 1]?.ch || ''}</button>
        <button class="btn" data-act="stroke-open" data-arg="${list[i + 1]?.ch || ''}" ${list[i + 1] ? '' : 'disabled'}>${list[i + 1]?.ch || ''} ›</button>
      </div>`);
    const s = st;
    const data = await loadStrokes(ch);
    if (st !== s) return;
    if (!data) { document.getElementById('count').textContent = 'Couldn’t load the strokes. Check your connection and try again.'; return; }
    st.data = data;
    build();
    st.step = data.p.length;
    draw();
    play();
  }

  // Each stroke is one <path>; numbers sit beside the stroke's start, as in printed stroke-order charts.
  function build() {
    const svg = document.getElementById('strokes');
    st.data.p.forEach((d, i) => {
      const ghost = document.createElementNS(SVG, 'path'); ghost.setAttribute('d', d); ghost.setAttribute('class', 'ghost'); svg.append(ghost);
    });
    st.paths = st.data.p.map(d => { const p = document.createElementNS(SVG, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'stroke'); svg.append(p); return p; });
    st.nums = st.data.n.map(([x, y], i) => { const t = document.createElementNS(SVG, 'text'); t.setAttribute('x', x); t.setAttribute('y', y); t.setAttribute('class', 'num'); t.textContent = i + 1; svg.append(t); return t; });
  }

  // Strokes before the current step are drawn; the current one is highlighted.
  function draw() {
    const n = st.paths.length;
    st.paths.forEach((p, i) => {
      p.getAnimations?.().forEach(a => a.cancel());
      p.style.strokeDasharray = p.style.strokeDashoffset = '';
      p.classList.toggle('done', i < st.step);
      p.classList.toggle('current', i === st.step - 1 && st.step < n);
    });
    st.nums.forEach((t, i) => { t.classList.toggle('shown', st.numbers && i < st.step); });
    document.getElementById('count').textContent = st.step === 0 ? `${n} strokes` : `Stroke ${st.step} of ${n}`;
  }

  // Draws the strokes in order, one after another, the way a pen would.
  async function play() {
    if (!st?.data) return;
    // Tied to this kanji's state: opening another kanji makes a new st (whose counter starts again at 0),
    // so checking the counter alone let an old animation run on into the new page.
    const s = st, token = ++s.playing;
    const live = () => st === s && s.playing === token;
    st.isPlaying = true;
    const btn = document.getElementById('play');
    btn.innerHTML = icon('pause') + ' Stop';
    if (reduceMotion()) {
      for (let i = 1; i <= s.paths.length; i++) { if (!live()) return; s.step = i; draw(); await wait(500); }
    } else {
      s.step = 0; draw();
      for (let i = 0; i < s.paths.length; i++) {
        if (!live()) return;
        s.step = i + 1; draw();
        const p = s.paths[i], len = p.getTotalLength();
        p.classList.add('current');
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        await p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: Math.max(280, len * 9), easing: 'ease-in-out', fill: 'forwards' }).finished.catch(() => {});
        if (!live()) return;
        p.style.strokeDashoffset = 0;
        await wait(120);
      }
      if (live()) draw();
    }
    if (live()) { s.isPlaying = false; btn.innerHTML = icon('also') + ' Replay'; }
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const stop = () => { if (!st) return; st.playing++; st.isPlaying = false; const b = document.getElementById('play'); if (b) b.innerHTML = icon('start') + ' Play'; };

  function stepBy(d) {
    if (!st?.data) return;
    stop();
    st.step = Math.max(0, Math.min(st.paths.length, st.step + d));
    draw();
  }

  function toggleNumbers() {
    if (!st?.data) return;
    st.numbers = !st.numbers;
    document.getElementById('nums').innerHTML = icon('numbers') + (st.numbers ? ' Hide numbers' : ' Show numbers');
    draw();
  }

  const actions = {
    'stroke-tab': () => ctx.go('write'),
    'stroke-level': l => { level = LEVELS.includes(l) ? l : 'n5'; grid(); },
    'stroke-open': ch => ch && ctx.go('write/' + ch),
    'stroke-play': () => (st?.isPlaying ? (stop(), draw()) : play()),
    'stroke-prev': () => stepBy(-1),
    'stroke-next': () => stepBy(1),
    'stroke-numbers': () => toggleNumbers(),
  };

  function route(h) {
    if (h === 'write') return grid(), true;
    if (h === 'write/hira' || h === 'write/kata') { level = h.slice(6); return grid(), true; }
    if (h.startsWith('write/')) { try { one(decodeURIComponent(h.slice(6))); } catch (_) { grid(); } return true; }
    return false;
  }

  return { actions, route, rerender() { if (!st) return false; one(st.ch); return true; }, clear() { if (st) st.playing++; st = null; } };
}
