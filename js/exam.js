// JLPT reading, listening and timed mock tests.
import { READING, LISTENING } from './exam-data.js';
import { EXAMS, GRAMMAR } from './jlpt-data.js';
import { KANJI } from './kanji-data.js';
import { WORDS } from './vocab-data.js';
import { chunk } from './jlpt.js';
import { prefetchClip } from './clips.js';
import { sameMeaning } from './core.js';
import { CONTEXT, PARAPHRASE, USAGE, PASSAGES, ORDER } from './exam-types.js';
import { icon } from './icons.js';

// Question types, in exam order.
export const TYPES = { kanji: '漢字読み', hyouki: '表記', pic: '語彙', context: '文脈規定', para: '言い換え類義', usage: '用法', form: '文法形式', order: '文の組み立て', passage: '文章の文法', read: '読解', task: '課題理解', point: 'ポイント理解', say: '発話表現', quick: '即時応答' };
// Full mock: the real exam's papers, question counts per type and minutes.
export const FULL = {
  n5: [
    { en: 'Vocabulary', jp: '言語知識（文字・語彙）', min: 20, parts: [['kanji', 7], ['hyouki', 5], ['context', 6], ['para', 3]] },
    { en: 'Grammar & reading', jp: '言語知識（文法）・読解', min: 40, parts: [['form', 9], ['order', 4], ['passage', 4], ['read', 6]] },
    { en: 'Listening', jp: '聴解', min: 30, parts: [['task', 7], ['point', 6], ['say', 5], ['quick', 6]] },
  ],
  n4: [
    { en: 'Vocabulary', jp: '言語知識（文字・語彙）', min: 25, parts: [['kanji', 7], ['hyouki', 5], ['context', 8], ['para', 4], ['usage', 4]] },
    { en: 'Grammar & reading', jp: '言語知識（文法）・読解', min: 55, parts: [['form', 13], ['order', 4], ['passage', 4], ['read', 8]] },
    { en: 'Listening', jp: '聴解', min: 35, parts: [['task', 8], ['point', 7], ['say', 5], ['quick', 8]] },
  ],
};

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
  let st = null;

  // Question, conversation, question again. A new play (or leaving the question) stops the old one.
  async function playListening(item) {
    const token = {};
    if (st) st.token = token;
    const live = () => st?.token === token;
    const say = (t, who) => ctx.sayAs(t, who);
    await say(item.q[0], 'n');
    for (const [who, jp] of item.lines) { if (!live()) return; await new Promise(r => setTimeout(r, 400)); if (!live()) return; await say(jp, who); }
    if (live()) { await new Promise(r => setTimeout(r, 500)); if (live()) await say(item.q[0], 'n'); }
  }

  const passageHtml = r => `
    <div class="passage" lang="ja">${esc(r.text).replace(/\n/g, '<br>')}</div>
    <details class="answers"><summary>${icon('reading')} Key words</summary><ul class="glossary">${r.words.map(w => `<li><b lang="ja">${esc(w[0])}</b> <span lang="ja">${esc(w[1])}</span> · ${esc(w[2])}</li>`).join('')}</ul></details>`;

  // ================= Reading =================
  function readingList(lv) {
    ctx.clearSess(); st = null;
    render(`
      <div class="head">${back('jlpt')}<h1>${lv.toUpperCase()} reading 読解</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="ex-reading" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <p class="muted">Real-life notes, emails and notices, like the exam. Read the Japanese first. Use the key words if you get stuck, and the translation only at the end.</p>
      <div class="pgrid">${READING.filter(r => r.level === lv).map(r => `<button class="pcard" data-act="ex-passage" data-arg="${r.id}">
        <span class="pch">${icon('reading')}</span><span class="pt"><b>${esc(r.title)}</b><small>${r.qs.length} questions</small></span></button>`).join('')}</div>`);
  }

  function passage(id) {
    ctx.clearSess();
    const r = READING.find(x => x.id === id);
    st = { kind: 'passage', id, picked: {} };
    render(`
      <div class="head">${back('ex-reading', r.level)}<h1>${esc(r.title)}</h1></div>
      <div class="card left">${passageHtml(r)}</div>
      ${r.qs.map((q, qi) => `<div class="card left qblock">
        <b lang="ja">問${qi + 1}　${esc(q.q)}</b><div class="muted small">${esc(q.en)}</div>
        <div class="choices">${q.options.map((o, oi) => `<button class="choice" data-act="ex-read-answer" data-arg="${qi}.${oi}" id="ro-${qi}-${oi}"><span lang="ja">${oi + 1}. ${esc(o)}</span></button>`).join('')}</div>
      </div>`).join('')}
      <details class="answers"><summary>${icon('translate')} English translation</summary><p>${esc(r.en)}</p></details>`);
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
        <span class="pch">${icon('listening')}</span><span class="pt"><b>${esc(l.kind)}</b><small>${esc(l.q[1])}</small></span></button>`).join('')}</div>`);
  }

  const listeningOptions = (item, act, arg = '') => `<div class="choices ${item.options[0].pic ? 'four' : ''}">${item.options.map((o, oi) => `<button class="choice ${o.pic ? 'center' : ''}" data-act="${act}" data-arg="${arg}${oi}" id="lo-${oi}">
      ${o.pic ? `<span class="wpic">${o.pic}</span>` : `<span lang="ja">${oi + 1}. ${esc(o.jp)}</span>`}</button>`).join('')}</div>`;

  const transcript = item => `<details class="answers" id="transcript"><summary>${icon('transcript')} Transcript</summary><ul class="phrases">${item.lines.map(([who, jp, en]) => `<li><b>${who === 'm' ? 'Man' : who === 'f' ? 'Woman' : 'Narrator'}:</b> <span lang="ja">${esc(jp)}</span><div class="muted small">${esc(en)}</div></li>`).join('')}</ul></details>`;

  function listen(id) {
    ctx.clearSess();
    const item = LISTENING.find(x => x.id === id);
    st = { kind: 'listen', id, answered: false };
    prefetchClip(item.q[0]); for (const [who, jp] of item.lines) prefetchClip(jp, who === 'm' || who === 'f' ? who : 'n');
    render(`
      <div class="head">${back('ex-listening', item.level)}<h1>${esc(item.kind)}</h1></div>
      <div class="card">
        <div class="pic">${icon('listening')}</div>
        <span class="tag alt">Listen and choose</span>
        <button class="btn listen" data-act="ex-play">${icon('play')} Play</button>
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
    ctx.clearSess(); stopTimer(); st = null;
    const ex = EXAMS[lv], plan = FULL[lv];
    const count = p => p.parts.reduce((n, t) => n + t[1], 0);
    render(`
      <div class="head">${back('jlpt')}<h1>${ex.title} mock test</h1></div>
      <div class="seg">${['n5', 'n4'].map(l => `<button class="${l === lv ? 'on' : ''}" data-act="ex-mock" data-arg="${l}">${l.toUpperCase()}</button>`).join('')}</div>
      <div class="card left">
        <p><b>Full mock</b>: the real exam’s question types, counts and time limits, in the same order. Scored the way JLPT scores: <b>language knowledge + reading out of 120</b> and <b>listening out of 60</b>.</p>
        <ul class="tips">${plan.map(p => `<li>${esc(p.en)} <span lang="ja" class="muted">${p.jp}</span> · ${count(p)} questions · ${p.min} min</li>`).join('')}</ul>
        <div class="note">${icon('goal')} To pass: ${ex.pass.total}/180 total, at least ${ex.pass.sections[0][1]}/120 and ${ex.pass.sections[1][1]}/60. No answers are shown until the end, like the real thing. Each paper has its own clock.</div>
      </div>
      <button class="btn primary big" data-act="ex-mock-start" data-arg="${lv}.full">${icon('start')} Start full mock · ${plan.reduce((n, p) => n + p.min, 0)} min</button>
      <button class="btn" data-act="ex-mock-start" data-arg="${lv}.quick">${icon('quick')} Quick mock · about 30 questions, no clock</button>`);
  }

  const tag = (jp, en) => `<span class="tag alt" lang="ja">${jp}</span> <span class="muted small">${esc(en)}</span>`;
  const plain = s => s.replace(/[[\]]/g, '');
  // Wrong options that differ from the right one and from each other.
  const distinct = (right, pool, n = 3) => [...new Set(shuffle(pool))].filter(x => x && x !== right).slice(0, n);
  const kanjiWords = lv => {
    const own = KANJI.filter(k => k.level === lv).flatMap(k => k.ex);
    return shuffle(own).filter((w, i, a) => a.findIndex(x => x[0] === w[0] || x[1] === w[1]) === i);
  };
  const grammarPool = lv => GRAMMAR.filter(g => g.level === lv || (lv === 'n4' && Math.random() < 0.2)).flatMap(g => g.ex).filter(e => /\[.+?\]/.test(e[0]));
  const NOTICE = /notice|menu|forecast|hours|advert|how to/i;

  // One builder per JLPT question type. Each returns n questions { section, type, prompt, options, right, review }.
  const BUILD = {
    kanji(lv, n, words) {
      return words.splice(0, n).map(w => ({ section: 'vocab', type: 'kanji',
        prompt: `${tag('漢字読み', 'How is the word read?')}<div class="kbig small-k" lang="ja">${esc(w[0])}</div>`,
        options: shuffle([w[1], ...distinct(w[1], words.map(x => x[1]))]), right: w[1], review: w[0] }));
    },
    hyouki(lv, n, words) {
      return words.splice(0, n).map(w => ({ section: 'vocab', type: 'hyouki',
        prompt: `${tag('表記', 'How is it written?')}<div class="kbig small-k" lang="ja">${esc(w[1])}</div>`,
        options: shuffle([w[0], ...distinct(w[0], words.map(x => x[0]))]), right: w[0], review: w[1] }));
    },
    context(lv, n) {
      return shuffle(CONTEXT.filter(c => c[0] === lv)).slice(0, n).map(([, jp, , en, right, ...wrong]) => ({ section: 'vocab', type: 'context',
        prompt: `${tag('文脈規定', 'Which word fits the gap?')}<div class="jp big-jp" lang="ja">${esc(jp).replace('（　）', '<span class="gap wide">？</span>')}</div>`,
        options: shuffle([right, ...wrong]), right, review: jp, en }));
    },
    para(lv, n) {
      return shuffle(PARAPHRASE.filter(c => c[0] === lv)).slice(0, n).map(([, jp, , en, right, ...wrong]) => ({ section: 'vocab', type: 'para',
        prompt: `${tag('言い換え類義', 'Which sentence means the same as the underlined part?')}<div class="jp big-jp" lang="ja">${esc(jp).replace(/\[(.+?)\]/, '<u>$1</u>')}</div>`,
        options: shuffle([right, ...wrong]), right, review: plain(jp), en }));
    },
    usage(lv, n) {
      return shuffle(USAGE).slice(0, n).map(([word, kana, en, right, ...wrong]) => ({ section: 'vocab', type: 'usage',
        prompt: `${tag('用法', 'Which sentence uses the word correctly?')}<div class="kbig small-k" lang="ja">${esc(word)}</div><div class="muted" lang="ja">${esc(kana)}</div>`,
        options: shuffle([right, ...wrong]), right, review: word, en }));
    },
    form(lv, n) {
      const pool = grammarPool(lv), gaps = pool.map(e => e[0].match(/\[(.+?)\]/)[1]);
      const out = [];
      for (const e of shuffle(pool)) {
        const right = e[0].match(/\[(.+?)\]/)[1];
        if (out.some(q => q.right === right)) continue;
        const wrong = distinct(right, gaps);
        if (wrong.length < 3) continue;
        out.push({ section: 'grammar', type: 'form',
          prompt: `${tag('文法形式', 'What goes in the gap?')}<div class="jp big-jp" lang="ja">${esc(e[0]).replace(/\[(.+?)\]/, '<span class="gap wide">？</span>')}</div>`,
          options: shuffle([right, ...wrong]), right, review: plain(e[0]), en: e[3] });
        if (out.length === n) break;
      }
      return out;
    },
    // ★ like the exam: four pieces in a row are blank, one has the star. Pick the piece for ★.
    order(lv, n) {
      return shuffle(ORDER.filter(o => o[0] === lv)).slice(0, n).map(([, before, four, after, en]) => {
        const k = Math.floor(Math.random() * 4), right = four[k];
        const blank = i => `<span class="gap${i === k ? ' star' : ''}">${i === k ? '★' : '＿＿'}</span>`;
        return { section: 'grammar', type: 'order',
          prompt: `${tag('文の組み立て', 'Put the four pieces in order. Which one goes in ★?')}<div class="jp big-jp" lang="ja">${esc(before)} ${four.map((_, i) => blank(i)).join(' ')} ${esc(after)}</div>`,
          options: shuffle(four), right, review: before + four.join('') + after, en };
      });
    },
    passage(lv, n) {
      const out = [];
      for (const p of shuffle(PASSAGES.filter(x => x.level === lv))) {
        for (const [i, [right, ...wrong]] of p.blanks.entries()) {
          if (out.length === n) return out;
          const mark = '（' + '１２３４５６７８'[i] + '）';
          const text = esc(p.text).replace(/\n/g, '<br>').replace(mark, `<mark>${mark}</mark>`);
          out.push({ section: 'grammar', type: 'passage', text,
            prompt: `${tag('文章の文法', `What goes in ${mark}?`)}`,
            options: shuffle([right, ...wrong]), right, review: `${p.title} ${mark}`, en: p.en });
        }
      }
      return out;
    },
    read(lv, n) {
      // Short and mid-length passages first, then one notice to find information in, like the exam.
      const pool = shuffle(READING.filter(r => r.level === lv));
      const notice = pool.find(r => NOTICE.test(r.title));
      const list = [];
      let count = notice ? notice.qs.length : 0;
      for (const r of pool.filter(r => !NOTICE.test(r.title))) { if (count >= n) break; list.push(r); count += r.qs.length; }
      if (notice) list.push(notice);
      return list.flatMap(r => r.qs.map((q, qi) => ({ section: 'reading', type: 'read', passage: r,
        prompt: `${qi ? '<span class="tag alt">Same passage</span> ' : ''}<b lang="ja">${esc(q.q)}</b>`,
        options: q.options, right: q.options[q.answer], review: q.q, en: q.en }))).slice(0, n);
    },
  };
  // Listening parts, by the kinds written in exam-data.js.
  const LISTEN_KINDS = { task: ['Task-based', 'Picture question'], point: ['Key point', 'Key point (why?)'], say: ['What do you say?'], quick: ['Quick response'] };
  for (const [type, kinds] of Object.entries(LISTEN_KINDS)) {
    BUILD[type] = (lv, n, words, used) => shuffle(LISTENING.filter(x => x.level === lv && kinds.includes(x.kind) && !used.has(x.id))).slice(0, n).map(item => {
      used.add(item.id);
      const line = type === 'say' || type === 'quick'; // the situation or remark is the question
      return { section: 'listening', type, item,
        prompt: `${tag(TYPES[type], item.kind)}<button class="btn listen" data-act="ex-mock-play">${icon('play')} Play again</button>`,
        options: item.options.map((o, i) => String(i)), right: String(item.answer), review: line ? item.lines[0][1] : item.q[0], en: line ? item.lines[0][2] : item.q[1], answerText: item.options[item.answer].jp };
    });
  }

  function buildFull(lv) {
    const words = kanjiWords(lv), used = new Set();
    return FULL[lv].map((p, pi) => ({ ...p, qs: p.parts.flatMap(([type, n]) => BUILD[type](lv, n, words, used).map(q => ({ ...q, paper: pi }))) }));
  }

  function buildMock(lv) {
    const qs = [];
    const kanji = KANJI.filter(k => k.level === lv || (lv === 'n4' && Math.random() < 0.3));
    const words = shuffle(kanji.flatMap(k => k.ex)).filter((w, i, a) => a.findIndex(x => x[1] === w[1]) === i);
    // 漢字読み: kanji word → reading
    for (const w of words.slice(0, 5)) {
      const others = shuffle(words.filter(x => x[1] !== w[1])).slice(0, 3).map(x => x[1]);
      qs.push({ section: 'vocab', type: 'kanji', prompt: `<span class="tag alt">漢字読み · How is it read?</span><div class="kbig small-k" lang="ja">${esc(w[0])}</div>`, options: shuffle([w[1], ...others]), right: w[1], review: w[0] });
    }
    // 表記: reading → written form
    for (const w of words.slice(5, 9)) {
      const others = shuffle(words.filter(x => x[0] !== w[0] && x[1] !== w[1])).slice(0, 3).map(x => x[0]);
      qs.push({ section: 'vocab', type: 'hyouki', prompt: `<span class="tag alt">表記 · How is it written?</span><div class="kbig small-k" lang="ja">${esc(w[1])}</div>`, options: shuffle([w[0], ...others]), right: w[0], review: w[1] });
    }
    // Words with pictures
    const ws = WORDS.filter(w => w.level === lv && w.pic);
    for (const w of shuffle(ws).slice(0, 4)) {
      const others = shuffle(ws.filter(o => o.jp !== w.jp && o.pic !== w.pic && !sameMeaning(o.en, w.en))).slice(0, 3).map(o => o.jp);
      qs.push({ section: 'vocab', type: 'pic', prompt: `<span class="tag alt">Which word fits the picture?</span><div class="wpic huge">${w.pic}</div>`, options: shuffle([w.jp, ...others]), right: w.jp, review: w.pic });
    }
    qs.push(...BUILD.context(lv, 3), ...BUILD.form(lv, 6), ...BUILD.order(lv, 2), ...BUILD.read(lv, 6));
    qs.push(...BUILD.task(lv, 2, null, new Set()), ...BUILD.point(lv, 2, null, new Set()), ...BUILD.say(lv, 1, null, new Set()), ...BUILD.quick(lv, 1, null, new Set()));
    return [{ en: 'Quick mock', jp: 'ミニ模試', min: 0, qs }];
  }

  // Each paper's clock counts down on screen. Like the real test, time running out ends the paper,
  // but here you choose when: the rest of the paper is then marked wrong.
  let timer = null;
  const stopTimer = () => { clearInterval(timer); timer = null; };
  const left = () => st.papers[st.p].min * 60000 - (Date.now() - st.paperStart);
  const clock = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  function tick() {
    const el = document.getElementById('mclock');
    if (!el || st?.kind !== 'mock') return stopTimer();
    const ms = left();
    el.innerHTML = icon('time') + ' ' + clock(ms);
    el.classList.toggle('late', ms <= 0);
    if (ms <= 0 && !document.getElementById('mtimeup')) {
      el.insertAdjacentHTML('afterend', `<div class="note" id="mtimeup">${icon('left')} Time’s up for this paper. In the real test it ends now. <button class="btn" data-act="ex-mock-endpaper">End paper</button></div>`);
    }
  }

  function mockStart(arg) {
    ctx.clearSess(); stopTimer();
    const [lv, mode] = arg.split('.');
    const papers = mode === 'quick' ? buildMock(lv) : buildFull(lv);
    st = { kind: 'mock', lv, mode, papers, p: 0, i: 0, results: [], started: Date.now(), intro: mode !== 'quick' };
    st.paperStart = Date.now();
    mockQ();
  }

  function paperIntro() {
    const p = st.papers[st.p];
    const parts = [...new Set(p.qs.map(q => q.type))].map(t => `<li><span lang="ja">${TYPES[t]}</span> · ${p.qs.filter(q => q.type === t).length}</li>`).join('');
    render(`
      <div class="head">${back('ex-mock', st.lv)}<h1>Paper ${st.p + 1} of ${st.papers.length}</h1></div>
      <div class="card left">
        <h2>${esc(p.en)} <span lang="ja" class="muted">${p.jp}</span></h2>
        <p>${p.qs.length} questions · ${p.min} minutes</p>
        <ul class="tips">${parts}</ul>
        ${p.qs[0]?.section === 'listening' ? `<div class="note">${icon('listening')} Each question plays once by itself: the question, the conversation, then the question again. You can replay it here, which the real test doesn’t allow.</div>` : ''}
      </div>
      <button class="btn primary big" data-act="ex-mock-paper">${icon('start')} Start paper ${st.p + 1}</button>`);
  }

  function mockQ() {
    const paper = st.papers[st.p];
    if (!paper) return mockDone();
    if (st.intro) return paperIntro();
    const q = paper.qs[st.i];
    if (!q) { st.p++; st.i = 0; st.intro = true; stopTimer(); return mockQ(); }
    const total = st.papers.reduce((n, p) => n + p.qs.length, 0);
    const done = st.papers.slice(0, st.p).reduce((n, p) => n + p.qs.length, 0) + st.i;
    const sec = SECTIONS.find(s => s[0] === q.section);
    const optHtml = q.item
      ? listeningOptions(q.item, 'ex-mock-answer')
      : `<div class="choices">${q.options.map((o, i) => `<button class="choice" data-act="ex-mock-answer" data-arg="${i}"><span lang="ja">${i + 1}. ${esc(o)}</span></button>`).join('')}</div>`;
    const timed = paper.min > 0;
    render(`
      <div class="head">${back('ex-mock', st.lv)}<div class="grow">${bar(done, total)}</div><span class="muted mclock" id="mclock">${icon('time')} ${timed ? clock(left()) : Math.floor((Date.now() - st.started) / 60000) + 'm'}</span></div>
      <p class="muted small center">${esc(sec[1])} <span lang="ja">${sec[2]}</span> · ${st.i + 1}/${paper.qs.length}${st.papers.length > 1 ? ` · paper ${st.p + 1}/${st.papers.length}` : ''}</p>
      ${q.passage ? `<div class="card left">${passageHtml(q.passage)}</div>` : ''}
      ${q.text ? `<div class="card left"><div class="passage" lang="ja">${q.text}</div></div>` : ''}
      <div class="card ${q.passage || q.text ? 'left' : ''}">${q.prompt}</div>
      ${optHtml}`);
    if (timed) { if (!timer) timer = setInterval(tick, 1000); tick(); }
    if (q.item) playListening(q.item);
  }

  function mockAnswer(i) {
    const q = st.papers[st.p].qs[st.i];
    st.token = null; ctx.stop();
    st.results.push({ section: q.section, type: q.type, ok: q.options[+i] === q.right, q, picked: q.options[+i] });
    st.i++;
    mockQ();
  }

  function endPaper() {
    const paper = st.papers[st.p];
    for (const q of paper.qs.slice(st.i)) st.results.push({ section: q.section, type: q.type, ok: false, q, picked: null });
    st.i = paper.qs.length;
    mockQ();
  }

  function mockDone() {
    stopTimer();
    const s = scoreMock(st.results, st.lv), ex = EXAMS[st.lv];
    const mins = Math.max(1, Math.round((Date.now() - st.started) / 60000));
    const lv = st.lv, results = st.results, full = st.mode !== 'quick'; st = null;
    // A passed full mock shows on the 👥 board. It no longer ticks a path level: levels are marked by hand (v6.0).
    if (s.passed && full) ctx.mockPassed(lv);
    const weakest = Object.entries(s.bySection).sort((a, b) => a[1] - b[1])[0];
    const types = [...new Set(results.map(r => r.type))].map(t => {
      const r = results.filter(x => x.type === t), ok = r.filter(x => x.ok).length;
      return `<li>${icon(ok / r.length >= 0.7 ? 'done' : 'warn')} <span lang="ja">${TYPES[t] || t}</span>: ${ok}/${r.length}</li>`;
    }).join('');
    const answerOf = q => q.answerText || q.right;
    const wrong = results.filter(r => !r.ok).map(({ q, picked }) => `<li><span lang="ja">${esc(q.review)}</span>${q.en ? `<div class="muted small">${esc(q.en)}</div>` : ''}
      <div>✓ <span lang="ja">${esc(answerOf(q))}</span>${picked == null ? ' <span class="muted small">(not answered)</span>' : q.item ? '' : ` <span class="muted small">· you chose <span lang="ja">${esc(picked)}</span></span>`}</div></li>`).join('');
    render(`<div class="done">
      <div class="big-emoji">${icon(s.passed ? 'finish' : 'need')}</div>
      <h1>${s.passed ? 'Pass!' : 'Not yet'} · ${s.total}/180</h1>
      <p class="muted">${mins} min · ${ex.title}${S().settings.hindi ? (s.passed ? ' · Badhai ho!' : ' · Lage raho, ho jaayega!') : ''}</p>
      <div class="card left passbox">
        <div class="passbar"><span>Total ${s.total} / 180 (pass ${ex.pass.total})</span><div class="pb"><i style="width:${100 * s.total / 180}%"></i></div></div>
        <div class="passbar small ${s.langReading >= ex.pass.sections[0][1] ? '' : 'fail'}"><span>Language + reading ${s.langReading} / 120 (min ${ex.pass.sections[0][1]})</span><div class="pb"><i style="width:${100 * s.langReading / 120}%"></i></div></div>
        <div class="passbar small ${s.listening >= ex.pass.sections[1][1] ? '' : 'fail'}"><span>Listening ${s.listening} / 60 (min ${ex.pass.sections[1][1]})</span><div class="pb"><i style="width:${100 * s.listening / 60}%"></i></div></div>
      </div>
      <ul class="tips">${SECTIONS.map(([id, en, jp]) => `<li>${icon(s.bySection[id] >= 70 ? 'done' : 'warn')} ${esc(en)} <span lang="ja" class="muted">${jp}</span>: ${s.bySection[id]}%</li>`).join('')}</ul>
      <p>Focus next on <b>${esc(SECTIONS.find(x => x[0] === weakest[0])[1])}</b>.</p>
      <details class="answers left"><summary>${icon('stats')} By question type</summary><ul class="tips">${types}</ul></details>
      ${wrong ? `<details class="answers left"><summary>${icon('also')} Review mistakes (${results.filter(r => !r.ok).length})</summary><ul class="phrases">${wrong}</ul></details>` : ''}
      ${s.passed && full ? `<p>${icon('path-jlpt')} Passed! Mark the exam level complete in your N5·N4 path.</p><a class="btn big" href="#path/jlpt">Open the path</a>` : ''}
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
    'ex-mock-paper': () => { st.intro = false; st.paperStart = Date.now(); mockQ(); },
    'ex-mock-endpaper': () => endPaper(),
    'ex-mock-play': () => { const q = st?.papers?.[st.p]?.qs[st.i]; if (q?.item) playListening(q.item); },
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

  return { actions, route, rerender, clear() { stopTimer(); st = null; } };
}
