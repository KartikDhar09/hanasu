// JLPT tab: exam overview, study path, kana charts, grammar points and exam-style drills.
import { EXAMS, EXAM_TIPS, QUESTION_TYPES, GRAMMAR } from './jlpt-data.js';
import { UNITS, CARDS } from './data.js';
import { PARTICLES } from './particles-data.js';
import { KANJI_N5, KANJI_N4 } from './kanji-data.js';
import { VOCAB, WORDS } from './vocab-data.js';
import { READING, LISTENING } from './exam-data.js';
import { toRomaji } from './conjugate.js';
import { isLearned, isDue, grade, pickSession, AGAIN, GOOD, EASY } from './core.js';

// Gojūon chart; ・ is an empty cell.
export const KANA_ROWS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'や・ゆ・よ', 'らりるれろ', 'わ・・・を', 'ん・・・・'];
export const DAKUTEN_ROWS = ['がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'];
export const COMBO_ROWS = ['きゃきゅきょ', 'しゃしゅしょ', 'ちゃちゅちょ', 'にゃにゅにょ', 'ひゃひゅひょ', 'みゃみゅみょ', 'りゃりゅりょ', 'ぎゃぎゅぎょ', 'じゃじゅじょ', 'びゃびゅびょ', 'ぴゃぴゅぴょ'];
const toKata = s => s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
const combos = row => row.match(/.[ゃゅょ]/g);
export const ALL_KANA = [...KANA_ROWS, ...DAKUTEN_ROWS].join('').replace(/・/g, '').split('').concat(COMBO_ROWS.flatMap(combos));

// Splits a sentence into pieces at particle boundaries, for the ★ word-order drill.
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

