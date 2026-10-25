// Path tabs: step-by-step levels. Since v6.0 there are no level tests (the user's choice, 2026-10-25): the learner
// marks a level complete by hand, in any order, and can undo it. Which levels are complete is kept on the account
// (app.js markLevel → /api/board) with an offline copy on the device; nothing else about the learner is kept.
import { PATH_JLPT, PATH_JLPT_INTRO } from './path-jlpt.js';
import { PATH_TALK, PATH_TALK_INTRO } from './path-talk.js';
import { QA } from './speaking-data.js';
import { furigana } from './furigana.js';
import { GRAMMAR } from './jlpt-data.js';
import { ALL_KANJI_GROUPS } from './kanji-data.js';
import { VOCAB } from './vocab-data.js';
import { PARTICLES } from './particles-data.js';
import { UNIT_INDEX } from './units-index.js';
import { icon } from './icons.js';

export const PATHS = {
  jlpt: { levels: PATH_JLPT, intro: PATH_JLPT_INTRO, title: 'Path to JLPT N5 & N4', short: 'JLPT path' },
  talk: { levels: PATH_TALK, intro: PATH_TALK_INTRO, title: 'Path to speaking fluently', short: 'Speaking path' },
};

// Key phrases: jp|kana|romaji|English|Hinglish.
export const parseKit = (text = '') => text.trim().split('\n').filter(Boolean).map(l => { const [jp, kana, ro, en, hg] = l.split('|'); return { jp, kana, ro, en, hg }; });

// Every line the paths play: the key phrases (unit phrases are voiced already). These lines are recorded as clips.
export function pathSpoken() {
  return Object.values(PATHS).flatMap(p => p.levels.flatMap(l => parseKit(l.kit).map(k => k.jp))).filter(Boolean);
}
// [jp, kana] for every key phrase (lets make-audio check how the voice reads it).
export function pathKana() {
  return Object.values(PATHS).flatMap(p => p.levels.flatMap(l => parseKit(l.kit).map(k => [k.jp, k.kana])));
}

