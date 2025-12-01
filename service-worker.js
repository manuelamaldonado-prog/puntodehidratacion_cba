
self.addEventListener("install",event=>{
 self.skipWaiting();
 event.waitUntil(
   caches.open("pwa-v3").then(cache=>{
     return cache.addAll([
       "index.html","style.css","app.js","manifest.json"
     ]);
   })
 );
});

self.addEventListener("activate",event=>{ clients.claim(); });

self.addEventListener("fetch",event=>{
 event.respondWith(
   caches.match(event.request).then(resp=>resp || fetch(event.request))
 );
});
