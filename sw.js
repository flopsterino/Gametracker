// Define a unique name for the cache
const CACHE_NAME = 'board-game-scorer-v20';

// List of files to cache when the service worker is installed
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
];

// Install event: fires when the service worker is first installed.
self.addEventListener('install', event => {
  // waitUntil() ensures that the service worker will not install until the
  // code inside it has successfully completed.
  event.waitUntil(
    // Open the cache by name.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified assets to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: fires for every request the PWA makes.
self.addEventListener('fetch', event => {
  // respondWith() hijacks the request and allows us to provide our own response.
  event.respondWith(
    // Check if the request is already in the cache.
    caches.match(event.request)
      .then(response => {
        // If a cached response is found, return it.
        if (response) {
          return response;
        }
        // Otherwise, fetch the resource from the network.
        return fetch(event.request);
      }
    )
  );
});

// Activate event: fires when the service worker is activated.
// This is a good place to manage old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
