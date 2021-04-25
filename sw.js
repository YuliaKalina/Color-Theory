const CACHE_NAME = 'my-cache1';
const ENABLE_DYNAMIC_CACHING = true
let urlsToCache = [
  './index.html',
  './color_properties.html'
];

self.addEventListener('install', installSW)
self.addEventListener('fetch', fetchSW)

function installSW(event) {
  console.log('[SW] Installing..');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Opened cache', cache);
        cache.addAll(urlsToCache)
          .then(() => console.log("[SW] Caching success.", urlsToCache))
          .catch(() => console.log("[SW] Caching failed."));
      })
      .finally(() => '[SW] Install process finished.')
  );
}

function fetchSW(event) {
  if (event.request.url.startsWith("chrome")) {
    console.log("[SW] Browser extension cannot be cached. Skipping.");
  } else {
    event.respondWith((async () => {
      console.log('[SW] Searching for the cache', event.request.url);
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        console.log('[SW] Cache was found');
        return cachedResponse;
      }

      console.log('[SW] Trying to connect..');

      const response = await fetch(event.request);

      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      if (ENABLE_DYNAMIC_CACHING) {
        const cache = await caches.open(CACHE_NAME)
        await cache.put(event.request, response.clone()).catch(() => console.log("[SW] Ignoring unsupported request schema"));
        console.log('[SW] Cache for the page was updated');
      }

      return response;
    })());
  }
}


self.addEventListener('activate', function (event) {
  var cacheWhitelist = ['pigment'];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
