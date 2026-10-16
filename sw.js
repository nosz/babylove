const CACHE = 'babylove-v12';
const SHELL = [
  './', './index.html', './styles.css', './app.js', './content.js', './features.js',
  './vendor/bootstrap/bootstrap.min.css', './vendor/bootstrap/bootstrap.bundle.min.js',
  './vendor/bootstrap-icons/bootstrap-icons.min.css', './vendor/bootstrap-icons/fonts/bootstrap-icons.woff2',
  './vendor/bootstrap-icons/fonts/bootstrap-icons.woff',
  './manifest.webmanifest', './icons/icon.svg', './icons/icon-maskable.svg'
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
