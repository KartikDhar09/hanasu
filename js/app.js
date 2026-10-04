import { TRACKS, UNITS, CARDS, COUNTRIES, CONTENT_VERSION } from './data.js';
import { grade, AGAIN, GOOD, EASY, isLearned, isDue, pickSession, bumpStreak, liveStreak, fill, matchScore, PASS } from './core.js';
import { say, canSpeak, canListen, listen, stopListening, stopSpeaking, jaVoices } from './speech.js';

// ---------- State ----------
const KEY = 'hanasu-v1';
const DEFAULTS = {
  setup: false,
  profile: { name: '', nameRo: '', country: 0 },
  settings: { romaji: true, kana: true, hindi: true, casual: true, rate: 0.9, voice: '' },
  progress: {},   // cardId -> { box, due, seen }
  streak: null,   // { last, count }
  spoken: {},     // cardId -> best speaking score (0..1)
};
let S = load();

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s) {
      // Card ids are positional, so progress from an older content layout no longer lines up.
      if (s.contentVersion !== CONTENT_VERSION) { s.progress = {}; s.spoken = {}; }
      return { ...DEFAULTS, ...s, contentVersion: CONTENT_VERSION, profile: { ...DEFAULTS.profile, ...s.profile }, settings: { ...DEFAULTS.settings, ...s.settings } };
    }
  } catch (_) { /* fall through to defaults */ }
  return { ...structuredClone(DEFAULTS), contentVersion: CONTENT_VERSION };
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) { toast('Could not save progress'); }
}
function practised() { S.streak = bumpStreak(S.streak); save(); }

const profile = () => {
  const c = COUNTRIES[S.profile.country] || COUNTRIES[0];
  return {
    name: S.profile.name || 'スミス', nameRo: S.profile.nameRo || 'Sumisu',
    country: c[0], countryKana: c[1], countryRo: c[2], countryEn: c[3], countryHi: c[4],
  };
};
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
const speak = (text, slow) => say(text, { rate: slow ? 0.6 : S.settings.rate, voice: S.settings.voice });

// ---------- Rendering helpers ----------
const $app = document.getElementById('app');
let sess = null; // active study session

function render(html) {
  $app.innerHTML = html;
  window.scrollTo(0, 0);
  updateTop();
}

function updateTop() {
  document.getElementById('streak').textContent = liveStreak(S.streak);
}

// Japanese block: kanji line, kana reading, romaji — per settings.
function jpBlock(c, cls = '') {
  return `<div class="jpblock ${cls}">
    <div class="jp" lang="ja">${esc(c.jp)}</div>
    ${S.settings.kana && c.kana !== c.jp ? `<div class="kana" lang="ja">${esc(c.kana)}</div>` : ''}
    ${S.settings.romaji ? `<div class="ro">${esc(c.ro)}</div>` : ''}
  </div>`;
}

// Meaning in English, with Hindi underneath when enabled.
function meaning(c, cls = 'en') {
  return `<div class="${cls}">${esc(c.en)}</div>${S.settings.hindi && c.hi ? `<div class="hi" lang="hi">${esc(c.hi)}</div>` : ''}`;
}

