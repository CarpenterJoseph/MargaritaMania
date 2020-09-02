

self.addEventListener('install', function(e) {
    console.log("Installing: " + cache)
    e.waitUntil(
        caches.open('margarita-mania').then(function(cache) {
            console.log("Installing: " + cache)
            return cache.addAll([
                '/MargaritaMania/',
                '/MargaritaMania/index.html',
                '/MargaritaMania/index.js',
                '/MargaritaMania/style.css'
            ]);
        })
    );
});
   
self.addEventListener('fetch', function(e) {
    console.log('fetching from: ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            console.log('fetching inside: ' + e.request.url);
            return response || fetch(e.request);
        })
    );
});