// Strokes tab: stroke order for every N5/N4 kanji. Watch the strokes drawn in order, step through them one at a
// time, then trace the kanji with a finger. Stroke data: KanjiVG (CC BY-SA 3.0), one small file per kanji in
// /strokes, made by scripts/strokes.mjs and loaded only when that kanji is opened.
import { KANJI, ALL_KANJI_GROUPS } from './kanji-data.js';

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
  let st = null;         // { ch, data, step, numbers, trace, playing }

  // ================= Grid =================
  function grid() {
    ctx.clearSess(); st = null;
    render(`
      <h1 class="page">Stroke order <span lang="ja">書き順</span></h1>
      <div class="intro">Kanji are written in a fixed order: top to bottom, left to right, horizontal before vertical. Pick a kanji to watch it drawn stroke by stroke, then trace it yourself.${S().settings.hindi ? '<div class="hi intro-hg" lang="hi-Latn">Har kanji ka likhne ka ek tarika hai. Dekho, phir khud likho.</div>' : ''}</div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === level ? 'on' : ''}" data-act="stroke-level" data-arg="${l}">${l.toUpperCase()} · ${KANJI.filter(k => k.level === l).length} kanji</button>`).join('')}</div>
      ${ALL_KANJI_GROUPS.filter(g => g.level === level).map(g => `
        <h2 class="sec">${g.icon} ${esc(g.title)}</h2>
        <div class="kgrid">${g.kanji.map(k => `<button class="ktile" data-act="stroke-open" data-arg="${k[0]}" aria-label="${esc(k[0])}: ${esc(k[3])}">
          <span lang="ja">${k[0]}</span><small>${esc(k[3].split(' /')[0])}</small></button>`).join('')}</div>`).join('')}`);
  }

  // ================= One kanji =================
  async function one(ch) {
    const k = KANJI.find(x => x.ch === ch);
    if (!k) return grid();
    ctx.clearSess();
    st = { ch, data: null, step: 0, numbers: true, trace: false, playing: 0 };
    const list = KANJI.filter(x => x.level === k.level), i = list.indexOf(k);
    render(`
      <div class="head">${back('stroke-tab')}<h1>Stroke order</h1><span class="pill">${k.level.toUpperCase()}</span></div>
      <div class="card stroke-card">
        <div class="kmean">${esc(k.en)}</div>
        <div class="muted small" lang="ja">${esc([k.on, k.kun].filter(Boolean).join(' · '))}</div>
        <div class="board" id="board" aria-label="Stroke order of ${esc(k.ch)}" role="img">
          <svg viewBox="0 0 109 109" id="strokes" aria-hidden="true"><path class="guide-line" d="M54.5 0V109M0 54.5H109"/></svg>
          <canvas id="pad" aria-label="Tracing pad" hidden></canvas>
        </div>
        <div class="stroke-count" id="count" aria-live="polite">Loading…</div>
        <div class="row center stroke-controls">
          <button class="btn icon" data-act="stroke-prev" aria-label="Previous stroke">‹</button>
          <button class="btn primary" data-act="stroke-play" id="play">▶ Play</button>
          <button class="btn icon" data-act="stroke-next" aria-label="Next stroke">›</button>
        </div>
        <div class="seg stroke-modes">
          <button class="on" data-act="stroke-mode" data-arg="watch" id="m-watch">👀 Watch</button>
          <button data-act="stroke-mode" data-arg="trace" id="m-trace">✍️ Trace</button>
        </div>
        <div class="row center">
          <button class="btn small ghost" data-act="stroke-numbers" id="nums">🔢 Hide numbers</button>
          <button class="btn small ghost" data-act="stroke-clear" id="clear" hidden>🧽 Clear</button>
          <button class="btn small ghost" data-act="kanji-one" data-arg="${esc(k.ch)}">漢 Kanji page</button>
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
    sizePad();
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
    const token = ++st.playing;
    st.isPlaying = true;
    const btn = document.getElementById('play');
    btn.textContent = '■ Stop';
    if (reduceMotion()) {
      for (let i = 1; i <= st.paths.length; i++) { if (st.playing !== token) return; st.step = i; draw(); await wait(500); }
    } else {
      st.step = 0; draw();
      for (let i = 0; i < st.paths.length; i++) {
        if (st?.playing !== token) return;
        st.step = i + 1; draw();
        const p = st.paths[i], len = p.getTotalLength();
        p.classList.add('current');
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        await p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: Math.max(280, len * 9), easing: 'ease-in-out', fill: 'forwards' }).finished.catch(() => {});
        if (st?.playing !== token) return;
        p.style.strokeDashoffset = 0;
        await wait(120);
      }
      if (st?.playing === token) draw();
    }
    if (st?.playing === token) { st.isPlaying = false; btn.textContent = '↻ Replay'; }
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const stop = () => { if (!st) return; st.playing++; st.isPlaying = false; const b = document.getElementById('play'); if (b) b.textContent = '▶ Play'; };

  function stepBy(d) {
    if (!st?.data) return;
    stop();
    st.step = Math.max(0, Math.min(st.paths.length, st.step + d));
    draw();
  }

  // ================= Tracing =================
  function sizePad() {
    const pad = document.getElementById('pad'), box = document.getElementById('board').getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    pad.width = Math.round(box.width * dpr); pad.height = Math.round(box.height * dpr);
    const g = pad.getContext('2d');
    g.scale(dpr, dpr); g.lineCap = g.lineJoin = 'round'; g.lineWidth = Math.max(5, box.width * 0.045);
    g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#2B2B2B';
    let last = null;
    const at = e => { const r = pad.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    pad.onpointerdown = e => { pad.setPointerCapture(e.pointerId); last = at(e); g.beginPath(); g.arc(last[0], last[1], g.lineWidth / 2, 0, 7); g.fillStyle = g.strokeStyle; g.fill(); };
    pad.onpointermove = e => { if (!last) return; const p = at(e); g.beginPath(); g.moveTo(...last); g.lineTo(...p); g.stroke(); last = p; };
    pad.onpointerup = pad.onpointercancel = () => { last = null; };
  }
  function clearPad() { const pad = document.getElementById('pad'); pad?.getContext('2d').clearRect(0, 0, pad.width, pad.height); }

  function mode(m) {
    if (!st?.data) return;
    st.trace = m === 'trace';
    stop();
    document.getElementById('m-watch').classList.toggle('on', !st.trace);
    document.getElementById('m-trace').classList.toggle('on', st.trace);
    document.getElementById('pad').hidden = !st.trace;
    document.getElementById('clear').hidden = !st.trace;
    document.getElementById('board').classList.toggle('tracing', st.trace);
    // Tracing starts from a faint outline with numbers; watching shows the finished kanji.
    st.step = st.trace ? 0 : st.paths.length;
    draw();
    if (st.trace) { sizePad(); document.getElementById('count').textContent = `Trace the ${st.paths.length} strokes in order. Use › to see the next one.`; }
  }

  function toggleNumbers() {
    if (!st?.data) return;
    st.numbers = !st.numbers;
    document.getElementById('nums').textContent = st.numbers ? '🔢 Hide numbers' : '🔢 Show numbers';
    draw();
  }

  const actions = {
    'stroke-tab': () => ctx.go('write'),
    'stroke-level': l => { level = l === 'n4' ? 'n4' : 'n5'; grid(); },
    'stroke-open': ch => ch && ctx.go('write/' + ch),
    'stroke-play': () => (st?.isPlaying ? (stop(), draw()) : play()),
    'stroke-prev': () => stepBy(-1),
    'stroke-next': () => stepBy(1),
    'stroke-mode': m => mode(m),
    'stroke-numbers': () => toggleNumbers(),
    'stroke-clear': () => clearPad(),
  };

  function route(h) {
    if (h === 'write') return grid(), true;
    if (h.startsWith('write/')) { try { one(decodeURIComponent(h.slice(6))); } catch (_) { grid(); } return true; }
    return false;
  }

  return { actions, route, rerender() { if (!st) return false; one(st.ch); return true; }, clear() { if (st) st.playing++; st = null; } };
}
