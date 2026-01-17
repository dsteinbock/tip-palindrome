// Service Worker for Palindrome Tip Calculator
const CACHE_NAME = 'tip-calc-v2';

const urlsToCache = [
    '/tip-palindrome/',
    '/tip-palindrome/index.html',
    '/tip-palindrome/styles.css',
    '/tip-palindrome/app.js',
    '/tip-palindrome/calc.js',
    '/tip-palindrome/manifest.json',
    '/tip-palindrome/icons/icon-192.png',
    '/tip-palindrome/icons/icon-512.png'
];

// Install event - cache all resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // Otherwise fetch from network
                return fetch(event.request);
            })
    );
});
