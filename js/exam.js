// JLPT reading, listening and timed mock tests.
import { READING, LISTENING } from './exam-data.js';
import { EXAMS, GRAMMAR } from './jlpt-data.js';
import { KANJI } from './kanji-data.js';
import { WORDS } from './vocab-data.js';
import { chunk } from './jlpt.js';

const SECTIONS = [['vocab', 'Vocabulary', '文字・語彙'], ['grammar', 'Grammar', '文法'], ['reading', 'Reading', '読解'], ['listening', 'Listening', '聴解']];

// Scaled scores like the real exam: language knowledge + reading out of 120, listening out of 60.
export function scoreMock(results, level) {
  const part = sec => { const r = results.filter(x => x.section === sec); return r.length ? r.filter(x => x.ok).length / r.length : 0; };
  const lr = results.filter(x => x.section !== 'listening');
  const langReading = Math.round(120 * (lr.length ? lr.filter(x => x.ok).length / lr.length : 0));
  const listening = Math.round(60 * part('listening'));
  const pass = EXAMS[level].pass;
  const total = langReading + listening;
  return {
    langReading, listening, total,
    passed: total >= pass.total && langReading >= pass.sections[0][1] && listening >= pass.sections[1][1],
    bySection: Object.fromEntries(SECTIONS.map(([id]) => [id, Math.round(100 * part(id))])),
  };
}

