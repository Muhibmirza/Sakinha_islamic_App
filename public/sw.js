const VERSION = "v15";
const PREFIX = "sakinah-";
const SHELL_CACHE = `${PREFIX}shell-${VERSION}`;
const CODE_CACHE = `${PREFIX}code-${VERSION}`;
const IMAGE_CACHE = `${PREFIX}images-${VERSION}`;
const DATA_CACHE = `${PREFIX}data-${VERSION}`;
const CURRENT_CACHES = new Set([SHELL_CACHE, CODE_CACHE, IMAGE_CACHE, DATA_CACHE]);
const SHELL = ["/offline.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(PREFIX) && !CURRENT_CACHES.has(key)).map((key) => caches.delete(key)),
  )).then(() => self.clients.claim()));
});
const cacheable = (response) => response && (response.ok || response.type === "opaque");
async function networkFirst(request, cacheName, fallback) {
  try {
    const response = await fetch(request);
    if (cacheable(response)) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (await caches.match(request)) || (fallback ? await caches.match(fallback) : undefined) || Promise.reject(error);
  }
}
async function staleWhileRevalidate(event, cacheName) {
  const cached = await caches.match(event.request);
  const refresh = fetch(event.request).then(async (response) => {
    if (cacheable(response)) {
      const cache = await caches.open(cacheName);
      await cache.put(event.request, response.clone());
    }
    return response;
  });
  if (cached) {
    event.waitUntil(refresh.catch(() => undefined));
    return cached;
  }
  return refresh;
}
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, CODE_CACHE, "/offline.html"));
    return;
  }
  if (["script", "style", "worker"].includes(event.request.destination)) {
    event.respondWith(networkFirst(event.request, CODE_CACHE));
    return;
  }
  if (event.request.destination === "image") {
    event.respondWith(staleWhileRevalidate(event, IMAGE_CACHE));
    return;
  }
  if (url.origin !== self.location.origin && url.hostname === "api.alquran.cloud") {
    event.respondWith(networkFirst(event.request, DATA_CACHE));
    return;
  }
  if (url.origin === self.location.origin) event.respondWith(staleWhileRevalidate(event, CODE_CACHE));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => list[0] ? list[0].focus() : clients.openWindow("/?view=prayer")));
});
self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "sakinah-daily") return;
  event.waitUntil(self.registration.showNotification("Daily Sakinah", {
    body: "Pause for a moment of Quran, remembrance and reflection.",
    icon: "/icons/icon-192.png", badge: "/icons/icon-192.png",
    tag: `sakinah-periodic-${new Date().toISOString().slice(0, 10)}`,
  }));
});