export function initJlpt(ctx) {
  const { esc, render, speak, shuffle, bar, back, practised, save } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  const level = () => S().jlptLevel || 'n5';
  const best = () => (S().quizBest = S().quizBest || {});
  const mark = (s, blank) => esc(s).replace(/\[(.+?)\]/g, (_, p) => blank ? '<span class="gap wide">？</span>' : `<mark>${p}</mark>`);
  const plain = s => s.replace(/[[\]]/g, '');
  let st = null;

  // ---- Study path: each step reports progress 0..1 from what you’ve done in the app ----
  const pct = key => (best()[key] || 0) / 100;
  const trackLearned = ids => { const cs = CARDS.filter(c => ids.includes(UNITS.find(u => u.id === c.unit).track)); return cs.filter(c => isLearned(S().progress[c.id])).length / cs.length; };
  const kanjiLearned = list => () => list.filter(k => isLearned((S().kanjiProgress || {})[k.ch])).length / list.length;
  const vprog = () => (S().vocabProgress = S().vocabProgress || {});
  const vocabLearned = lv => () => { const ws = WORDS.filter(w => w.level === lv); return ws.filter(w => isLearned(vprog()[w.id])).length / ws.length; };
  const particleAvg = () => PARTICLES.reduce((n, p) => n + ((S().pbest || {})[p.id] || 0), 0) / PARTICLES.length / 100;

  const readAvg = lv => () => { const rs = READING.filter(r => r.level === lv); return rs.reduce((t, r) => t + ((S().readBest || {})[r.id] || 0), 0) / rs.length / 100; };
  const listenPart = lv => () => { const ls = LISTENING.filter(l => l.level === lv); return ls.filter(l => (S().listenDone || {})[l.id]).length / ls.length; };
  const mockReady = lv => () => Math.min(1, (best()['mock-' + lv] || 0) / (100 * EXAMS[lv].pass.total / 180));
  const examSteps = lv => [
    ['📖', 'Reading practice', 'Notes, emails and notices.', readAvg(lv), 'ex-reading'],
    ['🎧', 'Listening practice', 'Conversations with picture answers.', listenPart(lv), 'ex-listening'],
    ['🏁', 'Pass a mock test', `Score ${EXAMS[lv].pass.total}+/180 with every section above the minimum.`, mockReady(lv), 'ex-mock'],
  ];

  function path(lv) {
    const n5 = [
      ['あ', 'Hiragana & katakana', 'Read every kana. Quiz score 80%+.', () => pct('kana'), 'kana'],
      ['💬', 'Everyday N5 phrases', 'Learn the Everyday N5 track.', () => trackLearned(['n5']), 'home'],
      ['の', 'Particles', 'Practise each particle quiz.', particleAvg, 'particles'],
      ['🏃', 'Verbs & forms', 'Conjugation quiz score.', () => pct('vquiz'), 'verbs'],
      ['漢', 'N5 kanji', `Learn all ${KANJI_N5.length} kanji with flashcards.`, kanjiLearned(KANJI_N5), 'kanji'],
      ['🍙', 'N5 vocabulary', `${WORDS.filter(w => w.level === 'n5').length} picture words. Learn them with flashcards.`, vocabLearned('n5'), 'jlpt-vocab'],
      ['📘', 'N5 grammar points', `${GRAMMAR.filter(g => g.level === 'n5').length} patterns. Grammar quiz score.`, () => pct('gram-n5'), 'jlpt-grammar'],
      ['★', 'Sentence order', 'Build sentences in the right order.', () => pct('order-n5'), 'order'],
      ...examSteps('n5'),
    ];
    if (lv === 'n5') return n5;
    const n5avg = () => n5.reduce((t, s) => t + Math.min(1, s[3]()), 0) / n5.length;
    return [
      ['5', 'Finish N5 first', 'N4 includes everything in N5.', n5avg, 'jlpt-n5'],
      ['🏢', 'Office & corporate phrases', 'Learn the Office and Corporate tracks.', () => trackLearned(['office', 'corp']), 'home'],
      ['漢', 'N4 kanji', `${KANJI_N4.length} more kanji.`, kanjiLearned(KANJI_N4), 'kanji-n4'],
      ['💼', 'N4 vocabulary', `${WORDS.filter(w => w.level === 'n4').length} picture words for work and life.`, vocabLearned('n4'), 'jlpt-vocab'],
      ['📗', 'N4 grammar points', `${GRAMMAR.filter(g => g.level === 'n4').length} patterns. Grammar quiz score.`, () => pct('gram-n4'), 'jlpt-grammar'],
      ['★', 'Sentence order (N4)', 'Build N4 sentences in the right order.', () => pct('order-n4'), 'order'],
      ...examSteps('n4'),
    ];
  }

  // ================= Hub =================
  function hub() {
    ctx.clearSess(); st = null;
    const lv = level(), ex = EXAMS[lv];
    const steps = path(lv);
    const overall = steps.reduce((t, s) => t + Math.min(1, s[3]()), 0) / steps.length;
    render(`
      <h1 class="page">JLPT <span lang="ja">日本語能力試験</span></h1>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="jlpt-level" data-arg="${l}">${EXAMS[l].title}</button>`).join('')}</div>
      <div class="card left">
        <b>${ex.title} · ${ex.level}</b>${hg(ex.hg)}
        <p>${esc(ex.can)}</p>${hg(ex.canHg)}
        <div class="note">📚 You need: ${esc(ex.need)}</div>
      </div>
      <h3>Your path to ${ex.title} <small class="muted">${Math.round(overall * 100)}% ready</small></h3>
      ${bar(overall, 1)}
      <ol class="path">${steps.map(s => {
        const p = Math.min(1, s[3]());
        return `<li class="${p >= 0.8 ? 'done' : ''}"><button data-act="${s[4]}" data-arg="${['jlpt-grammar', 'order', 'jlpt-vocab', 'ex-reading', 'ex-listening', 'ex-mock'].includes(s[4]) ? lv : ''}">
          <span class="pico" lang="ja">${p >= 0.8 ? '✓' : s[0]}</span>
          <span class="ptext"><b>${esc(s[1])}</b><small>${esc(s[2])}</small>${bar(p, 1)}</span>
          <span class="count">${Math.round(p * 100)}%</span></button></li>`;
      }).join('')}</ol>
      <button class="btn primary big mock-btn" data-act="ex-mock" data-arg="${lv}">🏁 Take a ${ex.title} mock test${best()['mock-' + lv] ? ` <small>(best ${Math.round(best()['mock-' + lv] * 1.8)}/180)</small>` : ''}</button>
      <h3>Practise like the exam</h3>
      <div class="speak-grid">
        <button class="scard" data-act="ex-reading" data-arg="${lv}"><span>📖</span><b>Reading</b><small>${READING.filter(r => r.level === lv).length} real-life passages with questions</small></button>
        <button class="scard" data-act="ex-listening" data-arg="${lv}"><span>🎧</span><b>Listening</b><small>${LISTENING.filter(l => l.level === lv).length} conversations, some with picture answers</small></button>
        <button class="scard" data-act="jlpt-grammar" data-arg="${lv}"><span>📘</span><b>Grammar points</b><small>${GRAMMAR.filter(g => g.level === lv).length} ${lv.toUpperCase()} patterns with pictures and examples</small></button>
        <button class="scard" data-act="gquiz" data-arg="${lv}"><span>✏️</span><b>Grammar quiz</b><small>Fill in the blank, like 文法形式</small></button>
        <button class="scard" data-act="order" data-arg="${lv}"><span>★</span><b>Sentence order</b><small>Put the pieces in order, like 文の組み立て</small></button>
        <button class="scard" data-act="jlpt-vocab" data-arg="${lv}"><span>🖼️</span><b>Vocabulary</b><small>${WORDS.filter(w => w.level === lv).length} ${lv.toUpperCase()} words with pictures</small></button>
        <button class="scard" data-act="kana"><span lang="ja">あア</span><b>Kana charts</b><small>Hiragana & katakana with sound + quiz</small></button>
      </div>
      <details class="fold"><summary>📋 About the exam: sections, times, pass marks</summary>
      <div class="exam">${ex.sections.map(sec => `<div class="exrow"><b>${esc(sec.name)}</b><span class="pill">${sec.min} min</span><small>${esc(sec.parts)}</small></div>`).join('')}</div>
      <div class="card left passbox">
        <b>To pass ${ex.title}</b>
        <div class="passbar"><span>${ex.pass.total} / ${ex.pass.max} total</span><div class="pb"><i style="width:${100 * ex.pass.total / ex.pass.max}%"></i></div></div>
        ${ex.pass.sections.map(([n, min, max]) => `<div class="passbar small"><span>${esc(n)}: at least ${min} / ${max}</span><div class="pb"><i style="width:${100 * min / max}%"></i></div></div>`).join('')}
      </div>
      </details>
      <details class="fold"><summary>❓ Question types</summary>
      <ul class="phrases">${QUESTION_TYPES.map(q => `<li><b lang="ja">${q[0]}</b> · ${esc(q[1])}<div class="muted small">${esc(q[2])}</div></li>`).join('')}</ul>
      </details>
      <details class="fold"><summary>💡 Exam tips</summary>
      <ul class="tips">${EXAM_TIPS.map(t => `<li>${t[0]} ${esc(t[1])}${hg(t[2])}</li>`).join('')}</ul></details>`);
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
      <button class="btn primary big" data-act="kana-quiz" data-arg="${script}">🎯 Kana quiz ${best().kana ? `<small>(best ${best().kana}%)</small>` : ''}</button>
      <h3>Basic</h3><div class="kchart">${KANA_ROWS.map(r => r.split('').map(cell).join('')).join('')}</div>
      <h3>With ゛ and ゜ <small class="muted">voiced sounds</small></h3><div class="kchart">${DAKUTEN_ROWS.map(r => r.split('').map(cell).join('')).join('')}</div>
      <h3>Combinations</h3><div class="kchart three">${COMBO_ROWS.map(r => combos(r).map(cell).join('')).join('')}</div>
      ${script === 'kata' ? '<div class="note">💡 ー makes a vowel long: コーヒー = kōhī. Small ッ doubles the next sound: ベッド = beddo.</div>' : '<div class="note">💡 Small っ doubles the next sound: きって = kitte. は and へ are read “wa” and “e” when they’re particles.</div>'}`);
  }

  function kanaQuiz(script) {
    const conv = script === 'kata' ? toKata : s => s;
    const qs = shuffle(ALL_KANA).slice(0, 15).map((k, i) => {
      const r = toRomaji(k);
      const others = shuffle(ALL_KANA.filter(o => toRomaji(o) !== r)).slice(0, 3);
      return i % 3 === 2
        ? { type: 'listen', k: conv(k), right: conv(k), options: shuffle([k, ...others]).map(conv) } // hear it, pick the kana
        : { type: 'read', k: conv(k), right: r, options: shuffle([r, ...others.map(toRomaji)]) }; // see it, pick the romaji
    });
    st = { kind: 'kquizk', script, qs, i: 0, right: 0, key: 'kana', back: 'kana' };
    quizQ();
  }

  // ================= Grammar points =================
  function grammarList(lv) {
    ctx.clearSess(); st = null;
    const pts = GRAMMAR.filter(g => g.level === lv);
    render(`
      <div class="head">${back('jlpt')}<h1>${lv.toUpperCase()} grammar</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="jlpt-grammar" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <div class="row"><button class="btn primary" data-act="gquiz" data-arg="${lv}">✏️ Grammar quiz</button><button class="btn" data-act="order" data-arg="${lv}">★ Sentence order</button></div>
      <div class="pgrid">${pts.map(g => `<button class="pcard" data-act="gpoint" data-arg="${g.id}">
        <span class="pch">${g.pic}</span>
        <span class="pt"><b lang="ja">${esc(g.pattern)}</b>${esc(g.en)}${S().settings.hindi ? `<small lang="hi-Latn">${esc(g.hg)}</small>` : ''}</span>
        <span class="count">${(S().gbest || {})[g.id] != null ? `${S().gbest[g.id]}%` : ''}</span></button>`).join('')}</div>`);
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
      <h3>Examples <small class="muted">tap to hear</small></h3>
      <ul class="phrases">${g.ex.map(e => `<li class="ex" data-act="say-text" data-arg="${esc(plain(e[0]))}">
        <div class="jp" lang="ja">${mark(e[0])}</div>
        ${S().settings.kana ? `<div class="kana" lang="ja">${mark(e[1])}</div>` : ''}
        ${S().settings.romaji ? `<div class="ro">${esc(plain(e[2]))}</div>` : ''}
        <div class="en">${esc(e[3])}</div>${hg(e[4])}</li>`).join('')}</ul>
      <button class="btn primary big" data-act="gquiz" data-arg="${g.level}.${g.id}">✏️ Practise this</button>
      <div class="row">
        <button class="btn" data-act="gpoint" data-arg="${list[i - 1]?.id || ''}" ${i ? '' : 'disabled'}>‹ Prev</button>
        <button class="btn" data-act="gpoint" data-arg="${list[i + 1]?.id || ''}" ${list[i + 1] ? '' : 'disabled'}>Next ›</button>
      </div>`);
  }

  // Fill-in-the-blank: wrong answers are the highlighted parts of other patterns at the same level.
  function gquiz(arg) {
    const [lv, only] = arg.split('.');
    const pts = GRAMMAR.filter(g => g.level === lv);
    const pool = pts.flatMap(g => g.ex.map(e => ({ g, e })));
    const chosen = only
      ? [...pool.filter(x => x.g.id === only), ...shuffle(pool.filter(x => x.g.id !== only)).slice(0, 4)]
      : shuffle(pool).slice(0, 12);
    const qs = shuffle(chosen).map(({ g, e }) => {
      const right = e[0].match(/\[(.+?)\]/)[1];
      const others = [...new Set(shuffle(pool.filter(x => x.g.id !== g.id)).map(x => x.e[0].match(/\[(.+?)\]/)[1]))].filter(x => x !== right).slice(0, 3);
      return { type: 'gram', g, e, right, options: shuffle([right, ...others]) };
    });
    st = { kind: 'gquiz', qs, i: 0, right: 0, key: only ? null : 'gram-' + lv, gid: only, back: only ? 'gpoint' : 'jlpt-grammar', backArg: only || lv };
    quizQ();
  }

  // ★ Sentence order: tap the pieces in the right order.
  function order(lv) {
    const pool = GRAMMAR.filter(g => g.level === lv).flatMap(g => g.ex).map(e => ({ e, parts: chunk(e[0]) })).filter(x => x.parts.length >= 3 && x.parts.length <= 6);
    const qs = shuffle(pool).slice(0, 8).map(x => ({ type: 'order', e: x.e, parts: x.parts, shuffled: shuffle(x.parts.map((p, i) => ({ p, i }))) }));
    st = { kind: 'order', qs, i: 0, right: 0, key: 'order-' + lv, back: 'jlpt' };
    ctx.clearSess();
    orderQ();
  }

  function orderQ() {
    const q = st.qs[st.i];
    if (!q) return done();
    q.picked = [];
    st.answered = false;
    render(`
      <div class="head">${back(st.back)}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">
        <span class="tag alt">★ Put the pieces in order</span>
        <div class="en">${esc(q.e[3])}</div>${hg(q.e[4])}
        <div class="built" id="built" lang="ja"><span class="muted">Tap the pieces below…</span></div>
      </div>
      <div class="pieces">${q.shuffled.map((x, n) => `<button class="piece" data-act="order-pick" data-arg="${n}" lang="ja">${esc(x.p)}</button>`).join('')}</div>
      <div class="row"><button class="btn" data-act="order-undo">↩ Undo</button></div>
      <div class="actions" id="actions"></div>`);
  }

  function orderPick(n) {
    const q = st.qs[st.i];
    if (st.answered || q.picked.includes(+n)) return;
    q.picked.push(+n);
    renderBuilt(q);
    if (q.picked.length === q.parts.length) {
      st.answered = true;
      const ok = q.picked.every((n, i) => q.shuffled[n].i === i) || q.picked.map(n => q.shuffled[n].p).join('') === q.parts.join('');
      if (ok) st.right++;
      document.getElementById('built').classList.add(ok ? 'right' : 'wrong');
      document.getElementById('actions').innerHTML = `
        ${ok ? '<div class="score ok center">✓ Correct!</div>' : `<div class="card compact left"><div class="jp" lang="ja">${esc(plain(q.e[0]))}</div>${S().settings.romaji ? `<div class="ro">${esc(plain(q.e[2]))}</div>` : ''}</div>`}
        <button class="btn primary big" data-act="quiz-next-j">${st.i + 1 < st.qs.length ? 'Next' : 'See score'}</button>`;
      speak(plain(q.e[0]));
    }
  }

  function renderBuilt(q) {
    document.getElementById('built').innerHTML = q.picked.length ? q.picked.map(n => `<span class="bpiece">${esc(q.shuffled[n].p)}</span>`).join('') : '<span class="muted">Tap the pieces below…</span>';
    document.querySelectorAll('.piece').forEach(b => { b.disabled = q.picked.includes(+b.dataset.arg); });
  }

  // ================= Vocabulary =================
  function vocab(lv) {
    ctx.clearSess(); st = null;
    const ws = WORDS.filter(w => w.level === lv);
    const due = ws.filter(w => isDue(vprog()[w.id])).length;
    render(`
      <div class="head">${back('jlpt')}<h1>${lv.toUpperCase()} vocabulary</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="jlpt-vocab" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <div class="stats small-stats"><div><b>${ws.filter(w => isLearned(vprog()[w.id])).length}</b><span>of ${ws.length} learned</span></div><div><b>${due}</b><span>due now</span></div></div>
      <div class="row"><button class="btn primary" data-act="vlearn" data-arg="${lv}">🃏 ${due ? `Review ${due}` : 'Learn new'}</button><button class="btn" data-act="vocab-quiz" data-arg="${lv}">🎯 Picture quiz</button></div>
      ${VOCAB.filter(t => t.level === lv).map(t => `
        <h3>${t.icon} ${esc(t.title)}${S().settings.hindi ? ` <small class="muted" lang="hi-Latn">${esc(t.hg)}</small>` : ''}</h3>
        <div class="wgrid">${WORDS.filter(w => w.topic === t.id).map(w => `<button class="wcard ${isLearned(vprog()[w.id]) ? 'known' : ''}" data-act="say-text" data-arg="${esc(w.jp)}">
          <span class="wpic">${w.pic}</span><b lang="ja">${esc(w.jp)}</b>
          ${S().settings.kana && w.kana !== w.jp ? `<small lang="ja">${esc(w.kana)}</small>` : ''}
          <small>${esc(w.en)}${S().settings.hindi ? ` · ${esc(w.hg)}` : ''}</small></button>`).join('')}</div>
        <button class="btn small ghost" data-act="vlearn" data-arg="${t.id}">🃏 Learn this topic</button>`).join('')}`);
  }

  function vlearn(arg) {
    const items = arg === 'n5' || arg === 'n4' ? WORDS.filter(w => w.level === arg) : WORDS.filter(w => w.topic === arg);
    let queue = pickSession(items, vprog(), { newLimit: 8, max: 16 });
    if (!queue.length) queue = shuffle(items).slice(0, 10);
    st = { kind: 'vlearn', queue, i: 0, done: 0, lv: items[0].level };
    vcard();
  }

  function vcard() {
    const w = st.queue[st.i];
    if (!w) {
      practised();
      const lv = st.lv; st = null;
      return render(`<div class="done"><div class="big-emoji">🖼️</div><h1>Words practised</h1><button class="btn primary big" data-act="jlpt-vocab" data-arg="${lv}">Back</button></div>`);
    }
    st.revealed = false;
    render(`
      <div class="head">${back('jlpt-vocab', st.lv)}<div class="grow">${bar(st.i, st.queue.length)}</div><span class="muted">${st.i + 1}/${st.queue.length}</span></div>
      <div class="card">
        <span class="tag alt">What’s this in Japanese?</span>
        <div class="wpic huge">${w.pic}</div>
        <div class="prompt">${esc(w.en)}</div>${hg(w.hg, 'prompt-hi')}
        <div id="answer" hidden>
          <div class="jpblock big"><div class="jp" lang="ja">${esc(w.jp)}</div>
          ${S().settings.kana && w.kana !== w.jp ? `<div class="kana" lang="ja">${esc(w.kana)}</div>` : ''}
          ${S().settings.romaji ? `<div class="ro">${esc(w.ro)}</div>` : ''}</div>
        </div>
      </div>
      <div class="actions" id="actions"><button class="btn primary big" data-act="vreveal">Show answer</button></div>`);
  }

  function vreveal() {
    if (st.revealed) return;
    st.revealed = true;
    document.getElementById('answer').hidden = false;
    document.getElementById('actions').innerHTML = `<div class="grades">
      <button class="btn again" data-act="vgrade" data-arg="${AGAIN}">Forgot</button>
      <button class="btn good" data-act="vgrade" data-arg="${GOOD}">Got it</button>
      <button class="btn easy" data-act="vgrade" data-arg="${EASY}">Easy</button></div>`;
    speak(st.queue[st.i].jp);
  }

  function vgrade(g) {
    const w = st.queue[st.i];
    vprog()[w.id] = grade(vprog()[w.id], +g);
    if (+g === AGAIN) st.queue.push(w); else st.done++;
    save(); st.i++; vcard();
  }

  // Picture → word, and word → meaning (like 文脈規定 / meaning questions).
  function vocabQuiz(lv) {
    const ws = WORDS.filter(w => w.level === lv);
    const qs = shuffle(ws).slice(0, 12).map((w, n) => {
      const others = shuffle(ws.filter(o => o.en !== w.en && o.jp !== w.jp)).slice(0, 3);
      return n % 2
        ? { type: 'pic', w, right: w.jp, options: shuffle([w, ...others]).map(o => o.jp) }
        : { type: 'mean', w, right: w.en, options: shuffle([w, ...others]).map(o => o.en) };
    });
    st = { kind: 'vquizj', qs, i: 0, right: 0, key: 'vocab-' + lv, back: 'jlpt-vocab', backArg: lv };
    quizQ();
  }

  // ================= Shared multiple-choice quiz =================
  function quizQ() {
    const q = st.qs[st.i];
    if (!q) return done();
    st.answered = false;
    let prompt = '';
    if (q.type === 'read') prompt = `<span class="tag alt">How do you read this?</span><div class="kbig" lang="ja">${q.k}</div>`;
    if (q.type === 'listen') prompt = `<span class="tag alt">Which kana did you hear?</span><button class="btn listen" data-act="say-text" data-arg="${q.k}">🔊 Play again</button>`;
    if (q.type === 'pic') prompt = `<span class="tag alt">Which word is this?</span><div class="wpic huge">${q.w.pic}</div>${hg(q.w.hg)}`;
    if (q.type === 'mean') prompt = `<span class="tag alt">What does it mean?</span><div class="kbig small-k" lang="ja">${esc(q.w.jp)}</div>${S().settings.kana && q.w.kana !== q.w.jp ? `<div class="kana" lang="ja">${esc(q.w.kana)}</div>` : ''}`;
    if (q.type === 'gram') prompt = `<span class="tag alt">Fill in the grammar</span>
      <div class="jp big-jp" lang="ja">${mark(q.e[0], true)}</div>
      ${S().settings.kana ? `<div class="kana" lang="ja">${mark(q.e[1], true)}</div>` : ''}
      <div class="en">${esc(q.e[3])}</div>${hg(q.e[4])}`;
    render(`
      <div class="head">${back(st.back, st.backArg || '')}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">${st.right} ✓</span></div>
      <div class="card">${prompt}</div>
      <div class="choices ${['gram', 'mean'].includes(q.type) ? '' : 'four'}">${q.options.map(o => {
        const kana = q.type === 'pic' && S().settings.kana ? WORDS.find(w => w.jp === o && w.level === q.w.level)?.kana : '';
        return `<button class="choice center" data-act="answer-j" data-arg="${esc(o)}"><span lang="ja">${esc(o)}</span>${kana && kana !== o ? `<small lang="ja">${esc(kana)}</small>` : ''}</button>`;
      }).join('')}</div>
      <div class="actions" id="actions"></div>`);
    if (q.type === 'listen') speak(q.k);
  }

  function answer(o) {
    if (st.answered) return;
    st.answered = true;
    const q = st.qs[st.i];
    const ok = o === q.right;
    if (ok) st.right++;
    document.querySelectorAll('.choice').forEach(b => {
      b.disabled = true;
      if (b.dataset.arg === q.right) b.classList.add('right'); else if (b.dataset.arg === o) b.classList.add('wrong');
    });
    let extra = '';
    if (q.type === 'gram') {
      extra = `<div class="card compact left"><div class="jp" lang="ja">${mark(q.e[0])}</div>${S().settings.romaji ? `<div class="ro">${esc(plain(q.e[2]))}</div>` : ''}
        ${ok ? '' : `<div class="note">${q.g.pic} <b lang="ja">${esc(q.g.pattern)}</b> = ${esc(q.g.en)}${S().settings.hindi ? ` · ${esc(q.g.hg)}` : ''}</div>`}</div>`;
      speak(plain(q.e[0]));
    } else if (q.w) {
      extra = `<div class="card compact"><span class="wpic">${q.w.pic}</span> <b lang="ja">${esc(q.w.jp)}</b> ${esc(q.w.kana !== q.w.jp ? q.w.kana : '')} = ${esc(q.w.en)}${S().settings.hindi ? ` · ${esc(q.w.hg)}` : ''}</div>`;
      speak(q.w.jp);
    } else {
      if (!ok) extra = `<div class="center"><b lang="ja" class="big-jp">${q.k}</b> = ${toRomaji(q.k)}</div>`;
      speak(q.k);
    }
    document.getElementById('actions').innerHTML = `${extra}<button class="btn primary big" data-act="quiz-next-j">${st.i + 1 < st.qs.length ? 'Next' : 'See score'}</button>`;
  }

  function done() {
    const score = Math.round(100 * st.right / st.qs.length);
    if (st.key) best()[st.key] = Math.max(best()[st.key] || 0, score);
    if (st.gid) { S().gbest = S().gbest || {}; S().gbest[st.gid] = Math.max(S().gbest[st.gid] || 0, score); }
    save(); practised();
    const backAct = st.back, backArg = st.backArg || '';
    st = null;
    render(`<div class="done">
      <div class="big-emoji">${score >= 80 ? '🏆' : score >= 60 ? '🌸' : '💪'}</div>
      <h1>${score}%</h1>
      <p class="muted">${score >= 80 ? 'Exam-ready on this! よくできました！' : score >= 60 ? 'Close. One more round will lock it in.' : 'Keep going. Review, then try again.'}${S().settings.hindi ? (score >= 80 ? ' Shaabaash!' : ' Lage raho!') : ''}</p>
      <button class="btn primary big" data-act="${backAct}" data-arg="${esc(backArg)}">Back</button>
    </div>`);
  }

  const actions = {
    jlpt: () => ctx.go('jlpt'),
    'jlpt-n5': () => { S().jlptLevel = 'n5'; save(); ctx.go('jlpt'); },
    'jlpt-level': l => { S().jlptLevel = l; save(); hub(); },
    kana: () => ctx.go('jlpt/kana'),
    'kana-script': s => kana(s),
    'kana-quiz': s => kanaQuiz(s),
    'jlpt-grammar': lv => ctx.go('jlpt/grammar/' + (lv || level())),
    gpoint: id => id && ctx.go('jlpt/g/' + id),
    gquiz: arg => gquiz(arg),
    order: lv => order(lv || level()),
    'order-pick': n => orderPick(n),
    'order-undo': () => { const q = st?.qs?.[st.i]; if (q && !st.answered) { q.picked.pop(); renderBuilt(q); } },
    'answer-j': o => answer(o),
    'jlpt-vocab': lv => ctx.go('jlpt/vocab/' + (lv || level())),
    vlearn: a => vlearn(a),
    vreveal: () => vreveal(),
    vgrade: g => vgrade(g),
    'vocab-quiz': lv => vocabQuiz(lv),
    'kanji-n4': () => { S().kanjiLevel = 'n4'; save(); ctx.go('kanji'); },
    'quiz-next-j': () => { st.i++; st.kind === 'order' ? orderQ() : quizQ(); },
  };

  function route(h) {
    if (h === 'jlpt') return hub(), true;
    if (h === 'jlpt/kana') return kana('hira'), true;
    if (h.startsWith('jlpt/grammar/')) return grammarList(h.slice(13) === 'n4' ? 'n4' : 'n5'), true;
    if (h.startsWith('jlpt/vocab/')) return vocab(h.slice(11) === 'n4' ? 'n4' : 'n5'), true;
    if (h.startsWith('jlpt/g/') && GRAMMAR.some(g => g.id === h.slice(7))) return gpoint(h.slice(7)), true;
    return false;
  }

  function rerender() {
    if (!st) return false;
    if (st.kind === 'kana') kana(st.script);
    else if (st.kind === 'vlearn') vcard();
    else if (st.kind === 'order') orderQ();
    else quizQ();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; } };
}
