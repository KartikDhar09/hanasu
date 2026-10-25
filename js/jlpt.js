// JLPT tab: exam overview, study path, kana charts, grammar points, vocabulary and exam-style reading/listening.
// No quizzes since v6.0 (the user's choice, 2026-10-25): the full N5/N4 mock tests (exam.js) are the only tests.
import { EXAMS, EXAM_TIPS, QUESTION_TYPES, GRAMMAR } from './jlpt-data.js';
import { KANJI_N5, KANJI_N4 } from './kanji-data.js';
import { VOCAB, WORDS } from './vocab-data.js';
import { sayable } from './core.js';
import { READING, LISTENING } from './exam-data.js';
import { toRomaji } from './conjugate.js';
import { furigana, markBrackets } from './furigana.js';
import { prefetchClip } from './clips.js';

import { KANA_ROWS, DAKUTEN_ROWS, COMBO_ROWS, ALL_KANA, toKata, combos } from './kana-data.js';
import { icon } from './icons.js';
export { KANA_ROWS, DAKUTEN_ROWS, COMBO_ROWS, ALL_KANA };

// Splits a sentence into pieces at particle boundaries, for the mock test's ★ word-order questions (exam.js).
// A particle only ends a piece when the next character isn't hiragana (so はい, もう stay whole).
export function chunk(sentence) {
  const s = sentence.replace(/[[\]]/g, '');
  const out = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    cur += s[i];
    const two = s.slice(i - 1, i + 1), next = s[i + 1] || '';
    const isParticle = ['から', 'まで'].includes(two) || 'はをにでがもへと'.includes(s[i]);
    if ((s[i] === '、' || (isParticle && next && !/[ぁ-ゖ、。]/.test(next))) && cur.length > 1) { out.push(cur); cur = ''; }
  }
  if (cur) out.push(cur);
  return out;
}

// Vocabulary levels: the two JLPT levels, plus Life & work (everyday and office words outside the JLPT lists).
const VLEVELS = ['n5', 'n4', 'life'];
const VLABEL = { n5: 'N5', n4: 'N4', life: 'Life & work' };

