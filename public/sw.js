const LocalCache = {
  PREFIX: `big-trip-cache`,
  VERSION: `v1`
};
const CACHE_NAME = `${LocalCache.PREFIX}-${LocalCache.VERSION}`;
const STATUS_OK = 200;
const RESPONSE_TYPE = `basic`;
const APP_DATA = [
  `/`,
  `/index.html`,
  `/bundle.js`,
  `/css/style.css`,
  `/img/header-bg.png`,
  `/img/header-bg@2x.png`,
  `/img/logo.png`,
  `/img/icons/bus.png`,
  `/img/icons/check-in.png`,
  `/img/icons/drive.png`,
  `/img/icons/flight.png`,
  `/img/icons/restaurant.png`,
  `/img/icons/ship.png`,
  `/img/icons/sightseeing.png`,
  `/img/icons/taxi.png`,
  `/img/icons/train.png`,
  `/img/icons/transport.png`,
];

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(APP_DATA);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map((key) => key.startsWith(LocalCache.PREFIX) && key !== CACHE_NAME ? caches.delete(key) : null)
                  .filter((key) => key !== null)
            )
        )
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== STATUS_OK || response.type !== RESPONSE_TYPE) {
                return response;
              }

              const clonedResponse = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
});
