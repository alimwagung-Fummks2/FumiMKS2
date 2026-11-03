const CACHE_NAME = 'fumi-mks2-shell-v6';
const SHELL_FILES = ['./', './index.html', './manifest.json', './logo.png.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES).catch(err => console.warn('Cache shell parsial:', err)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('fumi-mks2-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Jangan cache atau intersep aplikasi Google Apps Script.
  if (url.hostname === 'script.google.com' || url.hostname.endsWith('.googleusercontent.com')) return;
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navigasi utama: network-first agar versi GitHub terbaru diprioritaskan.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Aset statis: cache-first, lalu simpan hasil jaringan.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
