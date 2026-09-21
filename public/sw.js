const STATIC_CACHE_NAME = 'pwa-static-v1';
const DYNAMIC_CACHE_NAME = 'pwa-dynamic-v1';

// Recursos esenciales del App Shell
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
];

// 1. INSTALACIÓN
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// 2. ACTIVACIÓN
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              return caches.delete(cacheName);
            }

            return undefined;
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 3. INTERCEPCIÓN DE PETICIONES
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Solo interceptar peticiones GET
  if (request.method !== 'GET') {
    return;
  }

  // NETWORK FIRST
  // Se utiliza para navegación y documentos HTML.
  if (
    request.mode === 'navigate' ||
    request.headers.get('accept')?.includes('text/html')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseToCache = response.clone();

          caches
            .open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              return cache.put(request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );

    return;
  }

  // CACHE FIRST
  // Se utiliza para recursos estáticos como JS, CSS e imágenes.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Solo guardar respuestas HTTP válidas.
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseToCache = response.clone();

          caches
            .open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              return cache.put(request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          // Fallback controlado cuando no existe conexión
          // ni una copia disponible en caché.
          return new Response(
            'Recurso no disponible sin conexión.',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
              },
            }
          );
        });
    })
  );
});