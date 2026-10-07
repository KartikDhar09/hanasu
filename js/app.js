import { TRACKS, UNITS, CARDS, COUNTRIES } from './data.js';
import { fill, matchScore, PASS } from './core.js';
import { say, canSpeak, canListen, listen, stopListening, stopSpeaking, rankedVoices } from './speech.js';

// ---------- State ----------
// Nothing about the learner is stored: no name, progress, streak or scores.
// Only display settings are saved, so the app looks the same next time.
const KEY = 'hanasu-v1';
const DEFAULTS = { settings: { romaji: true, kana: true, hindi: true, casual: true, rate: 0.9, voice: '' } };
let S = load();

function load() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (_) { /* unreadable: start fresh */ }
  const state = sanitize({ settings: { ...DEFAULTS.settings, ...(saved && saved.settings) } });
  // Older versions stored progress and a profile; keep only the settings and drop the rest.
  if (saved && Object.keys(saved).some(k => k !== 'settings')) save(state);
  return state;
}
// Saved values that end up in page markup are forced back to known-safe shapes.
function sanitize(s) {
  const num = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
  s.settings.rate = num(s.settings.rate, 0.5, 1.5, DEFAULTS.settings.rate);
  s.settings.voice = typeof s.settings.voice === 'string' ? s.settings.voice : '';
  for (const k of ['romaji', 'kana', 'hindi', 'casual']) s.settings[k] = s.settings[k] !== false;
  return s;
}

function save(state = S) {
  try { localStorage.setItem(KEY, JSON.stringify({ settings: state.settings })); } catch (_) { /* private mode: settings just won't persist */ }
}

// Lessons use an example person (スミス from India) wherever a name or country appears.
const EXAMPLE = COUNTRIES[0];
const profile = () => ({
  name: 'スミス', nameRo: 'Sumisu',
  country: EXAMPLE[0], countryKana: EXAMPLE[1], countryRo: EXAMPLE[2], countryEn: EXAMPLE[3], countryHi: EXAMPLE[4],
});
const view = c => {
  const p = profile();
  const casual = c.casual && { jp: fill(c.casual.jp, p), kana: fill(c.casual.kana, p), ro: fill(c.casual.ro, p) };
  return { ...c, jp: fill(c.jp, p), kana: fill(c.kana, p), ro: fill(c.ro, p), en: fill(c.en, p), hi: fill(c.hi, p), note: fill(c.note || '', p), casual };
};
const lineView = l => view({ who: l[0], jp: l[1], kana: l[2], ro: l[3], en: l[4], hi: l[5] });
const unitById = id => UNITS.find(u => u.id === id);
const cardsOf = id => CARDS.filter(c => c.unit === id);
const cardById = id => CARDS.find(c => c.id === id);
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const speak = (text, slow) => say(text, { rate: slow ? Math.min(0.65, S.settings.rate) : S.settings.rate, voice: S.settings.voice });

// ---------- Rendering helpers ----------
const $app = document.getElementById('app');
let sess = null; // active study session

function render(html) {
  $app.innerHTML = html;
  window.scrollTo(0, 0);
}

// Japanese block: kanji line, kana reading, romaji — per settings.
function jpBlock(c, cls = '') {
  return `<div class="jpblock ${cls}">
    <div class="jp" lang="ja">${esc(c.jp)}</div>
    ${S.settings.kana && c.kana !== c.jp ? `<div class="kana" lang="ja">${esc(c.kana)}</div>` : ''}
    ${S.settings.romaji ? `<div class="ro">${esc(c.ro)}</div>` : ''}
  </div>`;
}

// Meaning in English, with Hinglish underneath when enabled.
function meaning(c, cls = 'en') {
  return `<div class="${cls}">${esc(c.en)}</div>${S.settings.hindi && c.hi ? `<div class="hi" lang="hi-Latn">${esc(c.hi)}</div>` : ''}`;
}

// How you'd say it to friends or close coworkers.
function casualBlock(c) {
  if (!c.casual || !S.settings.casual) return '';
  return `<button class="casual" data-act="say-casual" data-arg="${c.id}">
    <span class="tag-mini">😎 Casual · doston se</span>
    <span lang="ja">${esc(c.casual.jp)}</span>${S.settings.romaji ? ` <small>${esc(c.casual.ro)}</small>` : ''}
  </button>`;
}

