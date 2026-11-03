// /api/board: the shared progress board. Only logged-in users can read or write it (session cookie, see
// _session.js). Callers: js/app.js reports progress (sync), js/board.js shows the board.
//
//   GET                                   → {me, people: [{name, me, done: {jlpt, talk}, jlpt, talk, mocks, lessons}], feed, max}
//   POST {path?: {jlpt, talk}, level?: {path, i, done}, reset?, mock?, lessons?: {page, done}}
//        → marks one path level (or a lesson page) complete or not, and returns the account's completed levels and
//          pages, so every device of the same person ends up in the same place
//
// Since v6.0 there are no level tests: a level is complete because the person marked it (the user's choice,
// 2026-10-25), in any order, and can be un-marked. So the account keeps a list of completed level indexes per path
// instead of "the highest level reached", and the account is the source of truth: a device never pushes its own list,
// it only sends single changes (like lesson pages), so an old offline copy can't undo a change made on another device.
// Progress is reported by the app and trusted (a trial between friends, the user's choice); the server only keeps
// it sane: whole-number indexes inside each path.
import { store } from './_store.js';
import { userOf } from './_session.js';

// Number of levels in each path (js/path-jlpt.js and js/path-talk.js; check.mjs keeps these in step).
export const MAX = { jlpt: 13, talk: 11 };
const MOCKS = ['n5', 'n4'];
// Lesson page ids look like "u3" or "wb-verbs" (js/lessons-index.js). Checked by shape, not against the list, so the
// server doesn't depend on the app's files; the board ignores ids it doesn't know. Capped so the record stays small.
const PAGE_ID = /^[a-z0-9-]{1,24}$/, PAGES_MAX = 60;
const FEED_SHOWN = 30;
// Before v6.2 lesson pages were saved, sent and logged under this name. Records, feed events and copies of the app
// from then are read as `lessons`, and replies repeat the list under the old name so a v6.1 copy still shows its
// ticks until it updates. A record is rewritten under the new name on its next save. Remove once every
// account has synced on v6.2 and the old events have fallen off the 50-event feed.
const OLD = 'book';
// A normal day of studying syncs a few dozen times at most; this only stops a runaway loop or a script.
const SYNC_LIMIT = 120, WINDOW = 15 * 60;

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

const isLevel = (v, p) => Number.isInteger(v) && v >= 0 && v < MAX[p];
// Sorted, unique, in range. An old-style number n (levels 1..n reached, before v6.0) becomes [0 .. n-1].
export function levelsOf(v, p) {
  if (Number.isInteger(v)) return Array.from({ length: Math.max(0, Math.min(v, MAX[p])) }, (_, i) => i);
  return Array.isArray(v) ? [...new Set(v.filter(x => isLevel(x, p)))].sort((a, b) => a - b) : [];
}

// Works out the new progress and the feed events it causes. Pure, so the rules are easy to test.
//   prev: saved progress or null (first sync = "joined")   body: what the app sent   now: Date
export function merge(prev, body, now) {
  const at = now.toISOString();
  // No "last seen": the user removed it from the board (v5.12), so it isn't stored either. Records saved before
  // that still carry `active`; dropping it here clears it on that person's next sync.
  // The jlpt / talk level numbers saved before v6.0 are turned into lists once and then dropped.
  const { active: _lastSeen, jlpt: oldJlpt, talk: oldTalk, [OLD]: oldPages, ...kept } = prev || {};
  const next = { mocks: {}, lessons: oldPages || [], ...kept };
  next.mocks = { ...next.mocks };
  next.lessons = [...next.lessons];
  // A new account starts from what this device already had (levels reached before logging in existed).
  const start = prev ? { jlpt: oldJlpt, talk: oldTalk } : body.path || {};
  next.done = Object.fromEntries(Object.keys(MAX).map(p => [p, levelsOf(prev?.done ? prev.done[p] : start[p], p)]));
  const events = [];
  if (!prev) events.push({ kind: 'joined', at });
  for (const p of Object.keys(MAX)) {
    if (body.reset === p) {
      if (next.done[p].length) events.push({ kind: 'reset', path: p, at });
      next.done[p] = [];
    }
  }
  // One level marked complete (an event) or not complete any more (quietly removed, as with lesson pages).
  const lv = body.level;
  if (lv && MAX[lv.path] && isLevel(lv.i, lv.path)) {
    const list = next.done[lv.path], has = list.includes(lv.i);
    if (lv.done === true && !has) { next.done[lv.path] = levelsOf([...list, lv.i], lv.path); events.push({ kind: 'done', path: lv.path, i: lv.i, at }); }
    if (lv.done === false && has) next.done[lv.path] = list.filter(x => x !== lv.i);
  }
  if (MOCKS.includes(body.mock) && !next.mocks[body.mock]) {
    next.mocks[body.mock] = at;
    events.push({ kind: 'mock', lv: body.mock, at });
  }
  // A lesson page marked done (an event) or not done any more (quietly removed: un-ticking isn't news).
  const change = body.lessons || body[OLD], page = change?.page;
  if (typeof page === 'string' && PAGE_ID.test(page)) {
    const has = next.lessons.includes(page);
    if (change.done === true && !has && next.lessons.length < PAGES_MAX) { next.lessons.push(page); events.push({ kind: 'lessons', page, at }); }
    if (change.done === false && has) next.lessons = next.lessons.filter(x => x !== page);
  }
  return { next, events };
}

