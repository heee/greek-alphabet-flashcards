// Bump CACHE on every deploy so phones pick up the new files.
var CACHE = 'greek-flashcards-v3';
var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './words.js',
  './app.js',
  './manifest.webmanifest',
  './fonts/gfsdidot-greek.woff2',
  './fonts/gfsdidot-latin.woff2',
  './fonts/cinzel-latin.woff2',
  './fonts/cinzel-latin-ext.woff2',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); })); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});

// The Stoa asks whether everything is cached before showing "READY OFFLINE".
self.addEventListener('message', function (event) {
  if (!event.data || event.data.type !== 'status' || !event.ports[0]) return;
  var port = event.ports[0];
  caches.open(CACHE)
    .then(function (cache) { return Promise.all(ASSETS.map(function (u) { return cache.match(u); })); })
    .then(function (hits) { port.postMessage({ ready: hits.every(Boolean) }); })
    .catch(function () { port.postMessage({ ready: false }); });
});