const note = c => c.note ? `<div class="note">💡 ${esc(c.note)}</div>` : '';

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400);
}

const back = (act = 'home', arg = '') => `<button class="back" data-act="${act}" data-arg="${arg}" aria-label="Back">‹</button>`;
const bar = (n, d) => `<div class="bar"><i style="width:${d ? Math.round(100 * n / d) : 0}%"></i></div>`;

// ---------- Home ----------
function home() {
  sess = null; stopSpeaking();
  render(`
    <section class="hero">
      <div class="hero-text"><b>Speak Japanese for real life and work.</b><span class="muted">${CARDS.length} phrases in ${UNITS.length} units, each with flashcards, speaking practice, a quiz and a role-play.</span></div>
      <button class="btn primary big" data-act="learn" data-arg="${UNITS[0].id}">Start: ${esc(UNITS[0].title)}</button>
      <div class="quick">
        <a href="#speak" class="qlink"><span>🎤</span>Speak practice</a>
        <a href="#jlpt" class="qlink"><span>🎓</span>JLPT course</a>
      </div>
    </section>
    ${TRACKS.map(t => `
      <h2 class="track"><span lang="ja">${t.jp}</span> ${t.title}</h2>
      <p class="muted">${t.desc}${S.settings.hindi ? ` · <span lang="hi-Latn">${t.hi}</span>` : ''}</p>
      <div class="units">
        ${UNITS.filter(u => u.track === t.id).map(u => `<button class="unit" data-act="unit" data-arg="${u.id}">
            <span class="icon">${u.icon}</span>
            <span class="ut"><b>${esc(u.title)}</b><small><span lang="ja">${u.jp}</span>${S.settings.hindi ? ` · <span lang="hi-Latn">${u.hi}</span>` : ''}</small></span>
            <span class="count">${cardsOf(u.id).length}</span>
          </button>`).join('')}
      </div>`).join('')}
  `);
}

// ---------- Unit ----------
function unit(id) {
  sess = null; stopSpeaking();
  const u = unitById(id);
  const cs = cardsOf(id).map(view);
  render(`
    <div class="head">${back()}<h1>${u.icon} ${esc(u.title)}</h1></div>
    <p class="muted sub"><span lang="ja">${u.jp}</span>${S.settings.hindi ? ` · <span lang="hi-Latn">${u.hi}</span>` : ''}</p>
    <div class="modes compact">
      <button class="mode" data-act="learn" data-arg="${id}"><span>🃏</span><b>Learn</b><small>Flashcards · seekho</small></button>
      <button class="mode" data-act="speak" data-arg="${id}"><span>🎤</span><b>Speak</b><small>Say it, get checked · bolo</small></button>
      <button class="mode" data-act="quiz" data-arg="${id}"><span>✅</span><b>Quiz</b><small>Listen &amp; choose · quiz</small></button>
      <button class="mode" data-act="talk" data-arg="${id}"><span>💬</span><b>Role-play</b><small>Real conversation · baatcheet</small></button>
    </div>
    <h3>Phrases <small class="muted">tap to hear</small></h3>
    <ul class="phrases">
      ${cs.map(c => `<li data-act="play" data-arg="${c.id}">
        ${jpBlock(c)}
        ${meaning(c)}
        ${casualBlock(c)}
        ${note(c)}
      </li>`).join('')}
    </ul>
  `);
}

// ---------- Learn (flashcards) ----------
// Phrases come in groups of four: first heard and repeated, then tested English → Japanese.
// Nothing is saved; “Again” just brings a phrase back later in the same session.
function learn(unitId) {
  const cards = cardsOf(unitId);
  const queue = [];
  for (let i = 0; i < cards.length; i += 4) {
    const batch = cards.slice(i, i + 4);
    queue.push(...batch.map(c => ({ c, intro: true })), ...shuffle(batch).map(c => ({ c, intro: false })));
  }
  sess = { kind: 'learn', unitId, queue, i: 0, done: 0 };
  learnCard();
}

