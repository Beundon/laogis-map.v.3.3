/**
 * Laos GIS Mapper - Service Worker
 * Provides offline support, caching, and PWA installation
 */

const CACHE_NAME = 'laos-gis-v1';
const STATIC_ASSETS = [
  '/laos-gis-mapper/',
  '/laos-gis-mapper/index.html',
  '/laos-gis-mapper/manifest.json',
  '/laos-gis-mapper/icons/icon-72x72.png',
  '/laos-gis-mapper/icons/icon-96x96.png',
  '/laos-gis-mapper/icons/icon-128x128.png',
  '/laos-gis-mapper/icons/icon-144x144.png',
  '/laos-gis-mapper/icons/icon-152x152.png',
  '/laos-gis-mapper/icons/icon-192x192.png',
  '/laos-gis-mapper/icons/icon-384x384.png',
  '/laos-gis-mapper/icons/icon-512x512.png'
];

// CDN resources that should be cached for offline use
const CDN_CACHE = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/@turf/turf@6.5.0/turf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.9.0/proj4.js'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Laos GIS Mapper...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => {
      // Pre-cache CDN resources
      return caches.open(CACHE_NAME + '-cdn').then(cache => {
        return Promise.all(
          CDN_CACHE.map(url => 
            fetch(url, { mode: 'no-cors' }).then(response => {
              if (response.ok || response.type === 'opaque') {
                return cache.put(url, response);
              }
            }).catch(err => console.warn('[SW] CDN cache failed for', url, err))
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('laos-gis-') && name !== CACHE_NAME && name !== CACHE_NAME + '-cdn')
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Tile requests - cache with a separate, larger cache
  if (url.hostname.includes('tile') || url.hostname.includes('arcgisonline')) {
    event.respondWith(tileCacheStrategy(request));
    return;
  }

  // Static assets - cache first
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.endsWith('.html') || url.pathname.endsWith('.json') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.png')) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // CDN resources - stale while revalidate
  if (CDN_CACHE.includes(request.url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(networkFirstStrategy(request));
});

// Cache First Strategy
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return cached || new Response('Offline - content unavailable', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

// Network First Strategy
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('Offline - please check your connection', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

// Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME + '-cdn');
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fetchPromise;
}

// Tile Cache Strategy - cache tiles for offline map viewing
async function tileCacheStrategy(request) {
  const cache = await caches.open(CACHE_NAME + '-tiles');
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request, { mode: 'no-cors' });
    if (response.ok || response.type === 'opaque') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached || new Response('', { status: 204 });
  }
}

// Background sync for measurements when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-measurements') {
    event.waitUntil(syncMeasurements());
  }
});

async function syncMeasurements() {
  // Placeholder for background sync logic
  console.log('[SW] Background sync triggered');
}

// Push notifications (future support)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || 'Laos GIS Mapper', {
        body: data.body || 'Notification from Laos GIS Mapper',
        icon: '/laos-gis-mapper/icons/icon-192x192.png',
        badge: '/laos-gis-mapper/icons/icon-72x72.png',
        data: data
      })
    );
  }
});
