// All database access lives here, so moving from Upstash to another database (e.g. Supabase once the group grows)
// means rewriting this file only. The rest of the code calls these functions and never builds Redis commands.
//
// Upstash is reached over its REST API with plain fetch (no SDK, nothing to install). Keys:
//   user:<name key>   JSON {name, hash, created}  name = as typed (shown on the board), key = normalised (unique)
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
};

// In-memory stand-in with the same behaviour, used by the tests (scripts/check.mjs) and local runs without Upstash.
export function memoryStore() {
  const users = new Map(), rates = new Map();
  return {
    users,
    async getUser(_, key) { return users.has(key) ? structuredClone(users.get(key)) : null; },
    async createUser(_, key, record) { if (users.has(key)) return false; users.set(key, structuredClone(record)); return true; },
    async setUser(_, key, record) { users.set(key, structuredClone(record)); },
    async hit(_, bucket, limit) { const n = (rates.get(bucket) || 0) + 1; rates.set(bucket, n); return n <= limit; },
  };
}

let current = upstash;
export const store = () => current;
// Tests swap in memoryStore(); production never calls this.
export const useStore = s => { current = s; };