export function initJlpt(ctx) {
  const { esc, render, speak, shuffle, bar, back } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  let lvl = 'n5'; // chosen level, for this visit only
  const level = () => lvl;
  const mark = (s, blank) => esc(s).replace(/\[(.+?)\]/g, (_, p) => blank ? '<span class="gap wide">？</span>' : `<mark>${p}</mark>`);
  const plain = s => s.replace(/[[\]]/g, '');
  let st = null;

  // ---- Study path: the order to work through each level ----
  const examSteps = lv => [
    ['Reading practice', 'Notes, emails and notices.', 'ex-reading'],
    ['Listening practice', 'Conversations with picture answers.', 'ex-listening'],
    ['Mock test', `Aim for ${EXAMS[lv].pass.total}+/180 with every section above the minimum.`, 'ex-mock'],
  ];

  function path(lv) {
    if (lv === 'n5') return [
      ['Hiragana & katakana', 'Read every kana out loud until none makes you stop.', 'kana'],
      ['Everyday N5 phrases', 'Work through the Everyday N5 track.', 'home'],
      ['Particles', 'Open each particle and say its examples aloud.', 'particles'],
      ['Verbs & forms', 'Conjugation tables: say each form aloud.', 'verbs'],
      ['N5 kanji', `All ${KANJI_N5.length} kanji with flashcards.`, 'kanji'],
      ['N5 vocabulary', `${WORDS.filter(w => w.level === 'n5').length} picture words with flashcards.`, 'jlpt-vocab'],
      ['N5 grammar points', `${GRAMMAR.filter(g => g.level === 'n5').length} patterns with examples to say aloud.`, 'jlpt-grammar'],
      ...examSteps('n5'),
    ];
    return [
      ['N5 first', 'N4 includes everything in N5.', 'jlpt-n5'],
      ['Office & corporate phrases', 'Work through the Office and Corporate tracks.', 'home'],
      ['N4 kanji', `${KANJI_N4.length} more kanji.`, 'kanji-n4'],
      ['N4 vocabulary', `${WORDS.filter(w => w.level === 'n4').length} picture words for work and life.`, 'jlpt-vocab'],
      ['N4 grammar points', `${GRAMMAR.filter(g => g.level === 'n4').length} patterns with examples to say aloud.`, 'jlpt-grammar'],
      ...examSteps('n4'),
    ];
  }

  // ================= Hub =================
  function hub() {
    ctx.clearSess(); st = null;
    const lv = level(), ex = EXAMS[lv];
    const steps = path(lv);
    render(`
      <h1 class="page">JLPT <span lang="ja">日本語能力試験</span></h1>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="jlpt-level" data-arg="${l}">${EXAMS[l].title}</button>`).join('')}</div>
      <div class="card left">
        <b>${ex.title} · ${ex.level}</b>${hg(ex.hg)}
        <p>${esc(ex.can)}</p>${hg(ex.canHg)}
        <div class="note">${icon('need')} You need: ${esc(ex.need)}</div>
      </div>
      <h2 class="sec">Your path to ${ex.title}</h2>
      <ol class="path">${steps.map((s, n) => `<li><button data-act="${s[2]}" data-arg="${['jlpt-grammar', 'jlpt-vocab', 'ex-reading', 'ex-listening', 'ex-mock'].includes(s[2]) ? lv : ''}">
          <span class="pico">${n + 1}</span>
          <span class="ptext"><b>${esc(s[0])}</b><small>${esc(s[1])}</small></span>
          <span class="count">›</span></button></li>`).join('')}</ol>
      <button class="btn primary big mock-btn" data-act="ex-mock" data-arg="${lv}">${icon('mock')} Take a ${ex.title} mock test</button>
      <h2 class="sec">Practise like the exam</h2>
      <div class="speak-grid">
        <button class="scard" data-act="ex-reading" data-arg="${lv}">${icon('reading')}<b>Reading</b><small>${READING.filter(r => r.level === lv).length} real-life passages with questions</small></button>
        <button class="scard" data-act="ex-listening" data-arg="${lv}">${icon('listening')}<b>Listening</b><small>${LISTENING.filter(l => l.level === lv).length} conversations, some with picture answers</small></button>
        <button class="scard" data-act="jlpt-grammar" data-arg="${lv}">${icon('grammar')}<b>Grammar points</b><small>${GRAMMAR.filter(g => g.level === lv).length} ${lv.toUpperCase()} patterns with pictures and examples</small></button>
        <button class="scard" data-act="jlpt-vocab" data-arg="${lv}">${icon('vocab')}<b>Vocabulary</b><small>${WORDS.filter(w => w.level === lv).length} ${lv.toUpperCase()} words with pictures</small></button>
        <button class="scard" data-act="jlpt-vocab" data-arg="life">${icon('work')}<b>Life &amp; work words</b><small>${WORDS.filter(w => w.level === 'life').length} everyday and office words beyond the JLPT</small></button>
        <button class="scard" data-act="kana"><span lang="ja">あア</span><b>Kana charts</b><small>Hiragana & katakana with sound</small></button>
      </div>
      <details class="fold"><summary>${icon('about')} About the exam: sections, times, pass marks</summary>
      <div class="exam">${ex.sections.map(sec => `<div class="exrow"><b>${esc(sec.name)}</b><span class="pill">${sec.min} min</span><small>${esc(sec.parts)}</small></div>`).join('')}</div>
      <div class="card left passbox">
        <b>To pass ${ex.title}</b>
        <div class="passbar"><span>${ex.pass.total} / ${ex.pass.max} total</span><div class="pb"><i style="width:${100 * ex.pass.total / ex.pass.max}%"></i></div></div>
        ${ex.pass.sections.map(([n, min, max]) => `<div class="passbar small"><span>${esc(n)}: at least ${min} / ${max}</span><div class="pb"><i style="width:${100 * min / max}%"></i></div></div>`).join('')}
      </div>
      </details>
      <details class="fold"><summary>${icon('help')} Question types</summary>
      <ul class="phrases">${QUESTION_TYPES.map(q => `<li><b lang="ja">${q[0]}</b> · ${esc(q[1])}<div class="muted small">${esc(q[2])}</div></li>`).join('')}</ul>
      </details>
      <details class="fold"><summary>${icon('tip')} Exam tips</summary>
      <ul class="tips">${EXAM_TIPS.map(t => `<li>${esc(t[0])}${hg(t[1])}</li>`).join('')}</ul></details>`);
  }

  // ================= Kana =================
  function kana(script = st?.script || 'hira') {
    ctx.clearSess(); st = { kind: 'kana', script };
    const conv = script === 'kata' ? toKata : s => s;
    const cell = ch => ch === '・' ? '<span class="kcell empty"></span>'
      : `<button class="kcell" data-act="say-text" data-arg="${conv(ch)}"><b lang="ja">${conv(ch)}</b><small>${toRomaji(ch) === 'o' && ch === 'を' ? 'o (wo)' : toRomaji(ch)}</small></button>`;
    render(`
      <div class="head">${back('jlpt')}<h1>Kana charts</h1></div>
      <div class="seg"><button class="${script === 'hira' ? 'on' : ''}" data-act="kana-script" data-arg="hira">ひらがな Hiragana</button><button class="${script === 'kata' ? 'on' : ''}" data-act="kana-script" data-arg="kata">カタカナ Katakana</button></div>
      <p class="muted small">${script === 'hira' ? 'Hiragana is for Japanese words and grammar endings.' : 'Katakana is for foreign words: コーヒー (coffee), インド (India), パソコン (PC).'} Tap any kana to hear it.${S().settings.hindi ? ' Hindi ki tarah, har akshar ek awaaz hai!' : ''}</p>
      <h2 class="sec">Basic</h2><div class="kchart">${KANA_ROWS.map(r => r.split('').map(cell).join('')).join('')}</div>
      <h2 class="sec">With ゛ and ゜ <small class="muted">voiced sounds</small></h2><div class="kchart">${DAKUTEN_ROWS.map(r => r.split('').map(cell).join('')).join('')}</div>
      <h2 class="sec">Combinations</h2><div class="kchart three">${COMBO_ROWS.map(r => combos(r).map(cell).join('')).join('')}</div>
      ${script === 'kata' ? `<div class="note">${icon('tip')} ー makes a vowel long: コーヒー = kōhī. Small ッ doubles the next sound: ベッド = beddo.</div>` : `<div class="note">${icon('tip')} Small っ doubles the next sound: きって = kitte. は and へ are read “wa” and “e” when they’re particles.</div>`}`);
  }

  // ================= Grammar points =================
  function grammarList(lv) {
    ctx.clearSess(); st = null;
    const pts = GRAMMAR.filter(g => g.level === lv);
    render(`
      <div class="head">${back('jlpt')}<h1>${lv.toUpperCase()} grammar</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="jlpt-grammar" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <div class="pgrid">${pts.map(g => `<button class="pcard" data-act="gpoint" data-arg="${g.id}">
        <span class="pch">${g.pic}</span>
        <span class="pt"><b lang="ja">${esc(g.pattern)}</b>${esc(g.en)}${S().settings.hindi ? `<small lang="hi-Latn">${esc(g.hg)}</small>` : ''}</span></button>`).join('')}</div>`);
  }

  function gpoint(id) {
    ctx.clearSess(); st = null;
    const g = GRAMMAR.find(x => x.id === id);
    const list = GRAMMAR.filter(x => x.level === g.level), i = list.indexOf(g);
    render(`
      <div class="head">${back('jlpt-grammar', g.level)}<h1 lang="ja">${esc(g.pattern)}</h1><span class="pill">${g.level.toUpperCase()}</span></div>
      <div class="card">
        <div class="pic">${g.pic}</div>
        <div class="kmean">${esc(g.en)}</div>${hg(g.hg)}
        <div class="formula" lang="ja">${esc(g.how)}</div>
        <p class="left-text">${esc(g.explain)}</p>
      </div>
      <h2 class="sec">Examples <small class="muted">tap to hear</small></h2>
      <ul class="phrases">${g.ex.map((e, j) => { const furi = S().settings.kana ? furigana(e[0], e[1], esc, markBrackets(esc)) : null; return `<li class="ex" data-act="say-text" data-arg="${esc(plain(e[0]))}">
        <div class="jp" lang="ja">${furi || mark(e[0])}</div>
        ${S().settings.kana && !furi ? `<div class="kana" lang="ja">${mark(e[1])}</div>` : ''}
        ${S().settings.romaji ? `<div class="ro">${esc(plain(e[2]))}</div>` : ''}
        <div class="en">${esc(e[3])}</div>${hg(e[4])}${ctx.waysSlot(`g${g.level[1]}:${g.id}:${j}`)}</li>`; }).join('')}</ul>
      <div class="row">
        <button class="btn" data-act="gpoint" data-arg="${list[i - 1]?.id || ''}" ${i ? '' : 'disabled'}>‹ Prev</button>
        <button class="btn" data-act="gpoint" data-arg="${list[i + 1]?.id || ''}" ${list[i + 1] ? '' : 'disabled'}>Next ›</button>
      </div>`);
  }

  // ================= Vocabulary =================
  const wordFuri = w => S().settings.kana ? furigana(w.jp, w.kana, esc) : null;
  const wordCard = w => `<button class="wcard" data-act="say-text" data-arg="${esc(sayable(w.jp, w.kana))}">
    <span class="wpic">${w.pic || '<span class="wtxt">' + esc(w.en.split(/[ /(]/)[0]) + '</span>'}</span><b lang="ja">${wordFuri(w) || esc(w.jp)}</b>
    ${S().settings.kana && w.kana !== w.jp && !wordFuri(w) ? `<small lang="ja">${esc(w.kana)}</small>` : ''}
    <small>${esc(w.en)}${S().settings.hindi ? ` · ${esc(w.hg)}` : ''}</small></button>`;

  // Topic word grids are drawn when the topic is opened, not all at once (each level has ~700 words).
  const topicCards = id => WORDS.filter(w => w.topic === id).map(wordCard).join('');
  document.addEventListener('toggle', e => {
    const grid = e.target.open && e.target.querySelector?.('.wgrid[data-topic]:empty');
    if (grid) grid.innerHTML = topicCards(grid.dataset.topic);
  }, true);

  // Matches Japanese, kana, romaji (macrons optional), English or Hinglish.
  const flat = x => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function vocabSearch(lv, q) {
    st = { kind: 'vocab', lv, q };
    const res = document.getElementById('vresults'), topics = document.getElementById('vtopics');
    const term = flat(q.trim());
    if (!term) { res.innerHTML = ''; topics.hidden = false; return; }
    const hits = WORDS.filter(w => w.level === lv && [w.jp, w.kana, w.ro, w.en, w.hg].some(f => flat(f).includes(term)));
    topics.hidden = true;
    res.innerHTML = hits.length
      ? `<p class="muted small">${hits.length} match${hits.length === 1 ? '' : 'es'}</p><div class="wgrid">${hits.slice(0, 80).map(wordCard).join('')}</div>`
      : '<p class="muted center">No words found.</p>';
  }

  function vocab(lv) {
    ctx.clearSess(); st = null;
    const ws = WORDS.filter(w => w.level === lv);
    render(`
      <div class="head">${back(lv === 'life' ? 'home' : 'jlpt')}<h1>${esc(VLABEL[lv])} vocabulary</h1></div>
      <div class="seg">${VLEVELS.map(l => `<button class="${l === lv ? 'on' : ''}" data-act="jlpt-vocab" data-arg="${l}">${esc(VLABEL[l])}</button>`).join('')}</div>
      ${lv === 'life' ? '<p class="muted">Everyday words for living and working in Japan that the JLPT lists leave out: the office, keigo on email and phone, contracts and pay, city hall, banking, housing, rubbish days, the clinic, commuting and disasters. Words already taught in N5/N4 are not repeated here.</p>' : ''}
      <div class="row"><button class="btn primary" data-act="vlearn" data-arg="${lv}">${icon('learn')} Flashcards</button></div>
      <input class="search" type="search" id="vsearch" data-input="vocab-search" data-arg="${lv}" placeholder="Search ${ws.length} words (日本語, romaji, English, Hinglish)" aria-label="Search words" value="${esc(st?.q || '')}" autocomplete="off">
      <div id="vresults"></div>
      <div id="vtopics">${VOCAB.filter(t => t.level === lv).map((t, i) => `
        <details class="fold" ${i === 0 ? 'open' : ''}><summary><span class="sum-title">${esc(t.title)}${S().settings.hindi ? `<small class="muted" lang="hi-Latn">${esc(t.hg)}</small>` : ''}</span>
          <span class="count">${t.words.length}</span></summary>
          <div class="wgrid" data-topic="${t.id}">${i === 0 ? topicCards(t.id) : ''}</div>
          <button class="btn small ghost" data-act="vlearn" data-arg="${t.id}">${icon('learn')} Learn this topic</button>
        </details>`).join('')}</div>`);
  }

  function vlearn(arg) {
    const items = VLEVELS.includes(arg) ? WORDS.filter(w => w.level === arg) : WORDS.filter(w => w.topic === arg);
    st = { kind: 'vlearn', queue: shuffle(items).slice(0, 12), i: 0, lv: items[0].level };
    vcard();
  }

  function vcard() {
    const w = st.queue[st.i];
    if (w) { prefetchClip(sayable(w.jp, w.kana)); const nx = st.queue[st.i + 1]; if (nx) prefetchClip(sayable(nx.jp, nx.kana)); }
    if (!w) {
      const lv = st.lv; st = null;
      return render(`<div class="done"><div class="big-emoji">${icon('finish')}</div><h1>Words practised</h1><button class="btn primary big" data-act="jlpt-vocab" data-arg="${lv}">Back</button></div>`);
    }
    st.revealed = false;
    render(`
      <div class="head">${back('jlpt-vocab', st.lv)}<div class="grow">${bar(st.i, st.queue.length)}</div><span class="muted">${st.i + 1}/${st.queue.length}</span></div>
      <div class="card">
        <span class="tag alt">What’s this in Japanese?</span>
        <div class="wpic huge">${w.pic}</div>
        <div class="prompt">${esc(w.en)}</div>${hg(w.hg, 'prompt-hi')}
        <div id="answer" hidden>
          <div class="jpblock big"><div class="jp" lang="ja">${wordFuri(w) || esc(w.jp)}</div>
          ${S().settings.kana && w.kana !== w.jp && !wordFuri(w) ? `<div class="kana" lang="ja">${esc(w.kana)}</div>` : ''}
          ${S().settings.romaji ? `<div class="ro">${esc(w.ro)}</div>` : ''}</div>
        </div>
      </div>
      <div class="actions" id="actions"><button class="btn primary big" data-act="vreveal">Show answer</button></div>`);
  }

  function vreveal() {
    if (st.revealed) return;
    st.revealed = true;
    document.getElementById('answer').hidden = false;
    document.getElementById('actions').innerHTML = `<div class="grades two">
      <button class="btn again" data-act="vgrade" data-arg="again">Again later</button>
      <button class="btn good" data-act="vgrade" data-arg="ok">Got it</button></div>`;
    speak(sayable(st.queue[st.i].jp, st.queue[st.i].kana));
  }

  function vgrade(g) {
    const w = st.queue[st.i];
    if (g === 'again') st.queue.push(w);
    st.i++; vcard();
  }

  const actions = {
    jlpt: () => ctx.go('jlpt'),
    'jlpt-n5': () => { lvl = 'n5'; hub(); window.scrollTo(0, 0); },
    'jlpt-level': l => { lvl = l === 'n4' ? 'n4' : 'n5'; hub(); },
    kana: () => ctx.go('jlpt/kana'),
    'kana-script': s => kana(s),
    'jlpt-grammar': lv => ctx.go('jlpt/grammar/' + (lv || level())),
    gpoint: id => id && ctx.go('jlpt/g/' + id),
    'jlpt-vocab': lv => ctx.go('jlpt/vocab/' + (lv || level())),
    vlearn: a => vlearn(a),
    vreveal: () => vreveal(),
    vgrade: g => vgrade(g),
    'vocab-search': (lv, q) => vocabSearch(lv, q),
    'kanji-n4': () => ctx.go('kanji/n4'),
  };

  function route(h) {
    if (h === 'jlpt') return hub(), true;
    if (h === 'jlpt/kana') return kana('hira'), true;
    if (h.startsWith('jlpt/grammar/')) return grammarList(h.slice(13) === 'n4' ? 'n4' : 'n5'), true;
    if (h.startsWith('jlpt/vocab/')) { const l = h.slice(11); return vocab(VLEVELS.includes(l) ? l : 'n5'), true; }
    if (h.startsWith('jlpt/g/') && GRAMMAR.some(g => g.id === h.slice(7))) return gpoint(h.slice(7)), true;
    return false;
  }

  function rerender() {
    if (!st) return false;
    if (st.kind === 'kana') kana(st.script);
    else if (st.kind === 'vlearn') vcard();
    else if (st.kind === 'vocab') { vocab(st.lv); if (st?.q) vocabSearch(st.lv, st.q); }
    else return false;
    return true;
  }

  return { actions, route, rerender, clear() { st = null; } };
}
