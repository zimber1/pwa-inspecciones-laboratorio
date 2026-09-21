import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const serviceWorkerPath = resolve(root, "public/sw.js");

assert.equal(
  existsSync(serviceWorkerPath),
  true,
  "Debe existir public/sw.js"
);

const serviceWorker = readFileSync(serviceWorkerPath, "utf8");

// ============================================================
// CACHÉS
// ============================================================

assert.match(
  serviceWorker,
  /const STATIC_CACHE_NAME\s*=\s*['"]pwa-static-v1['"]/
);

assert.match(
  serviceWorker,
  /const DYNAMIC_CACHE_NAME\s*=\s*['"]pwa-dynamic-v1['"]/
);

// ============================================================
// APP SHELL
// ============================================================

assert.match(
  serviceWorker,
  /const APP_SHELL\s*=\s*\[/
);

assert.match(
  serviceWorker,
  /['"]\/['"]/
);

assert.match(
  serviceWorker,
  /['"]\/manifest\.webmanifest['"]/
);

// ============================================================
// CICLO DE VIDA DEL SERVICE WORKER
// ============================================================

assert.match(
  serviceWorker,
  /self\.addEventListener\(\s*['"]install['"]/
);

assert.match(
  serviceWorker,
  /self\.addEventListener\(\s*['"]activate['"]/
);

assert.match(
  serviceWorker,
  /self\.addEventListener\(\s*['"]fetch['"]/
);

// ============================================================
// INSTALACIÓN
// ============================================================

// Apertura de la caché estática.
assert.match(
  serviceWorker,
  /caches\s*\.open\(STATIC_CACHE_NAME\)/
);

// Precaché del App Shell.
assert.match(
  serviceWorker,
  /cache\.addAll\(APP_SHELL\)/
);

// Activación inmediata.
assert.match(
  serviceWorker,
  /self\.skipWaiting\(\)/
);

// ============================================================
// ACTIVACIÓN
// ============================================================

// Obtener las cachés existentes.
assert.match(
  serviceWorker,
  /caches\s*\.keys\(\)/
);

// Eliminar cachés antiguas.
assert.match(
  serviceWorker,
  /caches\s*\.delete\(cacheName\)/
);

// Tomar control de los clientes.
assert.match(
  serviceWorker,
  /self\.clients\s*\.claim\(\)/
);

// ============================================================
// PETICIONES GET
// ============================================================

// Solo se interceptan peticiones GET.
assert.match(
  serviceWorker,
  /request\.method\s*!==\s*['"]GET['"]/
);

// ============================================================
// NETWORK FIRST
// ============================================================

// Identificación de navegación.
assert.match(
  serviceWorker,
  /request\.mode\s*===\s*['"]navigate['"]/
);

// Solicitud a la red.
assert.match(
  serviceWorker,
  /fetch\(request\)/
);

// Consulta de la caché cuando falla la red.
assert.match(
  serviceWorker,
  /caches\.match\(request\)/
);

// Fallback hacia la ruta principal.
assert.match(
  serviceWorker,
  /caches\.match\(['"]\/['"]\)/
);

// ============================================================
// CACHE FIRST
// ============================================================

// Buscar primero en caché.
assert.match(
  serviceWorker,
  /caches\.match\(request\)/
);

// Comprobar si existe una respuesta almacenada.
assert.match(
  serviceWorker,
  /if\s*\(cachedResponse\)/
);

// ============================================================
// VALIDACIÓN DE RESPUESTAS
// ============================================================

// La respuesta debe tener estado HTTP 200.
assert.match(
  serviceWorker,
  /response\.status\s*!==\s*200/
);

// La respuesta debe ser de tipo basic.
assert.match(
  serviceWorker,
  /response\.type\s*!==\s*['"]basic['"]/
);

// ============================================================
// CACHÉ DINÁMICA
// ============================================================

// Apertura de la caché dinámica.
assert.match(
  serviceWorker,
  /caches\s*\.open\(DYNAMIC_CACHE_NAME\)/
);

// Guardar la respuesta en caché.
assert.match(
  serviceWorker,
  /cache\.put\(request,\s*responseToCache\)/
);

// ============================================================
// FALLBACK OFFLINE
// ============================================================

// Crear una respuesta cuando no hay red
// y tampoco existe el recurso en caché.
assert.match(
  serviceWorker,
  /new Response\(\s*['"]Recurso no disponible sin conexión\./
);

// Código HTTP 503.
assert.match(
  serviceWorker,
  /status:\s*503/
);

// ============================================================
// RESULTADO
// ============================================================

console.log("service-worker.spec.ts: PASS");