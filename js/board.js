// 👥 Progress board (#board): for each person, how far they are in the two paths and Lessons (a bar each and
// what's next), passed mock tests, and a feed of what happened ("Ravi completed level 5 of the JLPT path"). Data comes from
// /api/board; the app reports progress there (js/app.js syncProgress). Opened from the 👥 button in the header,
// not a tab (seven tabs is the most that fit).
//
// Nothing per tab is tracked: the two paths split the whole course (js/path-summary.js), so the completed levels say
// what is done in Study, JLPT, Phrases and Speak too. Only Lessons has its own record: pages marked done.
// Since v6.0 levels are marked complete by hand, in any order (no level tests), so a path is a set of levels.
import { PATH_SUMMARY } from './path-summary.js';
import { LESSONS_INDEX } from './lessons-index.js';
import { icon } from './icons.js';

const PATH_NAMES = { jlpt: 'JLPT path', talk: 'Fluent path' };
// Vercel's free plan can't keep a live connection open, so the board re-reads every minute while it's on screen.
const REFRESH_MS = 60 * 1000;

export function initBoard(ctx) {
  const { esc, render, back } = ctx;
  let timer = null, data = null, error = '';
  // Cards opened by tapping, by display name. Kept so the minute refresh redraws them still open; emptied in clear()
  // when you leave the board, so every visit starts with all cards closed (the user's choice, v5.15). Memory only:
  // the app stores nothing about what people do.
  const opened = new Set();

  function eventText(e, max) {
    const path = PATH_NAMES[e.path] || '';
    switch (e.kind) {
      case 'joined': return 'joined Hanasu';
      case 'done': return `completed level ${e.i + 1} of the ${path}`;
      // Saved before v6.0, when a passed level test moved you up: still shown until they fall off the feed.
      case 'level': return e.to === max[e.path] ? `finished the ${path}`
        : e.to - e.from === 1 ? `passed level ${e.to} of the ${path}` : `passed levels ${e.from + 1}–${e.to} of the ${path}`;
      case 'reset': return `started the ${path} again`;
      case 'mock': return `passed the full ${String(e.lv).toUpperCase()} mock test`;
      case 'lessons': { const b = LESSONS_INDEX.find(x => x.id === e.page); return b ? `finished Lessons page: ${pageName(b)}` : ''; }
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

  // A path: how many levels are ticked; "Now" names the first level not ticked yet.
  const doneOf = (p, k) => new Set((p.done?.[k] || []).filter(i => i < PATH_SUMMARY[k].levels.length));
  function pathRow(p, k) {
    const { levels } = PATH_SUMMARY[k], d = doneOf(p, k), i = levels.findIndex((_, n) => !d.has(n));
    return row('path-' + k, PATH_NAMES[k], d.size, levels.length, i >= 0 ? `Now: Level ${i + 1} · ${esc(levels[i][0])}` : 'Finished');
  }

  // Lessons: pages marked done; "Next" is the first page not done yet, in contents order.
  function lessonsRow(p) {
    const done = LESSONS_INDEX.filter(b => p.lessons.includes(b.id)).length, next = LESSONS_INDEX.find(b => !p.lessons.includes(b.id));
    return row('lessons', 'Lessons', done, LESSONS_INDEX.length, next ? `Next: ${esc(pageName(next))}` : 'Finished');
  }

  // Each card folds: closed it is one line of numbers, so a bigger group still fits on a screen; open it shows the
  // three rows with bars instead. Every card starts closed, yours too (v5.15).
  function person(p) {
    const mocks = ['n5', 'n4'].filter(lv => p.mocks[lv]).map(lv => `<span class="pill g2">${icon('done')} ${lv.toUpperCase()}</span>`).join(' ');
    const n = k => doneOf(p, k).size;
    const pages = LESSONS_INDEX.filter(b => p.lessons.includes(b.id)).length;
    const isOpen = opened.has(p.name);
    // The whole card is the tap target (not a <details>, whose summary line is the only clickable part). data-act
    // makes app.js give it tabindex + role=button, so Tab and Enter/Space work too; aria-expanded tells a screen
    // reader whether the rows are showing. It sits inside the <li> so the list keeps its list role.
    return `<li><div class="card left bperson${p.me ? ' me' : ''}${isOpen ? ' open' : ''}" data-act="board-card" data-arg="${esc(p.name)}" aria-expanded="${isOpen}">
      <div class="brow"><b class="bname">${esc(p.name)}${p.me ? ' <span class="muted">(you)</span>' : ''}</b></div>
      <div class="bsum">${icon('path-jlpt')} ${n('jlpt')}/${PATH_SUMMARY.jlpt.levels.length} · ${icon('path-talk')} ${n('talk')}/${PATH_SUMMARY.talk.levels.length} · ${icon('lessons')} ${pages}/${LESSONS_INDEX.length}${mocks ? ` ${mocks}` : ''}</div>
      <div class="bmore">${pathRow(p, 'jlpt')}${pathRow(p, 'talk')}${lessonsRow(p)}</div>
    </div></li>`;
  }

  function page() {
    ctx.clearSess();
    let body;
    if (!data) body = error ? `<p class="warn">${esc(error)}</p>` : '<p class="muted">Loading…</p>';
    else {
      // You first, then whoever is furthest along. Not by recent activity: last seen was removed (v5.12).
      const score = p => doneOf(p, 'jlpt').size + doneOf(p, 'talk').size + p.lessons.length;
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
        ${feed ? `<ul class="bfeed">${feed}</ul>` : '<p class="muted">Nothing yet. Mark a level complete in a path and it shows up here.</p>'}`;
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
    actions: {
      // Toggled in place rather than redrawn, so keyboard focus stays on the card that was pressed.
      'board-card'(name) {
        const card = [...document.querySelectorAll('.bperson')].find(c => c.dataset.arg === name);
        if (!card) return;
        const on = !opened.has(name);
        if (on) opened.add(name); else opened.delete(name);
        card.classList.toggle('open', on);
        card.setAttribute('aria-expanded', String(on));
      },
    },
    route,
    rerender() { if (location.hash !== '#board') return false; page(); return true; },
    // Leaving the screen stops the refresh and closes every card again for the next visit.
    clear() { clearInterval(timer); timer = null; opened.clear(); },
  };
}
