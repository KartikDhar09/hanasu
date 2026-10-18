// Path tabs: step-by-step levels, each ending in a level test. The only thing saved is the level reached in
// each path (app.js stores it); test scores are shown, never kept.
import { PATH_JLPT, PATH_JLPT_INTRO } from './path-jlpt.js';
import { PATH_TALK, PATH_TALK_INTRO } from './path-talk.js';
import { QA } from './speaking-data.js';
import { furigana } from './furigana.js';
import { GRAMMAR } from './jlpt-data.js';
import { ALL_KANJI_GROUPS } from './kanji-data.js';
import { VOCAB } from './vocab-data.js';
import { PARTICLES } from './particles-data.js';
import { UNIT_INDEX } from './units-index.js';
import { ALL_KANA } from './jlpt.js';
import { toRomaji } from './conjugate.js';
import { sayable, PASS } from './core.js';
import { prefetchClip } from './clips.js';

export const PATHS = {
  jlpt: { levels: PATH_JLPT, intro: PATH_JLPT_INTRO, title: 'Path to JLPT N5 & N4', icon: '🪜', short: 'JLPT path' },
  talk: { levels: PATH_TALK, intro: PATH_TALK_INTRO, title: 'Path to speaking fluently', icon: '🗣️', short: 'Speaking path' },
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

// Speaking-test items (format in path-talk.js).
export function parseSpeak(text = '') {
  return text.trim().split('\n').filter(Boolean).map(line => {
    const f = line.split('|'), t = f[0];
    if (t === 'u') return { t, say: f[1], card: f[2] };
    if (t === 's') return { t, say: f[1], jp: f[2], kana: f[3], ro: f[4], en: f[5], alts: (f[6] || '').split(';').filter(Boolean) };
    if (t === 'a') return { t, jp: f[1], kana: f[2], ro: f[3], en: f[4] };
    return { t, bad: line };
  });
}
// Key phrases: jp|kana|romaji|English|Hinglish.
export const parseKit = (text = '') => text.trim().split('\n').filter(Boolean).map(l => { const [jp, kana, ro, en, hg] = l.split('|'); return { jp, kana, ro, en, hg }; });

// What each question plays once answered (l plays before). These lines are recorded as clips.
export const spokenOf = q => q.t === 'g' ? plain(q.jp) : q.t === 'r' ? sayable(q.jp, q.right)
  : q.t === 'm' || q.t === 'l' ? sayable(q.jp, q.kana) : q.t === 'w' ? q.right : null;

// Every line the paths play: test answers, key phrases, new speaking-test lines (unit phrases are voiced already).
export function pathSpoken() {
  return Object.values(PATHS).flatMap(p => p.levels.flatMap(l => [
    ...parseQs(l.test.qs).map(spokenOf),
    ...parseKit(l.kit).map(k => k.jp),
    ...parseSpeak(l.test.speak).filter(x => x.t !== 'u').map(x => x.jp),
  ])).filter(Boolean);
}
// [jp, kana] for every path line that has a written reading (lets make-audio check how the voice reads it).
export function pathKana() {
  return Object.values(PATHS).flatMap(p => p.levels.flatMap(l => [
    ...parseQs(l.test.qs).flatMap(q => q.t === 'g' || q.t === 'm' || q.t === 'l' ? [[q.jp, q.kana]] : q.t === 'r' ? [[q.jp, q.right]] : []),
    ...parseKit(l.kit).map(k => [k.jp, k.kana]),
    ...parseSpeak(l.test.speak).filter(x => x.t !== 'u').map(x => [x.jp, x.kana]),
  ]));
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
      sec('Phrase units', 'Learn → Speak → Quiz → Role-play.', rows(units)),
      sec('Questions to answer', 'Play the question, answer out loud in your own words, then compare with the examples.', chips(qa)),
    ].join('');
    const missions = l.missions?.length ? `<h2 class="sec">Missions with real people</h2>
      <p class="muted small">The app can’t do these for you, and they matter most. Nothing is recorded.</p>
      <ul class="tips">${l.missions.map(m => `<li>🎯 ${esc(m)}</li>`).join('')}</ul>` : '';
    const drill = l.drill ? `<button class="btn big" data-act="path-drill" data-arg="${p}.${l.id}">⏱ 4/3/2 talking drill · ${l.drill.length} topics</button>` : '';

    const T = l.test;
    const qn = T.mock ? 0 : (T.n || 0) + parseQs(T.qs).length + parseSpeak(T.speak).length;
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
      ${missions}${drill}
      <h2 class="sec">A day at this level</h2>
      <ul class="tips">${l.daily.map(d => `<li>☀️ ${esc(d)}</li>`).join('')}</ul>
      <div class="note">💡 ${esc(l.tip)}${hg(l.tipHg)}</div>
      <h2 class="sec">Level test</h2>
      <div class="card left ltest">${T.mock
        ? `<p>Pass the full-length ${T.mock.toUpperCase()} mock test in the JLPT tab: three papers with their own clocks, scored like the real exam. Passing it completes this level${nextTitle ? `, and level ${i + 2} opens` : ''}.</p>
           <button class="btn primary big" data-act="ex-mock" data-arg="${T.mock}">🏁 Full ${T.mock.toUpperCase()} mock test</button>`
        : T.speak ? `<p>${qn} things to say into the microphone · pass with ${T.pass}% or more.${nextTitle ? ` Level ${i + 2} (${esc(nextTitle)}) opens when you pass.` : ''} The business, casual and other ways taught in the app also count.${ctx.canListen() ? '' : ' This browser can’t check speech, so you’ll compare with the answer and mark yourself.'}</p>
           <button class="btn primary big" data-act="path-speak" data-arg="${p}.${l.id}">🎤 Start the speaking test</button>`
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
    st = { kind: 'quiz', p, i, id, qs: build(l), n: 0, right: 0, missed: [], answered: false };
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
    const show = q => q.say || (q.t === 'w' ? q.en : q.t === 'g' ? plain(q.jp) : q.t === 'p' ? q.q : q.jp);
    const answerOf = q => (q.say || q.t === 'a') ? q.jp : q.right;
    render(`<div class="done">
      <div class="big-emoji">${passed ? '🎉' : '💪'}</div>
      <h1>${score}% · ${passed ? 'Level passed!' : 'Not yet'}</h1>
      <p class="muted">${right} of ${qs.length} right · ${l.test.pass}% needed${S().settings.hindi ? (passed ? ' · Shaabaash!' : ' · Lage raho, ho jaayega!') : ''}</p>
      ${passed && next ? `<p>${before > i ? 'You’d already passed this level.' : `Level ${i + 2} is open: <b>${esc(next.title)}</b>.`}</p>
        <button class="btn primary big" data-act="path-level" data-arg="${p}.${next.id}">Go to level ${i + 2}</button>`
        : passed ? '<p>🎓 That was the last level of this path.</p>'
        : `<p class="muted">Go back over the steps for the ones you missed, then try again. They come in a new order each time.</p>
        <button class="btn primary big" data-act="${l.test.speak ? 'path-speak' : 'path-test'}" data-arg="${p}.${l.id}">Try again</button>`}
      ${missed.length ? `<details class="answers"><summary>Review ${missed.length} missed</summary><ul class="phrases">${missed.map(q => `<li><span lang="ja">${esc(show(q))}</span>
        <div>✓ <span lang="ja">${esc(answerOf(q))}</span></div></li>`).join('')}</ul></details>` : ''}
      <button class="btn" data-act="path-level" data-arg="${p}.${l.id}">Back to level ${i + 1}</button>
    </div>`);
  }

  // ================= Speaking test =================
  async function startSpeak(p, id) {
    const i = find(p, id), l = PATHS[p].levels[i];
    const items = await Promise.all(shuffle(parseSpeak(l.test.speak)).map(async x => {
      if (x.t !== 'u') return { ...x, alts: x.alts?.map(a => [a]) || [] };
      const c = await ctx.card(x.card);
      return { ...x, jp: c.jp, kana: c.kana, ro: c.ro, en: c.en, casual: c.casual, alts: c.alts };
    }));
    st = { kind: 'speak', p, i, id, qs: items, n: 0, right: 0, missed: [], fails: 0 };
    speakQ();
  }

  function speakQ() {
    const q = st.qs[st.n];
    if (!q) return testDone();
    Object.assign(st, { passed: false, revealed: false });
    const prompt = q.t === 'a'
      ? `<span class="tag alt">Read this aloud</span><div class="jp big-jp" lang="ja">${esc(q.jp)}</div>${S().settings.romaji ? `<div class="ro">${esc(q.ro)}</div>` : ''}`
      : `<span class="tag alt">Say it in Japanese</span><div class="big-en">${esc(q.say)}</div>`;
    render(`
      <div class="head">${back('path-level', `${st.p}.${st.id}`)}<div class="grow">${bar(st.n, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">${prompt}<div class="result" id="result"></div></div>
      <div class="actions" id="actions">
        ${ctx.canListen() ? '<button class="btn primary big mic" id="mic" data-act="path-mic">🎤 Speak</button>' : ''}
        <div class="row"><button class="btn" data-act="path-reveal">👀 Show answer</button><button class="btn ghost" id="snext" data-act="path-snext">Skip</button></div>
      </div>
      <div id="answer"></div>`);
    if (q.jp) prefetchClip(q.jp);
  }

  async function mic() {
    const q = st.qs[st.n], at = st.n;
    const score = await ctx.record(q, document.getElementById('result'), document.getElementById('mic'));
    if (!st || st.n !== at) return;
    if (score == null) { st.fails++; if (st.revealed) reveal(); return; }
    if (score >= PASS && !st.revealed && !st.passed) {
      st.passed = true;
      document.getElementById('snext').textContent = 'Next';
      document.getElementById('snext').className = 'btn primary';
    }
  }

  function reveal() {
    const q = st.qs[st.n];
    st.revealed = true;
    const furi = S().settings.kana ? furigana(q.jp, q.kana, esc) : null;
    const others = [q.casual?.jp, ...(q.alts || []).map(a => a[0])].filter(Boolean);
    const selfGrade = !st.passed && (!ctx.canListen() || st.fails > 0);
    document.getElementById('answer').innerHTML = `<div class="card compact left">
      <div class="jp big-jp" lang="ja" data-act="say-text" data-arg="${esc(q.jp)}">${furi || esc(q.jp)} 🔊</div>
      ${S().settings.kana && !furi && q.kana !== q.jp ? `<div class="kana" lang="ja">${esc(q.kana)}</div>` : ''}
      ${S().settings.romaji ? `<div class="ro">${esc(q.ro)}</div>` : ''}<div class="en">${esc(q.en)}</div>
      ${others.length ? `<div class="note">Also OK: <span lang="ja">${others.slice(0, 3).map(esc).join(' · ')}</span></div>` : ''}
      ${st.passed ? '' : `<p class="muted small">${selfGrade ? 'Say it out loud now, then mark yourself honestly.' : 'Showing the answer makes this one practice: say it along with the voice.'}</p>`}
      ${selfGrade ? '<div class="row"><button class="btn primary" data-act="path-self" data-arg="1">✓ I said it right</button><button class="btn" data-act="path-self" data-arg="0">✗ Not yet</button></div>' : ''}
    </div>`;
    speak(q.jp);
  }

  function nextSpeak(ok) {
    const q = st.qs[st.n];
    if (ok) st.right++; else st.missed.push(q);
    st.n++; speakQ(); window.scrollTo(0, 0);
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
    'path-answer': i => st?.kind === 'quiz' && answer(i),
    'path-next': () => { if (st?.kind !== 'quiz') return; st.n++; testQ(); window.scrollTo(0, 0); },
    'path-go': t => {
      if (t.startsWith('#')) return ctx.go(t.slice(1));
      const [act, ...rest] = t.split(':');
      ctx.run(act, rest.join(':'));
    },
    'path-speak': arg => { const a = split(arg); if (a) startSpeak(...a); },
    'path-mic': () => st?.kind === 'speak' && mic(),
    'path-reveal': () => st?.kind === 'speak' && reveal(),
    'path-self': ok => st?.kind === 'speak' && nextSpeak(ok === '1'),
    'path-snext': () => st?.kind === 'speak' && nextSpeak(st.passed),
    'path-drill': arg => { const a = split(arg); if (a && PATHS[a[0]].levels[find(...a)].drill) drill(...a); },
    'path-drill-go': () => drillGo(),
    'path-drill-topic': () => { if (st?.kind === 'drill') { const n = PATHS[st.p].levels[find(st.p, st.id)].drill.length; drill(st.p, st.id, (st.t + 1) % n); } },
    'path-drill-again': () => { if (st?.kind === 'drill') drill(st.p, st.id, st.t); },
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
    if (st.kind === 'speak') speakQ(); else if (st.kind === 'drill') drillView(); else testQ();
    return true;
  }

  return { actions, route, rerender, mockPassed, clear() { st = null; stopTimer(); } };
}
