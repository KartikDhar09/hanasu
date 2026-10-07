// Particles, Verbs and Kanji sections. Shared helpers come from app.js via ctx.
import { PARTICLES, PARTICLES_INTRO, CONFUSABLE } from './particles-data.js';
import { furigana, markBrackets } from './furigana.js';
import { VERBS, GROUPS, TIPS } from './verbs-data.js';
import { KANJI, ALL_KANJI_GROUPS, KANJI_INTRO } from './kanji-data.js';
import { conjugate, toRomaji, FORMS } from './conjugate.js';

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

  function example(e, i, key) {
    const furi = S().settings.kana ? furigana(e[0], e[1], esc, markBrackets(esc)) : null;
    return `<li class="ex" data-act="say-text" data-arg="${esc(plain(e[0]))}">
      <div class="jp" lang="ja">${furi || mark(e[0])}</div>
      ${S().settings.kana && !furi ? `<div class="kana" lang="ja">${mark(e[1])}</div>` : ''}
      ${ro(plain(e[2]))}
      <div class="en">${esc(e[3])}</div>${hg(e[4])}
    </li>`;
  }

  // ================= Grammar hub =================
  function grammarHub() {
    ctx.clearSess(); st = null;
    render(`
      <h1 class="page">Grammar <span lang="ja">文法</span></h1>
      <div class="intro">${esc(PARTICLES_INTRO.en)}${hg(PARTICLES_INTRO.hg, 'hi intro-hg')}</div>
      <div class="speak-grid">
        <button class="scard" data-act="particles"><span lang="ja" class="pch">は</span><b>Particles</b><small>${PARTICLES.length} little words that glue sentences together: は, を, に, で…</small></button>
        <button class="scard" data-act="verbs"><span>🏃</span><b>Verbs</b><small>${VERBS.length} verbs with every form: ます, て, ない, た…</small></button>
      </div>`);
  }

  // ================= Particles =================
  function particles() {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('grammar')}<h1>Particles <span lang="ja" class="accent">助詞</span></h1></div>
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
      <h3>Examples <small class="muted">tap to hear</small></h3>
      <ul class="phrases">${p.examples.map((e, i) => example(e, i)).join('')}</ul>
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
      <div class="head">${back('grammar')}<h1>Verbs <span lang="ja" class="accent">動詞</span></h1></div>
      <div class="groups">${GROUPS.map(g => `<div class="card left group g${g.id}">
        <b>${esc(g.name)}</b> <span class="muted" lang="ja">${g.jp}</span>
        <p>${esc(g.how)}</p>${hg(g.hg)}</div>`).join('')}</div>
      <ul class="tips">${TIPS.map(t => `<li>💡 ${esc(t)}</li>`).join('')}</ul>
      <button class="btn primary big" data-act="vquiz">🎯 Conjugation quiz</button>
      ${GROUPS.map(g => `
        <h3>${esc(g.name)}</h3>
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
      <h3>All forms <small class="muted">tap to hear</small></h3>
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
      <h1 class="page">Kanji <span lang="ja">漢字</span></h1>
      <details class="fold"><summary>💡 How kanji work</summary><div class="fold-body">${esc(KANJI_INTRO.en)}${hg(KANJI_INTRO.hg, 'hi intro-hg')}</div></details>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === klevel() ? 'on' : ''}" data-act="kanji-level" data-arg="${l}">${l.toUpperCase()} · ${KANJI.filter(k => k.level === l).length} kanji</button>`).join('')}</div>
      <div class="row">
        <button class="btn primary" data-act="klearn" data-arg="">🃏 Flashcards</button>
        <button class="btn" data-act="kquiz" data-arg="">🎯 Quiz</button>
      </div>
      ${ALL_KANJI_GROUPS.filter(g => g.level === klevel()).map(g => `
        <h3>${g.icon} ${esc(g.title)}${S().settings.hindi ? ` <small class="muted" lang="hi-Latn">${esc(g.hg)}</small>` : ''}</h3>
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
      <ul class="phrases">${k.ex.map(e => `<li class="ex" data-act="say-text" data-arg="${esc(e[0])}">
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
    speak(st.queue[st.i].ex[0][0]);
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
        const others = shuffle(pool.filter(o => o.ch !== k.ch && o.en !== k.en)).slice(0, 3);
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
    speak(q.type === 'meaning' ? q.k.ex[0][0] : q.word[0]);
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

  const actions = {
    grammar: () => ctx.go('grammar'),
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
    'say-text': t => speak(t),
  };

  // Returns true when the hash belongs to this module.
  function route(h) {
    if (h === 'grammar') return grammarHub(), true;
    if (h === 'particles') return particles(), true;
    if (h.startsWith('particle/') && PARTICLES.some(p => p.id === h.slice(9))) return particle(h.slice(9)), true;
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
