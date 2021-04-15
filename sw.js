self.addEventListener('install', (event) => {
    console.log('Установлен');
});

self.addEventListener('activate', (event) => {
    console.log('Активирован');
});

self.addEventListener('fetch', (event) => {
    console.log('Происходит запрос на сервер');
});


let CACHE_NAME = 'my-cache';
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
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
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