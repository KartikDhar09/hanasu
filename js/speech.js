// Japanese text-to-speech and speech recognition via the browser's Web Speech API.

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = (synth?.getVoices() || []).filter(v => /^ja(-|_|$)/i.test(v.lang));
}
if (synth) { loadVoices(); synth.addEventListener?.('voiceschanged', loadVoices); }

export const canSpeak = () => !!synth;
export const jaVoices = () => voices;

// Best voice first: neural/natural voices, then Apple's enhanced/premium, then Google, then the common built-ins.
const QUALITY = [/Natural|Neural|Online/i, /Premium|Enhanced|拡張|プレミアム/i, /Google/i, /O-ren|Kyoko|Nanami|Hattori|Otoya|Haruka|Ayumi|Ichiro/i];
const score = v => QUALITY.reduce((n, re, i) => n + (re.test(v.name) ? 10 - i : 0), 0) + (v.lang === 'ja-JP' ? 1 : 0);
export const rankedVoices = () => [...voices].sort((a, b) => score(b) - score(a));

function pickVoice(name) {
  return voices.find(v => v.name === name) || rankedVoices()[0] || null;
}

const wait = ms => new Promise(r => setTimeout(r, ms));
let current = null;   // keep a reference: Chrome can garbage-collect a playing utterance and cut it off
let lastEnd = 0;      // when audio last stopped; after a pause the output goes to sleep
let seq = 0;          // each say() call; a newer call cancels older pending ones

// The first phrase can arrive before the voice list has loaded.
function voicesReady() {
  if (voices.length || !synth?.addEventListener) return Promise.resolve();
  return new Promise(r => {
    const done = () => { loadVoices(); r(); };
    const t = setTimeout(done, 1000);
    synth.addEventListener('voiceschanged', () => { clearTimeout(t); done(); }, { once: true });
  });
}

// Speaks one utterance and resolves when it ends (or when it should have ended).
function utter(text, { rate, pitch, voice, volume = 1 }) {
  return new Promise(resolve => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = rate; u.pitch = pitch; u.volume = volume;
    if (voice) u.voice = voice;
    current = u;
    // Some browsers (notably iOS Safari) occasionally never fire onend; don't let callers hang.
    const fallback = setTimeout(finish, 2000 + text.length * 300 / rate);
    function finish() { clearTimeout(fallback); if (current === u) current = null; lastEnd = Date.now(); resolve(); }
    u.onend = u.onerror = finish;
    synth.speak(u);
  });
}

// A silent sound that wakes the audio output, so the real phrase isn't clipped at the start.
let warming = null;
const warmUp = () => warming || (warming = utter('。', { rate: 2, pitch: 1, volume: 0 }).finally(() => { warming = null; }));

export async function say(text, { rate = 0.9, voice = '', pitch = 1 } = {}) {
  if (!synth) return;
  const id = ++seq;
  // Let a warm-up finish (it's tiny) instead of cutting it off; otherwise stop whatever is playing.
  if (warming) await warming;
  const wasBusy = synth.speaking || synth.pending;
  synth.cancel();
  if (synth.paused) synth.resume();
  await voicesReady();
  // Speaking straight after cancel() clips the first syllables in Chrome and Safari; give the engine a moment.
  if (wasBusy) await wait(180);
  if (id !== seq) return;
  if (Date.now() - lastEnd > 4000) { await warmUp(); if (id !== seq) return; }
  await utter(text.replace(/[{}]/g, ''), { rate, pitch, voice: pickVoice(voice) });
}

// iOS only allows speech after a user gesture: unlock and warm up on the first tap.
if (synth && typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { if (!synth.speaking) warmUp(); }, { once: true, capture: true });
}

export const stopSpeaking = () => { seq++; synth?.cancel(); };

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = () => !!Recognition;

let active = null;
// Resolves with a list of things the recogniser thinks it heard (best first).
export function listen() {
  if (!Recognition) return Promise.reject(new Error('unsupported'));
  active?.abort();
  stopSpeaking();
  return new Promise((resolve, reject) => {
    const r = new Recognition();
    active = r;
    r.lang = 'ja-JP';
    r.interimResults = false;
    r.maxAlternatives = 5;
    let heard = [];
    r.onresult = e => { heard = Array.from(e.results[0]).map(a => a.transcript); };
    r.onerror = e => { active = null; reject(new Error(e.error)); };
    r.onend = () => { active = null; resolve(heard); };
    r.start();
  });
}

export const stopListening = () => active?.stop();
