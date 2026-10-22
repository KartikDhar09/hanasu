// 👥 Progress board (#board): for each person, how far they are in the two paths and the Book (a bar each and
// what's next), passed mock tests, and a feed of what happened ("Ravi passed level 5 of the JLPT path"). Data comes from
// /api/board; the app reports progress there (js/app.js syncProgress). Opened from the 👥 button in the header,
// not a tab (seven tabs is the most that fit).
//
// Nothing per tab is tracked: the two paths split the whole course (js/path-summary.js), so a level number says
// what is done in Study, JLPT, Phrases and Speak too. Only the Book has its own record: pages marked done.
import { PATH_SUMMARY } from './path-summary.js';
import { BOOK_INDEX } from './book-index.js';
import { icon } from './icons.js';

const PATH_NAMES = { jlpt: 'JLPT path', talk: 'Fluent path' };
// Vercel's free plan can't keep a live connection open, so the board re-reads every minute while it's on screen.
const REFRESH_MS = 60 * 1000;

export function initBoard(ctx) {
  const { esc, render, back } = ctx;
  let timer = null, data = null, error = '';
  // Which cards were opened or closed by hand, by display name. In memory only (gone on reload): the app stores
  // nothing about what people do, and the board redraws every minute, which would otherwise snap cards shut.
  const opened = new Map();
  // 'toggle' doesn't bubble, so listen in the capture phase; one listener for the module's lifetime.
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (d instanceof HTMLDetailsElement && d.dataset.name !== undefined) opened.set(d.dataset.name, d.open);
  }, true);

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

  // One row per area: name and "n / total", a bar, and one line saying what comes next. The bar shows done and
  // left at a glance, so the old done / now / left lists with counts per kind ("3 grammar points · 1 kanji group")
  // are gone: the user found them hard to read (v5.12).
  function row(iconName, name, n, total, next) {
    return `<div class="barea">
      <div class="brow"><span>${icon(iconName)} <b>${name}</b></span><b>${n} / ${total}</b></div>${ctx.bar(n, total)}
      <div class="bnow muted">${next}</div>
    </div>`;
  }

  // A path: the level number is all that's tracked; "Now" names the level being worked on.
  function pathRow(p, k) {
    const { levels } = PATH_SUMMARY[k], n = Math.min(p[k], levels.length), now = levels[n];
    return row('path-' + k, PATH_NAMES[k], n, levels.length, now ? `Now: Level ${n + 1} · ${esc(now[0])}` : 'Finished 🏆');
  }

  // The Book: pages marked done; "Next" is the first page not done yet, in book order.
  function bookRow(p) {
    const done = BOOK_INDEX.filter(b => p.book.includes(b.id)).length, next = BOOK_INDEX.find(b => !p.book.includes(b.id));
    return row('book', 'Book', done, BOOK_INDEX.length, next ? `Next: ${esc(pageName(next))}` : 'Finished 🏆');
  }

  // Each card folds (v5.14, the user asked for it back): closed it is one line of numbers, so a bigger group still
  // fits on a screen; open it shows the three rows with bars. Your own card starts open, everyone else's closed.
  function person(p) {
    const mocks = ['n5', 'n4'].filter(lv => p.mocks[lv]).map(lv => `<span class="pill g2">✅ ${lv.toUpperCase()}</span>`).join(' ');
    const n = k => Math.min(p[k], PATH_SUMMARY[k].levels.length);
    const book = BOOK_INDEX.filter(b => p.book.includes(b.id)).length;
    // A card someone opened or closed stays that way through the minute refresh; otherwise only yours is open.
    const isOpen = opened.has(p.name) ? opened.get(p.name) : p.me;
    return `<li class="card left bperson${p.me ? ' me' : ''}"><details data-name="${esc(p.name)}"${isOpen ? ' open' : ''}>
      <summary>
        <div class="brow"><b class="bname">${esc(p.name)}${p.me ? ' <span class="muted">(you)</span>' : ''}</b>${icon('chevron')}</div>
        <div class="bsum">${icon('path-jlpt')} ${n('jlpt')}/${PATH_SUMMARY.jlpt.levels.length} · ${icon('path-talk')} ${n('talk')}/${PATH_SUMMARY.talk.levels.length} · ${icon('book')} ${book}/${BOOK_INDEX.length}${mocks ? ` ${mocks}` : ''}</div>
      </summary>
      ${pathRow(p, 'jlpt')}${pathRow(p, 'talk')}${bookRow(p)}
    </details></li>`;
  }

  function page() {
    ctx.clearSess();
    let body;
    if (!data) body = error ? `<p class="warn">${esc(error)}</p>` : '<p class="muted">Loading…</p>';
    else {
      // You first, then whoever is furthest along. Not by recent activity: last seen was removed (v5.12).
      const score = p => p.jlpt + p.talk + p.book.length;
      const people = [...data.people].sort((a, b) => (b.me - a.me) || score(b) - score(a) || a.name.localeCompare(b.name));
      // Newest first, with no times: a time on someone's latest event would tell everyone when they were last on.
      const feed = data.feed.map(e => {
        const text = eventText(e, data.max);
        return text ? `<li><b>${e.me ? 'You' : esc(e.name)}</b> ${esc(text)}</li>` : '';
      }).join('');
      body = `${error ? `<p class="warn">${esc(error)}</p>` : ''}
        <p class="muted small">How far everyone has got. Shared with everyone who has an account.</p>
        <ul class="bpeople">${people.map(person).join('')}</ul>
        <h2 class="sec">Latest</h2>
        ${feed ? `<ul class="bfeed">${feed}</ul>` : '<p class="muted">Nothing yet. Pass a level test in a path and it shows up here.</p>'}`;
    }
    render(`<div class="head">${back()}<h1>${icon('board')} Board</h1></div>${body}`);
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
