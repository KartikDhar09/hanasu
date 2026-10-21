// /api/auth: sign up, log in, log out, and "who am I". The login page (login.html + js/login.js) and the app's
// launch check (js/app.js) are the only callers.
//
//   GET                                         → 200 {name} when the session cookie is valid, else 401
//   POST {action:'signup', name, password, invite} → creates the account and logs in; 409 if the name is taken;
//                                                    invite is checked only when INVITE_CODE is set in Vercel
//   POST {action:'login',  name, password}         → logs in; one vague error for any wrong name or password
//   POST {action:'logout'}                         → clears the cookie
import { store } from './_store.js';
import { sign, userOf, setCookie, clearCookie } from './_session.js';
import { displayName, nameKey, nameProblem, passwordProblem, hashPassword, checkPassword, inviteOk, inviteNeeded } from './_account.js';

// Brute-force guards, counted in Upstash so they hold across serverless instances. Generous for two real people
// typing (a typo or five), far too low for a password-guessing script.
const PER_IP = 20, PER_NAME = 10, WINDOW = 15 * 60;

// Hash of a random password, checked when the name doesn't exist so a wrong name takes as long as a wrong password
// and response times don't reveal which names are registered.
const DUMMY = 'scrypt$16384$8$1$00000000000000000000000000000000$' + '0'.repeat(128);

const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
});

// Vercel puts the caller's address first in x-forwarded-for and doesn't let the caller forge it.
const ipOf = req => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

// Testable core: scripts/check.mjs calls it with a memory store and a fake env.
export async function handle(req, env) {
  const db = store();
  if (req.method === 'GET') {
    // A logged-out answer also tells the login page whether sign-up needs an invite code (only a yes/no, never
    // the code), so the code field appears only when INVITE_CODE is set.
    const out = { error: 'Not logged in.', invite: inviteNeeded(env) };
    const user = await userOf(req, env);
    if (!user) return json(401, out);
    const rec = await db.getUser(env, user);
    // A valid cookie for a deleted account is treated as logged out.
    return rec ? json(200, { name: rec.name }) : json(401, out, { 'Set-Cookie': clearCookie() });
  }
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });

  // Only our own pages may post here. Browsers always send Origin on POST; a mismatch means another site's form
  // or script is trying to act for the user.
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(req.url).host) return json(403, { error: 'Wrong origin.' });

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'Bad request.' }); }
  const { action, name, password, invite } = body || {};

  if (action === 'logout') return json(200, { ok: true }, { 'Set-Cookie': clearCookie() });
  if (action !== 'signup' && action !== 'login') return json(400, { error: 'Unknown action.' });

  if (!await db.hit(env, `ip:${ipOf(req)}`, PER_IP, WINDOW)) return json(429, { error: 'Too many tries. Wait 15 minutes and try again.' });
  const key = nameKey(name);

  if (action === 'signup') {
    if (!inviteOk(invite, env)) return json(403, { error: 'That invite code is wrong.' });
    const bad = nameProblem(name) || passwordProblem(password);
    if (bad) return json(400, { error: bad });
    const created = await db.createUser(env, key, { name: displayName(name), hash: await hashPassword(password), created: new Date().toISOString() });
    if (!created) return json(409, { error: 'That name is already taken. Pick another one.' });
    return json(200, { name: displayName(name) }, { 'Set-Cookie': setCookie(await sign(key, env)) });
  }

  // login
  if (!key || typeof password !== 'string') return json(400, { error: 'Enter your name and password.' });
  if (!await db.hit(env, `name:${key}`, PER_NAME, WINDOW)) return json(429, { error: 'Too many tries for this name. Wait 15 minutes.' });
  const rec = await db.getUser(env, key);
  const ok = await checkPassword(password, rec ? rec.hash : DUMMY);
  if (!rec || !ok) return json(401, { error: 'Name or password is wrong.' });
  return json(200, { name: rec.name }, { 'Set-Cookie': setCookie(await sign(key, env)) });
}

// Vercel Functions (Node) call these Web-standard handlers by HTTP method.
// Errors (e.g. Upstash not connected yet) become a plain 500 without internals; details go to the Vercel log.
const serve = async req => {
  try { return await handle(req, process.env); }
  catch (e) { console.error(e); return json(500, { error: 'Something went wrong on the server. Try again in a minute.' }); }
};
export const GET = serve;
export const POST = serve;
