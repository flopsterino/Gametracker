// A unique name for the cache. Using a version number helps in updating the cache when the app is updated.
const CACHE_NAME = 'board-game-scorer-v22';

// A list of the essential files the app needs to work offline.
const urlsToCache = [
  '/', // The root of the site
  'index.html',
  'manifest.json'
];

const tailwindUrl = 'https://cdn.tailwindcss.com';

// 'install' event: This is fired when the service worker is first installed.
self.addEventListener('install', event => {
  // We use event.waitUntil to ensure that the service worker doesn't finish installing
  // until the caching is complete.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Opened cache');
        // Add the main app files to the cache.
        await cache.addAll(urlsToCache);
        
        // FIX: Fetch and cache the Tailwind CSS file with 'no-cors' mode.
        // This allows us to cache the file from the CDN without a CORS error.
        const tailwindRequest = new Request(tailwindUrl, { mode: 'no-cors' });
        const tailwindResponse = await fetch(tailwindRequest);
        return cache.put(tailwindRequest, tailwindResponse);
      })
  );
});

// 'fetch' event: This is fired for every request the PWA makes (e.g., for pages, scripts, images).
self.addEventListener('fetch', event => {
  // respondWith() hijacks the request and allows us to provide our own response.
  event.respondWith(
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