export function initExam(ctx) {
  const { esc, render, shuffle, bar, back } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  const level = () => 'n5';
  const voice = who => ({ m: 0.75, f: 1.25, n: 1 }[who] || 1);
  let st = null;

  // Question, conversation, question again. A new play (or leaving the question) stops the old one.
  async function playListening(item) {
    const token = {};
    if (st) st.token = token;
    const live = () => st?.token === token;
    const say = (t, who) => ctx.sayAs(t, voice(who));
    await say(item.q[0], 'n');
    for (const [who, jp] of item.lines) { if (!live()) return; await new Promise(r => setTimeout(r, 400)); if (!live()) return; await say(jp, who); }
    if (live()) { await new Promise(r => setTimeout(r, 500)); if (live()) await say(item.q[0], 'n'); }
  }

  const passageHtml = r => `
    <div class="passage" lang="ja">${esc(r.text).replace(/\n/g, '<br>')}</div>
    <details class="answers"><summary>📖 Key words</summary><ul class="glossary">${r.words.map(w => `<li><b lang="ja">${esc(w[0])}</b> <span lang="ja">${esc(w[1])}</span> · ${esc(w[2])}</li>`).join('')}</ul></details>`;

  // ================= Reading =================
  function readingList(lv) {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('jlpt')}<h1>${lv.toUpperCase()} reading 読解</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="ex-reading" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <p class="muted">Real-life notes, emails and notices, like the exam. Read the Japanese first. Use the key words if you get stuck, and the translation only at the end.</p>
      <div class="pgrid">${READING.filter(r => r.level === lv).map(r => `<button class="pcard" data-act="ex-passage" data-arg="${r.id}">
        <span class="pch">${r.pic}</span><span class="pt"><b>${esc(r.title)}</b><small>${r.qs.length} questions</small></span></button>`).join('')}</div>`);
  }

  function passage(id) {
    ctx.clearSess();
    const r = READING.find(x => x.id === id);
    st = { kind: 'passage', id, picked: {} };
    render(`
      <div class="head">${back('ex-reading', r.level)}<h1>${r.pic} ${esc(r.title)}</h1></div>
      <div class="card left">${passageHtml(r)}</div>
      ${r.qs.map((q, qi) => `<div class="card left qblock">
        <b lang="ja">問${qi + 1}　${esc(q.q)}</b><div class="muted small">${esc(q.en)}</div>
        <div class="choices">${q.options.map((o, oi) => `<button class="choice" data-act="ex-read-answer" data-arg="${qi}.${oi}" id="ro-${qi}-${oi}"><span lang="ja">${oi + 1}. ${esc(o)}</span></button>`).join('')}</div>
      </div>`).join('')}
      <details class="answers"><summary>🔤 English translation</summary><p>${esc(r.en)}</p></details>`);
  }

  function readAnswer(arg) {
    const [qi, oi] = arg.split('.').map(Number);
    if (st.picked[qi] != null) return;
    st.picked[qi] = oi;
    const r = READING.find(x => x.id === st.id), q = r.qs[qi];
    for (let i = 0; i < q.options.length; i++) {
      const b = document.getElementById(`ro-${qi}-${i}`);
      b.disabled = true;
      if (i === q.answer) b.classList.add('right'); else if (i === oi) b.classList.add('wrong');
    }
  }

  // ================= Listening =================
  function listeningList(lv) {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('jlpt')}<h1>${lv.toUpperCase()} listening 聴解</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="ex-listening" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <p class="muted">Like the real test: you hear the question first, then the conversation, then the question again. The man’s voice is lower, the woman’s higher. Don’t read the transcript until you’ve answered!</p>
      <div class="pgrid">${LISTENING.filter(l => l.level === lv).map(l => `<button class="pcard" data-act="ex-listen" data-arg="${l.id}">
        <span class="pch">${l.pic}</span><span class="pt"><b>${esc(l.kind)}</b><small>${esc(l.q[1])}</small></span></button>`).join('')}</div>`);
  }

  const listeningOptions = (item, act, arg = '') => `<div class="choices ${item.options[0].pic ? 'four' : ''}">${item.options.map((o, oi) => `<button class="choice ${o.pic ? 'center' : ''}" data-act="${act}" data-arg="${arg}${oi}" id="lo-${oi}">
      ${o.pic ? `<span class="wpic">${o.pic}</span>` : `<span lang="ja">${oi + 1}. ${esc(o.jp)}</span>`}</button>`).join('')}</div>`;

  const transcript = item => `<details class="answers" id="transcript"><summary>📜 Transcript</summary><ul class="phrases">${item.lines.map(([who, jp, en]) => `<li><b>${who === 'm' ? '👨' : who === 'f' ? '👩' : '🎙️'}</b> <span lang="ja">${esc(jp)}</span><div class="muted small">${esc(en)}</div></li>`).join('')}</ul></details>`;

  function listen(id) {
    ctx.clearSess();
    const item = LISTENING.find(x => x.id === id);
    st = { kind: 'listen', id, answered: false };
    render(`
      <div class="head">${back('ex-listening', item.level)}<h1>${item.pic} ${esc(item.kind)}</h1></div>
      <div class="card">
        <div class="pic">🎧</div>
        <span class="tag alt">Listen and choose</span>
        <button class="btn listen" data-act="ex-play">▶ Play</button>
      </div>
      ${listeningOptions(item, 'ex-listen-answer')}
      <div class="actions" id="actions"></div>`);
    playListening(item);
  }

  function listenAnswer(oi) {
    if (st.answered) return;
    st.answered = true;
    st.token = null; ctx.stop();
    const item = LISTENING.find(x => x.id === st.id);
    item.options.forEach((o, i) => {
      const b = document.getElementById('lo-' + i);
      b.disabled = true;
      if (i === item.answer) b.classList.add('right'); else if (i === +oi) b.classList.add('wrong');
    });
    const ok = +oi === item.answer;
    document.getElementById('actions').innerHTML = `
      <div class="score ${ok ? 'ok' : 'retry'} center">${ok ? '✓ Correct!' : '✗ Not quite. Read the transcript, then listen again.'}</div>
      <div class="card compact left"><b lang="ja">${esc(item.q[0])}</b><div class="muted small">${esc(item.q[1])}</div>
        <div>✓ <span lang="ja">${esc(item.options[item.answer].jp)}</span> · ${esc(item.options[item.answer].en)}</div></div>
      ${transcript(item)}`;
    if (!ok) document.getElementById('transcript').open = true;
  }

  // ================= Mock test =================
  function mockIntro(lv) {
    ctx.clearSess(); st = null;
    const ex = EXAMS[lv];
    render(`
      <div class="head">${back('jlpt')}<h1>${ex.title} mock test</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="ex-mock" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <div class="card left">
        <p>A mini exam with every section, scored the way JLPT scores: <b>language knowledge + reading out of 120</b> and <b>listening out of 60</b>.</p>
        <ul class="tips">${SECTIONS.map(([, en, jp]) => `<li>✏️ ${esc(en)} <span lang="ja" class="muted">${jp}</span></li>`).join('')}</ul>
        <div class="note">🎯 To pass: ${ex.pass.total}/180 total, at least ${ex.pass.sections[0][1]}/120 and ${ex.pass.sections[1][1]}/60. No answers are shown until the end, like the real thing. About 25 minutes.</div>
      </div>
      <button class="btn primary big" data-act="ex-mock-start" data-arg="${lv}">▶ Start mock test</button>`);
  }

  function buildMock(lv) {
    const qs = [];
    const kanji = KANJI.filter(k => k.level === lv || (lv === 'n4' && Math.random() < 0.3));
    const words = shuffle(kanji.flatMap(k => k.ex)).filter((w, i, a) => a.findIndex(x => x[1] === w[1]) === i);
    // 漢字読み: kanji word → reading
    for (const w of words.slice(0, 5)) {
      const others = shuffle(words.filter(x => x[1] !== w[1])).slice(0, 3).map(x => x[1]);
      qs.push({ section: 'vocab', prompt: `<span class="tag alt">漢字読み · How is it read?</span><div class="kbig small-k" lang="ja">${esc(w[0])}</div>`, options: shuffle([w[1], ...others]), right: w[1], say: w[0] });
    }
    // 表記: reading → written form
    for (const w of words.slice(5, 9)) {
      const others = shuffle(words.filter(x => x[0] !== w[0] && x[1] !== w[1])).slice(0, 3).map(x => x[0]);
      qs.push({ section: 'vocab', prompt: `<span class="tag alt">表記 · How is it written?</span><div class="kbig small-k" lang="ja">${esc(w[1])}</div>`, options: shuffle([w[0], ...others]), right: w[0], say: w[0] });
    }
    // Words with pictures
    const ws = WORDS.filter(w => w.level === lv && w.pic);
    for (const w of shuffle(ws).slice(0, 4)) {
      const others = shuffle(ws.filter(o => o.jp !== w.jp && o.en !== w.en)).slice(0, 3).map(o => o.jp);
      qs.push({ section: 'vocab', prompt: `<span class="tag alt">Which word fits the picture?</span><div class="wpic huge">${w.pic}</div>`, options: shuffle([w.jp, ...others]), right: w.jp, say: w.jp });
    }
    // 文法形式: grammar fill-in
    const pool = GRAMMAR.filter(g => g.level === lv || (lv === 'n4' && Math.random() < 0.25)).flatMap(g => g.ex);
    const gx = shuffle(pool);
    for (const e of gx.slice(0, 6)) {
      const right = e[0].match(/\[(.+?)\]/)[1];
      const others = [...new Set(shuffle(pool).map(x => x[0].match(/\[(.+?)\]/)[1]))].filter(x => x !== right).slice(0, 3);
      qs.push({ section: 'grammar', prompt: `<span class="tag alt">文法 · Fill in the blank</span><div class="jp big-jp" lang="ja">${esc(e[0]).replace(/\[(.+?)\]/, '<span class="gap wide">？</span>')}</div>`, options: shuffle([right, ...others]), right, say: e[0].replace(/[[\]]/g, '') });
    }
    // 文の組み立て as multiple choice: which order is correct?
    for (const e of gx.slice(6).filter(x => chunk(x[0]).length >= 3 && chunk(x[0]).length <= 5).slice(0, 2)) {
      const parts = chunk(e[0]), right = parts.join(' / ');
      const wrong = new Set();
      for (let t = 0; t < 20 && wrong.size < 3; t++) { const o = shuffle(parts).join(' / '); if (o !== right) wrong.add(o); }
      qs.push({ section: 'grammar', prompt: `<span class="tag alt">★ Which order is correct?</span><div class="muted">${esc(e[3])}</div>`, options: shuffle([right, ...wrong]), right, say: e[0].replace(/[[\]]/g, '') });
    }
    // 読解
    for (const r of shuffle(READING.filter(x => x.level === lv)).slice(0, 3)) {
      for (const [qi, q] of r.qs.entries()) qs.push({ section: 'reading', passage: r, prompt: `${qi === 0 ? '' : '<span class="tag alt">Same passage</span>'}<b lang="ja">${esc(q.q)}</b>`, options: q.options, right: q.options[q.answer] });
    }
    // 聴解
    for (const item of shuffle(LISTENING.filter(x => x.level === lv)).slice(0, 6)) {
      qs.push({ section: 'listening', item, prompt: '<span class="tag alt">聴解 · Listen and choose</span><button class="btn listen" data-act="ex-mock-play">▶ Play again</button>',
        options: item.options.map((o, i) => String(i)), right: String(item.answer) });
    }
    return qs;
  }

  function mockStart(lv) {
    ctx.clearSess();
    st = { kind: 'mock', lv, qs: buildMock(lv), i: 0, results: [], started: Date.now() };
    mockQ();
  }

  function mockQ() {
    const q = st.qs[st.i];
    if (!q) return mockDone();
    const mins = Math.floor((Date.now() - st.started) / 60000);
    const sec = SECTIONS.find(s => s[0] === q.section);
    const optHtml = q.item
      ? listeningOptions(q.item, 'ex-mock-answer')
      : `<div class="choices">${q.options.map((o, i) => `<button class="choice" data-act="ex-mock-answer" data-arg="${i}"><span lang="ja">${i + 1}. ${esc(o)}</span></button>`).join('')}</div>`;
    render(`
      <div class="head">${back('ex-mock', st.lv)}<div class="grow">${bar(st.i, st.qs.length)}</div><span class="muted">⏱ ${mins}m</span></div>
      <p class="muted small center">${esc(sec[1])} <span lang="ja">${sec[2]}</span> · ${st.i + 1}/${st.qs.length}</p>
      ${q.passage ? `<div class="card left">${passageHtml(q.passage)}</div>` : ''}
      <div class="card ${q.passage ? 'left' : ''}">${q.prompt}</div>
      ${optHtml}`);
    if (q.item) playListening(q.item);
  }

  function mockAnswer(i) {
    const q = st.qs[st.i];
    st.token = null; ctx.stop();
    st.results.push({ section: q.section, ok: q.options[+i] === q.right });
    st.i++;
    mockQ();
  }

  function mockDone() {
    const s = scoreMock(st.results, st.lv), ex = EXAMS[st.lv];
    const mins = Math.max(1, Math.round((Date.now() - st.started) / 60000));
    const lv = st.lv; st = null;
    const weakest = Object.entries(s.bySection).sort((a, b) => a[1] - b[1])[0];
    render(`<div class="done">
      <div class="big-emoji">${s.passed ? '🎉' : '📚'}</div>
      <h1>${s.passed ? 'Pass!' : 'Not yet'} · ${s.total}/180</h1>
      <p class="muted">${mins} min · ${ex.title}${S().settings.hindi ? (s.passed ? ' · Badhai ho!' : ' · Lage raho, ho jaayega!') : ''}</p>
      <div class="card left passbox">
        <div class="passbar"><span>Total ${s.total} / 180 (pass ${ex.pass.total})</span><div class="pb"><i style="width:${100 * s.total / 180}%"></i></div></div>
        <div class="passbar small ${s.langReading >= ex.pass.sections[0][1] ? '' : 'fail'}"><span>Language + reading ${s.langReading} / 120 (min ${ex.pass.sections[0][1]})</span><div class="pb"><i style="width:${100 * s.langReading / 120}%"></i></div></div>
        <div class="passbar small ${s.listening >= ex.pass.sections[1][1] ? '' : 'fail'}"><span>Listening ${s.listening} / 60 (min ${ex.pass.sections[1][1]})</span><div class="pb"><i style="width:${100 * s.listening / 60}%"></i></div></div>
      </div>
      <ul class="tips">${SECTIONS.map(([id, en, jp]) => `<li>${s.bySection[id] >= 70 ? '✅' : '⚠️'} ${esc(en)} <span lang="ja" class="muted">${jp}</span>: ${s.bySection[id]}%</li>`).join('')}</ul>
      <p>Focus next on <b>${esc(SECTIONS.find(x => x[0] === weakest[0])[1])}</b>.</p>
      <button class="btn primary big" data-act="ex-mock" data-arg="${lv}">Done</button>
    </div>`);
  }

  const actions = {
    'ex-reading': lv => ctx.go('jlpt/reading/' + (lv || level())),
    'ex-passage': id => passage(id),
    'ex-read-answer': a => readAnswer(a),
    'ex-listening': lv => ctx.go('jlpt/listening/' + (lv || level())),
    'ex-listen': id => listen(id),
    'ex-play': () => { const item = LISTENING.find(x => x.id === st?.id); if (item) playListening(item); },
    'ex-listen-answer': i => listenAnswer(i),
    'ex-mock': lv => ctx.go('jlpt/mock/' + (lv || level())),
    'ex-mock-start': lv => mockStart(lv),
    'ex-mock-answer': i => mockAnswer(i),
    'ex-mock-play': () => { const q = st?.qs?.[st.i]; if (q?.item) playListening(q.item); },
  };

  function route(h) {
    const lv = s => (s === 'n4' ? 'n4' : 'n5');
    if (h.startsWith('jlpt/reading/')) return readingList(lv(h.slice(13))), true;
    if (h.startsWith('jlpt/listening/')) return listeningList(lv(h.slice(15))), true;
    if (h.startsWith('jlpt/mock/')) return mockIntro(lv(h.slice(10))), true;
    return false;
  }

  function rerender() {
    if (!st) return false;
    if (st.kind === 'passage') passage(st.id);
    else if (st.kind === 'listen') listen(st.id);
    else mockQ();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; } };
}
