// Offline-first: app files are served from the cache instantly and refreshed in the background
// (stale-while-revalidate). A release ships a new CACHE name, which installs alongside and takes over on the
// next open. Everything is same-origin, including the font. Bump CACHE on each release.
const CACHE = 'hanasu-v4.0.1';
// Voice clips live in their own cache that app releases don't clear: cache-first, since a clip never changes
// unless the voices are re-recorded (then bump AUDIO). Capped so it can't grow without limit.
const AUDIO = 'hanasu-audio-v1';
const AUDIO_MAX = 2000;
const SHELL = ['/', '/index.html', '/css/app.css', '/js/app.js', '/js/units-index.js', '/js/core.js', '/js/data.js', '/js/corp-more.js', '/js/speech.js', '/js/clips.js', '/js/study.js', '/js/speaking.js', '/js/speaking-data.js', '/js/jlpt.js', '/js/jlpt-data.js', '/js/vocab-data.js', '/js/vocab-n5.js', '/js/vocab-n4.js', '/js/grammar-n5.js', '/js/grammar-n4.js', '/js/kanji-n4.js', '/js/exam.js', '/js/exam-data.js', '/js/exam-more.js', '/js/conjugate.js', '/js/furigana.js', '/js/kanji-readings.js',
  '/js/particles-data.js', '/js/verbs-data.js', '/js/kanji-data.js',
  '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

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
  const res = await fetch(req);
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