function learnCard() {
  const s = sess;
  if (s.i >= s.queue.length) return finish(`${s.done} phrase${s.done === 1 ? '' : 's'} practised`, s.unitId);
  const { c: raw, intro } = s.queue[s.i];
  const c = view(raw);
  s.revealed = intro;
  const total = s.queue.length;
  render(`
    <div class="head">${back('unit', s.unitId)}<div class="grow">${bar(s.i, total)}</div><span class="muted">${s.i + 1}/${total}</span></div>
    <div class="card ${intro ? 'intro' : ''}">
      ${intro ? '<span class="tag">New phrase</span>' : '<span class="tag alt">Say it in Japanese</span>'}
      <div class="prompt">${esc(c.en)}</div>
      ${S.settings.hindi ? `<div class="prompt-hi" lang="hi-Latn">${esc(c.hi)}</div>` : ''}
      <div id="answer" ${intro ? '' : 'hidden'}>
        ${jpBlock(c, 'big')}
        <div class="row center">
          <button class="btn icon" data-act="say" data-arg="${raw.id}">🔊</button>
          <button class="btn icon" data-act="sayslow" data-arg="${raw.id}">🐢</button>
        </div>
        ${casualBlock(c)}
        ${note(c)}
      </div>
    </div>
    <div class="actions" id="actions">
      ${intro
        ? `<p class="muted center">Listen, then say it out loud twice.</p><button class="btn primary big" data-act="next-intro">Got it</button>`
        : `<button class="btn primary big" data-act="reveal">Show answer</button>`}
    </div>
  `);
  if (intro) speak(c.jp);
}

function reveal() {
  const s = sess;
  if (!s || s.revealed) return;
  s.revealed = true;
  const { c } = s.queue[s.i];
  document.getElementById('answer').hidden = false;
  document.getElementById('actions').innerHTML = `<p class="muted center">Did you remember it?</p>
       <div class="grades two">
         <button class="btn again" data-act="grade" data-arg="again">Again later</button>
         <button class="btn good" data-act="grade" data-arg="ok">Got it</button>
       </div>`;
  speak(view(c).jp);
}

function gradeCard(g) {
  const s = sess;
  const { c } = s.queue[s.i];
  if (g === 'again') s.queue.push({ c, intro: false }); // see it again later this session
  else s.done++;
  s.i++; learnCard();
}

// ---------- Speak (pronunciation check) ----------
// cards/backAct let the Speak tab reuse this drill with any set of phrases.
function speakMode(unitId, i = 0, cards = null, backAct = 'unit') {
  sess = { kind: 'speak', unitId, cards: cards || cardsOf(unitId), i, backAct };
  speakCard();
}

function speakCard() {
  const s = sess;
  const raw = s.cards[s.i];
  const c = view(raw);
  render(`
    <div class="head">${back(s.backAct, s.unitId || '')}<div class="grow">${bar(s.i, s.cards.length)}</div><span class="muted">${s.i + 1}/${s.cards.length}</span></div>
    <div class="card">
      <span class="tag alt">Listen, then say it</span>
      <div class="prompt small">${esc(c.en)}</div>
      ${S.settings.hindi ? `<div class="prompt-hi" lang="hi-Latn">${esc(c.hi)}</div>` : ''}
      ${jpBlock(c, 'big')}
      <div class="row center">
        <button class="btn icon" data-act="say" data-arg="${raw.id}">🔊</button>
        <button class="btn icon" data-act="sayslow" data-arg="${raw.id}">🐢</button>
      </div>
      ${casualBlock(c)}
      <div id="result" class="result"></div>
    </div>
    <div class="actions">
      ${canListen()
        ? `<button class="btn mic big" id="mic" data-act="mic">🎤 Tap and speak</button>`
        : `<p class="muted center">Your browser can’t check speech. Say it aloud, then tap 🔊 to compare.</p>`}
      <div class="row">
        <button class="btn" data-act="speak-move" data-arg="-1" ${s.i ? '' : 'disabled'}>‹ Prev</button>
        <button class="btn" data-act="speak-move" data-arg="1">${s.i + 1 < s.cards.length ? 'Next ›' : 'Finish'}</button>
      </div>
    </div>
  `);
  speak(c.jp);
}

