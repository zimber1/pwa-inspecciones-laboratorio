const STATIC_CACHE_NAME = 'pwa-static-v1';
const DYNAMIC_CACHE_NAME = 'pwa-dynamic-v1';

// Recursos esenciales que siempre deben estar disponibles offline (App Shell)
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  // Puedes agregar aquí más rutas estáticas críticas
];

// 1. INSTALACIÓN: Precaché de recursos críticos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando y cacheando App Shell...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        // Fuerza al Service Worker a activarse inmediatamente
        return self.skipWaiting();
      })
  );
});

// 2. ACTIVACIÓN: Limpieza de cachés obsoletas
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando y limpiando cachés antiguas...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Toma el control de todos los clientes de inmediato sin necesidad de recargar
      return self.clients.claim();
    })
  );
});

// 3. FETCH: Estrategias de intercepción
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Solo interceptamos peticiones GET (no mutaciones)
  if (request.method !== 'GET') return;

  // ESTRATEGIA: Network First con fallback a caché para navegación (HTML)
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si hay red, guardamos una copia en la caché dinámica y devolvemos la respuesta
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Si no hay red, intentamos devolver desde la caché dinámica o la estática
          return caches.match(request).then((cachedResponse) => {
             // Retorna la versión en caché de la página, o el fallback principal
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // ESTRATEGIA: Cache First con fallback a red para recursos estáticos (imágenes, CSS, JS)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Retorna desde caché si existe
      }
      
      // Si no está en caché, va a la red
      return fetch(request)
        .then((response) => {
          // Validamos que la respuesta sea válida antes de cachearla
          // Omitimos opaqueresponses u otros tipos inválidos para caché
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
           // Fallback opcional si falla la red al pedir recursos estáticos
        });
    })
  );
});
