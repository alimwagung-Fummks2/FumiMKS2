const CACHE_NAME = 'fumi-mks2-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png.png'
];

// Instalasi Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache awal dilewati:', err))
  );
  self.skipWaiting();
});

// Aktivasi dan pembersihan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intersep request
self.addEventListener('fetch', event => {
  // Trafik Google Apps Script selalu langsung ke jaringan internet
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // File lokal GitHub Pages
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