// Records speech and scores it against the target line. Returns the score or null.
// c.alts: extra acceptable sayings as [jp, kana] pairs.
async function recordAgainst(c, resultEl, micEl) {
  const act = micEl?.dataset.act; // restored afterwards, so each screen keeps its own mic handler
  if (micEl) { micEl.classList.add('on'); micEl.textContent = '● Listening… tap to stop'; micEl.dataset.act = 'mic-stop'; }
  try {
    const heard = await listen();
    if (!heard.length) { resultEl.innerHTML = `<span class="muted">Didn’t catch that. Try again, a little louder.</span>`; return null; }
    const score = matchScore(heard, c.jp, c.kana, [...(c.casual ? [c.casual.jp, c.casual.kana] : []), ...(c.alts || []).flat()]);
    const ok = score >= PASS;
    resultEl.innerHTML = `
      <div class="score ${ok ? 'ok' : 'retry'}">${ok ? '🎉 Great!' : '🔁 Almost'} <b>${Math.round(score * 100)}%</b></div>
      <div class="heard">Heard: <span lang="ja">${esc(heard[0])}</span></div>`;
    return score;
  } catch (e) {
    resultEl.innerHTML = `<span class="muted">${e.message === 'not-allowed' || e.message === 'service-not-allowed'
      ? 'Microphone blocked. Allow mic access for this site in your browser settings.'
      : 'Couldn’t listen (' + esc(e.message) + '). Try again.'}</span>`;
    return null;
  } finally {
    if (micEl) { micEl.classList.remove('on'); micEl.textContent = '🎤 Try again'; micEl.dataset.act = act; }
  }
}

async function micSpeak() {
  const raw = sess.cards[sess.i];
  await recordAgainst(view(raw), document.getElementById('result'), document.getElementById('mic'));
}

// ---------- Quiz ----------
function quiz(unitId) {
  const cards = cardsOf(unitId);
  const qs = shuffle(cards).slice(0, 8).map((c, i) => {
    const type = i % 2 ? 'audio' : 'en2jp';
    const options = shuffle([c, ...shuffle(cards.filter(o => o.id !== c.id)).slice(0, 3)]);
    return { c, type, options };
  });
  sess = { kind: 'quiz', unitId, qs, i: 0, right: 0, answered: false };
  quizQ();
}

function quizQ() {
  const s = sess;
  if (s.i >= s.qs.length) {
    return finish(`Quiz score: ${s.right}/${s.qs.length}`, s.unitId, s.right === s.qs.length ? 'Perfect! 🎯' : '');
  }
  const q = s.qs[s.i];
  const c = view(q.c);
  s.answered = false;
  render(`
    <div class="head">${back('unit', s.unitId)}<div class="grow">${bar(s.i, s.qs.length)}</div><span class="muted">${s.right} ✓</span></div>
    <div class="card">
      ${q.type === 'audio'
        ? `<span class="tag alt">What does this mean?</span>
           <button class="btn listen" data-act="say" data-arg="${q.c.id}">🔊 Play again</button>
           <button class="btn ghost small" data-act="sayslow" data-arg="${q.c.id}">🐢 Slow</button>`
        : `<span class="tag alt">How do you say…</span><div class="prompt">${esc(c.en)}</div>${S.settings.hindi ? `<div class="prompt-hi" lang="hi-Latn">${esc(c.hi)}</div>` : ''}`}
    </div>
    <div class="choices">
      ${q.options.map(o => {
        const v = view(o);
        return `<button class="choice" data-act="answer" data-arg="${o.id}">${q.type === 'audio'
          ? `${esc(v.en)}${S.settings.hindi ? `<small lang="hi-Latn">${esc(v.hi)}</small>` : ''}` : `<span lang="ja">${esc(v.jp)}</span>${S.settings.romaji ? `<small>${esc(v.ro)}</small>` : ''}`}</button>`;
      }).join('')}
    </div>
    <div class="actions" id="actions"></div>
  `);
  if (q.type === 'audio') speak(c.jp);
}

function answer(id) {
  const s = sess;
  if (s.answered) return;
  s.answered = true;
  const q = s.qs[s.i];
  const ok = id === q.c.id;
  if (ok) s.right++;
  document.querySelectorAll('.choice').forEach(b => {
    b.disabled = true;
    if (b.dataset.arg === q.c.id) b.classList.add('right');
    else if (b.dataset.arg === id) b.classList.add('wrong');
  });
  const c = view(q.c);
  document.getElementById('actions').innerHTML = `
    ${ok ? '' : `<div class="card compact">${jpBlock(c)}${meaning(c)}</div>`}
    <button class="btn primary big" data-act="quiz-next">${s.i + 1 < s.qs.length ? 'Next' : 'See score'}</button>`;
  speak(c.jp);
}

