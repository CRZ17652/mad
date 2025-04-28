// Service Worker for Simple PWA

const CACHE_NAME = 'simple-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './tree.jpg',  // Add any other assets here
  './style.css', // Example stylesheet
  './main.js'    // Example JavaScript file
];

// Install service worker and cache assets
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response if available
        }

        return fetch(event.request)
          .then(networkResponse => {
            // Optionally, cache the network response
            if (event.request.url.indexOf('/api/') === -1) {
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, networkResponse.clone()));
            }
            return networkResponse;
          });
      })
  );
});

// Cleanup old caches on service worker activation
self.addEventListener('activate', event => {
  const cacheWhitelist = ['simple-pwa-v1'];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
