// Login wall: Vercel runs this before every request (Routing Middleware, Edge runtime). Without a valid session
// cookie, nothing of the app is served: page loads go to the login page, and files (scripts, book pages, audio,
// pictures) get 401. So the book and everything else are visible only to people who have an account.
import { userOf } from './api/_session.js';

// What a logged-out visitor may load: the login page and what it needs, the icons and manifest (shown by the
// browser before login), robots.txt, and sw.js (it only lists file names; serving it lets an installed app
// update). /api/ checks the session itself, per endpoint.
export const PUBLIC = /^\/(login\.html|js\/login\.js|css\/app\.css|robots\.txt|manifest\.webmanifest|icon(\.svg|-\d+\.png)|sw\.js|api\/.*)$/;

// Tells Vercel to carry on and serve the requested file (what next() from @vercel/functions returns; written
// out here so the project needs no npm packages).
const pass = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

export default async function middleware(request) {
  const url = new URL(request.url);
  if (PUBLIC.test(url.pathname)) return pass();
  if (await userOf(request, process.env)) return pass();

  // A page load (typing the address, opening the home-screen app) goes to the login page, which comes back here
  // afterwards. Anything else gets a bare 401, so a script or clip can't be mistaken for a page and cached as one.
  const page = request.headers.get('sec-fetch-mode') === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
  if (page) {
    const next = url.pathname + url.search;
    return new Response(null, { status: 302, headers: { Location: `/login.html${next === '/' ? '' : `?next=${encodeURIComponent(next)}`}`, 'Cache-Control': 'no-store' } });
  }
  return new Response('Log in first.', { status: 401, headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } });
}
