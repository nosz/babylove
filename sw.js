// BABYLOVE by Sarah: Service Worker. Version muss zu APP_VERSION in content.js passen.
const VERSION = '1.0.0';
const CACHE = 'babylove-' + VERSION;
const SHELL = [
  './', './index.html', './styles.css', './app.js', './content.js', './features.js', './extras.js', './printing.js',
  './vendor/bootstrap/bootstrap.min.css', './vendor/bootstrap/bootstrap.bundle.min.js',
  './vendor/bootstrap-icons/bootstrap-icons.min.css', './vendor/bootstrap-icons/fonts/bootstrap-icons.woff2',
  './vendor/bootstrap-icons/fonts/bootstrap-icons.woff',
  './manifest.webmanifest', './icons/icon.svg', './icons/icon-maskable.svg', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Sofort aus dem Speicher antworten (offline bereit) und im Hintergrund aktualisieren, damit Neuerungen beim nächsten Öffnen da sind
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(cache => cache.match(e.request).then(hit => {
    const refresh = fetch(e.request).then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => hit || cache.match('./index.html'));
    return hit || refresh;
  })));
});