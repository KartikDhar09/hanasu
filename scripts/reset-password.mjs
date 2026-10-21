// Gives an account a new random password, for when someone forgets theirs (there is no email, so no self-service
// reset). Run on your Mac with the Upstash keys from Vercel → Storage → your database → .env.local tab:
//
//   KV_REST_API_URL=… KV_REST_API_TOKEN=… node scripts/reset-password.mjs "<name>"
//
// Prints the new password once; send it to the person privately. Sessions already logged in on their phone keep
// working (cookies aren't stored server-side); to log everyone out, change SESSION_SECRET in Vercel.
import { randomBytes } from 'node:crypto';
import { store } from '../api/_store.js';
import { nameKey, hashPassword } from '../api/_account.js';

const name = process.argv[2];
if (!name) { console.error('Usage: node scripts/reset-password.mjs "<name>"'); process.exit(1); }

const db = store();
const key = nameKey(name);
const rec = await db.getUser(process.env, key);
if (!rec) { console.error(`No account called "${name}".`); process.exit(1); }

// 12 random bytes → 16 URL-safe characters: easy to copy into a chat, far too many to guess.
const password = randomBytes(12).toString('base64url');
await db.setUser(process.env, key, { ...rec, hash: await hashPassword(password) });
console.log(`New password for ${rec.name}: ${password}`);
