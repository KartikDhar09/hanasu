// Name and password rules, shared by api/auth.js and scripts/reset-password.mjs (Node only: uses node:crypto).
import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto';

// The name people see on the board: trimmed, inner runs of spaces collapsed, otherwise as typed.
export const displayName = raw => String(raw ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ');

// The name's identity, used as the database key. NFKC folds full-width letters (Ｋａｒｔｉｋ → Kartik) and case is
// ignored, so "Kartik", " kartik " and "ＫＡＲＴＩＫ" are all the same name and only the first one can be claimed.
export const nameKey = raw => displayName(raw).toLowerCase();

// 2–20 characters, starting with a letter or digit; letters in any script, digits, space, dot, dash, underscore.
// Anything else (emoji, symbols, invisible characters) is refused so names stay readable and unambiguous.
export const NAME_RULE = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,19}$/u;
export const nameProblem = raw => NAME_RULE.test(displayName(raw)) ? null
  : 'Use 2–20 letters or numbers (spaces, dots, dashes and underscores are fine too).';

export const PASSWORD_MIN = 8;
export const passwordProblem = pw => typeof pw === 'string' && pw.length >= PASSWORD_MIN && pw.length <= 200 ? null
  : `Use at least ${PASSWORD_MIN} characters.`;

// scrypt is deliberately slow and memory-hungry, so a leaked database can't be brute-forced cheaply. Parameters are
// stored with each hash so they can be raised later without breaking existing accounts.
const N = 16384, R = 8, P = 1, LEN = 64;
const derive = (pw, salt, n, r, p) => new Promise((ok, no) =>
  scrypt(pw.normalize('NFKC'), salt, LEN, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (e, key) => e ? no(e) : ok(key)));

// Stored form: scrypt$N$r$p$<salt hex>$<hash hex>. The random salt makes equal passwords hash differently.
export async function hashPassword(pw) {
  const salt = randomBytes(16);
  return ['scrypt', N, R, P, salt.toString('hex'), (await derive(pw, salt, N, R, P)).toString('hex')].join('$');
}

export async function checkPassword(pw, stored) {
  const [kind, n, r, p, salt, hash] = String(stored).split('$');
  if (kind !== 'scrypt' || !hash || typeof pw !== 'string') return false;
  const got = await derive(pw, Buffer.from(salt, 'hex'), +n, +r, +p);
  return timingSafeEqual(got, Buffer.from(hash, 'hex'));
}

// Sign-up is open to anyone with the link by default (the user's choice, 2026-10-21: "whoever the link is shared
// to should create an account"). Setting INVITE_CODE in Vercel closes it: from then on sign-up needs that code,
// and the login page shows the code field on its own (it reads `invite` from GET /api/auth).
export const inviteNeeded = env => !!env.INVITE_CODE;

// Invite code check in constant time. Both sides are hashed first so they have equal length for timingSafeEqual
// (which would otherwise reveal the code's length).
export function inviteOk(given, env) {
  const want = env.INVITE_CODE || '';
  if (!want) return true; // no code set = open sign-up
  const h = s => createHash('sha256').update(String(s ?? '').trim()).digest();
  return timingSafeEqual(h(given), h(want));
}
