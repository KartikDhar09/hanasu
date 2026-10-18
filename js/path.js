// Path tabs: step-by-step levels, each ending in a level test. The only thing saved is the level reached in
// each path (app.js stores it); test scores are shown, never kept.
import { PATH_JLPT, PATH_JLPT_INTRO } from './path-jlpt.js';
import { GRAMMAR } from './jlpt-data.js';
import { ALL_KANJI_GROUPS } from './kanji-data.js';
import { VOCAB } from './vocab-data.js';
import { PARTICLES } from './particles-data.js';
import { UNIT_INDEX } from './units-index.js';
import { ALL_KANA } from './jlpt.js';
import { toRomaji } from './conjugate.js';
import { sayable } from './core.js';
import { prefetchClip } from './clips.js';

export const PATHS = {
  jlpt: { levels: PATH_JLPT, intro: PATH_JLPT_INTRO, title: 'Path to JLPT N5 & N4', icon: '🪜', short: 'JLPT path' },
};

const plain = s => s.replace(/[[\]]/g, '');
const toKata = s => s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
const hasKanji = s => /[一-龯々]/.test(s);

// Authored level-test questions (format in path-jlpt.js). Right answer first.
export function parseQs(text = '') {
  return text.trim().split('\n').filter(Boolean).map(line => {
    const f = line.split('|'), t = f[0];
    if (t === 'g') return { t, jp: f[1], kana: f[2], en: f[3], right: /\[(.+?)\]/.exec(f[1])?.[1], wrong: f.slice(4) };
    if (t === 'r') return { t, jp: f[1], right: f[2], wrong: f.slice(3) };
    if (t === 'm' || t === 'l') return { t, jp: f[1], kana: f[2], right: f[3], wrong: f.slice(4) };
    if (t === 'w') return { t, en: f[1], right: f[2], wrong: f.slice(3) };
    if (t === 'p') return { t, passage: f[1], q: f[2], qEn: f[3], right: f[4], wrong: f.slice(5) };
    return { t, bad: line };
  });
}

// What each question plays once answered (l plays before). These lines are recorded as clips.
export const spokenOf = q => q.t === 'g' ? plain(q.jp) : q.t === 'r' ? sayable(q.jp, q.right)
  : q.t === 'm' || q.t === 'l' ? sayable(q.jp, q.kana) : q.t === 'w' ? q.right : null;

export function pathSpoken() {
  return Object.values(PATHS).flatMap(p => p.levels.flatMap(l => parseQs(l.test.qs).map(spokenOf))).filter(Boolean);
}

