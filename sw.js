// A unique name for the cache. Using a version number helps in updating the cache when the app is updated.
const CACHE_NAME = 'board-game-scorer-v26';

// A list of the essential files the app needs to work offline.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 'install' event: This is fired when the service worker is first installed.
self.addEventListener('install', event => {
  // We use event.waitUntil to ensure that the service worker doesn't finish installing
  // until the caching is complete.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified assets to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// 'fetch' event: This is fired for every request the PWA makes.
self.addEventListener('fetch', event => {
  // We don't want to cache requests to Firebase or Google APIs
  if (event.request.url.startsWith('https://firestore.googleapis.com') || event.request.url.startsWith('https://generativelanguage.googleapis.com')) {
    return;
  }
  
  // respondWith() hijacks the request and allows us to provide our own response.
  event.respondWith(
    // Check if the request is already in the cache.
    caches.match(event.request)
      .then(response => {
        // If a cached response is found, return it.
        if (response) {
          return response;
        }
        // If the request is not in the cache, we let the browser fetch it from the network as usual.
        return fetch(event.request);
      })
  );
});

// 'activate' event: This is fired when the service worker is activated.
// It's a good place to clean up old, unused caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache's name is not in our whitelist, we delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
