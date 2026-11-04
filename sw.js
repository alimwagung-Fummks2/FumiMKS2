/* FumiMKS2 GitHub Pages Service Worker - Cache v7
 * Memprioritaskan versi terbaru dari GitHub Pages dan tidak mengintersep GAS.
 */
const CACHE_NAME = 'fumi-mks2-shell-v7';
const CACHE_PREFIX = 'fumi-mks2-';
const SHELL_FILES = ['./index.html', './manifest.json', './logo.png.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache setiap aset secara terpisah agar satu kegagalan tidak menggagalkan semuanya.
    await Promise.all(SHELL_FILES.map(async path => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response && response.ok) await cache.put(path, response);
      } catch (err) {
        console.warn('Aset shell tidak dapat dicache:', path, err);
      }
    }));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, cacheKey) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) await cache.put(cacheKey || request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(cacheKey || request);
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Jangan cache atau intersep Google Apps Script maupun hasil redirect Google.
  if (url.hostname === 'script.google.com' || url.hostname.endsWith('.googleusercontent.com')) return;
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Dokumen navigasi selalu network-first agar rilis GitHub terbaru diprioritaskan.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  // Manifest dan ikon network-first agar metadata/ikon PWA cepat mengikuti rilis.
  if (/manifest\.json$/i.test(url.pathname) || /logo\.png\.png$/i.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Aset statis lain cache-first, dengan fallback jaringan.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
