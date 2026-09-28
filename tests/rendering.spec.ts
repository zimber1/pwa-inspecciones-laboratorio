import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const readText = (path: string) =>
  readFileSync(resolve(root, path), "utf8");

const csrPagePath = "src/app/inspecciones/page.tsx";
const ssrPagePath = "src/app/inspecciones/[id]/page.tsx";
const loadingPath = "src/app/inspecciones/[id]/loading.tsx";
const notFoundPath = "src/app/inspecciones/[id]/not-found.tsx";
const loadingStatePath = "src/components/loading-state.tsx";

assert.equal(
  existsSync(resolve(root, csrPagePath)),
  true,
  "Debe existir la ruta CSR de inspecciones"
);

assert.equal(
  existsSync(resolve(root, ssrPagePath)),
  true,
  "Debe existir la ruta SSR de detalle"
);

assert.equal(
  existsSync(resolve(root, loadingPath)),
  true,
  "Debe existir el loading de la ruta dinámica"
);

assert.equal(
  existsSync(resolve(root, notFoundPath)),
  true,
  "Debe existir el not-found de la ruta dinámica"
);

assert.equal(
  existsSync(resolve(root, loadingStatePath)),
  true,
  "Debe existir el componente LoadingState"
);

const csrPage = readText(csrPagePath);
const ssrPage = readText(ssrPagePath);
const loading = readText(loadingPath);
const notFound = readText(notFoundPath);
const loadingState = readText(loadingStatePath);

//
// CSR — listado de inspecciones
//

assert.match(
  csrPage,
  /^["']use client["'];/m,
  "La ruta /inspecciones debe ser un Client Component"
);

assert.match(
  csrPage,
  /useEffect/,
  "La ruta CSR debe utilizar useEffect para cargar los datos en el navegador"
);

assert.match(
  csrPage,
  /useState/,
  "La ruta CSR debe utilizar estado del cliente"
);

assert.match(
  csrPage,
  /@\/lib\/data\/inspections/,
  "La ruta CSR debe utilizar los datos sintéticos del proyecto"
);

assert.match(
  csrPage,
  /type LoadState = ["']loading["'] \| ["']ready["'] \| ["']error["']/,
  "La ruta CSR debe declarar los estados loading, ready y error"
);

assert.match(
  csrPage,
  /Cargando listado CSR/,
  "Debe existir el estado de carga del listado CSR"
);

assert.match(
  csrPage,
  /No se pudo cargar el listado/,
  "Debe existir el estado de error del listado CSR"
);

assert.match(
  csrPage,
  /Reintentar/,
  "El estado de error debe permitir reintentar"
);

assert.match(
  csrPage,
  /Refrescar datos/,
  "El listado CSR debe permitir refrescar los datos"
);

assert.match(
  csrPage,
  /Ver con hallazgos/,
  "El listado CSR debe permitir filtrar inspecciones con hallazgos"
);

assert.match(
  csrPage,
  /Simular error/,
  "El listado CSR debe permitir comprobar el estado de error"
);

//
// SSR — detalle de inspección
//

assert.doesNotMatch(
  ssrPage,
  /^["']use client["'];/m,
  "La ruta de detalle no debe convertirse en Client Component"
);

assert.match(
  ssrPage,
  /export default async function/,
  "La ruta de detalle debe ser un Server Component asíncrono"
);

assert.match(
  ssrPage,
  /params:\s*\{\s*id:\s*string\s*\}/,
  "La ruta SSR debe recibir el identificador dinámico"
);

assert.match(
  ssrPage,
  /params\.id/,
  "La ruta SSR debe utilizar el identificador recibido"
);

assert.match(
  ssrPage,
  /notFound\(\)/,
  "La ruta SSR debe manejar identificadores inexistentes con notFound()"
);

assert.match(
  ssrPage,
  /mockDatabase/,
  "El detalle SSR debe utilizar datos sintéticos"
);

assert.match(
  ssrPage,
  /setTimeout\(resolve,\s*1500\)/,
  "El detalle SSR debe conservar la latencia sintética definida para demostrar loading"
);

assert.match(
  ssrPage,
  /Renderizado en el servidor \(SSR\)/,
  "El detalle debe identificar explícitamente su estrategia SSR"
);

//
// Loading de la ruta dinámica
//

assert.match(
  loading,
  /LoadingState/,
  "loading.tsx debe reutilizar LoadingState"
);

assert.match(
  loading,
  /@\/components\/loading-state/,
  "loading.tsx debe importar el componente LoadingState"
);

assert.match(
  loadingState,
  /Cargando detalles de inspecci/,
  "LoadingState debe mostrar un mensaje de carga"
);

assert.match(
  loadingState,
  /Obteniendo informaci/,
  "LoadingState debe indicar que obtiene información del servidor"
);

//
// Estado not-found
//

assert.match(
  notFound,
  /Inspecci.*no encontrada/,
  "not-found.tsx debe informar que la inspección no existe"
);

assert.match(
  notFound,
  /href=["']\/inspecciones["']/,
  "not-found.tsx debe permitir regresar al listado"
);

//
// Resultado
//

console.log("rendering.spec.ts: PASS");