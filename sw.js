// Dot Log PWA service worker (light theme build)
const CACHE = 'dotlog-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

// Install: pre-cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin, fall back to network
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    // Navigation fallback to index.html for offline use
    if (e.request.mode === 'navigate') {
      e.respondWith(
        fetch(e.request).catch(() => caches.match('./index.html'))
      );
      return;
    }
    e.respondWith(
      caches.match(e.request).then((r) => r || fetch(e.request))
    );
  }
});