// ---------- Role-play ----------
function talk(unitId) {
  const u = unitById(unitId);
  sess = { kind: 'talk', unitId, lines: u.dialogue.map(lineView), i: 0, log: [] };
  render(`
    <div class="head">${back('unit', unitId)}<h1>💬 Role-play</h1></div>
    <p class="muted">You play the lines on the right. The app speaks the other part. Tap any bubble to hear it again.</p>
    <div class="chat" id="chat"></div>
    <div class="actions" id="actions"></div>
  `);
  talkStep();
}

function bubble(l, scoreHtml = '') {
  const chat = document.getElementById('chat');
  const div = document.createElement('div');
  div.className = `bubble ${l.who}`;
  div.innerHTML = `${jpBlock(l)}${meaning(l)}${scoreHtml}`;
  div.addEventListener('click', () => speak(l.jp));
  chat.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

async function talkStep() {
  const s = sess;
  const actions = document.getElementById('actions');
  while (sess === s && s.i < s.lines.length && s.lines[s.i].who === 'them') {
    const l = s.lines[s.i++];
    bubble(l);
    actions.innerHTML = '';
    await speak(l.jp);
    await new Promise(r => setTimeout(r, 300));
  }
  if (sess !== s) return;
  if (s.i >= s.lines.length) {
    actions.innerHTML = `
      <p class="center">🎉 Conversation complete!</p>
      <div class="row"><button class="btn" data-act="talk" data-arg="${s.unitId}">Again</button>
      <button class="btn primary" data-act="unit" data-arg="${s.unitId}">Done</button></div>`;
    return;
  }
  const l = s.lines[s.i];
  actions.innerHTML = `
    <div class="yourturn">
      <span class="tag alt">Your turn — say:</span>
      <div class="prompt small">${esc(l.en)}</div>
      ${S.settings.hindi ? `<div class="prompt-hi" lang="hi-Latn">${esc(l.hi)}</div>` : ''}
      <div id="hint" class="hint" hidden>${jpBlock(l)}</div>
      <div id="result" class="result"></div>
    </div>
    ${canListen() ? `<button class="btn mic big" id="mic" data-act="talk-mic">🎤 Speak</button>` : ''}
    <div class="row">
      <button class="btn" data-act="hint">💡 Hint</button>
      <button class="btn" data-act="talk-skip">${canListen() ? 'Skip' : 'Show line'} ›</button>
    </div>`;
}

async function talkMic() {
  const s = sess;
  const l = s.lines[s.i];
  const result = document.getElementById('result');
  const score = await recordAgainst(l, result, document.getElementById('mic'));
  if (score == null || sess !== s) return;
  if (score >= PASS) talkAdvance(`<div class="score ok">✓ ${Math.round(score * 100)}%</div>`);
  else document.getElementById('hint').hidden = false;
}

async function talkAdvance(scoreHtml = '') {
  const s = sess;
  const l = s.lines[s.i++];
  bubble(l, scoreHtml);
  document.getElementById('actions').innerHTML = '';
  await speak(l.jp);
  if (sess === s) talkStep();
}

// ---------- Finish screen ----------
function finish(title, unitId, extra = '', backAct = 'home') {
  sess = null;
  render(`
    <div class="done">
      <div class="big-emoji">🌸</div>
      <h1>${esc(title)}</h1>
      ${extra ? `<p>${extra}</p>` : ''}
      <p class="muted">よくできました！ Bahut badhiya!</p>
      ${unitId ? `
        <div class="modes">
          <button class="mode" data-act="speak" data-arg="${unitId}"><span>🎤</span><b>Speak</b></button>
          <button class="mode" data-act="quiz" data-arg="${unitId}"><span>✅</span><b>Quiz</b></button>
          <button class="mode" data-act="talk" data-arg="${unitId}"><span>💬</span><b>Role-play</b></button>
          <button class="mode" data-act="home"><span>🏠</span><b>Home</b></button>
        </div>` : `<button class="btn primary big" data-act="${backAct}">Back</button>`}
    </div>
  `);
}

// ---------- Settings ----------
function openSettings() {
  const sheet = document.getElementById('sheet');
  const voices = rankedVoices();
  sheet.innerHTML = `
    <div class="panel" role="dialog" aria-modal="true" aria-label="Settings">
      <h2>Settings</h2>
      <p class="muted small">Only these display settings are saved on this device. Nothing about you or your progress is stored.</p>
      <label class="check"><input type="checkbox" id="s-romaji" ${S.settings.romaji ? 'checked' : ''}> Show romaji</label>
      <label class="check"><input type="checkbox" id="s-kana" ${S.settings.kana ? 'checked' : ''}> Show kana reading under kanji</label>
      <label class="check"><input type="checkbox" id="s-hindi" ${S.settings.hindi ? 'checked' : ''}> Show Hinglish meanings · Hindi mein matlab</label>
      <label class="check"><input type="checkbox" id="s-casual" ${S.settings.casual ? 'checked' : ''}> Show casual versions (with friends)</label>
      <label>Voice speed <span class="muted" id="s-rate-val">${S.settings.rate}×</span>
        <input type="range" id="s-rate" min="0.6" max="1.2" step="0.05" value="${S.settings.rate}" data-input="rate-label"></label>
      ${voices.length ? `<label>Voice <select id="s-voice"><option value="">Auto (best: ${esc(voices[0].name)})</option>${voices.map(v => `<option value="${esc(v.name)}" ${v.name === S.settings.voice ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></label>
        <p class="muted small">Tip: on iPhone, download a better voice in Settings → Accessibility → Spoken Content → Voices → Japanese (Kyoko Enhanced or O-ren Premium).</p>` : ''}
      ${!canSpeak() || !voices.length ? `<p class="warn">No Japanese voice found. On iPhone: Settings → Accessibility → Spoken Content → Voices → Japanese. On Android: install Google Text-to-speech Japanese.</p>` : ''}
      <div class="row">
        <button class="btn" data-act="test-voice">🔊 Test voice</button>
        <button class="btn primary" data-act="save-settings">Save</button>
      </div>
    </div>`;
  sheet.hidden = false;
}

function saveSettings() {
  const v = id => document.getElementById(id);
  S.settings.romaji = v('s-romaji').checked;
  S.settings.kana = v('s-kana').checked;
  S.settings.hindi = v('s-hindi').checked;
  S.settings.casual = v('s-casual').checked;
  S.settings.rate = +v('s-rate').value;
  if (v('s-voice')) S.settings.voice = v('s-voice').value;
  save();
  document.getElementById('sheet').hidden = true;
  rerender();
}

// Re-draw the current screen after settings change.
function rerender() {
  if (Object.values(mods).some(m => m.rerender())) return;
  if (!sess) return route();
  if (sess.kind === 'learn') learnCard();
  else if (sess.kind === 'speak') speakCard();
  else if (sess.kind === 'quiz') quizQ();
  else talk(sess.unitId);
}

// ---------- Events ----------
const actions = {
  home: () => go(''),
  unit: id => go('unit/' + id),
  learn: id => learn(id),
  speak: id => speakMode(id),
  quiz: id => quiz(id),
  talk: id => talk(id),
  play: id => speak(view(cardById(id)).jp),
  say: id => speak(view(cardById(id)).jp),
  sayslow: id => speak(view(cardById(id)).jp, true),
  'say-casual': id => speak(view(cardById(id)).casual.jp),
  'say-text': t => speak(t),
  reveal: () => reveal(),
  'next-intro': () => { sess.i++; learnCard(); },
  grade: g => gradeCard(+g),
  mic: () => micSpeak(),
  'mic-stop': () => stopListening(),
  'speak-move': d => {
    sess.i += +d;
    if (sess.i >= sess.cards.length) { return finish('Speaking practice done', sess.unitId, '', sess.backAct); }
    speakCard();
  },
  answer: id => answer(id),
  'quiz-next': () => { sess.i++; quizQ(); },
  'talk-mic': () => talkMic(),
  hint: () => { document.getElementById('hint').hidden = false; },
  'talk-skip': () => talkAdvance(),
  settings: () => openSettings(),
  'save-settings': () => saveSettings(),
  'rate-label': (_, v) => { document.getElementById('s-rate-val').textContent = v + '×'; },
  'test-voice': () => {
    const r = document.getElementById('s-rate'), vs = document.getElementById('s-voice');
    say('こんにちは。日本語を勉強しましょう。', { rate: +r.value, voice: vs ? vs.value : S.settings.voice });
  },
};

document.addEventListener('click', e => {
  // Tabs: re-route even when the hash is unchanged (e.g. tapping Kanji mid-quiz goes back to the Kanji page).
  const tab = e.target.closest('#tabs a');
  if (tab) { e.preventDefault(); go(tab.getAttribute('href').slice(1)); return; }
  const el = e.target.closest('[data-act]');
  if (el) { run(el.dataset.act, el.dataset.arg); return; }
  if (e.target.id === 'sheet') e.target.hidden = true;
});

document.addEventListener('keydown', e => {
  if (e.target.matches('input, select') || mods.study?.keydown(e)) return;
  if (!sess) return;
  if (sess.kind === 'learn') {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); sess.queue[sess.i]?.intro ? actions['next-intro']() : sess.revealed ? null : reveal(); }
    else if (sess.revealed && !sess.queue[sess.i]?.intro && '12'.includes(e.key)) gradeCard(e.key === '1' ? 'again' : 'ok');
  }
});

// ---------- Sections loaded on demand ----------
// Home needs only the phrase data; Speak, Grammar, Kanji and JLPT (and their large data files) load on first visit.
const shared = () => ({ S: () => S, esc, render, speak, shuffle, bar, back, go, clearSess: () => { sess = null; stopSpeaking(); } });
const LOADERS = {
  study: () => import('./study.js').then(m => m.initStudy({ ...shared(), setSess: () => { sess = null; } })),
  speaking: () => import('./speaking.js').then(m => m.initSpeaking({
    ...shared(), profile, canListen, fill: t => fill(t, profile()), record: recordAgainst, speakMode, speakSlow: t => speak(t, true),
  })),
  jlpt: () => import('./jlpt.js').then(m => m.initJlpt(shared())),
  exam: () => import('./exam.js').then(m => m.initExam({
    ...shared(), sayAs: (text, pitch) => say(text, { rate: S.settings.rate, voice: S.settings.voice, pitch }), stop: stopSpeaking,
  })),
};
const mods = {};      // initialised modules
const loading = {};   // in-flight loads
function loadSection(name) {
  return loading[name] || (loading[name] = LOADERS[name]().then(mod => { mods[name] = mod; Object.assign(actions, mod.actions); return mod; }));
}
const loadAll = () => Promise.all(Object.keys(LOADERS).map(loadSection));
const moduleFor = h => /^speak/.test(h) ? 'speaking' : /^jlpt\/(reading|listening|mock)/.test(h) ? 'exam'
  : /^jlpt/.test(h) ? 'jlpt' : /^(particle|verb|grammar|kanji)/.test(h) ? 'study' : null;

// Runs an action; one that belongs to a section not loaded yet loads the sections first.
async function run(name, ...args) {
  if (!actions[name]) await loadAll();
  actions[name]?.(...args);
}

// Hash routing so the back button and reloads work.
function go(h) { if (location.hash.slice(1) === h) route(); else location.hash = h; }
async function route() {
  const h = location.hash.slice(1);
  Object.values(mods).forEach(m => m.clear());
  const m = /^(speak|particle|verb|grammar|kanji|jlpt)/.exec(h)?.[1];
  const tab = m === 'particle' || m === 'verb' ? 'grammar' : m || 'phrases';
  document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  const name = moduleFor(h);
  if (name) {
    const mod = await loadSection(name);
    if (location.hash.slice(1) !== h) return; // the user moved on while it loaded
    try { if (mod.route(h)) return; } catch (_) { /* malformed link: fall through to home */ }
  }
  if (h.startsWith('unit/') && unitById(h.slice(5))) unit(h.slice(5));
  else home();
}
window.addEventListener('hashchange', route);

// Text inputs name their action in data-input; it gets (data-arg, value) on every keystroke.
document.addEventListener('input', e => {
  const el = e.target.closest('[data-input]');
  if (el) run(el.dataset.input, el.dataset.arg, el.value);
});

// Form controls (selects) name their action in data-change.
document.addEventListener('change', e => {
  const el = e.target.closest('[data-change]');
  if (el) run(el.dataset.change, el.value);
});

route();

// Warm the other sections in the background once the app is idle, so the first tab switch is instant.
const idle = window.requestIdleCallback || (f => setTimeout(f, 1));
setTimeout(() => idle(() => loadAll(), { timeout: 3000 }), 2500);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
