// Service Worker Version
const cacheVersion = 'tic-tac-toe-v1';

// Files to cache
const filesToCache = [
    '/tic_tac_toe/index.html',
    '/tic_tac_toe/style.css',
    '/tic_tac_toe/script.js',
    '/tic_tac_toe/clap.wav',
    '/tic_tac_toe/click.mp3',
    '/tic_tac_toe/favicon/favicon.ico',
    '/tic_tac_toe/favicon/site.webmanifest',
    '/tic_tac_toe/favicon/apple-touch-icon.png',
    // Add more resources to cache here
];

// Install Event: Cache resources
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheVersion).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

// Fetch Event: Serve from Cache or Fetch and cache
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // If resource found in cache, return it
            if (response) {
                return response;
            }

            // If not found in cache, fetch it and add to cache
            return fetch(event.request).then(function (response) {
                // Clone the response to add it to cache
                const clonedResponse = response.clone();

                // Add the fetched response to cache
                caches.open(cacheVersion).then(function (cache) {
                    cache.put(event.request, clonedResponse);
                });

                // Return the fetched response
                return response;
            });
        })
    );
});
