import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const serviceWorker = readFileSync(
  resolve(root, "public/sw.js"),
  "utf8"
);

// ============================================================
// NETWORK FIRST
// ============================================================

// La estrategia Network First debe estar documentada.
assert.match(
  serviceWorker,
  /Network First/i,
  "Debe documentarse la estrategia Network First"
);

// La navegación debe identificarse mediante request.mode.
assert.match(
  serviceWorker,
  /request\.mode\s*===\s*['"]navigate['"]/,
  "La navegación debe identificarse mediante request.mode"
);

// La navegación debe intentar primero la red
// y consultar la caché cuando falla.
assert.match(
  serviceWorker,
  /fetch\(request\)[\s\S]*?\.catch\(\(\)\s*=>\s*\{[\s\S]*?caches\.match\(request\)/,
  "La navegación debe consultar la caché cuando falla la red"
);

// Debe existir fallback hacia la ruta principal.
assert.match(
  serviceWorker,
  /cachedResponse\s*\|\|\s*caches\.match\(['"]\/['"]\)/,
  "Debe existir fallback hacia la ruta principal"
);

// ============================================================
// CACHE FIRST
// ============================================================

// La estrategia Cache First debe estar documentada.
assert.match(
  serviceWorker,
  /Cache First/i,
  "Debe documentarse la estrategia Cache First"
);

// Los recursos deben buscarse primero en caché.
assert.match(
  serviceWorker,
  /caches\.match\(request\)[\s\S]*?if\s*\(cachedResponse\)/,
  "Los recursos deben buscarse primero en caché"
);

// Si no existe en caché, debe utilizarse la red.
assert.match(
  serviceWorker,
  /if\s*\(cachedResponse\)[\s\S]*?return\s+fetch\(request\)/,
  "Debe existir fallback hacia la red para recursos no cacheados"
);

// ============================================================
// VALIDACIÓN DE RESPUESTAS
// ============================================================

// Solo deben almacenarse respuestas HTTP 200.
assert.match(
  serviceWorker,
  /response\.status\s*!==\s*200/,
  "Debe validarse el estado HTTP antes de almacenar la respuesta"
);

// Solo deben almacenarse respuestas de tipo basic.
assert.match(
  serviceWorker,
  /response\.type\s*!==\s*['"]basic['"]/,
  "Debe validarse el tipo de respuesta antes de almacenarla"
);

// ============================================================
// CACHÉ DINÁMICA
// ============================================================

// Debe utilizarse la caché dinámica.
// \s* permite saltos de línea entre caches y .open().
assert.match(
  serviceWorker,
  /caches\s*\.open\(DYNAMIC_CACHE_NAME\)/,
  "Debe utilizarse la caché dinámica"
);

// La respuesta válida debe almacenarse en caché.
assert.match(
  serviceWorker,
  /cache\.put\(request,\s*responseToCache\)/,
  "La respuesta válida debe almacenarse en caché"
);

// ============================================================
// PETICIONES GET
// ============================================================

// Las peticiones que no sean GET no deben ser interceptadas.
assert.match(
  serviceWorker,
  /if\s*\(\s*request\.method\s*!==\s*['"]GET['"]\s*\)\s*\{\s*return\s*;\s*\}/,
  "Las peticiones que no sean GET no deben ser interceptadas"
);

// ============================================================
// FALLBACK OFFLINE
// ============================================================

// Debe existir una respuesta controlada cuando no hay
// conexión ni una copia disponible en caché.
assert.match(
  serviceWorker,
  /new Response\(\s*['"]Recurso no disponible sin conexión\./,
  "Debe existir un fallback para recursos no disponibles"
);

// El fallback debe devolver HTTP 503.
assert.match(
  serviceWorker,
  /status:\s*503/,
  "El fallback offline debe utilizar estado HTTP 503"
);

// ============================================================
// RESULTADO
// ============================================================

console.log("offline.spec.ts: PASS");