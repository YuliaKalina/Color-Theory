self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});



let cacheName = 'Custom_name_cache';

let appShellFiles = [
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


const gamesImages = [];
for (let i = 0; i < games.length; i++) {
    gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages);



self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});


self.addEventListener('fetch', (e) => {
    console.log(`[Service Worker] Fetched resource ${e.request.url}`);
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