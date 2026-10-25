// Particles, Verbs, Counters and Kanji sections. Shared helpers come from app.js via ctx.
// No quizzes since v6.0 (the user's choice, 2026-10-25): explanations, examples to hear and kanji flashcards only.
import { PARTICLES, PARTICLES_INTRO } from './particles-data.js';
import { furigana, markBrackets } from './furigana.js';
import { prefetchClip } from './clips.js';
import { VERBS, GROUPS, TIPS } from './verbs-data.js';
import { KANJI, ALL_KANJI_GROUPS, KANJI_INTRO } from './kanji-data.js';
import { conjugate, toRomaji, FORMS } from './conjugate.js';
import { sayable } from './core.js';
import { COUNTERS, COUNTER_GROUPS, COUNTER_INTRO, NUMBERS, NUMBER_KANJI } from './counters-data.js';
import { icon } from './icons.js';

const plain = s => s.replace(/[[\]]/g, '');

export function initStudy(ctx) {
  const { esc, render, speak, shuffle, bar, back } = ctx;
  const S = () => ctx.S();
  const hg = (text, cls = 'hi') => S().settings.hindi && text ? `<div class="${cls}" lang="hi-Latn">${esc(text)}</div>` : '';
  const ro = text => S().settings.romaji ? `<div class="ro">${esc(text)}</div>` : '';
  const kanaLine = (kana, jp) => S().settings.kana && kana !== jp ? `<div class="kana" lang="ja">${esc(kana)}</div>` : '';
  let st = null; // current flashcard state for this module

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
      <p class="muted">Not sure where to start? The <a class="inline-link" href="#path/jlpt">${icon('path-jlpt')} N5·N4 path</a> tells you what to study, in order.</p>
      <h2 class="sec">Grammar <span lang="ja">文法</span></h2>
      <div class="intro">${esc(PARTICLES_INTRO.en)}${hg(PARTICLES_INTRO.hg, 'hi intro-hg')}</div>
      <div class="speak-grid">
        <button class="scard" data-act="particles"><span lang="ja" class="pch">は</span><b>Particles</b><small>${PARTICLES.length} little words that glue sentences together: は, を, に, で…</small></button>
        <button class="scard" data-act="verbs">${icon('verbs')}<b>Verbs</b><small>${VERBS.length} verbs with every form: ます, て, ない, た…</small></button>
        <button class="scard" data-act="counters"><span lang="ja" class="pch">本</span><b>Counters</b><small>${COUNTERS.length} ways to count: 本, 枚, 人, 個… with the tricky sound changes</small></button>
        <button class="scard" data-act="jlpt-grammar" data-arg="n5">${icon('grammar')}<b>Grammar points</b><small>Every N5 and N4 pattern with examples (in the JLPT tab)</small></button>
      </div>
      <h2 class="sec">Kanji <span lang="ja">漢字</span></h2>
      <div class="speak-grid">
        <button class="scard" data-act="kanji"><span lang="ja" class="pch">漢</span><b>Kanji</b><small>${KANJI.length} N5 and N4 kanji with readings, examples and flashcards</small></button>
        <button class="scard" data-act="stroke-tab">${icon('strokes')}<b>Stroke order</b><small>Watch every kanji, hiragana and katakana drawn stroke by stroke</small></button>
      </div>`);
  }

  // ================= Particles =================
  function particles() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('study')}<h1>Particles <span lang="ja" class="accent">助詞</span></h1></div>
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
      <ul class="phrases">${p.examples.map((e, i) => example(e, i, `pt:${p.id}:${i}`)).join('')}</ul>`);
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
    if (!k) { return finished(`${st.done} kanji practised`, 'kanji', ''); }
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

  // ================= Shared =================
  // The end of a flashcard round (the quizzes that also used this are gone since v6.0).
  function finished(title, backTo, arg, onDone) {
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
      <ul class="phrases">${c.ex.map((e, i) => example(e, i)).join('')}</ul>`);
  }

  const actions = {
    grammar: () => ctx.go('study'),
    study: () => ctx.go('study'),
    particles: () => ctx.go('particles'),
    particle: id => ctx.go('particle/' + id),
    verbs: () => ctx.go('verbs'),
    verb: i => ctx.go('verb/' + i),
    kanji: () => ctx.go('kanji'),
    'kanji-one': ch => ch && ctx.go('kanji/' + encodeURIComponent(ch)),
    'kanji-level': l => { kLevel = l === 'n4' ? 'n4' : 'n5'; kanji(); },
    klearn: g => klearn(g),
    kreveal: () => kreveal(),
    kgrade: g => kgrade(g),
    counters: () => ctx.go('counters'),
    counter: id => ctx.go('counter/' + id),
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
    kcard();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; }, keydown(e) {
    if (st?.kind !== 'klearn') return false;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!st.revealed) kreveal(); return true; }
    if (st.revealed && '12'.includes(e.key)) { kgrade(e.key === '1' ? 'again' : 'ok'); return true; }
    return false;
  } };
}
