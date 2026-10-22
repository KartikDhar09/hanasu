// /api/board: the shared progress board. Only logged-in users can read or write it (session cookie, see
// _session.js). Callers: js/app.js reports progress (sync), js/board.js shows the board.
//
//   GET                                   → {me, people: [{name, me, jlpt, talk, mocks, book}], feed, max}
//   POST {path: {jlpt, talk}, reset?, mock?, book?: {page, done}}
//        → merges this device's levels into the account and marks a Book page done or not done; returns the
//          account's levels and done pages, so every device of the same person ends up in the same place
//
// Progress is reported by the app and trusted (a trial between friends, the user's choice); the server only keeps
// it sane: whole numbers within each path, levels never go down except by an explicit "start again".
import { store } from './_store.js';
import { userOf } from './_session.js';

// Number of levels in each path (js/path-jlpt.js and js/path-talk.js; check.mjs keeps these in step).
export const MAX = { jlpt: 13, talk: 11 };
const MOCKS = ['n5', 'n4'];
// Book page ids look like "u3" or "wb-verbs" (js/book-index.js). Checked by shape, not against the list, so the
// server doesn't depend on the app's files; the board ignores ids it doesn't know. Capped so the record stays small.
const PAGE_ID = /^[a-z0-9-]{1,24}$/, BOOK_MAX = 60;
const FEED_SHOWN = 30;
// A normal day of studying syncs a few dozen times at most; this only stops a runaway loop or a script.
const SYNC_LIMIT = 120, WINDOW = 15 * 60;

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

// Anything that isn't a whole number in range becomes 0 for a new account, or leaves the saved level unchanged.
const levelOf = (v, p) => Number.isInteger(v) && v >= 0 && v <= MAX[p] ? v : 0;

// Works out the new progress and the feed events it causes. Pure, so the rules are easy to test.
//   prev: saved progress or null (first sync = "joined")   body: what the app sent   now: Date
export function merge(prev, body, now) {
  const at = now.toISOString();
  // No "last seen": the user removed it from the board (v5.12), so it isn't stored either. Records saved before
  // that still carry `active`; dropping it here clears it on that person's next sync.
  const { active: _lastSeen, ...kept } = prev || {};
  const next = { jlpt: 0, talk: 0, mocks: {}, book: [], ...kept };
  next.mocks = { ...next.mocks };
  next.book = [...next.book];
  const events = [];
  if (!prev) events.push({ kind: 'joined', at });
  for (const p of Object.keys(MAX)) {
    const was = next[p];
    if (body.reset === p) {
      next[p] = 0;
      if (was > 0) events.push({ kind: 'reset', path: p, at });
      continue;
    }
    // Max of saved and sent: a phone that was offline (or a second device) can't pull the level back down.
    const sent = levelOf(body.path?.[p], p);
    if (sent > was) { next[p] = sent; events.push({ kind: 'level', path: p, from: was, to: sent, at }); }
  }
  if (MOCKS.includes(body.mock) && !next.mocks[body.mock]) {
    next.mocks[body.mock] = at;
    events.push({ kind: 'mock', lv: body.mock, at });
  }
  // A Book page marked done (an event) or not done any more (quietly removed: un-ticking isn't news).
  const page = body.book?.page;
  if (typeof page === 'string' && PAGE_ID.test(page)) {
    const has = next.book.includes(page);
    if (body.book.done === true && !has && next.book.length < BOOK_MAX) { next.book.push(page); events.push({ kind: 'book', page, at }); }
    if (body.book.done === false && has) next.book = next.book.filter(x => x !== page);
  }
  return { next, events };
}

export async function handle(req, env) {
  const key = await userOf(req, env);
  if (!key) return json(401, { error: 'Not logged in.' });
  const db = store();

  if (req.method === 'GET') {
    const { people, feed } = await db.board(env, FEED_SHOWN);
    const names = Object.fromEntries(people.map(p => [p.key, p.user.name]));
    const books = Object.fromEntries(people.map(p => [p.key, p.prog.book || []]));
    // A Book page ticked by mistake and un-ticked again shouldn't stay in the feed as "finished".
    const stillTrue = e => e.kind !== 'book' || books[e.who]?.includes(e.page);
    return json(200, {
      max: MAX,
      // Only what the board shows: never the password hash or the name key.
      people: people.map(({ key: k, user, prog }) => ({
        name: user.name, me: k === key, jlpt: prog.jlpt, talk: prog.talk, mocks: prog.mocks || {}, book: prog.book || [],
      })),
      // Events name their person by key; send the display name instead (an event of a deleted account is dropped).
      // The time stays on the server: the newest event's time would show when someone was last on (removed in v5.12).
      feed: feed.filter(e => names[e.who] && stillTrue(e)).map(({ who, at, ...e }) => ({ ...e, name: names[who], me: who === key })),
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
  return json(200, { path: { jlpt: next.jlpt, talk: next.talk }, book: next.book });
}

// Same pattern as api/auth.js: Web-standard handlers per method; errors become a plain 500, details in the log.
const serve = async req => {
  try { return await handle(req, process.env); }
  catch (e) { console.error(e); return json(500, { error: 'Something went wrong on the server. Try again in a minute.' }); }
};
export const GET = serve;
export const POST = serve;
