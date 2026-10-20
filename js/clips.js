// Recorded voice clips: natural VOICEVOX audio for the app's own lines, made by scripts/make-audio.mjs.
// A line without a clip (sentence-builder combinations, a typed name) is spoken by the browser voice instead.

// Clip file for a line: /audio/<voice>/<8-hex FNV-1a hash of the text>.m4a. Voices: n = narrator, m = man, f = woman.
export function clipPath(text, who = 'n') {
  let h = 0x811c9dc5;
  for (const ch of normalizeLine(text)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return `/audio/${who}/${h.toString(16).padStart(8, '0')}.m4a`;
}
export const normalizeLine = text => String(text).replace(/[{}[\]]/g, '').trim();

let player = null;          // one shared <audio>: iOS lets it play later once it has played inside a tap
let playing = null;         // { resolve } for the clip in progress
const urls = new Map();     // clip path → Promise<object URL | null>, oldest first; capped so memory stays small
const MAX_URLS = 200;
// Clips start with 0.4 s of silence (scripts/make-audio.mjs LEAD) because an output that has gone idle (Bluetooth
// headphones, phone speakers) fades in and swallowed the first word. While audio is still awake from a clip that
// just ended, most of that silence is skipped so back-to-back lines don't lag.
const LEAD_SKIP = 0.3;
const AWAKE_MS = 1500;
let lastEnd = 0;

function ensurePlayer() {
  if (player || typeof Audio === 'undefined') return player;
  player = new Audio();
  player.preload = 'auto';
  if ('preservesPitch' in player) player.preservesPitch = true;
  return player;
}

// Unlocks audio on the first tap (plays a silent clip), so clips can start after an await later.
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => {
    const p = ensurePlayer();
    if (!p) return;
    p.src = '/audio/silence.m4a';
    p.play().catch(() => {});
  }, { once: true, capture: true });
}

// Fetches the whole clip once (no range requests, so the service worker can cache it for offline use).
// A tap and a prefetch for the same clip share one download.
function clipUrl(path) {
  if (urls.has(path)) { const p = urls.get(path); urls.delete(path); urls.set(path, p); return p; }
  const p = (async () => {
    try {
      const res = await fetch(path, { cache: 'no-cache' }); // revalidate: a re-recorded clip keeps its name
      if (res.ok && (res.headers.get('content-type') || '').startsWith('audio/')) return URL.createObjectURL(await res.blob());
    } catch (_) { /* offline and not cached: fall back to the browser voice */ }
    return null;
  })();
  urls.set(path, p);
  if (urls.size > MAX_URLS) {
    const [oldest, old] = urls.entries().next().value;
    urls.delete(oldest);
    old.then(u => { if (u && player?.src !== u) URL.revokeObjectURL(u); });
  }
  return p;
}

// Data Saver or a 2G connection: only load clips when they're actually played.
export const constrained = () => { const c = typeof navigator !== 'undefined' && navigator.connection; return !!c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')); };

// Background loading, at most two clips at a time; taps never wait behind this queue.
const queue = [];
let active = 0;
function pump() {
  while (active < 2 && queue.length) {
    const path = queue.shift();
    active++;
    clipUrl(path).finally(() => { active--; pump(); });
  }
}

// Starts loading a clip so it plays instantly when needed (the next card, the lines of a conversation).
export function prefetchClip(text, who = 'n') {
  if (!text || constrained()) return;
  const path = clipPath(text, who);
  if (!urls.has(path) && !queue.includes(path)) { queue.push(path); pump(); }
}

// Loads clips for speakable elements that stay on screen for a moment (not ones scrolled past quickly).
// textFor(el) returns the line an element would say, or '' if none. Call watch() again after each render.
export function watchVisible(textFor, { dwell = 250, perScreen = 40 } = {}) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const timers = new Map();
  let count = 0;
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) timers.set(e.target, setTimeout(() => {
        timers.delete(e.target); io.unobserve(e.target);
        // textFor gives the line, or [line, voice] when it isn't the main voice.
        const t = textFor(e.target);
        if (count++ < perScreen) Array.isArray(t) ? prefetchClip(t[0], t[1]) : prefetchClip(t);
      }, dwell));
      else { clearTimeout(timers.get(e.target)); timers.delete(e.target); }
    }
  }, { rootMargin: '120px 0px' });
  const seen = new WeakSet();
  return function watch(root, { newScreen = false } = {}) {
    if (newScreen) { count = 0; queue.length = 0; io.disconnect(); timers.forEach(clearTimeout); timers.clear(); }
    for (const el of root.querySelectorAll('[data-act^="say"], [data-act="play"], [data-say]')) if (!seen.has(el)) { seen.add(el); io.observe(el); }
  };
}

export function stopClip() {
  if (player && !player.paused) { player.pause(); lastEnd = Date.now(); }
  if (playing) { playing.resolve(); playing = null; }
}

// Plays the clip for a line. Resolves true when it finished (or was stopped), false if there is no clip.
// isCurrent() lets the caller drop a clip that arrives after the learner has moved on.
export async function playClip(text, { who = 'n', rate = 1, isCurrent = () => true } = {}) {
  const url = await clipUrl(clipPath(text, who));
  if (!url) return false;
  if (!isCurrent()) return true;
  const p = ensurePlayer();
  if (!p) return false;
  stopClip();
  return new Promise(resolve => {
    playing = { resolve: () => resolve(true) };
    const done = () => { lastEnd = Date.now(); p.onended = p.onerror = null; if (playing) { playing = null; resolve(true); } };
    p.onended = done;
    p.onerror = () => { p.onended = p.onerror = null; playing = null; resolve(false); };
    const awake = Date.now() - lastEnd < AWAKE_MS;
    p.src = url;
    if (awake) p.currentTime = LEAD_SKIP;
    p.playbackRate = rate;
    p.play().catch(() => { p.onended = p.onerror = null; playing = null; resolve(false); });
  });
}
