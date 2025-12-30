// Service Worker for Words With Friends Helper PWA
const CACHE_NAME = 'wwf-helper-v1';
const urlsToCache = [
  '/',
  '/static/styles/styles.css',
  '/static/scripts/bundle.js',
  '/static/assets/logo.png',
  '/static/manifest.json',
  'https://use.fontawesome.com/releases/v5.7.2/css/all.css',
  'https://fonts.googleapis.com/css?family=Caveat&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[Service Worker] Cache failed:', err);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip caching for API calls (bestGameMove endpoint)
  if (request.url.includes('/bestGameMove') || request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Serving from cache:', request.url);
          return response;
        }

        // Clone the request
        const fetchRequest = request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });

          return response;
        }).catch((err) => {
          console.error('[Service Worker] Fetch failed:', err);
          // You could return a custom offline page here
          return new Response('Offline - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
