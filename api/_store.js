// All database access lives here, so moving from Upstash to another database (e.g. Supabase once the group grows)
// means rewriting this file only. The rest of the code calls these functions and never builds Redis commands.
//
// Upstash is reached over its REST API with plain fetch (no SDK, nothing to install). Keys:
//   user:<name key>   JSON {name, hash, created}  name = as typed (shown on the board), key = normalised (unique)
//   prog:<name key>   JSON {jlpt, talk, mocks: {n5?, n4?: ISO date}, book: [page id]}  what the board shows
//   members           set of name keys that have synced at least once (the board's rows)
//   feed              list of event JSON, newest first, trimmed to FEED_MAX
//   rate:<bucket>     attempt counter that expires on its own (see hit)

// Upstash connected through the Vercel Marketplace sets the KV_* names; a database made directly on upstash.com
// gives the UPSTASH_* names. Either works.
const config = env => ({
  url: env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL,
  token: env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN,
});

// Runs several Redis commands in one round trip and returns their results in order.
async function redis(env, commands) {
  const { url, token } = config(env);
  if (!url || !token) throw new Error('Upstash is not connected: KV_REST_API_URL / KV_REST_API_TOKEN are missing');
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Upstash answered ${res.status}`);
  const out = await res.json();
  const bad = out.find(r => r.error);
  if (bad) throw new Error(`Upstash: ${bad.error}`);
  return out.map(r => r.result);
}

const upstash = {
  async getUser(env, key) {
    const [raw] = await redis(env, [['GET', `user:${key}`]]);
    return raw ? JSON.parse(raw) : null;
  },
  // SET … NX writes only if the key doesn't exist yet, so two people claiming the same name at the same moment
  // can't both win: exactly one gets true.
  async createUser(env, key, record) {
    const [ok] = await redis(env, [['SET', `user:${key}`, JSON.stringify(record), 'NX']]);
    return ok === 'OK';
  },
  async setUser(env, key, record) {
    await redis(env, [['SET', `user:${key}`, JSON.stringify(record)]]);
  },
  // Counts an attempt in a fixed time window and says whether it is still allowed. The window starts with the
  // first attempt (EXPIRE … NX doesn't extend it), so a blocked user waits at most `seconds`.
  async hit(env, bucket, limit, seconds) {
    const [n] = await redis(env, [['INCR', `rate:${bucket}`], ['EXPIRE', `rate:${bucket}`, seconds, 'NX']]);
    return n <= limit;
  },
  async getProgress(env, key) {
    const [raw] = await redis(env, [['GET', `prog:${key}`]]);
    return raw ? JSON.parse(raw) : null;
  },
  // Progress, board membership and new events are written in one round trip.
  async saveProgress(env, key, prog, events) {
    const cmds = [['SET', `prog:${key}`, JSON.stringify(prog)], ['SADD', 'members', key]];
    if (events.length) cmds.push(['LPUSH', 'feed', ...events.map(e => JSON.stringify(e))], ['LTRIM', 'feed', 0, FEED_MAX - 1]);
    await redis(env, cmds);
  },
  // Everything the board screen needs: each member's name and progress, and the latest events. Two round trips
  // (the member list first, then their records), whatever the group size.
  async board(env, feedSize) {
    const [keys, feed] = await redis(env, [['SMEMBERS', 'members'], ['LRANGE', 'feed', 0, feedSize - 1]]);
    if (!keys.length) return { people: [], feed: [] };
    const [users, progs] = await redis(env, [['MGET', ...keys.map(k => `user:${k}`)], ['MGET', ...keys.map(k => `prog:${k}`)]]);
    return {
      people: keys.map((key, i) => ({ key, user: users[i] && JSON.parse(users[i]), prog: progs[i] && JSON.parse(progs[i]) })).filter(p => p.user && p.prog),
      feed: feed.map(e => JSON.parse(e)),
    };
  },
};

// The feed keeps only the latest events; older ones fall off, so the list can't grow without limit.
export const FEED_MAX = 50;

// In-memory stand-in with the same behaviour, used by the tests (scripts/check.mjs) and local runs without Upstash.
export function memoryStore() {
  const users = new Map(), rates = new Map(), progs = new Map(), members = new Set();
  let feed = [];
  return {
    users, progs,
    async getUser(_, key) { return users.has(key) ? structuredClone(users.get(key)) : null; },
    async createUser(_, key, record) { if (users.has(key)) return false; users.set(key, structuredClone(record)); return true; },
    async setUser(_, key, record) { users.set(key, structuredClone(record)); },
    async hit(_, bucket, limit) { const n = (rates.get(bucket) || 0) + 1; rates.set(bucket, n); return n <= limit; },
    async getProgress(_, key) { return progs.has(key) ? structuredClone(progs.get(key)) : null; },
    async saveProgress(_, key, prog, events) {
      progs.set(key, structuredClone(prog)); members.add(key);
      // LPUSH with several values puts the last one first; mirror that so tests see Redis's order.
      feed = [...structuredClone(events).reverse(), ...feed].slice(0, FEED_MAX);
    },
    async board(_, feedSize) {
      return {
        people: [...members].map(key => ({ key, user: structuredClone(users.get(key)), prog: structuredClone(progs.get(key)) })).filter(p => p.user && p.prog),
        feed: structuredClone(feed.slice(0, feedSize)),
      };
    },
  };
}

let current = upstash;
export const store = () => current;
// Tests swap in memoryStore(); production never calls this.
export const useStore = s => { current = s; };
