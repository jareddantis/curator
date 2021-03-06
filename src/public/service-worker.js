/* eslint-disable no-undef */
/**
 @file service-worker.js
 @description Custom logic for the service worker.
 Handles Google Font and JS lib caching.
 @author Jared Dantis (@jareddantis)
 @license MIT
 */

// Skip waiting
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Precache
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// SPA
workbox.routing.registerNavigationRoute("/index.html");

// Workbox plugins
const newPlugins = function() {
  return [
    new workbox.cacheableResponse.Plugin({
      statuses: [0, 200]
    }),
    new workbox.expiration.Plugin({
      maxAgeSeconds: 60 * 60 * 24 * 365,
      maxEntries: 30
    })
  ];
};
// Stale-while-revalidate
const newSwrStrategy = function(cacheName) {
  return new workbox.strategies.StaleWhileRevalidate({
    cacheName: cacheName,
    plugins: newPlugins()
  });
};
// Cache-first
const newCfStrategy = function(cacheName) {
  return new workbox.strategies.CacheFirst({
    cacheName: cacheName,
    plugins: newPlugins()
  });
};

// Cache album art from Spotify
workbox.routing.registerRoute(
  /^https:\/\/i\.scdn\.co\/image/,
  newCfStrategy("spotify-art")
);

// Cache icon font from Icons8
workbox.routing.registerRoute(
  /^https:\/\/maxst\.icons8\.com/,
  newSwrStrategy("icons8-fonts")
);

// Cache files from Google API storage (e.g. Workbox scripts)
workbox.routing.registerRoute(
  /^https:\/\/storage\.googleapis\.com/,
  newSwrStrategy("google-storage")
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
// https://developers.google.com/web/tools/workbox/guides/common-recipes
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  newSwrStrategy("google-fonts-stylesheets")
);

// Cache the underlying font files with a cache-first strategy for 1 year.
// https://developers.google.com/web/tools/workbox/guides/common-recipes
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  newCfStrategy("google-fonts-webfonts")
);