// How you'd say it to friends or close coworkers.
function casualBlock(c) {
  if (!c.casual || !S.settings.casual) return '';
  return `<button class="casual" data-act="say-casual" data-arg="${c.id}">
    <span class="tag-mini">😎 Casual · दोस्तों से</span>
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
  const now = Date.now();
  const due = CARDS.filter(c => isDue(S.progress[c.id], now)).length;
  const learned = CARDS.filter(c => isLearned(S.progress[c.id])).length;
  const next = UNITS.find(u => cardsOf(u.id).some(c => !S.progress[c.id]));
  const streak = liveStreak(S.streak);

  render(`
    <section class="hero">
      <div class="stats">
        <div><b>${streak}</b><span>day streak</span></div>
        <div><b>${learned}</b><span>of ${CARDS.length} phrases</span></div>
        <div><b>${due}</b><span>due now</span></div>
      </div>
      ${due ? `<button class="btn primary big" data-act="review">Review ${due} phrase${due > 1 ? 's' : ''}</button>` : ''}
      ${next ? `<button class="btn ${due ? '' : 'primary'} big" data-act="learn" data-arg="${next.id}">${S.progress[cardsOf(next.id)[0].id] ? 'Continue' : 'Start'}: ${esc(next.title)}</button>` : ''}
      ${!due && !next ? `<p class="muted center">All caught up. Practise speaking or role-play any unit.</p>` : ''}
    </section>
    ${TRACKS.map(t => `
      <h2 class="track"><span lang="ja">${t.jp}</span> ${t.title}</h2>
      <p class="muted">${t.desc}${S.settings.hindi ? ` · <span lang="hi">${t.hi}</span>` : ''}</p>
      <div class="units">
        ${UNITS.filter(u => u.track === t.id).map(u => {
          const cs = cardsOf(u.id);
          const n = cs.filter(c => isLearned(S.progress[c.id])).length;
          return `<button class="unit" data-act="unit" data-arg="${u.id}">
            <span class="icon">${u.icon}</span>
            <span class="ut"><b>${esc(u.title)}</b><small><span lang="ja">${u.jp}</span>${S.settings.hindi ? ` · <span lang="hi">${u.hi}</span>` : ''}</small></span>
            <span class="count">${n}/${cs.length}</span>
            ${bar(n, cs.length)}
          </button>`;
        }).join('')}
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
    <p class="muted sub"><span lang="ja">${u.jp}</span>${S.settings.hindi ? ` · <span lang="hi">${u.hi}</span>` : ''}</p>
    <div class="modes">
      <button class="mode" data-act="learn" data-arg="${id}"><span>🃏</span><b>Learn</b><small>Flashcards · सीखें</small></button>
      <button class="mode" data-act="speak" data-arg="${id}"><span>🎤</span><b>Speak</b><small>Say it, get checked · बोलें</small></button>
      <button class="mode" data-act="quiz" data-arg="${id}"><span>✅</span><b>Quiz</b><small>Listen &amp; choose · क्विज़</small></button>
      <button class="mode" data-act="talk" data-arg="${id}"><span>💬</span><b>Role-play</b><small>Real conversation · बातचीत</small></button>
    </div>
    <h3>Phrases <small class="muted">tap to hear</small></h3>
    <ul class="phrases">
      ${cs.map(c => `<li data-act="play" data-arg="${c.id}">
        ${jpBlock(c)}
        ${meaning(c)}
        ${casualBlock(c)}
        ${note(c)}
        <span class="state">${isLearned(S.progress[c.id]) ? '✓' : ''}</span>
      </li>`).join('')}
    </ul>
  `);
}

// ---------- Learn / Review (flashcards with spaced repetition) ----------
// New cards are introduced first (hear + repeat), then tested English → Japanese.
function buildQueue(cards) {
  const picked = pickSession(cards, S.progress);
  const reviews = picked.filter(c => S.progress[c.id]).map(c => ({ c, intro: false }));
  const fresh = picked.filter(c => !S.progress[c.id]);
  const q = [...reviews];
  for (let i = 0; i < fresh.length; i += 4) {
    const batch = fresh.slice(i, i + 4);
    q.push(...batch.map(c => ({ c, intro: true })), ...shuffle(batch).map(c => ({ c, intro: false })));
  }
  return q;
}

function learn(unitId) {
  const cards = unitId ? cardsOf(unitId) : CARDS;
  const queue = buildQueue(cards);
  if (!queue.length) {
    // Nothing due: drill the whole unit again without touching the schedule.
    if (unitId) sess = { kind: 'learn', unitId, queue: cardsOf(unitId).map(c => ({ c, intro: false, drill: true })), i: 0, done: 0 };
    else { toast('Nothing due right now'); return home(); }
  } else sess = { kind: 'learn', unitId, queue, i: 0, done: 0 };
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
    <div class="head">${back(s.unitId ? 'unit' : 'home', s.unitId || '')}<div class="grow">${bar(s.i, total)}</div><span class="muted">${s.i + 1}/${total}</span></div>
    <div class="card ${intro ? 'intro' : ''}">
      ${intro ? '<span class="tag">New phrase</span>' : '<span class="tag alt">Say it in Japanese</span>'}
      <div class="prompt">${esc(c.en)}</div>
      ${S.settings.hindi ? `<div class="prompt-hi" lang="hi">${esc(c.hi)}</div>` : ''}
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
  document.getElementById('actions').innerHTML = s.queue[s.i].drill
    ? `<button class="btn primary big" data-act="drill-next">Next</button>`
    : `<p class="muted center">How did you do?</p>
       <div class="grades">
         <button class="btn again" data-act="grade" data-arg="${AGAIN}">Forgot</button>
         <button class="btn good" data-act="grade" data-arg="${GOOD}">Got it</button>
         <button class="btn easy" data-act="grade" data-arg="${EASY}">Easy</button>
       </div>`;
  speak(view(c).jp);
}

function gradeCard(g) {
  const s = sess;
  const { c } = s.queue[s.i];
  S.progress[c.id] = grade(S.progress[c.id], g);
  if (g === AGAIN) s.queue.push({ c, intro: false }); // see it again this session
  else s.done++;
  practised();
  s.i++; learnCard();
}

// ---------- Speak (pronunciation check) ----------
function speakMode(unitId, i = 0) {
  sess = { kind: 'speak', unitId, cards: cardsOf(unitId), i };
  speakCard();
}

function speakCard() {
  const s = sess;
  const raw = s.cards[s.i];
  const c = view(raw);
  const best = S.spoken[raw.id];
  render(`
    <div class="head">${back('unit', s.unitId)}<div class="grow">${bar(s.i, s.cards.length)}</div><span class="muted">${s.i + 1}/${s.cards.length}</span></div>
    <div class="card">
      <span class="tag alt">Listen, then say it</span>
      <div class="prompt small">${esc(c.en)}</div>
      ${S.settings.hindi ? `<div class="prompt-hi" lang="hi">${esc(c.hi)}</div>` : ''}
      ${jpBlock(c, 'big')}
      <div class="row center">
        <button class="btn icon" data-act="say" data-arg="${raw.id}">🔊</button>
        <button class="btn icon" data-act="sayslow" data-arg="${raw.id}">🐢</button>
      </div>
      ${casualBlock(c)}
      <div id="result" class="result">${best != null ? `<span class="muted">Best: ${Math.round(best * 100)}%</span>` : ''}</div>
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
async function recordAgainst(c, resultEl, micEl) {
  if (micEl) { micEl.classList.add('on'); micEl.textContent = '● Listening… tap to stop'; micEl.dataset.act = 'mic-stop'; }
  try {
    const heard = await listen();
    if (!heard.length) { resultEl.innerHTML = `<span class="muted">Didn’t catch that. Try again, a little louder.</span>`; return null; }
    const score = matchScore(heard, c.jp, c.kana, c.casual ? [c.casual.jp, c.casual.kana] : []);
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
    if (micEl) { micEl.classList.remove('on'); micEl.textContent = '🎤 Try again'; micEl.dataset.act = 'mic'; }
  }
}

async function micSpeak() {
  const s = sess;
  const raw = s.cards[s.i];
  const score = await recordAgainst(view(raw), document.getElementById('result'), document.getElementById('mic'));
  if (score != null && sess === s) {
    S.spoken[raw.id] = Math.max(S.spoken[raw.id] || 0, score);
    practised();
  }
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
    practised();
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
        : `<span class="tag alt">How do you say…</span><div class="prompt">${esc(c.en)}</div>${S.settings.hindi ? `<div class="prompt-hi" lang="hi">${esc(c.hi)}</div>` : ''}`}
    </div>
    <div class="choices">
      ${q.options.map(o => {
        const v = view(o);
        return `<button class="choice" data-act="answer" data-arg="${o.id}">${q.type === 'audio'
          ? `${esc(v.en)}${S.settings.hindi ? `<small lang="hi">${esc(v.hi)}</small>` : ''}` : `<span lang="ja">${esc(v.jp)}</span>${S.settings.romaji ? `<small>${esc(v.ro)}</small>` : ''}`}</button>`;
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
    <p class="muted">You play the blue lines. The app speaks the other part. Tap any bubble to hear it again.</p>
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
    practised();
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
      ${S.settings.hindi ? `<div class="prompt-hi" lang="hi">${esc(l.hi)}</div>` : ''}
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
function finish(title, unitId, extra = '') {
  sess = null;
  render(`
    <div class="done">
      <div class="big-emoji">🌸</div>
      <h1>${esc(title)}</h1>
      ${extra ? `<p>${extra}</p>` : ''}
      <p class="muted">${liveStreak(S.streak)}-day streak · よくできました！</p>
      ${unitId ? `
        <div class="modes">
          <button class="mode" data-act="speak" data-arg="${unitId}"><span>🎤</span><b>Speak</b></button>
          <button class="mode" data-act="quiz" data-arg="${unitId}"><span>✅</span><b>Quiz</b></button>
          <button class="mode" data-act="talk" data-arg="${unitId}"><span>💬</span><b>Role-play</b></button>
          <button class="mode" data-act="home"><span>🏠</span><b>Home</b></button>
        </div>` : `<button class="btn primary big" data-act="home">Home</button>`}
    </div>
  `);
}

// ---------- Settings ----------
function openSettings(first = false) {
  const sheet = document.getElementById('sheet');
  const voices = jaVoices();
  sheet.innerHTML = `
    <div class="panel" role="dialog" aria-modal="true" aria-label="Settings">
      ${first
        ? `<h2>ようこそ! Welcome</h2><p class="muted">Learn phrases you’ll actually say: daily life first, then the office. Tell us your name so the introduction lessons are about you.</p>`
        : `<h2>Settings</h2>`}
      <label>Your name in katakana <input id="s-name" lang="ja" placeholder="e.g. スミス" value="${esc(S.profile.name)}"></label>
      <label>Your name in romaji <input id="s-namero" placeholder="e.g. Sumisu" value="${esc(S.profile.nameRo)}"></label>
      <label>Where you’re from
        <select id="s-country">${COUNTRIES.map((c, i) => `<option value="${i}" ${i === +S.profile.country ? 'selected' : ''}>${c[3]} · ${c[0]} · ${c[4]}</option>`).join('')}</select>
      </label>
      <label class="check"><input type="checkbox" id="s-romaji" ${S.settings.romaji ? 'checked' : ''}> Show romaji</label>
      <label class="check"><input type="checkbox" id="s-kana" ${S.settings.kana ? 'checked' : ''}> Show kana reading under kanji</label>
      <label class="check"><input type="checkbox" id="s-hindi" ${S.settings.hindi ? 'checked' : ''}> Show Hindi meanings · हिंदी अर्थ दिखाएँ</label>
      <label class="check"><input type="checkbox" id="s-casual" ${S.settings.casual ? 'checked' : ''}> Show casual versions (with friends)</label>
      <label>Voice speed <input type="range" id="s-rate" min="0.5" max="1.2" step="0.1" value="${S.settings.rate}"></label>
      ${voices.length > 1 ? `<label>Voice <select id="s-voice"><option value="">Auto</option>${voices.map(v => `<option ${v.name === S.settings.voice ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></label>` : ''}
      ${!canSpeak() || !voices.length ? `<p class="warn">No Japanese voice found. On iPhone: Settings → Accessibility → Spoken Content → Voices → Japanese. On Android: install Google Text-to-speech Japanese.</p>` : ''}
      <div class="row">
        <button class="btn" data-act="test-voice">🔊 Test voice</button>
        <button class="btn primary" data-act="save-settings">${first ? 'Start learning' : 'Save'}</button>
      </div>
      ${first ? '' : `<button class="btn danger small" data-act="reset">Reset all progress</button>`}
    </div>`;
  sheet.hidden = false;
}

function saveSettings() {
  const v = id => document.getElementById(id);
  S.profile.name = v('s-name').value.trim();
  S.profile.nameRo = v('s-namero').value.trim();
  S.profile.country = +v('s-country').value;
  S.settings.romaji = v('s-romaji').checked;
  S.settings.kana = v('s-kana').checked;
  S.settings.hindi = v('s-hindi').checked;
  S.settings.casual = v('s-casual').checked;
  S.settings.rate = +v('s-rate').value;
  if (v('s-voice')) S.settings.voice = v('s-voice').value;
  S.setup = true;
  save();
  document.getElementById('sheet').hidden = true;
  rerender();
}

// Re-draw the current screen after settings change.
function rerender() {
  if (!sess) return location.hash.startsWith('#unit/') ? unit(location.hash.slice(6)) : home();
  if (sess.kind === 'learn') learnCard();
  else if (sess.kind === 'speak') speakCard();
  else if (sess.kind === 'quiz') quizQ();
  else talk(sess.unitId);
}

// ---------- Events ----------
const actions = {
  home: () => go(''),
  unit: id => go('unit/' + id),
  review: () => learn(null),
  learn: id => learn(id),
  speak: id => speakMode(id),
  quiz: id => quiz(id),
  talk: id => talk(id),
  play: id => speak(view(cardById(id)).jp),
  say: id => speak(view(cardById(id)).jp),
  sayslow: id => speak(view(cardById(id)).jp, true),
  'say-casual': id => speak(view(cardById(id)).casual.jp),
  reveal: () => reveal(),
  'next-intro': () => { sess.i++; learnCard(); },
  'drill-next': () => { sess.done++; practised(); sess.i++; learnCard(); },
  grade: g => gradeCard(+g),
  mic: () => micSpeak(),
  'mic-stop': () => stopListening(),
  'speak-move': d => {
    sess.i += +d;
    if (sess.i >= sess.cards.length) { practised(); return finish('Speaking practice done', sess.unitId); }
    speakCard();
  },
  answer: id => answer(id),
  'quiz-next': () => { sess.i++; quizQ(); },
  'talk-mic': () => talkMic(),
  hint: () => { document.getElementById('hint').hidden = false; },
  'talk-skip': () => talkAdvance(),
  settings: () => openSettings(),
  'save-settings': () => saveSettings(),
  'test-voice': () => {
    const r = document.getElementById('s-rate'), vs = document.getElementById('s-voice');
    say('こんにちは。日本語を勉強しましょう。', { rate: +r.value, voice: vs ? vs.value : S.settings.voice });
  },
  reset: () => {
    if (!confirm('Delete all progress and streak?')) return;
    S.progress = {}; S.spoken = {}; S.streak = null; save();
    document.getElementById('sheet').hidden = true; home();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el) { actions[el.dataset.act]?.(el.dataset.arg); return; }
  if (e.target.id === 'sheet' && S.setup) e.target.hidden = true;
});

document.addEventListener('keydown', e => {
  if (!sess || e.target.matches('input, select')) return;
  if (sess.kind === 'learn') {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); sess.queue[sess.i]?.intro ? actions['next-intro']() : sess.revealed ? null : reveal(); }
    else if (sess.revealed && !sess.queue[sess.i]?.intro && !sess.queue[sess.i]?.drill && '123'.includes(e.key)) gradeCard([AGAIN, GOOD, EASY][+e.key - 1]);
  }
});

// Hash routing so the back button and reloads work.
function go(h) { if (location.hash.slice(1) === h) route(); else location.hash = h; }
function route() {
  const h = location.hash.slice(1);
  if (h.startsWith('unit/') && unitById(h.slice(5))) unit(h.slice(5));
  else home();
}
window.addEventListener('hashchange', route);

route();
if (!S.setup) openSettings(true);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
