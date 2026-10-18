// Offline-first: app files are served from the cache instantly and refreshed in the background
// (stale-while-revalidate). A release ships a new CACHE name, which installs alongside and waits: the app asks
// "New version · Restart" (js/app.js), and Restart tells it to take over; otherwise it takes over once the app
// is fully closed. Everything is same-origin, including the font. Bump CACHE on each release.
const CACHE = 'hanasu-v5.6';
// Voice clips live in their own cache that app releases don't clear: cache-first, since a clip never changes
// unless the voices are re-recorded (then bump AUDIO). Capped so it can't grow without limit.
const AUDIO = 'hanasu-audio-v3';
const AUDIO_MAX = 2000;
const SHELL = ['/', '/index.html', '/css/app.css', '/js/app.js', '/js/units-index.js', '/js/module-deps.js', '/js/core.js', '/js/data.js', '/js/corp-more.js', '/js/speech.js', '/js/clips.js', '/js/study.js', '/js/speaking.js', '/js/speaking-data.js', '/js/jlpt.js', '/js/jlpt-data.js', '/js/vocab-data.js', '/js/vocab-n5.js', '/js/vocab-n4.js', '/js/vocab-life.js', '/js/grammar-n5.js', '/js/grammar-n4.js', '/js/kanji-n4.js', '/js/exam.js', '/js/exam-data.js', '/js/exam-more.js', '/js/exam-listen.js', '/js/exam-types.js', '/js/conjugate.js', '/js/strokes.js', '/js/ways.js', '/js/ways-n5.js', '/js/ways-office.js', '/js/ways-corp.js', '/js/ways-qa.js', '/js/ways-particles.js', '/js/ways-grammar-n5.js', '/js/ways-grammar-n4.js', '/js/furigana.js', '/js/kanji-readings.js',
  '/js/particles-data.js', '/js/counters-data.js', '/js/verbs-data.js', '/js/kanji-data.js', '/js/path.js', '/js/kana-data.js', '/js/search.js', '/js/path-jlpt.js', '/js/path-talk.js',
  '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

// Restart in the update prompt.
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== AUDIO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/audio/')) { e.respondWith(audio(req, e)); return; }
  const key = req.mode === 'navigate' ? '/' : req;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(key, { ignoreSearch: true });
    // Refresh in the background; only good responses are stored.
    const refresh = fetch(req).then(res => {
      if (res.ok) cache.put(key, res.clone());
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
