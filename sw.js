// Offline-first: app files are served from the cache instantly and refreshed in the background
// (stale-while-revalidate). A release ships a new CACHE name, which installs alongside and waits: the app asks
// "New version · Restart" (js/app.js), and Restart tells it to take over; otherwise it takes over once the app
// is fully closed. Everything is same-origin, including the font. Bump CACHE on each release.
const CACHE = 'hanasu-v6.1';
// Voice clips live in their own cache that app releases don't clear: cache-first, since a clip never changes
// unless the voices are re-recorded (then bump AUDIO). Capped so it can't grow without limit.
const AUDIO = 'hanasu-audio-v3';
const AUDIO_MAX = 2000;
// Book tab pictures: fetched only when a page shows them, then kept (cache-first) across app releases.
const IMAGES = 'hanasu-img-v1';
const SHELL = ['/', '/index.html', '/css/app.css', '/js/app.js', '/js/units-index.js', '/js/module-deps.js', '/js/core.js', '/js/data.js', '/js/corp-more.js', '/js/speech.js', '/js/clips.js', '/js/study.js', '/js/speaking.js', '/js/speaking-data.js', '/js/jlpt.js', '/js/jlpt-data.js', '/js/vocab-data.js', '/js/vocab-n5.js', '/js/vocab-n4.js', '/js/vocab-life.js', '/js/grammar-n5.js', '/js/grammar-n4.js', '/js/kanji-n4.js', '/js/exam.js', '/js/exam-data.js', '/js/exam-more.js', '/js/exam-listen.js', '/js/exam-types.js', '/js/conjugate.js', '/js/strokes.js', '/js/ways.js', '/js/ways-n5.js', '/js/ways-office.js', '/js/ways-corp.js', '/js/ways-qa.js', '/js/ways-particles.js', '/js/ways-grammar-n5.js', '/js/ways-grammar-n4.js', '/js/furigana.js', '/js/kanji-readings.js',
  '/js/particles-data.js', '/js/counters-data.js', '/js/verbs-data.js', '/js/kanji-data.js', '/js/path.js', '/js/kana-data.js', '/js/search.js', '/js/path-jlpt.js', '/js/path-talk.js', '/js/book.js', '/js/book-data.js', '/js/book-kit.js', '/js/book-index.js', '/js/book-pics.js',
  '/js/book-kana.js', '/js/book-pictures.js', '/js/book-musts.js', '/js/book-u1.js', '/js/book-u2.js', '/js/book-u3.js', '/js/book-u4.js', '/js/book-u5.js', '/js/book-u6.js', '/js/book-u7.js', '/js/book-u8.js', '/js/book-u9.js', '/js/book-u10.js', '/js/book-u11.js', '/js/book-u12.js', '/js/book-grammar.js', '/js/book-wb-verbs.js', '/js/book-wb-adjectives.js', '/js/book-wb-countries.js', '/js/book-wb-words.js', '/js/login.js', '/js/board.js', '/js/path-summary.js', '/js/icons.js',
  '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-180.png'];

// Is anyone logged in on this device? null = can't tell (offline), so nothing drastic happens without a network.
const loggedIn = () => fetch('/api/auth', { cache: 'no-store' }).then(r => r.ok ? true : r.status === 401 ? false : null, () => null);

// Login wall (middleware.js) vs. offline copies made before it existed: an old service worker answers from its
// cache without ever reaching the server, so a device that had the app before v5.8 kept opening it with no login.
// Its update can't download the app files while logged out (they answer 401), so a normal install would fail and
// the old copy would stay forever. So when nobody is logged in, this version installs without downloading anything
// and takes over at once; activate then deletes every copy and sends open windows to the login page.
self.addEventListener('install', e => {
  e.waitUntil(loggedIn().then(async on => {
    if (on === false) return self.skipWaiting();
    await precache();
  }));
});

// Downloads the whole offline copy. A marker entry records that it finished, so a device that installed this
// version while logged out (empty copy, see above) can fill it later: js/app.js sends PRECACHE after a login.
const DONE = '/__precached';
async function precache() {
  const c = await caches.open(CACHE);
  if (await c.match(DONE)) return;
  await c.addAll(SHELL);
  await c.put(DONE, new Response('1'));
}

// Restart in the update prompt.
// PRECACHE: sent by js/app.js once the server confirms someone is logged in.
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data && e.data.type === 'PRECACHE') e.waitUntil(precache().catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // Logged out: drop everything, the voice clips and book pictures included, so nothing of the app is readable
    // from this device until someone logs in. Logged in (or offline): drop only older app versions, as before.
    const out = await loggedIn() === false;
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => out || (k !== CACHE && k !== AUDIO && k !== IMAGES)).map(k => caches.delete(k)));
    await self.clients.claim();
    // Windows still showing the old app (it's already in memory) are moved to the login page.
    if (out) for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate('/login.html').catch(() => {});
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // Login wall (middleware.js): the login page and the API always go to the network. Otherwise every navigation,
  // /login.html included, would be answered with the cached app (navigations share the '/' key below), and the
  // login page could never show.
  if (url.pathname === '/login.html' || url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/audio/')) { e.respondWith(audio(req, e)); return; }
  if (url.pathname.startsWith('/img/')) { e.respondWith(image(req, e)); return; }
  const key = req.mode === 'navigate' ? '/' : req;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(key, { ignoreSearch: true });
    // Refresh in the background; only good responses are stored.
    // A logged-out request is answered with a redirect or 401 (middleware.js); neither is res.ok, so the login
    // wall's answers never replace a cached app file.
    const refresh = fetch(req).then(res => {
      if (res.ok && !res.redirected) cache.put(key, res.clone());
      return res;
    });
    if (hit) { e.waitUntil(refresh.catch(() => {})); return hit; }
    return refresh.catch(() => Response.error());
  }));
});

let puts = 0;
async function audio(req, e) {
  const cache = await caches.open(AUDIO);
  const hit = await cache.match(req);
  if (hit) return hit;
  // no-cache: ask the server (a cheap 304 if unchanged) so a clip re-recorded under the same name never comes
  // from the browser's HTTP cache.
  const res = await fetch(req, { cache: 'no-cache' });
  // Only whole files: a partial (206) response can't be cached.
  if (res.status === 200) {
    e.waitUntil(cache.put(req, res.clone()).then(async () => {
      if (++puts % 50) return;
      const keys = await cache.keys();
      await Promise.all(keys.slice(0, Math.max(0, keys.length - AUDIO_MAX)).map(k => cache.delete(k)));
    }));
  }
  return res;
}

async function image(req, e) {
  const cache = await caches.open(IMAGES);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.status === 200) e.waitUntil(cache.put(req, res.clone()));
    return res;
  } catch (_) { return Response.error(); }
}
