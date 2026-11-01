const CACHE_NAME = 'fumi-mks2-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://i.postimg.cc/90YX1YMZ/IMG-20261101-WA0000-1-removebg-preview.png'
];

// Instalasi Service Worker dan Cache File Statis Dasar
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Aktivasi dan hapus cache lama jika ada update
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

// Intersep permintaan jaringan (Hanya cache file lokal, biarkan URL Google Script live)
self.addEventListener('fetch', event => {
  // Jika permintaan ke Google Script, langsung ambil dari internet (Network Only)
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Untuk file PWA (index.html, manifest, icon), gunakan Cache First, Network Fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});