export function initPath(ctx) {
  const { esc, render, back } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  let st = null; // the 4/3/2 drill in progress

  const find = (p, id) => PATHS[p]?.levels.findIndex(l => l.id === id) ?? -1;
  // "Now" is the first level not marked complete; levels can be ticked in any order, so later ones may be done too.
  const current = p => { const d = ctx.done(p); return PATHS[p].levels.findIndex((_, i) => !d.has(i)); };
  const status = (p, i) => ctx.done(p).has(i) ? 'done' : i === current(p) ? 'now' : 'later';

  // A step's target: '#hash' opens a screen, 'action:arg' runs an action (e.g. flashcards).
  const target = t => t ? `data-act="path-go" data-arg="${esc(t)}"` : '';

  // ================= Overview =================
  function overview(p) {
    ctx.clearSess(); st = null;
    const P = PATHS[p], L = P.levels, d = ctx.done(p), cur = current(p);
    const next = L[cur];
    render(`
      <h1 class="page">${icon('path-' + p)} ${esc(P.title)}</h1>
      <div class="card left pnow">${next
        ? `<span class="tag">Level ${cur + 1} of ${L.length} · ${d.size} complete</span><b>${esc(next.icon)} ${esc(next.title)}</b><p class="muted small">${esc(next.goal)}</p>
           <button class="btn primary big" data-act="path-level" data-arg="${p}.${next.id}">${d.size ? 'Continue' : 'Start level 1'}</button>`
        : `<span class="tag">All ${L.length} levels complete</span><b>🎓 You’ve finished this path.</b><p class="muted small">${esc(L[L.length - 1].goal)}</p>
           <p class="muted small">Keep it fresh: open any level and go over it again now and then.</p>`}
      </div>
      <details class="fold"><summary>💡 How the levels work</summary><div class="fold-body">${esc(P.intro.en)}${hg(P.intro.hg, 'hi intro-hg')}</div></details>
      <h2 class="sec">All levels</h2>
      <ol class="path levels">${L.map((l, i) => {
        const s = status(p, i);
        return `<li class="${s === 'done' ? 'done' : s === 'now' ? 'now' : ''}"><button data-act="path-level" data-arg="${p}.${l.id}">
          <span class="pico" lang="ja">${s === 'done' ? '✓' : esc(l.icon)}</span>
          <span class="ptext"><b>${i + 1} · ${esc(l.title)}</b><small>${esc(l.part)} · ${esc(l.time)}</small>
            <small>${s === 'done' ? 'Complete' : s === 'now' ? '▶ You are here' : 'Not marked complete yet'}</small></span>
          <span class="count">›</span></button></li>`;
      }).join('')}</ol>
      ${d.size ? `<button class="btn small ghost preset" data-act="path-reset" data-arg="${p}">↺ Start again: clear every tick</button>` : ''}`);
  }

  // ================= One level =================
  function level(p, id) {
    ctx.clearSess(); st = null;
    const P = PATHS[p], i = find(p, id), l = P.levels[i], s = status(p, i);
    const sd = l.study || {};
    const sec = (title, how, body) => body ? `<h3 class="psub">${title}</h3>${how ? `<p class="muted small">${how}</p>` : ''}${body}` : '';
    const rows = items => items.length ? `<ul class="path prow">${items.join('')}</ul>` : '';
    const row = (pic, title, small, t) => `<li><button ${target(t)}><span class="pico" lang="ja">${pic}</span>
      <span class="ptext"><b>${title}</b>${small ? `<small lang="ja">${small}</small>` : ''}</span><span class="count">›</span></button></li>`;
    const chips = items => items.length ? `<div class="chips">${items.join('')}</div>` : '';

    const particles = (sd.particles || []).map(pid => PARTICLES.find(x => x.id === pid))
      .map(x => `<button class="chip" ${target('#particle/' + x.id)}><b lang="ja">${esc(x.p)}</b> ${esc(x.ro)}</button>`);
    const grammar = (sd.grammar || []).map(gid => GRAMMAR.find(g => g.id === gid))
      .map(g => `<button class="chip" ${target('gpoint:' + g.id)}><span lang="ja">${esc(g.pattern)}</span></button>`);
    const kanji = (sd.kanji || []).map(gid => ALL_KANJI_GROUPS.find(g => g.id === gid))
      .map(g => row(esc(g.icon), `${esc(g.title)} · ${g.kanji.length}`, esc(g.kanji.map(k => k[0]).join(' ')), 'klearn:' + g.id));
    const vocab = (sd.vocab || []).map(tid => VOCAB.find(t => t.id === tid))
      .map(t => row(esc(t.icon), esc(t.title), `${t.words.length} words · flashcards`, 'vlearn:' + t.id));
    const units = (sd.units || []).map(uid => UNIT_INDEX.find(u => u.id === uid))
      .map(u => row(esc(u.icon), esc(u.title), `${esc(u.jp)} · ${u.n} phrases`, '#unit/' + u.id));
    const qa = (sd.qa || []).map(n => `<button class="chip" ${target('qa:' + n)}>${esc(QA[n].pic)} <span lang="ja">${esc(QA[n].q[0])}</span></button>`);
    const kit = parseKit(l.kit).map(k => {
      const furi = S().settings.kana ? furigana(k.jp, k.kana, esc) : null;
      return `<li class="ex" data-act="say-text" data-arg="${esc(k.jp)}"><div class="jp" lang="ja">${furi || esc(k.jp)}</div>
        ${S().settings.kana && !furi && k.kana !== k.jp ? `<div class="kana" lang="ja">${esc(k.kana)}</div>` : ''}
        ${S().settings.romaji ? `<div class="ro">${esc(k.ro)}</div>` : ''}<div class="en">${esc(k.en)}</div>${hg(k.hg)}</li>`;
    });
    const content = [
      sec('Particles', 'Open each one, play the examples, say them aloud.', chips(particles)),
      sec(`Grammar points · ${grammar.length}`, 'In this order. Pattern, examples aloud, then the meaning with the English covered.', chips(grammar)),
      sec('Kanji', 'Flashcards for each group (12 at a time) until you know them all.', rows(kanji)),
      sec('Vocabulary', 'Flashcards, 12 at a time. Say each word aloud before turning the card.', rows(vocab)),
      sec('Key phrases', 'Tap to hear. Say each one three times, then cover the Japanese and say it from the English.', kit.length ? `<ul class="phrases">${kit.join('')}</ul>` : ''),
      sec('Phrase units', 'Learn → Speak → Role-play.', rows(units)),
      sec('Questions to answer', 'Play the question, answer out loud in your own words, then compare with the examples.', chips(qa)),
    ].join('');
    const missions = l.missions?.length ? `<h2 class="sec">Missions with real people</h2>
      <p class="muted small">The app can’t do these for you, and they matter most. Nothing is recorded.</p>
      <ul class="tips">${l.missions.map(m => `<li>🎯 ${esc(m)}</li>`).join('')}</ul>` : '';
    const drill = l.drill ? `<button class="btn big" data-act="path-drill" data-arg="${p}.${l.id}">⏱ 4/3/2 talking drill · ${l.drill.length} topics</button>` : '';

    const nextTitle = P.levels[i + 1]?.title;
    render(`
      <div class="head">${back('path-home', p)}<h1>Level ${i + 1} <small class="muted">of ${P.levels.length}</small></h1><span class="pill">${esc(l.part)}</span></div>
      <h2 class="ltitle"><span lang="ja">${esc(l.icon)}</span> ${esc(l.title)}</h2>
      <p class="muted small">⏱ ${esc(l.time)}</p>
      ${s === 'done' ? '<div class="note ok">✅ Complete. Review it any time.</div>' : ''}
      <div class="card left goal"><b>🎯 By the end of this level you can</b><p>${esc(l.goal)}</p>${hg(l.goalHg)}</div>
      <h2 class="sec">Do this, in order</h2>
      <ol class="path steps">${l.steps.map(([icon, title, how, t], n) => t
        ? `<li><button ${target(t)}><span class="pico" lang="ja">${esc(icon)}</span><span class="ptext"><b>${n + 1}. ${esc(title)}</b><small>${esc(how)}</small></span><span class="count">›</span></button></li>`
        : `<li><div class="pstep"><span class="pico" lang="ja">${esc(icon)}</span><span class="ptext"><b>${n + 1}. ${esc(title)}</b><small>${esc(how)}</small></span></div></li>`).join('')}</ol>
      ${content ? `<h2 class="sec">Everything in this level</h2>${content}` : ''}
      ${missions}${drill}
      <h2 class="sec">A day at this level</h2>
      <ul class="tips">${l.daily.map(d => `<li>☀️ ${esc(d)}</li>`).join('')}</ul>
      <div class="note">💡 ${esc(l.tip)}${hg(l.tipHg)}</div>
      ${l.mock ? `<h2 class="sec">Mock test</h2>
      <div class="card left ltest"><p>The full-length ${l.mock.toUpperCase()} mock test in the JLPT tab: three papers with their own clocks, scored like the real exam.</p>
        <button class="btn primary big" data-act="ex-mock" data-arg="${l.mock}">🏁 Full ${l.mock.toUpperCase()} mock test</button></div>` : ''}
      <h2 class="sec">Done with this level?</h2>
      <div class="card left ltest"><p class="muted small">Mark it complete when you can do what the goal at the top says. It shows on the 👥 board${nextTitle ? `, and level ${i + 2} (${esc(nextTitle)}) is next` : ''}. You can undo it.</p>
        ${completeButton(p, i)}</div>`);
  }

  // Lives on the account, so it needs a connection; the button says so instead of pretending it worked.
  const completeButton = (p, i) => ctx.done(p).has(i)
    ? `<button class="btn big bk-done on" id="lv-done" data-act="path-complete" data-arg="${p}.${PATHS[p].levels[i].id}.0">✅ Complete · tap to undo</button>`
    : `<button class="btn primary big bk-done" id="lv-done" data-act="path-complete" data-arg="${p}.${PATHS[p].levels[i].id}.1">✓ Mark level complete</button>`;

  async function markComplete(p, id, done) {
    const i = find(p, id), el = document.getElementById('lv-done');
    if (i < 0 || !el) return;
    el.disabled = true;
    const ok = await ctx.markLevel(p, i, done);
    const now = document.getElementById('lv-done');
    if (!now || location.hash !== `#path/${p}/${id}`) return; // moved to another screen meanwhile
    if (ok) now.outerHTML = completeButton(p, i);
    else { now.disabled = false; now.textContent = 'No connection. Tap to try again.'; }
  }

  // ================= 4/3/2 drill =================
  const ROUNDS = [240, 180, 120];
  let timer = null;
  const stopTimer = () => { clearInterval(timer); timer = null; };
  const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function drill(p, id, topic) {
    stopTimer();
    const l = PATHS[p].levels[find(p, id)];
    const t = topic ?? Math.floor(Math.random() * l.drill.length);
    st = { kind: 'drill', p, id, t, round: 0, left: ROUNDS[0] };
    drillView();
  }

  function drillView() {
    const l = PATHS[st.p].levels[find(st.p, st.id)], [title, thg, hints] = l.drill[st.t];
    const done = st.round >= ROUNDS.length;
    render(`
      <div class="head">${back('path-level', `${st.p}.${st.id}`)}<h1>4/3/2 drill</h1></div>
      <p class="muted small">Tell the same story three times: 4 minutes, then 3, then 2. Don’t stop to fix mistakes: keep talking. Each round, say it faster and smoother.</p>
      <div class="card left"><span class="tag">Topic</span><b>${esc(title)}</b>${hg(thg)}<div class="note">Ideas: <span lang="ja">${esc(hints)}</span></div></div>
      <div class="drill-rounds">${ROUNDS.map((r, n) => `<span class="pill ${n < st.round ? 'g2' : n === st.round ? 'g1' : ''}">${n < st.round ? '✓ ' : ''}${mmss(r)}</span>`).join('')}</div>
      ${done ? `<div class="done"><div class="big-emoji">🎉</div><h1>Three rounds done</h1><p class="muted">Tomorrow, try a new topic. When the 2-minute round feels easy, you own that topic.</p></div>`
        : `<div class="drill-clock" id="clock" role="timer" aria-live="off">${mmss(st.left)}</div>
           <div class="row center"><button class="btn primary big" id="dgo" data-act="path-drill-go">${timer ? '⏸ Pause' : st.left < ROUNDS[st.round] ? '▶ Resume' : '▶ Start round ' + (st.round + 1)}</button></div>`}
      <div class="row"><button class="btn small ghost" data-act="path-drill-topic">🔀 Another topic</button>${done ? '<button class="btn small" data-act="path-drill-again">↺ Same topic again</button>' : ''}</div>`);
  }

  function drillGo() {
    if (!st || st.kind !== 'drill') return;
    if (timer) { stopTimer(); return drillView(); }
    timer = setInterval(() => {
      if (!st || st.kind !== 'drill') return stopTimer();
      st.left--;
      const el = document.getElementById('clock');
      if (el) el.textContent = mmss(Math.max(0, st.left));
      if (st.left <= 0) { stopTimer(); st.round++; st.left = ROUNDS[st.round] || 0; drillView(); if (navigator.vibrate) navigator.vibrate(300); }
    }, 1000);
    drillView();
  }

  const split = arg => { const [p, id] = String(arg).split('.'); return PATHS[p] && find(p, id) >= 0 ? [p, id] : null; };
  const actions = {
    'path-home': p => ctx.go('path/' + (PATHS[p] ? p : 'jlpt')),
    'path-level': arg => { const a = split(arg); if (a) ctx.go(`path/${a[0]}/${a[1]}`); },
    'path-complete': arg => { const [p, id, on] = String(arg).split('.'); if (split(`${p}.${id}`)) markComplete(p, id, on === '1'); },
    'path-go': t => {
      if (t.startsWith('#')) return ctx.go(t.slice(1));
      const [act, ...rest] = t.split(':');
      ctx.run(act, rest.join(':'));
    },
    'path-drill': arg => { const a = split(arg); if (a && PATHS[a[0]].levels[find(...a)].drill) drill(...a); },
    'path-drill-go': () => drillGo(),
    'path-drill-topic': () => { if (st?.kind === 'drill') { const n = PATHS[st.p].levels[find(st.p, st.id)].drill.length; drill(st.p, st.id, (st.t + 1) % n); } },
    'path-drill-again': () => { if (st?.kind === 'drill') drill(st.p, st.id, st.t); },
    'path-reset': async p => {
      if (!PATHS[p] || !confirm('Clear every completed level in this path? Your other path is not affected.')) return;
      if (!await ctx.resetPath(p)) alert('No connection: nothing was cleared. Try again when you’re online.');
      else if (location.hash === '#path/' + p) overview(p);
    },
  };

  function route(h) {
    const [, p, id] = h.split('/');
    if (!PATHS[p]) return false;
    if (!id) return overview(p), true;
    if (find(p, id) < 0) return overview(p), true;
    return level(p, id), true;
  }

  function rerender() {
    if (!st) return false;
    drillView();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; stopTimer(); } };
}
