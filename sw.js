'use strict';
const CACHE_NAME = 'fumimks2-pwa-shell-rev270-2-7';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './logo-192.png',
  './logo-512.png',
  './offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('fumimks2-pwa-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Never intercept GAS, Google, or other cross-origin application requests.
  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;

  // Navigation: prefer network; fall back to the cached launcher/offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match('./index.html');
        return cached || caches.match('./offline.html');
      })
    );
    return;
  }

  // Cache only the static PWA shell assets.
  if (APP_SHELL.some(path => new URL(path, self.location.href).pathname === url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
  }
});
