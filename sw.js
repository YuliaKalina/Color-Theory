
let cacheName = 'my-cache';
let urlsToCache = [
    './',
    './index.js',
    './css/main.css',
    './js/main_page.css',
    '/index.html',
    '/black_color.html',
    '/brown_color.html',
    '/blue_color.html',
    '/red_color.html',
    '/yellow_color.html',
    '/white_color.html',
    '/orange_color.html',
    '/pink_color.html',
    '/purple_color.html',
    '/grey_color.html',
    '/green_color.html',
    '/turquoise_color.html',
    '/color_models.html',
    '/color_palettes.html',
    '/color_properties.html',
    '/color_wheel.html',
    '/colors_types.html',
    '/manifest.json'
];

self.addEventListener('install', function(event) {
// Perform install steps
    event.waitUntil(
        caches.open(cacheName)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['pigment'];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});