// Signed session cookie shared by middleware.js (Edge) and the /api functions (Node). Uses only Web Crypto, which
// both runtimes have, so the same code checks the cookie everywhere.
//
// Cookie value: <base64url JSON {u: name key, exp: unix seconds}>.<base64url HMAC-SHA256 of that part>.
// Nothing secret is inside; the signature only proves the server issued it. There is no server-side session list,
// so a session can't be revoked one by one: changing SESSION_SECRET in Vercel logs everyone out.

export const COOKIE = 'hanasu_session';
export const DAYS = 90; // long, so a phone that opens the app every few days never sees the login page again

const enc = new TextEncoder();
const b64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

// Constant-time compare, so a forged signature can't be guessed byte by byte from response timings.
function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// A short secret would make signatures guessable; refuse to run rather than sign with it.
function secretOf(env) {
  const s = env.SESSION_SECRET || '';
  if (s.length < 32) throw new Error('SESSION_SECRET must be set to at least 32 characters');
  return s;
}

export async function sign(user, env, now = Date.now()) {
  const body = b64url(enc.encode(JSON.stringify({ u: user, exp: Math.floor(now / 1000) + DAYS * 86400 })));
  return `${body}.${b64url(await hmac(secretOf(env), body))}`;
}

// Returns the user's name key, or null for a missing, tampered or expired cookie.
export async function verify(token, env, now = Date.now()) {
  const [body, sig, extra] = String(token || '').split('.');
  if (!body || !sig || extra !== undefined) return null;
  try {
    if (!same(unb64url(sig), await hmac(secretOf(env), body))) return null;
    const { u, exp } = JSON.parse(new TextDecoder().decode(unb64url(body)));
    return typeof u === 'string' && exp > now / 1000 ? u : null;
  } catch { return null; }
}

export function readCookie(request) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

// HttpOnly: page scripts (and anything injected into them) can't read the session.
// SameSite=Lax: other sites can't make logged-in requests on the user's behalf.
export const setCookie = token => `${COOKIE}=${token}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
export const clearCookie = () => `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

export const userOf = (request, env) => verify(readCookie(request), env);
