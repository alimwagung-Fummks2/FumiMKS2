const CACHE_NAME = 'fumi-mks2-v3';
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
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.warn('Cache awal dilewati sebagian:', err);
      })
  );
  self.skipWaiting();
});

// Aktivasi dan hapus cache versi lama
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

// Intersep permintaan jaringan
self.addEventListener('fetch', event => {
  // Biarkan trafik Google Apps Script berjalan langsung via internet
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Untuk file lokal PWA di GitHub Pages
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
