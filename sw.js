

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('margarita-mania').then(function(cache) {
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
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});