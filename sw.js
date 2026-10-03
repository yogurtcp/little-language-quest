const VERSION = 'llq-v3';
const CORE = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './src/main.js', './src/core/content.js', './src/core/i18n.js',
  './src/core/art.js', './src/core/audio.js', './src/core/helpers.js',
  './src/core/scheduler.js', './src/core/rewards.js',
  './src/games/index.js', './src/games/shared.js',
  './src/games/initialSet.js', './src/games/countGroup.js',
  './src/games/memoryPairs.js', './src/games/letterOrder.js',
  './src/games/firstLetter.js', './src/games/describe.js',
  './src/games/arithmetic.js', './src/games/compare.js',
  './src/games/listenChoose.js', './src/games/missingNumber.js',
  './src/games/makeAmount.js', './src/games/patternNext.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
