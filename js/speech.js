// Japanese text-to-speech and speech recognition via the browser's Web Speech API.

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = (synth?.getVoices() || []).filter(v => /^ja(-|_|$)/i.test(v.lang));
}
if (synth) { loadVoices(); synth.addEventListener?.('voiceschanged', loadVoices); }

export const canSpeak = () => !!synth;
export const jaVoices = () => voices;

// Prefer the user's pick, then natural-sounding voices, then any Japanese voice.
function pickVoice(name) {
  return voices.find(v => v.name === name)
    || voices.find(v => /Google|Kyoko|O-ren|Nanami|Haruka|Otoya/i.test(v.name))
    || voices[0] || null;
}

export function say(text, { rate = 0.9, voice = '', pitch = 1 } = {}) {
  if (!synth) return Promise.resolve();
  synth.cancel();
  return new Promise(resolve => {
    const u = new SpeechSynthesisUtterance(text.replace(/[{}]/g, ''));
    u.lang = 'ja-JP';
    u.rate = rate;
    u.pitch = pitch;
    const v = pickVoice(voice);
    if (v) u.voice = v;
    // Some browsers (notably iOS Safari) occasionally never fire onend; don't let callers hang.
    const fallback = setTimeout(resolve, 1500 + text.length * 250 / rate);
    u.onend = u.onerror = () => { clearTimeout(fallback); resolve(); };
    synth.speak(u);
  });
}

export const stopSpeaking = () => synth?.cancel();

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