export function initPath(ctx) {
  const { esc, render, speak, shuffle, bar, back } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  let st = null; // the level test in progress

  const find = (p, id) => PATHS[p]?.levels.findIndex(l => l.id === id) ?? -1;
  const status = (p, i) => i < ctx.level(p) ? 'done' : i === ctx.level(p) ? 'now' : 'later';

  // A step's target: '#hash' opens a screen, 'action:arg' runs an action (e.g. a quiz).
  const target = t => t ? `data-act="path-go" data-arg="${esc(t)}"` : '';

  // ================= Overview =================
  function overview(p) {
    ctx.clearSess(); st = null;
    const P = PATHS[p], cur = ctx.level(p), L = P.levels;
    const next = L[cur];
    render(`
      <h1 class="page">${P.icon} ${esc(P.title)}</h1>
      <div class="card left pnow">${next
        ? `<span class="tag">Level ${cur + 1} of ${L.length}</span><b>${esc(next.icon)} ${esc(next.title)}</b><p class="muted small">${esc(next.goal)}</p>
           <button class="btn primary big" data-act="path-level" data-arg="${p}.${next.id}">${cur ? 'Continue' : 'Start level 1'}</button>`
        : `<span class="tag">All ${L.length} levels passed</span><b>🎓 You’ve finished this path.</b><p class="muted small">${esc(L[L.length - 1].goal)}</p>
           <p class="muted small">Keep it fresh: open any level and retake its test now and then.</p>`}
      </div>
      <details class="fold"><summary>💡 How the levels work</summary><div class="fold-body">${esc(P.intro.en)}${hg(P.intro.hg, 'hi intro-hg')}</div></details>
      <h2 class="sec">All levels</h2>
      <ol class="path levels">${L.map((l, i) => {
        const s = status(p, i);
        return `<li class="${s === 'done' ? 'done' : s === 'now' ? 'now' : ''}"><button data-act="path-level" data-arg="${p}.${l.id}">
          <span class="pico" lang="ja">${s === 'done' ? '✓' : esc(l.icon)}</span>
          <span class="ptext"><b>${i + 1} · ${esc(l.title)}</b><small>${esc(l.part)} · ${esc(l.time)}</small>
            <small>${s === 'done' ? 'Passed' : s === 'now' ? '▶ You are here' : 'Not reached yet: take its test to skip ahead'}</small></span>
          <span class="count">›</span></button></li>`;
      }).join('')}</ol>
      ${cur ? `<button class="btn small ghost preset" data-act="path-reset" data-arg="${p}">↺ Start again from level 1</button>` : ''}`);
  }

  // ================= One level =================
  function level(p, id) {
    ctx.clearSess(); st = null;
    const P = PATHS[p], i = find(p, id), l = P.levels[i], s = status(p, i);
    const sd = l.study || {};
    const sec = (title, how, body) => body ? `<h3 class="psub">${title}</h3>${how ? `<p class="muted small">${how}</p>` : ''}${body}` : '';
    const rows = items => items.length ? `<ul class="path prow">${items.join('')}</ul>` : '';
    const row = (icon, title, small, t) => `<li><button ${target(t)}><span class="pico" lang="ja">${icon}</span>
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
    const content = [
      sec('Particles', 'Open each one, play the examples, say them aloud.', chips(particles)),
      sec(`Grammar points · ${grammar.length}`, 'In this order. Pattern, examples aloud, then the meaning with the English covered.', chips(grammar)),
      sec('Kanji', 'Flashcards for each group (12 at a time) until you know them all.', rows(kanji)),
      sec('Vocabulary', 'Flashcards, 12 at a time. Say each word aloud before turning the card.', rows(vocab)),
      sec('Phrase units', 'Learn → Speak → Quiz → Role-play.', rows(units)),
    ].join('');

    const T = l.test;
    const qn = T.mock ? 0 : (T.n || 0) + parseQs(T.qs).length;
    const nextTitle = P.levels[i + 1]?.title;
    render(`
      <div class="head">${back('path-home', p)}<h1>Level ${i + 1} <small class="muted">of ${P.levels.length}</small></h1><span class="pill">${esc(l.part)}</span></div>
      <h2 class="ltitle"><span lang="ja">${esc(l.icon)}</span> ${esc(l.title)}</h2>
      <p class="muted small">⏱ ${esc(l.time)}</p>
      ${s === 'done' ? '<div class="note ok">✅ Passed. Review it any time.</div>'
        : s === 'later' ? '<div class="note">You haven’t reached this level yet. Already know it? Take the level test: passing it moves you here.</div>' : ''}
      <div class="card left goal"><b>🎯 By the end of this level you can</b><p>${esc(l.goal)}</p>${hg(l.goalHg)}</div>
      <h2 class="sec">Do this, in order</h2>
      <ol class="path steps">${l.steps.map(([icon, title, how, t], n) => t
        ? `<li><button ${target(t)}><span class="pico" lang="ja">${esc(icon)}</span><span class="ptext"><b>${n + 1}. ${esc(title)}</b><small>${esc(how)}</small></span><span class="count">›</span></button></li>`
        : `<li><div class="pstep"><span class="pico" lang="ja">${esc(icon)}</span><span class="ptext"><b>${n + 1}. ${esc(title)}</b><small>${esc(how)}</small></span></div></li>`).join('')}</ol>
      ${content ? `<h2 class="sec">Everything in this level</h2>${content}` : ''}
      <h2 class="sec">A day at this level</h2>
      <ul class="tips">${l.daily.map(d => `<li>☀️ ${esc(d)}</li>`).join('')}</ul>
      <div class="note">💡 ${esc(l.tip)}${hg(l.tipHg)}</div>
      <h2 class="sec">Level test</h2>
      <div class="card left ltest">${T.mock
        ? `<p>Pass the full-length ${T.mock.toUpperCase()} mock test in the JLPT tab: three papers with their own clocks, scored like the real exam. Passing it completes this level${nextTitle ? `, and level ${i + 2} opens` : ''}.</p>
           <button class="btn primary big" data-act="ex-mock" data-arg="${T.mock}">🏁 Full ${T.mock.toUpperCase()} mock test</button>`
        : `<p>${qn} questions · pass with ${T.pass}% or more.${nextTitle ? ` Level ${i + 2} (${esc(nextTitle)}) opens when you pass.` : ''} Nothing is recorded but the level you reach.</p>
           <button class="btn primary big" data-act="path-test" data-arg="${p}.${l.id}">📝 Start the level test</button>`}
      </div>`);
  }

  // ================= Level test =================
  function build(l) {
    const T = l.test, qs = [];
    if (T.kana) {
      const conv = T.kana === 'kata' ? toKata : s => s;
      for (const k of shuffle(ALL_KANA).slice(0, T.n)) {
        const r = toRomaji(k);
        const wrong = shuffle(ALL_KANA.filter(o => toRomaji(o) !== r)).slice(0, 3).map(toRomaji);
        qs.push({ t: 'k', jp: conv(k), right: r, wrong });
      }
    }
    qs.push(...shuffle(parseQs(T.qs)));
    return qs.map(q => ({ ...q, options: shuffle([q.right, ...q.wrong]) }));
  }

  function startTest(p, id) {
    const i = find(p, id), l = PATHS[p].levels[i];
    st = { p, i, id, qs: build(l), n: 0, right: 0, missed: [], answered: false };
    testQ();
  }

  function testQ() {
    const q = st.qs[st.n];
    if (!q) return testDone();
    st.answered = false;
    const kana = s => S().settings.kana ? `<div class="kana" lang="ja">${esc(s)}</div>` : '';
    const gap = s => esc(s).replace(/\[(.+?)\]/g, '<span class="gap wide">？</span>');
    const prompt = {
      k: () => `<span class="tag alt">How do you read this?</span><div class="kbig" lang="ja">${esc(q.jp)}</div>`,
      g: () => `<span class="tag alt">Fill in the blank</span><div class="jp big-jp" lang="ja">${gap(q.jp)}</div>${kana(q.kana.replace(/\[(.+?)\]/g, '[ ]'))}<div class="en">${esc(q.en)}</div>`,
      r: () => `<span class="tag alt">How do you read this?</span><div class="kbig small-k" lang="ja">${esc(q.jp)}</div>`,
      m: () => `<span class="tag alt">What does it mean?</span><div class="kbig small-k" lang="ja">${esc(q.jp)}</div>${hasKanji(q.jp) ? kana(q.kana) : ''}`,
      w: () => `<span class="tag alt">Which is the Japanese?</span><div class="big-en">${esc(q.en)}</div>`,
      l: () => `<span class="tag alt">Listen: what does it mean?</span><button class="btn listen" data-act="say-text" data-arg="${esc(sayable(q.jp, q.kana))}">🔊 Play again</button>`,
      p: () => `<span class="tag alt">Read, then answer</span><div class="passage" lang="ja">${esc(q.passage)}</div><div class="jp" lang="ja"><b>${esc(q.q)}</b></div><div class="en">${esc(q.qEn)}</div>`,
    }[q.t]();
    const jpOpts = ['r', 'w', 'g', 'p'].includes(q.t);
    render(`
      <div class="head">${back('path-level', `${st.p}.${st.id}`)}<div class="grow">${bar(st.n, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">${prompt}</div>
      <div class="choices ${['k', 'r'].includes(q.t) ? 'four' : ''}">${q.options.map((o, i) => `<button class="choice center" data-act="path-answer" data-arg="${i}"><span${jpOpts ? ' lang="ja"' : ''}>${esc(o)}</span></button>`).join('')}</div>
      <div class="actions" id="actions"></div>`);
    if (q.t === 'l') speak(sayable(q.jp, q.kana));
    const nx = st.qs[st.n + 1];
    if (nx?.t === 'l') prefetchClip(sayable(nx.jp, nx.kana));
  }

  function answer(i) {
    if (!st || st.answered) return;
    st.answered = true;
    const q = st.qs[st.n], picked = q.options[+i], ok = picked === q.right;
    if (ok) st.right++; else st.missed.push(q);
    document.querySelectorAll('.choice').forEach((b, n) => {
      b.disabled = true;
      if (q.options[n] === q.right) b.classList.add('right'); else if (n === +i) b.classList.add('wrong');
    });
    let extra = '';
    if (q.t === 'g') extra = `<div class="card compact left"><div class="jp" lang="ja">${esc(q.jp).replace(/\[(.+?)\]/g, '<mark>$1</mark>')}</div>${S().settings.kana ? `<div class="kana" lang="ja">${esc(plain(q.kana))}</div>` : ''}</div>`;
    if (q.t === 'l' || q.t === 'm') extra = `<div class="card compact"><b lang="ja">${esc(q.jp)}</b>${hasKanji(q.jp) ? ` <span lang="ja">${esc(q.kana)}</span>` : ''} = ${esc(q.right)}</div>`;
    if (q.t === 'k' && !ok) extra = `<div class="center"><b lang="ja" class="big-jp">${esc(q.jp)}</b> = ${esc(q.right)}</div>`;
    const say = q.t === 'k' ? q.jp : spokenOf(q);
    if (say) speak(say);
    document.getElementById('actions').innerHTML = `${extra}<button class="btn primary big" data-act="path-next">${st.n + 1 < st.qs.length ? 'Next' : 'See result'}</button>`;
  }

  function testDone() {
    const { p, i, qs, right, missed } = st;
    const P = PATHS[p], l = P.levels[i], score = Math.round(100 * right / qs.length), passed = score >= l.test.pass;
    st = null;
    const before = ctx.level(p);
    if (passed) ctx.setLevel(p, i + 1);
    const next = P.levels[i + 1];
    const show = q => q.t === 'w' ? q.en : q.t === 'g' ? plain(q.jp) : q.t === 'p' ? q.q : q.jp;
    render(`<div class="done">
      <div class="big-emoji">${passed ? '🎉' : '💪'}</div>
      <h1>${score}% · ${passed ? 'Level passed!' : 'Not yet'}</h1>
      <p class="muted">${right} of ${qs.length} right · ${l.test.pass}% needed${S().settings.hindi ? (passed ? ' · Shaabaash!' : ' · Lage raho, ho jaayega!') : ''}</p>
      ${passed && next ? `<p>${before > i ? 'You’d already passed this level.' : `Level ${i + 2} is open: <b>${esc(next.title)}</b>.`}</p>
        <button class="btn primary big" data-act="path-level" data-arg="${p}.${next.id}">Go to level ${i + 2}</button>`
        : passed ? '<p>🎓 That was the last level of this path.</p>'
        : `<p class="muted">Go back over the steps for the questions you missed, then try again. A new mix of questions comes each time.</p>
        <button class="btn primary big" data-act="path-test" data-arg="${p}.${l.id}">Try again</button>`}
      ${missed.length ? `<details class="answers"><summary>Review ${missed.length} missed</summary><ul class="phrases">${missed.map(q => `<li><span lang="ja">${esc(show(q))}</span>
        <div>✓ <span lang="ja">${esc(q.right)}</span></div></li>`).join('')}</ul></details>` : ''}
      <button class="btn" data-act="path-level" data-arg="${p}.${l.id}">Back to level ${i + 1}</button>
    </div>`);
  }

  // Called when a full mock test is passed: completes the level whose test is that mock.
  function mockPassed(lv) {
    for (const [p, P] of Object.entries(PATHS)) {
      const i = P.levels.findIndex(l => l.test.mock === lv);
      if (i >= 0) ctx.setLevel(p, i + 1);
    }
  }

  const split = arg => { const [p, id] = String(arg).split('.'); return PATHS[p] && find(p, id) >= 0 ? [p, id] : null; };
  const actions = {
    'path-home': p => ctx.go('path/' + (PATHS[p] ? p : 'jlpt')),
    'path-level': arg => { const a = split(arg); if (a) ctx.go(`path/${a[0]}/${a[1]}`); },
    'path-test': arg => { const a = split(arg); if (a) startTest(...a); },
    'path-answer': i => answer(i),
    'path-next': () => { st.n++; testQ(); window.scrollTo(0, 0); },
    'path-go': t => {
      if (t.startsWith('#')) return ctx.go(t.slice(1));
      const [act, ...rest] = t.split(':');
      ctx.run(act, rest.join(':'));
    },
    'path-reset': p => {
      if (PATHS[p] && confirm('Start this path again from level 1? Your other path is not affected.')) { ctx.setLevel(p, 0, true); overview(p); }
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
    testQ();
    return true;
  }

  return { actions, route, rerender, mockPassed, clear() { st = null; } };
}
