// Particles, Verbs, Counters and Kanji sections. Shared helpers come from app.js via ctx.
import { PARTICLES, PARTICLES_INTRO, CONFUSABLE } from './particles-data.js';
import { furigana, markBrackets } from './furigana.js';
import { prefetchClip } from './clips.js';
import { VERBS, GROUPS, TIPS } from './verbs-data.js';
import { KANJI, ALL_KANJI_GROUPS, KANJI_INTRO } from './kanji-data.js';
import { conjugate, toRomaji, FORMS } from './conjugate.js';
import { sayable, sameMeaning } from './core.js';
import { COUNTERS, COUNTER_GROUPS, COUNTER_INTRO, NUMBERS, NUMBER_KANJI } from './counters-data.js';

const ALL_PARTICLES = PARTICLES.map(p => p.p);
const plain = s => s.replace(/[[\]]/g, '');

export function initStudy(ctx) {
  const { esc, render, speak, shuffle, bar, back } = ctx;
  const S = () => ctx.S();
  const hg = (text, cls = 'hi') => S().settings.hindi && text ? `<div class="${cls}" lang="hi-Latn">${esc(text)}</div>` : '';
  const ro = text => S().settings.romaji ? `<div class="ro">${esc(text)}</div>` : '';
  const kanaLine = (kana, jp) => S().settings.kana && kana !== jp ? `<div class="kana" lang="ja">${esc(kana)}</div>` : '';
  let st = null; // current quiz / flashcard state for this module

  // Japanese with the taught particle highlighted; blank = show a gap instead.
  const mark = (s, blank) => esc(s).replace(/\[(.+?)\]/g, (_, p) => blank ? '<span class="gap">？</span>' : `<mark>${p}</mark>`);

  // wid: the id of this example's 👔 business / other ways fold, if it has one.
  function example(e, i, wid) {
    const furi = S().settings.kana ? furigana(e[0], e[1], esc, markBrackets(esc)) : null;
    return `<li class="ex" data-act="say-text" data-arg="${esc(plain(e[0]))}">
      <div class="jp" lang="ja">${furi || mark(e[0])}</div>
      ${S().settings.kana && !furi ? `<div class="kana" lang="ja">${mark(e[1])}</div>` : ''}
      ${ro(plain(e[2]))}
      <div class="en">${esc(e[3])}</div>${hg(e[4])}
      ${wid ? ctx.waysSlot(wid) : ''}
    </li>`;
  }

  // ================= Study hub: grammar, kanji and stroke order =================
  function studyHub() {
    ctx.clearSess(); st = null;
    render(`
      <h1 class="page">Study <span lang="ja">勉強</span></h1>
      <p class="muted">Not sure where to start? The <a class="inline-link" href="#path/jlpt">🪜 N5·N4 path</a> tells you what to study, in order.</p>
      <h2 class="sec">Grammar <span lang="ja">文法</span></h2>
      <div class="intro">${esc(PARTICLES_INTRO.en)}${hg(PARTICLES_INTRO.hg, 'hi intro-hg')}</div>
      <div class="speak-grid">
        <button class="scard" data-act="particles"><span lang="ja" class="pch">は</span><b>Particles</b><small>${PARTICLES.length} little words that glue sentences together: は, を, に, で…</small></button>
        <button class="scard" data-act="verbs"><span>🏃</span><b>Verbs</b><small>${VERBS.length} verbs with every form: ます, て, ない, た…</small></button>
        <button class="scard" data-act="counters"><span lang="ja" class="pch">本</span><b>Counters</b><small>${COUNTERS.length} ways to count: 本, 枚, 人, 個… with the tricky sound changes</small></button>
        <button class="scard" data-act="jlpt-grammar" data-arg="n5"><span>📘</span><b>Grammar points</b><small>Every N5 and N4 pattern with examples (in the JLPT tab)</small></button>
      </div>
      <h2 class="sec">Kanji <span lang="ja">漢字</span></h2>
      <div class="speak-grid">
        <button class="scard" data-act="kanji"><span lang="ja" class="pch">漢</span><b>Kanji</b><small>${KANJI.length} N5 and N4 kanji with readings, examples, flashcards and a quiz</small></button>
        <button class="scard" data-act="stroke-tab"><span>✍️</span><b>Stroke order</b><small>Watch every kanji, hiragana and katakana drawn stroke by stroke</small></button>
      </div>`);
  }

  // ================= Particles =================
  function particles() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('study')}<h1>Particles <span lang="ja" class="accent">助詞</span></h1></div>
      <button class="btn primary big" data-act="pquiz" data-arg="">🎯 Mixed particle quiz</button>
      <div class="pgrid">
        ${PARTICLES.map(p => `<button class="pcard" data-act="particle" data-arg="${p.id}">
          <span class="pch" lang="ja">${p.p}</span>
          <span class="pt"><b>${esc(p.ro)}</b> · ${esc(p.title)}${S().settings.hindi ? `<small lang="hi-Latn">${esc(p.hg)}</small>` : ''}</span>
        </button>`).join('')}
      </div>`);
  }

  function particle(id) {
    ctx.clearSess(); st = null;
    const p = PARTICLES.find(x => x.id === id);
    render(`
      <div class="head">${back('particles')}<h1><span lang="ja" class="accent">${p.p}</span> ${esc(p.ro)}</h1></div>
      <p class="muted sub">${esc(p.title)}</p>
      <div class="card left">
        <p>${esc(p.explain)}</p>
        ${S().settings.hindi ? `<div class="compare"><b>🇮🇳 Hindi mein:</b> ${esc(p.hindi)}</div>` : ''}
        ${p.tip ? `<div class="note">💡 ${esc(p.tip)}</div>` : ''}
      </div>
      <h2 class="sec">Examples <small class="muted">tap to hear</small></h2>
      <ul class="phrases">${p.examples.map((e, i) => example(e, i, `pt:${p.id}:${i}`)).join('')}</ul>
      <button class="btn primary big" data-act="pquiz" data-arg="${p.id}">🎯 Practise ${p.p}</button>`);
  }

  function pquiz(id) {
    const pool = id
      ? [...PARTICLES.find(x => x.id === id).examples.map(e => ({ e, pid: id })), ...shuffle(PARTICLES.filter(x => x.id !== id).flatMap(x => x.examples.map(e => ({ e, pid: x.id })))).slice(0, 4)]
      : PARTICLES.flatMap(x => x.examples.map(e => ({ e, pid: x.id })));
    const qs = shuffle(pool).slice(0, id ? 8 : 10).map(({ e, pid }) => {
      const answer = e[0].match(/\[(.+?)\]/)[1];
      const bad = ALL_PARTICLES.filter(p => p !== answer && !(CONFUSABLE[answer] || []).includes(p));
      return { e, pid, answer, options: shuffle([answer, ...shuffle(bad).slice(0, 3)]) };
    });
    st = { kind: 'pquiz', id, qs, i: 0, right: 0 };
    ctx.setSess(st);
    pquizQ();
  }

  function pquizQ() {
    const q = st.qs[st.i];
    if (!q) return quizDone(`Particle quiz: ${st.right}/${st.qs.length}`, st.id ? 'particle' : 'particles', st.id || '');
    st.answered = false;
    render(`
      <div class="head">${back(st.id ? 'particle' : 'particles', st.id || '')}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">
        <span class="tag alt">Fill in the particle</span>
        <div class="jp big-jp" lang="ja">${mark(q.e[0], true)}</div>
        ${S().settings.kana ? `<div class="kana" lang="ja">${mark(q.e[1], true)}</div>` : ''}
        <div class="en">${esc(q.e[3])}</div>${hg(q.e[4])}
      </div>
      <div class="choices four">${q.options.map(o => `<button class="choice center" data-act="panswer" data-arg="${o}"><span lang="ja" class="pch-sm">${o}</span></button>`).join('')}</div>
      <div class="actions" id="actions"></div>`);
  }

  function panswer(o) {
    if (st.answered) return;
    st.answered = true;
    const q = st.qs[st.i];
    const ok = o === q.answer;
    if (ok) st.right++;
    document.querySelectorAll('.choice').forEach(b => {
      b.disabled = true;
      if (b.dataset.arg === q.answer) b.classList.add('right'); else if (b.dataset.arg === o) b.classList.add('wrong');
    });
    const p = PARTICLES.find(x => x.id === q.pid);
    document.getElementById('actions').innerHTML = `
      <div class="card compact left"><div class="jp" lang="ja">${mark(q.e[0])}</div>${ro(plain(q.e[2]))}
        ${ok ? '' : `<div class="note">💡 <b>${p.p}</b> = ${esc(p.title)}${S().settings.hindi ? ` · ${esc(p.hg)}` : ''}</div>`}</div>
      <button class="btn primary big" data-act="pnext">${st.i + 1 < st.qs.length ? 'Next' : 'See score'}</button>`;
    speak(plain(q.e[0]));
  }

  // ================= Verbs =================
  const vRomaji = (kana, form) => toRomaji(kana, { keepFinalU: form === 'dict' });

  function verbs() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('study')}<h1>Verbs <span lang="ja" class="accent">動詞</span></h1></div>
      <div class="groups">${GROUPS.map(g => `<div class="card left group g${g.id}">
        <b>${esc(g.name)}</b> <span class="muted" lang="ja">${g.jp}</span>
        <p>${esc(g.how)}</p>${hg(g.hg)}</div>`).join('')}</div>
      <ul class="tips">${TIPS.map(t => `<li>💡 ${esc(t)}</li>`).join('')}</ul>
      <button class="btn primary big" data-act="vquiz">🎯 Conjugation quiz</button>
      ${GROUPS.map(g => `
        <h2 class="sec">${esc(g.name)}</h2>
        <div class="vlist">${VERBS.map((v, i) => v.group === g.id ? `<button class="vrow" data-act="verb" data-arg="${i}">
          <span lang="ja" class="vjp">${v.jp}</span>
          <span class="vmeta">${S().settings.romaji ? `<i>${vRomaji(v.kana, 'dict')}</i> · ` : ''}${esc(v.en)}${S().settings.hindi ? ` · <span lang="hi-Latn" class="muted">${esc(v.hg)}</span>` : ''}</span>
          <span class="pill g${v.group}">${v.group}</span>
        </button>` : '').join('')}</div>`).join('')}`);
  }

  function verb(i) {
    ctx.clearSess(); st = null;
    const v = VERBS[+i];
    const c = conjugate(v);
    const g = GROUPS.find(x => x.id === v.group);
    render(`
      <div class="head">${back('verbs')}<h1><span lang="ja">${v.jp}</span></h1><span class="pill g${v.group}">Group ${v.group}</span></div>
      <p class="muted sub"><span lang="ja">${v.kana}</span> · ${vRomaji(v.kana, 'dict')} · ${esc(v.en)}${S().settings.hindi ? ` · <span lang="hi-Latn">${esc(v.hg)}</span>` : ''}</p>
      <div class="card left">
        <div><b>How to use:</b> <span lang="ja">${esc(v.use)}</span></div>
        <ul class="phrases">${example(v.ex, 0)}</ul>
        <div class="note">💡 ${esc(g.how)}</div>
      </div>
      <h2 class="sec">All forms <small class="muted">tap to hear</small></h2>
      <div class="conj">${FORMS.map(f => `<button class="crow" data-act="say-text" data-arg="${esc(c[f.id][0])}">
        <span class="cl"><b>${esc(f.label)}</b><small>${esc(f.en)}${S().settings.hindi ? ` · <span lang="hi-Latn">${esc(f.hg)}</span>` : ''}</small></span>
        <span class="cv"><span lang="ja" class="cj">${c[f.id][0]}</span>${S().settings.kana && c[f.id][1] !== c[f.id][0] ? `<small lang="ja">${c[f.id][1]}</small>` : ''}${S().settings.romaji ? `<small class="ro">${vRomaji(c[f.id][1], f.id)}</small>` : ''}</span>
      </button>`).join('')}</div>`);
  }

  // Wrong answers that look plausible: same verb in the wrong group, the classic ます-stem + て mistake, other forms.
  function verbDistractors(v, form, right) {
    const c = conjugate(v);
    const cands = [];
    for (const g of [1, 2]) if (g !== v.group && v.group !== 3) { try { cands.push(conjugate({ ...v, group: g })[form][0]); } catch (_) { /* not conjugatable that way */ } }
    if (form === 'te' || form === 'ta') cands.push(c.masu[0].replace(/ます$/, form === 'te' ? 'て' : 'た'));
    if (form === 'nai') cands.push(c.masu[0].replace(/ます$/, 'ない'));
    if (form === 'masu' && v.group === 1) cands.push(v.jp.slice(0, -1) + 'ます');
    cands.push(...shuffle(FORMS.filter(f => f.id !== form && f.id !== 'dict').map(f => c[f.id][0])));
    return [...new Set(cands.filter(x => x !== right))].slice(0, 3);
  }

  function vquiz() {
    const forms = FORMS.filter(f => f.id !== 'dict');
    const qs = shuffle(VERBS).slice(0, 10).map(v => {
      const f = forms[Math.floor(Math.random() * forms.length)];
      const right = conjugate(v)[f.id][0];
      return { v, f, right, options: shuffle([right, ...verbDistractors(v, f.id, right)]) };
    });
    st = { kind: 'vquiz', qs, i: 0, right: 0 };
    ctx.setSess(st);
    vquizQ();
  }

  function vquizQ() {
    const q = st.qs[st.i];
    if (!q) return quizDone(`Conjugation quiz: ${st.right}/${st.qs.length}`, 'verbs', '');
    st.answered = false;
    render(`
      <div class="head">${back('verbs')}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">
        <span class="tag alt">Make the ${esc(q.f.label)} form</span>
        <div class="jp big-jp" lang="ja">${q.v.jp}</div>
        <div class="muted">${S().settings.romaji ? vRomaji(q.v.kana, 'dict') + ' · ' : ''}${esc(q.v.en)} · group ${q.v.group}</div>
        <div class="en">${esc(q.f.en)}</div>${hg(q.f.hg)}
      </div>
      <div class="choices">${q.options.map(o => `<button class="choice" data-act="vanswer" data-arg="${esc(o)}"><span lang="ja">${esc(o)}</span></button>`).join('')}</div>
      <div class="actions" id="actions"></div>`);
  }

  function vanswer(o) {
    if (st.answered) return;
    st.answered = true;
    const q = st.qs[st.i];
    const ok = o === q.right;
    if (ok) st.right++;
    document.querySelectorAll('.choice').forEach(b => {
      b.disabled = true;
      if (b.dataset.arg === q.right) b.classList.add('right'); else if (b.dataset.arg === o) b.classList.add('wrong');
    });
    const kana = conjugate(q.v)[q.f.id][1];
    document.getElementById('actions').innerHTML = `
      ${ok ? '' : `<div class="card compact left"><span lang="ja">${q.right}</span> ${S().settings.romaji ? `<i class="muted">${vRomaji(kana, q.f.id)}</i>` : ''}
        <div class="note">💡 ${esc(GROUPS.find(g => g.id === q.v.group).how)}</div></div>`}
      <button class="btn primary big" data-act="vnext">${st.i + 1 < st.qs.length ? 'Next' : 'See score'}</button>`;
    speak(q.right);
  }

  // ================= Kanji =================
  let kLevel = 'n5'; // chosen level, for this visit only
  const klevel = () => kLevel;
  const levelKanji = () => KANJI.filter(k => k.level === klevel());

  function kanji() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('study')}<h1>Kanji <span lang="ja">漢字</span></h1></div>
      <details class="fold"><summary>💡 How kanji work</summary><div class="fold-body">${esc(KANJI_INTRO.en)}${hg(KANJI_INTRO.hg, 'hi intro-hg')}</div></details>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === klevel() ? 'on' : ''}" data-act="kanji-level" data-arg="${l}">${l.toUpperCase()} · ${KANJI.filter(k => k.level === l).length} kanji</button>`).join('')}</div>
      <div class="row">
        <button class="btn primary" data-act="klearn" data-arg="">🃏 Flashcards</button>
        <button class="btn" data-act="kquiz" data-arg="">🎯 Quiz</button>
      </div>
      ${ALL_KANJI_GROUPS.filter(g => g.level === klevel()).map(g => `
        <h2 class="sec">${g.icon} ${esc(g.title)}${S().settings.hindi ? ` <small class="muted" lang="hi-Latn">${esc(g.hg)}</small>` : ''}</h2>
        <div class="kgrid">${g.kanji.map(k => `<button class="ktile" data-act="kanji-one" data-arg="${k[0]}">
          <span lang="ja">${k[0]}</span><small>${esc(k[3].split(' /')[0])}</small></button>`).join('')}</div>
        <button class="btn small ghost" data-act="klearn" data-arg="${g.id}">🃏 Learn this group</button>`).join('')}`);
  }

  function kanjiDetail(k, cls = '') {
    return `<div class="kdetail ${cls}">
      <div class="kbig" lang="ja">${k.ch}</div>
      <div class="kmean">${esc(k.en)}${hg(k.hg)}</div>
      ${k.pic ? `<div class="khint"><span>${k.pic}</span>${esc(k.hint)}</div>` : ''}
      <div class="kread">
        ${k.on ? `<div><span class="pill">On</span> <span lang="ja">${k.on}</span>${S().settings.romaji ? ` <small class="ro">${toRomaji(k.on.replace(/[()]/g, '').replace(/・/g, ' · '))}</small>` : ''}</div>` : ''}
        ${k.kun ? `<div><span class="pill">Kun</span> <span lang="ja">${k.kun}</span>${S().settings.romaji ? ` <small class="ro">${toRomaji(k.kun.replace(/[()]/g, '').replace(/・/g, ' · '))}</small>` : ''}</div>` : ''}
      </div>
      <ul class="phrases">${k.ex.map(e => `<li class="ex" data-act="say-text" data-arg="${esc(sayable(e[0], e[1]))}">
        <div class="jp" lang="ja">${esc(e[0])} <span class="kana-inline">${esc(e[1])}</span></div>${ro(e[2])}
        <div class="en">${esc(e[3])}</div>${hg(e[4])}</li>`).join('')}</ul>
    </div>`;
  }

  function kanjiOne(ch) {
    ctx.clearSess(); st = null;
    const k = KANJI.find(x => x.ch === ch);
    if (!k) return kanji();
    const list = KANJI.filter(x => x.group === k.group), i = list.indexOf(k);
    render(`
      <div class="head">${back('kanji')}<h1>${esc(ALL_KANJI_GROUPS.find(g => g.id === k.group).title)}</h1><span class="pill">${k.level.toUpperCase()}</span></div>
      <div class="card">${kanjiDetail(k)}</div>
      <button class="btn" data-act="stroke-open" data-arg="${k.ch}">✍️ Stroke order</button>
      <div class="row">
        <button class="btn" data-act="kanji-one" data-arg="${list[i - 1]?.ch || ''}" ${i ? '' : 'disabled'}>‹ ${list[i - 1]?.ch || ''}</button>
        <button class="btn" data-act="kanji-one" data-arg="${list[i + 1]?.ch || ''}" ${list[i + 1] ? '' : 'disabled'}>${list[i + 1]?.ch || ''} ›</button>
      </div>`);
  }

  function klearn(groupId) {
    const items = (groupId ? KANJI.filter(k => k.group === groupId) : levelKanji()).map(k => ({ ...k, id: k.ch }));
    const queue = shuffle(items).slice(0, 12);
    st = { kind: 'klearn', groupId, queue, i: 0, done: 0 };
    ctx.setSess(st);
    kcard();
  }

  function kcard() {
    const k = st.queue[st.i];
    if (!k) { return quizDone(`${st.done} kanji practised`, 'kanji', ''); }
    st.revealed = false;
    const ex0 = x => x?.ex?.[0] && sayable(x.ex[0][0], x.ex[0][1]);
    prefetchClip(ex0(k)); prefetchClip(ex0(st.queue[st.i + 1]));
    render(`
      <div class="head">${back('kanji')}<div class="grow">${bar(st.i, st.queue.length)}</div><span class="muted">${st.i + 1}/${st.queue.length}</span></div>
      <div class="card">
        <span class="tag alt">What does it mean?</span>
        <div id="kfront" class="kbig" lang="ja">${k.ch}</div>
        <div id="answer" hidden>${kanjiDetail(k, 'no-big')}</div>
      </div>
      <div class="actions" id="actions"><button class="btn primary big" data-act="kreveal">Show answer</button></div>`);
  }

  function kreveal() {
    if (st.revealed) return;
    st.revealed = true;
    document.getElementById('answer').hidden = false;
    document.getElementById('actions').innerHTML = `<div class="grades two">
      <button class="btn again" data-act="kgrade" data-arg="again">Again later</button>
      <button class="btn good" data-act="kgrade" data-arg="ok">Got it</button></div>`;
    speak(sayable(st.queue[st.i].ex[0][0], st.queue[st.i].ex[0][1]));
  }

  function kgrade(g) {
    const k = st.queue[st.i];
    if (g === 'again') st.queue.push(k); else st.done++; // nothing saved: “again” repeats it this session
    st.i++; kcard();
  }

  function kquiz() {
    const pool = levelKanji();
    const qs = shuffle(pool).slice(0, 10).map((k, n) => {
      if (n % 2 === 0) {
        const others = shuffle(pool.filter(o => o.ch !== k.ch && !sameMeaning(o.en, k.en))).slice(0, 3);
        return { type: 'meaning', k, right: k.en, options: shuffle([k, ...others]).map(o => ({ v: o.en, hg: o.hg })) };
      }
      const word = k.ex[Math.floor(Math.random() * k.ex.length)];
      const others = shuffle(pool.flatMap(o => o.ex).filter(e => e[1] !== word[1])).slice(0, 3);
      return { type: 'reading', k, word, right: word[1], options: shuffle([word, ...others]).map(e => ({ v: e[1], ro: e[2] })) };
    });
    st = { kind: 'kquiz', qs, i: 0, right: 0 };
    ctx.setSess(st);
    kquizQ();
  }

  function kquizQ() {
    const q = st.qs[st.i];
    if (!q) return quizDone(`Kanji quiz: ${st.right}/${st.qs.length}`, 'kanji', '');
    st.answered = false;
    render(`
      <div class="head">${back('kanji')}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">
        <span class="tag alt">${q.type === 'meaning' ? 'What does this kanji mean?' : 'How do you read this word?'}</span>
        <div class="kbig" lang="ja">${q.type === 'meaning' ? q.k.ch : esc(q.word[0])}</div>
        ${q.type === 'reading' ? `<div class="en">${esc(q.word[3])}</div>${hg(q.word[4])}` : ''}
      </div>
      <div class="choices">${q.options.map(o => `<button class="choice" data-act="kanswer" data-arg="${esc(o.v)}">${q.type === 'meaning'
        ? `${esc(o.v)}${S().settings.hindi ? `<small lang="hi-Latn">${esc(o.hg)}</small>` : ''}`
        : `<span lang="ja">${esc(o.v)}</span>`}</button>`).join('')}</div>
      <div class="actions" id="actions"></div>`);
  }

  function kanswer(o) {
    if (st.answered) return;
    st.answered = true;
    const q = st.qs[st.i];
    const ok = o === q.right;
    if (ok) st.right++;
    document.querySelectorAll('.choice').forEach(b => {
      b.disabled = true;
      if (b.dataset.arg === q.right) b.classList.add('right'); else if (b.dataset.arg === o) b.classList.add('wrong');
    });
    document.getElementById('actions').innerHTML = `
      ${ok ? '' : `<div class="card compact">${kanjiDetail(q.k, 'no-big')}</div>`}
      <button class="btn primary big" data-act="knext">${st.i + 1 < st.qs.length ? 'Next' : 'See score'}</button>`;
    speak(q.type === 'meaning' ? sayable(q.k.ex[0][0], q.k.ex[0][1]) : sayable(q.word[0], q.word[1]));
  }

  // ================= Shared =================
  function quizDone(title, backTo, arg, onDone) {
    onDone?.();
    st = null; ctx.clearSess();
    render(`<div class="done">
      <div class="big-emoji">🌸</div><h1>${esc(title)}</h1>
      <p class="muted">よくできました！ Bahut badhiya!</p>
      <button class="btn primary big" data-act="${backTo}" data-arg="${esc(arg)}">Back</button>
    </div>`);
  }

  // ================= Counters =================
  // Readings 1–10; a reading that isn't simply "number + counter" is a sound change, and is highlighted.
  const cNum = (c, i) => c.nums?.[i] || NUMBER_KANJI[i] + c.c;
  const irregular = (c, i) => c.n[i] !== NUMBERS[i] + c.kana;

  function counters() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('study')}<h1>Counters <span lang="ja" class="accent">助数詞</span></h1></div>
      <div class="card left"><p>${esc(COUNTER_INTRO.en)}</p>${hg(COUNTER_INTRO.hg)}
        <div class="note">💡 From 11 on: じゅう + the 1–9 reading (十一本 じゅういっぽん, 十三本 じゅうさんぼん). Ask “how many” with 何 + counter (何本 なんぼん).</div></div>
      <button class="btn primary big" data-act="cquiz" data-arg="">🎯 Counter quiz</button>
      ${COUNTER_GROUPS.map(g => `<h2 class="sec">${g.icon} ${esc(g.title)}${S().settings.hindi ? ` <small class="muted" lang="hi-Latn">${esc(g.hg)}</small>` : ''}</h2>
        <div class="pgrid">${COUNTERS.filter(c => c.group === g.id).map(c => `<button class="pcard" data-act="counter" data-arg="${c.id}">
          <span class="pch" lang="ja">${c.c}</span>
          <span class="pt"><b>${c.pic} ${esc(c.title)}</b><small lang="ja">${c.kana} · ${c.level.toUpperCase()}</small></span>
        </button>`).join('')}</div>`).join('')}`);
  }

  function counter(id) {
    ctx.clearSess(); st = null;
    const c = COUNTERS.find(x => x.id === id);
    const cell = i => `<button class="ccell${irregular(c, i) ? ' irr' : ''}" data-act="say-text" data-arg="${c.n[i]}">
      <b lang="ja">${cNum(c, i)}</b><span lang="ja">${c.n[i]}</span>${S().settings.romaji ? `<small>${toRomaji(c.n[i])}</small>` : ''}</button>`;
    render(`
      <div class="head">${back('counters')}<h1><span lang="ja" class="accent">${c.c}</span> ${esc(c.title)}</h1></div>
      <p class="muted sub"><span lang="ja">${c.kana}</span> · ${toRomaji(c.kana)} · ${c.level.toUpperCase()}</p>
      <div class="card left">
        <p>${esc(c.use)}</p>${hg(c.useHg)}
        <div class="citems">${c.items.map(([pic, en]) => `<span class="pill">${pic} ${esc(en)}</span>`).join(' ')}</div>
        <div class="row ask"><span>How many? </span><button class="btn small" data-act="say-text" data-arg="${c.ask[1]}"><span lang="ja">${c.ask[0]}</span>${c.ask[0] !== c.ask[1] ? ` <small lang="ja">${c.ask[1]}</small>` : ''} 🔊</button></div>
      </div>
      <h2 class="sec">1 to 10 <small class="muted">tap to hear · <span class="irr-key">highlighted</span> = sound change</small></h2>
      <div class="ctable">${c.n.map((_, i) => cell(i)).join('')}</div>
      <h2 class="sec">Examples <small class="muted">tap to hear</small></h2>
      <ul class="phrases">${c.ex.map((e, i) => example(e, i)).join('')}</ul>
      <button class="btn primary big" data-act="cquiz" data-arg="${c.id}">🎯 Practise ${c.c}</button>`);
  }

  // Wrong readings people actually say: the plain "number + counter", or the wrong sound change.
  const VOICE = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };
  const HALFV = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };
  function readingDistractors(c, i) {
    const k = c.kana, num = NUMBERS[i], short = num.replace(/[ちくつ]$/, 'っ').replace(/^じゅう$/, 'じゅっ');
    const heads = [k, VOICE[k[0]] ? VOICE[k[0]] + k.slice(1) : k, HALFV[k[0]] ? HALFV[k[0]] + k.slice(1) : k];
    const near = new Set(shuffle([...heads.map(h => num + h), ...heads.map(h => short + h)]));
    const far = shuffle(COUNTERS.filter(o => o.kana !== c.kana).map(o => o.n[i]));
    return [...new Set([...near, ...far])].filter(x => x !== c.n[i]).slice(0, 3);
  }
  // Counters that are also right for the same thing, so they're never offered as wrong answers.
  const ALSO_RIGHT = { nin: ['mei'], mei: ['nin'], mai: ['chaku'], chaku: ['mai'], kenn: ['tsuu'], tsuu: ['kenn'] };
  const alsoRight = (c, o) => (ALSO_RIGHT[c.id] || []).includes(o.id) || (c.group === 'things' && o.id === 'tsu') || (c.id === 'tsu' && o.group === 'things');

  function cquiz(id) {
    const pool = id ? COUNTERS.filter(c => c.id === id) : COUNTERS;
    const qs = [];
    // How do you read it? (sound changes first)
    for (const c of pool) for (let i = 0; i < 10; i++) qs.push({ type: 'read', c, i, w: irregular(c, i) ? 3 : 1 });
    const reads = shuffle(qs.flatMap(q => Array(q.w).fill(q))).filter((q, k, a) => a.findIndex(x => x.c === q.c && x.i === q.i) === k).slice(0, id ? 8 : 5)
      .map(q => ({ ...q, right: q.c.n[q.i], options: shuffle([q.c.n[q.i], ...readingDistractors(q.c, q.i)]) }));
    // Which counter? (whole-app quiz only)
    const which = id ? [] : shuffle(COUNTERS.flatMap(c => c.items.map(it => ({ c, it })))).slice(0, 5).map(({ c, it }) => {
      const n = 2 + Math.floor(Math.random() * 3);
      const wrong = shuffle(COUNTERS.filter(o => o !== c && !alsoRight(c, o) && o.kana !== c.kana)).slice(0, 3);
      return { type: 'which', c, it, n, right: c.c, options: shuffle([c, ...wrong]).map(o => o.c) };
    });
    st = { kind: 'cquiz', id, qs: shuffle([...reads, ...which]), i: 0, right: 0 };
    ctx.setSess(st);
    cquizQ();
  }

  function cquizQ() {
    const q = st.qs[st.i];
    if (!q) return quizDone(`Counter quiz: ${st.right}/${st.qs.length}`, st.id ? 'counter' : 'counters', st.id || '');
    st.answered = false;
    const prompt = q.type === 'read'
      ? `<span class="tag alt">How do you read it?</span><div class="kbig" lang="ja">${cNum(q.c, q.i)}</div><div class="muted">${q.c.pic} ${esc(q.c.title)}</div>`
      : `<span class="tag alt">Which counter?</span><div class="wpic huge">${q.it[0].repeat(q.n)}</div><div class="prompt">${q.n} × ${esc(q.it[1])}</div>${q.it[2] !== q.it[1] ? hg(q.it[2], 'prompt-hi') : ''}`;
    render(`
      <div class="head">${back(st.id ? 'counter' : 'counters', st.id || '')}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">${prompt}</div>
      <div class="choices four">${q.options.map(o => `<button class="choice center" data-act="canswer" data-arg="${esc(o)}"><span lang="ja" class="pch-sm">${esc(o)}</span></button>`).join('')}</div>
      <div class="actions" id="actions"></div>`);
  }

  function canswer(o) {
    if (st.answered) return;
    st.answered = true;
    const q = st.qs[st.i], ok = o === q.right;
    if (ok) st.right++;
    document.querySelectorAll('.choice').forEach(b => {
      b.disabled = true;
      if (b.dataset.arg === q.right) b.classList.add('right'); else if (b.dataset.arg === o) b.classList.add('wrong');
    });
    const c = q.c, idx = q.type === 'read' ? q.i : q.n - 1, say = c.n[idx];
    document.getElementById('actions').innerHTML = `
      <div class="card compact left"><b lang="ja">${cNum(c, idx)}</b> <span lang="ja">${say}</span>${S().settings.romaji ? ` <small class="ro">${toRomaji(say)}</small>` : ''}
        <div class="muted small"><span lang="ja">${c.c}</span> · ${esc(c.title)}${!ok && q.type === 'read' && irregular(c, q.i) ? ' · a sound change: not just number + counter' : ''}</div></div>
      <button class="btn primary big" data-act="cnext">${st.i + 1 < st.qs.length ? 'Next' : 'See score'}</button>`;
    speak(say);
  }

  const actions = {
    grammar: () => ctx.go('study'),
    study: () => ctx.go('study'),
    particles: () => ctx.go('particles'),
    particle: id => ctx.go('particle/' + id),
    pquiz: id => pquiz(id),
    panswer: o => panswer(o),
    pnext: () => { st.i++; pquizQ(); },
    verbs: () => ctx.go('verbs'),
    verb: i => ctx.go('verb/' + i),
    vquiz: () => vquiz(),
    vanswer: o => vanswer(o),
    vnext: () => { st.i++; vquizQ(); },
    kanji: () => ctx.go('kanji'),
    'kanji-one': ch => ch && ctx.go('kanji/' + encodeURIComponent(ch)),
    'kanji-level': l => { kLevel = l === 'n4' ? 'n4' : 'n5'; kanji(); },
    klearn: g => klearn(g),
    kreveal: () => kreveal(),
    kgrade: g => kgrade(g),
    kquiz: () => kquiz(),
    kanswer: o => kanswer(o),
    knext: () => { st.i++; kquizQ(); },
    counters: () => ctx.go('counters'),
    counter: id => ctx.go('counter/' + id),
    cquiz: id => cquiz(id),
    canswer: o => canswer(o),
    cnext: () => { st.i++; cquizQ(); },
    'say-text': t => speak(t),
  };

  // Returns true when the hash belongs to this module.
  function route(h) {
    if (h === 'study' || h === 'grammar') return studyHub(), true;
    if (h === 'particles') return particles(), true;
    if (h.startsWith('particle/') && PARTICLES.some(p => p.id === h.slice(9))) return particle(h.slice(9)), true;
    if (h === 'counters') return counters(), true;
    if (h.startsWith('counter/') && COUNTERS.some(c => c.id === h.slice(8))) return counter(h.slice(8)), true;
    if (h === 'verbs') return verbs(), true;
    if (h.startsWith('verb/') && VERBS[+h.slice(5)]) return verb(h.slice(5)), true;
    if (h === 'kanji') return kanji(), true;
    if (h === 'kanji/n4') { kLevel = 'n4'; return kanji(), true; }
    if (h.startsWith('kanji/')) { try { return kanjiOne(decodeURIComponent(h.slice(6))), true; } catch (_) { return kanji(), true; } }
    return false;
  }

  // Re-draw after a settings change.
  function rerender() {
    if (!st) return false;
    if (st.kind === 'pquiz') pquizQ();
    else if (st.kind === 'vquiz') vquizQ();
    else if (st.kind === 'kquiz') kquizQ();
    else if (st.kind === 'cquiz') cquizQ();
    else kcard();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; }, keydown(e) {
    if (st?.kind !== 'klearn') return false;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!st.revealed) kreveal(); return true; }
    if (st.revealed && '12'.includes(e.key)) { kgrade(e.key === '1' ? 'again' : 'ok'); return true; }
    return false;
  } };
}
