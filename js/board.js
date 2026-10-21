// 👥 Progress board (#board): for each person, what is done, current and left in every tab, plus passed mock
// tests, last active day and a feed of what happened ("Ravi passed level 5 of the JLPT path"). Data comes from
// /api/board; the app reports progress there (js/app.js syncProgress). Opened from the 👥 button in the header,
// not a tab (seven tabs is the most that fit).
//
// Nothing per tab is tracked: the two paths split the whole course (js/path-summary.js), so a level number says
// what is done in Study, JLPT, Phrases and Speak too. Only the Book has its own record: pages marked done.
import { PATH_SUMMARY } from './path-summary.js';
import { BOOK_INDEX } from './book-index.js';

const PATH_NAMES = { jlpt: '🪜 JLPT path', talk: '🗣️ Fluent path' };
// What each path stands for on the board: the tabs whose content it covers.
const AREAS = [
  ['jlpt', '🪜 N5·N4 path', 'Study + JLPT tabs'],
  ['talk', '🗣️ Fluent path', 'Phrases + Speak tabs'],
];
// Vercel's free plan can't keep a live connection open, so the board re-reads every minute while it's on screen.
const REFRESH_MS = 60 * 1000;

export function initBoard(ctx) {
  const { esc, render, back } = ctx;
  let timer = null, data = null, error = '';

  // "just now", "5 min ago", "3 h ago", "yesterday", "4 days ago": precise enough for a study group.
  function ago(iso) {
    const s = (Date.now() - Date.parse(iso)) / 1000;
    if (!(s >= 0)) return '';
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    const d = Math.floor(s / 86400);
    return d === 1 ? 'yesterday' : `${d} days ago`;
  }

  function eventText(e, max) {
    const path = PATH_NAMES[e.path] || '';
    switch (e.kind) {
      case 'joined': return 'joined Hanasu 👋';
      case 'level': return e.to === max[e.path] ? `finished the ${path} 🏆`
        : e.to - e.from === 1 ? `passed level ${e.to} of the ${path}` : `passed levels ${e.from + 1}–${e.to} of the ${path}`;
      case 'reset': return `started the ${path} again`;
      case 'mock': return `passed the full ${String(e.lv).toUpperCase()} mock test 🎉`;
      case 'book': { const b = BOOK_INDEX.find(x => x.id === e.page); return b ? `finished Book page: ${pageName(b)} 📕` : ''; }
      default: return '';
    }
  }

  const pageName = b => b.n ? `Unit ${b.n} · ${b.title}` : b.title;
  // "3 grammar points · 1 kanji group", leaving out kinds with nothing in them.
  const counts = (kinds, nums) => nums.map((n, i) => n ? `${n} ${kinds[i][n === 1 ? 0 : 1]}` : '').filter(Boolean).join(' · ');
  const sum = (rows, from, to) => rows[0].slice(1).map((_, i) => rows.slice(from, to).reduce((t, r) => t + r[i + 1], 0));

  // One tab area: done (levels passed), now (the level you are on) and left (everything after it).
  function area(p, [k, name, tabs]) {
    const { kinds, levels } = PATH_SUMMARY[k], n = Math.min(p[k], levels.length);
    const done = counts(kinds, sum(levels, 0, n)), left = counts(kinds, sum(levels, n + 1, levels.length));
    const now = levels[n];
    return `<div class="barea">
      <div class="brow"><span><b>${name}</b> <small class="muted">${tabs}</small></span><b>${n} / ${levels.length}</b></div>${ctx.bar(n, levels.length)}
      <div class="bline">✅ <span>${n ? `${n} level${n === 1 ? '' : 's'}${done ? ` · ${done}` : ''}` : 'Nothing yet'}</span></div>
      <div class="bline">📍 <span>${now ? `Level ${n + 1} · ${esc(now[0])}${counts(kinds, now.slice(1)) ? ` <small class="muted">(${counts(kinds, now.slice(1))})</small>` : ''}` : 'Path complete 🏆'}</span></div>
      ${now ? `<div class="bline">⏳ <span>${levels.length - n - 1 ? `${levels.length - n - 1} more level${levels.length - n - 1 === 1 ? '' : 's'}${left ? ` · ${left}` : ''}` : 'Nothing after this level'}</span></div>` : ''}
    </div>`;
  }

  // The Book: pages marked done, the first page not done yet (book order), and how many are left.
  function bookArea(p) {
    const done = BOOK_INDEX.filter(b => p.book.includes(b.id)), next = BOOK_INDEX.find(b => !p.book.includes(b.id));
    const total = BOOK_INDEX.length;
    return `<div class="barea">
      <div class="brow"><b>📕 Book</b><b>${done.length} / ${total}</b></div>${ctx.bar(done.length, total)}
      <div class="bline">✅ <span>${done.length ? `${done.length} page${done.length === 1 ? '' : 's'}` : 'Nothing yet'}</span></div>
      <div class="bline">📍 <span>${next ? esc(pageName(next)) : 'Book finished 🏆'}</span></div>
      ${next ? `<div class="bline">⏳ <span>${total - done.length} page${total - done.length === 1 ? '' : 's'} left</span></div>` : ''}
    </div>`;
  }

  // Each person's card is a fold: name, levels and mocks always visible; the done / now / left details open on
  // tap (yours starts open), so the board stays short with several people.
  function person(p) {
    const mocks = ['n5', 'n4'].filter(lv => p.mocks[lv]).map(lv => `<span class="pill">✅ ${lv.toUpperCase()} mock</span>`).join(' ');
    const total = BOOK_INDEX.length, bookN = BOOK_INDEX.filter(b => p.book.includes(b.id)).length;
    return `<li class="card left bperson${p.me ? ' me' : ''}"><details${p.me ? ' open' : ''}>
      <summary>
        <div class="brow"><b class="bname">${esc(p.name)}${p.me ? ' <span class="muted">(you)</span>' : ''}</b><small class="muted">${p.active ? `active ${esc(ago(p.active))}` : ''}</small></div>
        <div class="bsum">🪜 ${Math.min(p.jlpt, PATH_SUMMARY.jlpt.levels.length)}/${PATH_SUMMARY.jlpt.levels.length} · 🗣️ ${Math.min(p.talk, PATH_SUMMARY.talk.levels.length)}/${PATH_SUMMARY.talk.levels.length} · 📕 ${bookN}/${total}${mocks ? ` ${mocks}` : ''}</div>
      </summary>
      ${AREAS.map(a => area(p, a)).join('')}${bookArea(p)}
    </details></li>`;
  }

  function page() {
    ctx.clearSess();
    let body;
    if (!data) body = error ? `<p class="warn">${esc(error)}</p>` : '<p class="muted">Loading…</p>';
    else {
      // You first, then whoever studied most recently.
      const people = [...data.people].sort((a, b) => (b.me - a.me) || String(b.active).localeCompare(String(a.active)));
      const feed = data.feed.map(e => {
        const text = eventText(e, data.max);
        return text ? `<li><b>${e.me ? 'You' : esc(e.name)}</b> ${esc(text)} <small class="muted">· ${esc(ago(e.at))}</small></li>` : '';
      }).join('');
      body = `${error ? `<p class="warn">${esc(error)}</p>` : ''}
        <p class="muted small">What everyone has done, is on now and has left in each tab. The paths cover Study, JLPT, Phrases and Speak; Book pages count once marked done. Shared with everyone who has an account; updates every minute.</p>
        <ul class="bpeople">${people.map(person).join('')}</ul>
        <h2 class="sec">What's new</h2>
        ${feed ? `<ul class="bfeed">${feed}</ul>` : '<p class="muted">Nothing yet. Pass a level test in a path and it shows up here.</p>'}`;
    }
    render(`<div class="head">${back()}<h1>👥 Board</h1></div>${body}`);
  }

  async function load() {
    try {
      const res = await fetch('/api/board', { cache: 'no-store' });
      if (res.status === 401) { location.replace('/login.html?next=' + encodeURIComponent('/#board')); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
      error = '';
    } catch {
      // Keep showing the last board we had; just say it may be out of date.
      error = data ? 'Offline: showing the board from earlier.' : "Can't load the board. It needs an internet connection.";
    }
    if (location.hash === '#board') page();
  }

  function open() {
    page();
    load();
    clearInterval(timer);
    // Only while the screen is visible: a phone in a pocket doesn't keep polling.
    timer = setInterval(() => { if (document.visibilityState === 'visible') load(); }, REFRESH_MS);
  }

  function route(h) { if (h === 'board') return open(), true; return false; }
  return {
    actions: {},
    route,
    rerender() { if (location.hash !== '#board') return false; page(); return true; },
    // Leaving the screen stops the refresh.
    clear() { clearInterval(timer); timer = null; },
  };
}
