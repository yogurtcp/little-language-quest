// Only this app's caches and requests are handled; other Pages apps share the origin.
const VERSION = "little-language-quest-shell-v6";
const AUDIO = "little-language-quest-audio-v1";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./src/core/art.js",
  "./src/core/audio-manifest.js",
  "./src/core/audio.js",
  "./src/core/clues.js",
  "./src/core/content.js",
  "./src/core/extra-art.js",
  "./src/core/helpers.js",
  "./src/core/i18n.js",
  "./src/core/lifecycle.js",
  "./src/core/offline.js",
  "./src/core/rewards.js",
  "./src/core/scheduler.js",
  "./src/core/speech.js",
  "./src/core/storage.js",
  "./src/games/arithmetic.js",
  "./src/games/compare.js",
  "./src/games/countGroup.js",
  "./src/games/describe.js",
  "./src/games/firstLetter.js",
  "./src/games/index.js",
  "./src/games/initialSet.js",
  "./src/games/letterOrder.js",
  "./src/games/listenChoose.js",
  "./src/games/makeAmount.js",
  "./src/games/memoryPairs.js",
  "./src/games/missingNumber.js",
  "./src/games/patternNext.js",
  "./src/games/shared.js",
  "./src/main.js",
  "./src/ui/parents.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon.svg",
];
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                (key.startsWith("little-language-quest-shell-") ||
                  /^llq-v\d+$/.test(key)) &&
                key !== VERSION,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url),
    scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname))
    return;
  if (url.pathname.includes("/audio/")) {
    event.respondWith(
      caches.open(AUDIO).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response;
      }),
    );
    return;
  }
  // A release is a coherent shell: its module graph comes from one versioned cache.
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: true });
      return cached || fetch(event.request);
    }),
  );
});
