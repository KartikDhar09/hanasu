// Offline-first: app files are served from the cache instantly and refreshed in the background
// (stale-while-revalidate). A release ships a new CACHE name, which installs alongside and takes over on the
// next open. Everything is same-origin, including the font. Bump CACHE on each release.
const CACHE = 'hanasu-v3.9';
const SHELL = ['/', '/index.html', '/css/app.css', '/js/app.js', '/js/core.js', '/js/data.js', '/js/corp-more.js', '/js/speech.js', '/js/study.js', '/js/speaking.js', '/js/speaking-data.js', '/js/jlpt.js', '/js/jlpt-data.js', '/js/vocab-data.js', '/js/vocab-n5.js', '/js/vocab-n4.js', '/js/grammar-n5.js', '/js/grammar-n4.js', '/js/kanji-n4.js', '/js/exam.js', '/js/exam-data.js', '/js/exam-more.js', '/js/conjugate.js', '/js/furigana.js', '/js/kanji-readings.js',
  '/js/particles-data.js', '/js/verbs-data.js', '/js/kanji-data.js', '/fonts/inter-latin.woff2',
  '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
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