// A saved record's completed levels, whether it was saved before v6.0 (level numbers) or after (lists).
const doneOf = prog => Object.fromEntries(Object.keys(MAX).map(p => [p, levelsOf(prog.done ? prog.done[p] : prog[p], p)]));

export async function handle(req, env) {
  const key = await userOf(req, env);
  if (!key) return json(401, { error: 'Not logged in.' });
  const db = store();

  if (req.method === 'GET') {
    const { people, feed } = await db.board(env, FEED_SHOWN);
    const names = Object.fromEntries(people.map(p => [p.key, p.user.name]));
    const pagesOf = prog => prog.lessons || prog[OLD] || [];
    const pages = Object.fromEntries(people.map(p => [p.key, pagesOf(p.prog)]));
    const done = Object.fromEntries(people.map(p => [p.key, doneOf(p.prog)]));
    // A lesson page or level ticked by mistake and un-ticked again shouldn't stay in the feed as "finished".
    const kindOf = e => e.kind === OLD ? 'lessons' : e.kind;
    const stillTrue = e => kindOf(e) === 'lessons' ? pages[e.who]?.includes(e.page)
      : e.kind === 'done' ? done[e.who]?.[e.path]?.includes(e.i) : true;
    return json(200, {
      max: MAX,
      // Only what the board shows: never the password hash or the name key.
      // jlpt / talk (counts) are still sent for copies of the app older than v6.0 until they update.
      people: people.map(({ key: k, user, prog }) => ({
        name: user.name, me: k === key, done: done[k], jlpt: done[k].jlpt.length, talk: done[k].talk.length,
        mocks: prog.mocks || {}, lessons: pages[k], [OLD]: pages[k],
      })),
      // Events name their person by key; send the display name instead (an event of a deleted account is dropped).
      // The time stays on the server: the newest event's time would show when someone was last on (removed in v5.12).
      feed: feed.filter(e => names[e.who] && stillTrue(e)).map(({ who, at, ...e }) => ({ ...e, kind: kindOf(e), name: names[who], me: who === key })),
    });
  }
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(req.url).host) return json(403, { error: 'Wrong origin.' });
  if (!await db.hit(env, `sync:${key}`, SYNC_LIMIT, WINDOW)) return json(429, { error: 'Too many updates. Try again later.' });

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'Bad request.' }); }
  const { next, events } = merge(await db.getProgress(env, key), body || {}, new Date());
  await db.saveProgress(env, key, next, events.map(e => ({ who: key, ...e })));
  return json(200, { done: next.done, lessons: next.lessons, [OLD]: next.lessons });
}

// Same pattern as api/auth.js: Web-standard handlers per method; errors become a plain 500, details in the log.
const serve = async req => {
  try { return await handle(req, process.env); }
  catch (e) { console.error(e); return json(500, { error: 'Something went wrong on the server. Try again in a minute.' }); }
};
export const GET = serve;
export const POST = serve;
