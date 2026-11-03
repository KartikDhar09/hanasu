// Lessons tab: the lesson pages, one by one. Every Japanese line plays on tap; conversations and
// listening scripts can play in full, each speaker in their own voice.
import { LESSONS_INDEX, loadPage, FOOD_PIC, COLOR, spoken, sayOf, voiceOf } from './lessons-data.js';
import { PIC_SIZE } from './lessons-pics.js';
import { icon } from './icons.js';

export function initLessons(ctx) {
  const { esc, render, back } = ctx;
  const S = () => ctx.S();
  let st = null;   // the open page: { id, say: [[text, who]], seqs: [[[text, who]]], quiz: [answer] }
  let tok = 0;     // bumps to stop a conversation that is playing

  const ro = t => S().settings.romaji && t ? `<div class="ro">${esc(t)}</div>` : '';
  // A tappable line: data-say / data-who also let the app fetch its clip (in the right voice) while it's on screen.
  const sayIdx = (text, who = 'n') => {
    if (!text) return '';
    st.say.push([text, who]);
    return ` data-act="ls-say" data-arg="${st.say.length - 1}" data-say="${esc(text)}"${who !== 'n' ? ` data-who="${who}"` : ''}`;
  };

  // ================= Contents =================
  function hub() {
    ctx.clearSess(); st = null; tok++;
    // ✅ in place of the icon once the page is marked done (on the 👥 board too).
    const btn = (p, sub) => `<button class="unit" data-act="ls-open" data-arg="${p.id}">
        <span class="icon">${ctx.pageDone(p.id) ? icon('done') : p.n || icon(p.group === 'back' ? 'grammar' : 'lessons')}</span>
        <span class="ut"><b>${esc(p.n ? `Unit ${p.n} · ${p.title}` : p.title)}</b><small>${esc(sub)}</small></span>
      </button>`;
    render(`
      <h1 class="page">Lessons <span lang="ja">教科書</span></h1>
      ${[['front', 'Before you start'], ['units', 'Units'], ['back', 'Grammar &amp; word lists']].map(([g, h]) => `
        <h2 class="sec">${h}</h2>
        <div class="units">${LESSONS_INDEX.filter(p => p.group === g).map(p => btn(p, p.n ? `${p.topic} · ${p.topicJp}` : p.jp)).join('')}</div>`).join('')}`);
  }

  // ================= One page (front matter or a unit) =================
  // Pages load on demand (one small file each); a page opened before it arrives is drawn once it does.
  async function page(id) {
    ctx.clearSess(); tok++;
    const want = location.hash;
    const p = await loadPage(id);
    if (location.hash !== want) return; // the learner moved on while it loaded
    st = { id, p, say: [], seqs: [], quiz: [] };
    const top = p.n ? `
      <div class="card compact ls-key ex"${sayIdx(spoken(p.jp))}>
        <span class="tag">Unit ${p.n} · ${esc(p.topic)} <span lang="ja">${esc(p.topicJp)}</span></span>
        <div class="jp" lang="ja">${esc(p.jp)}</div>${ro(p.ro)}<div class="en">${esc(p.title)}</div>
      </div>
      <div class="card left"><b>Goals for Unit ${p.n}</b><ul class="ls-list">${p.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>` : '';
    const i = LESSONS_INDEX.findIndex(x => x.id === id), prev = LESSONS_INDEX[i - 1], next = LESSONS_INDEX[i + 1];
    if (next) loadPage(next.id).catch(() => {}); // so Next opens instantly
    render(`
      <div class="head">${back('ls-home')}<h1>${esc(p.n ? `Unit ${p.n}` : p.title)}</h1>${p.jp && !p.n ? `<span class="pill" lang="ja">${esc(p.jp)}</span>` : ''}</div>
      ${top}
      ${p.sections.map((s, k) => {
        const open = p.sections.length === 1 || (!p.n && k === 0);
        // A folded section is drawn the first time it's opened, so long pages (400+ words) open instantly.
        return `<details class="fold ls-sec"${open ? ' open' : ''} data-sec="${k}">
        <summary>${esc(s.h)}${s.sub ? ` <small class="muted">${esc(s.sub)}</small>` : ''}</summary>
        <div class="ls-body">${open ? s.blocks.map(block).join('') : ''}</div>
      </details>`;
      }).join('')}
      ${doneButton(id)}
      <div class="row">
        <button class="btn" data-act="ls-open" data-arg="${prev?.id || ''}" ${prev ? '' : 'disabled'}>‹ Prev</button>
        <button class="btn" data-act="ls-open" data-arg="${next?.id || ''}" ${next ? '' : 'disabled'}>Next ›</button>
      </div>`);
  }

  // Marks the page done on the account (shown on the 👥 board). Nothing is saved on the device, so it needs a
  // connection; the button says so instead of pretending it worked.
  const doneButton = id => ctx.pageDone(id)
    ? `<button class="btn big ls-done on" id="ls-done" data-act="ls-done" data-arg="0">${icon('done')} Done · tap to undo</button>`
    : `<button class="btn big ls-done" id="ls-done" data-act="ls-done" data-arg="1">${icon('done')} Mark this page done</button>`;
  async function markDone(done) {
    const id = st?.id, el = document.getElementById('ls-done');
    if (!id || !el) return;
    el.disabled = true;
    const ok = await ctx.markPage(id, done);
    if (st?.id !== id) return; // moved to another page meanwhile
    if (ok) el.outerHTML = doneButton(id);
    else { el.disabled = false; el.textContent = 'No connection. Tap to try again.'; }
  }

  // A picture on a lesson page: loads only when it scrolls near the screen; its size is reserved so nothing jumps.
  const pic = (file, alt = '') => {
    const [w, h] = PIC_SIZE[file] || [];
    // Not cropped yet: a box the same shape the picture will be, so the page doesn't move when it arrives.
    if (!w) return `<div class="ls-img ls-pending" role="img" aria-label="${esc(alt)}"><span>${icon('vocab')} Picture coming</span></div>`;
    return `<img class="ls-img" src="/img/lessons/${file}.jpg" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${esc(alt)}">`;
  };
  const picOf = w => COLOR[w[0]] ? `<span class="ls-swatch" style="background:${COLOR[w[0]]}"></span>` : FOOD_PIC[w[0]] ? pic(`food/${FOOD_PIC[w[0]]}`, w[2]) : '';
  const word = (w, pics) => `<button class="ls-w${pics ? ' pic' : ''}"${sayIdx(sayOf(w))}>${pics ? picOf(w) : ''}<b lang="ja">${esc(w[0])}</b>${ro(w[1])}<span class="en">${esc(w[2])}</span></button>`;
  const line = w => `<li class="ex"${sayIdx(sayOf(w))}><div class="jp" lang="ja">${esc(w[0])}</div>${ro(w[1])}<div class="en">${esc(w[2])}</div></li>`;

  // A conversation: the first speaker on the left, the next on the right, and so on.
  function talk(lines, title = '') {
    const sides = [];
    const k = st.seqs.push(lines.map(l => [spoken(l[1]), voiceOf(l[0])]).filter(x => x[0])) - 1;
    return `<div class="ls-talk">
      ${title}<button class="btn ls-play" data-act="ls-play" data-arg="${k}">${icon('start')} Play conversation</button>
      <div class="chat">${lines.map(l => {
        if (!sides.includes(l[0])) sides.push(l[0]);
        return `<div class="bubble ${sides.indexOf(l[0]) % 2 ? 'you' : 'them'}"${sayIdx(spoken(l[1]), voiceOf(l[0]))}>
          <small class="who" lang="ja">${esc(l[0])}</small><div class="jp" lang="ja">${esc(l[1])}</div>${ro(l[2])}${l[3] ? `<div class="en">${esc(l[3])}</div>` : ''}</div>`;
      }).join('')}</div></div>`;
  }

  function block(b) {
    switch (b.t) {
      case 'key': return `<div class="card compact ls-key ex"${sayIdx(spoken(b.jp))}><div class="jp" lang="ja">${esc(b.jp)}</div>${ro(b.ro)}<div class="en">${esc(b.en)}</div></div>`;
      case 'h': return `<h3 class="ls-h">${esc(b.text)}</h3>`;
      case 'p': return `<p class="ls-p">${esc(b.text)}</p>`;
      case 'note': return `<div class="note">${icon('note')} ${esc(b.text)}</div>`;
      case 'tip': return `<div class="note ok">${icon('tip')} <b>Hanasu note:</b> ${esc(b.text)}</div>`;
      case 'words': return `<div class="ls-words${b.pics ? ' pics' : ''}">${b.items.map(w => word(w, b.pics)).join('')}</div>`;
      case 'img': return PIC_SIZE[b.file] ? `<a class="ls-pic" href="/img/lessons/${b.file}.jpg" target="_blank" rel="noopener">${pic(b.file, b.alt)}<small class="muted">Tap to open full size</small></a>` : `<div class="ls-pic">${pic(b.file, b.alt)}</div>`;
      case 'scenes': return `<div class="ls-scenes">${b.items.map((x, i) => `<figure>${pic(`${b.unit}/remember-${i + 1}`, x)}<figcaption>${esc(x)}</figcaption></figure>`).join('')}</div>`;
      case 'lines': return `<ul class="phrases">${b.items.map(line).join('')}</ul>`;
      case 'talk': return talk(b.lines);
      case 'list': return `<ul class="ls-list">${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
      case 'link': return `<a class="btn" href="${esc(b.href)}">${esc(b.text)}</a>`;
      case 'subs': return `<h3 class="ls-h">Replace (1), (2)… with</h3>${b.sets.map((set, i) => `<div class="ls-subs"><span class="ls-n">${'①②③④'[i]}</span>
        <div class="ls-words">${set.map(x => word([x[1], x[2], x[0]])).join('')}</div></div>`).join('')}`;
      case 'table': return `<div class="ls-table"><table><thead><tr>${b.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      case 'check': return `<div class="ls-check">${b.items.map(x => `<label><input type="checkbox"> ${esc(x)}</label>`).join('')}</div>`;
      case 'role': return `<div class="card left ls-role">${b.title ? `<b>${esc(b.title)}</b>` : ''}
        <div class="ls-ab"><div><span class="tag">A</span><p>${esc(b.a)}</p></div><div><span class="tag alt">B</span><p>${esc(b.b)}</p></div></div></div>`;
      case 'listen': {
        const q = st.quiz.push(b.answer) - 1;
        const k = st.seqs.push(b.script.map(l => [spoken(l[1]), voiceOf(l[0])]).filter(x => x[0])) - 1;
        return `<div class="card left ls-listen" data-q="${q}">
          <div class="ls-qhead"><b>${esc(b.q)}</b>${b.setting ? ` <span class="muted">${esc(b.setting)}</span>` : ''}</div>
          <button class="btn primary" data-act="ls-play" data-arg="${k}">${icon('play')} Play</button>
          <div class="choices">${b.options.map((o, i) => `<button class="choice" data-act="ls-ans" data-arg="${q}.${i}">${i + 1}. ${esc(o)}</button>`).join('')}</div>
          <div class="ls-result" aria-live="polite"></div>
          <details class="ways"><summary>Script &amp; translation</summary>${talk(b.script)}</details>
        </div>`;
      }
      default: return '';
    }
  }

  async function playSeq(k) {
    const my = ++tok;
    for (const [text, who] of st?.seqs[k] || []) {
      if (my !== tok) return;
      await ctx.sayAs(text, who);
    }
  }

  function answer(arg) {
    const [q, i] = arg.split('.').map(Number);
    const card = document.querySelector(`.ls-listen[data-q="${q}"]`);
    if (!card || !st) return;
    const right = st.quiz[q];
    card.querySelectorAll('.choice').forEach((el, j) => {
      el.classList.toggle('right', j === right);
      el.classList.toggle('wrong', j === i && i !== right);
    });
    card.querySelector('.ls-result').innerHTML = i === right ? '<div class="score ok">✓ Correct!</div>' : `<div class="muted">The answer is ${right + 1}. Open the script to check.</div>`;
  }

  // Fill a folded section when it is first opened ('toggle' doesn't bubble, so listen in the capture phase).
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (!st || !d.open || !d.matches?.('.ls-sec[data-sec]')) return;
    const body = d.querySelector('.ls-body');
    if (body.childElementCount) return;
    body.innerHTML = st.p.sections[+d.dataset.sec].blocks.map(block).join('');
  }, true);

  const actions = {
    'ls-home': () => ctx.go('lessons'),
    'ls-open': id => id && ctx.go('lessons/' + id),
    'ls-say': i => { tok++; const s = st?.say[+i]; if (s) ctx.sayAs(s[0], s[1]); },
    'ls-play': k => playSeq(+k),
    'ls-ans': arg => answer(arg),
    'ls-done': d => markDone(d === '1'),
  };

  function route(h) {
    if (h === 'lessons') return hub(), true;
    if (h.startsWith('lessons/') && LESSONS_INDEX.some(p => p.id === h.slice(8))) return page(h.slice(8)), true;
    return false;
  }

  function rerender() {
    if (!st) return false;
    page(st.id);
    return true;
  }

  return { actions, route, rerender, clear() { st = null; tok++; ctx.stop(); } };
}
