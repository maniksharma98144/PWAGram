
var CACHE_STATIC_NAME = 1;
var CACHE_DYNAMIC_NAME = 1;
//installing a service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);

  //wait until cache finishes and preventing to run further async code
  event.waitUntil(
    caches.open('static') //creates or open static cache using cache api
      .then(cache => {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  );
});

//activating a service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== 'static' && key !== 'dynamic') {
            console.log('[ServiceWorker] Removing Old Cache', key);
            return caches.delete(key);
          }
        }));
      })
  )
  return self.clients.claim();
});

//listening to an event(fetch) 
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(res => {
              return caches.open('dynamic')
                .then(cache => {
                  cache.put(event.request.url, res.clone())
                  return res;
                })
                .catch(err => {
                })
            })
        }
      })
  );
});