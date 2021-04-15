self.addEventListener('install', (event) => {
    console.log('Установлен');
});

self.addEventListener('activate', (event) => {
    console.log('Активирован');
});

self.addEventListener('fetch', (event) => {
    console.log('Происходит запрос на сервер');
});


let cache_name = 'Custom_name_cache';

let cached_assets = [
    './',
    './index.js',
    './css/main.css',
    './js/main_page.css',
    '/manifest.json'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cache_name).then(function (cache) {
            return cache.addAll(cached_assets);
        })
    );
});
const timeout = 400;
// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

// при событии fetch, мы и делаем запрос, но используем кэш, только после истечения timeout.
self.addEventListener('fetch', (event) => {
    event.respondWith(fromNetwork(event.request, timeout)
        .catch((err) => {
            console.log(`Error: ${err.message()}`);
            return fromCache(event.request);
        }));
});

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
// Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
// Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}


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
