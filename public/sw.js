const CACHE_NAME = 'pwa-cache-75'; // Increment version for updates
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate new service worker immediately
  );
});

self.addEventListener('fetch', event => {
  // Skip caching for chrome-extension and other non-http requests
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://') ||
      event.request.url.startsWith('safari-extension://') ||
      !event.request.url.startsWith('http')) {
    return;
  }

  // Skip caching for data files to ensure fresh data
  if (event.request.url.includes('/src/data/') || 
      event.request.url.includes('.json')) {
    return fetch(event.request).catch(error => {
      console.log('Data fetch failed:', error);
      return new Response('Data fetch error', { status: 500, statusText: 'Data Error' });
    });
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(error => {
          console.log('Fetch failed:', error);
          return new Response('Network error', { status: 408, statusText: 'Request Timeout' });
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            cacheName: CACHE_NAME
          });
        });
      });
    })
    .then(() => self.clients.claim()) // Take control of all clients immediately
  );
});

