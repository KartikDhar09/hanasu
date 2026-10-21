// 👥 Progress board (#board): everyone's path levels, passed mock tests and last active day, plus a feed of what
// happened ("Ravi passed level 5 of the JLPT path"). Data comes from /api/board; the app reports progress there
// (js/app.js sync). Opened from the 👥 button in the header, not a tab (seven tabs is the most that fit).
const PATH_NAMES = { jlpt: '🪜 JLPT path', talk: '🗣️ Fluent path' };
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
      default: return '';
    }
  }

  function person(p, max) {
    const row = k => `<div class="brow"><span>${PATH_NAMES[k]}</span><b>${p[k]} / ${max[k]}</b></div>${ctx.bar(p[k], max[k])}`;
    const mocks = ['n5', 'n4'].filter(lv => p.mocks[lv]).map(lv => `<span class="pill">✅ ${lv.toUpperCase()} mock</span>`).join(' ');
    return `<li class="card left bperson${p.me ? ' me' : ''}">
      <div class="brow"><b class="bname">${esc(p.name)}${p.me ? ' <span class="muted">(you)</span>' : ''}</b><small class="muted">${p.active ? `active ${esc(ago(p.active))}` : ''}</small></div>
      ${row('jlpt')}${row('talk')}${mocks ? `<div>${mocks}</div>` : ''}</li>`;
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
        <p class="muted small">Levels in each path and passed full mock tests, shared with everyone who has an account. Updates every minute.</p>
        <ul class="bpeople">${people.map(p => person(p, data.max)).join('')}</ul>
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
