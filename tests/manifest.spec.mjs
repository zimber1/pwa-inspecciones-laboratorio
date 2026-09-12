import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifestPath = resolve(root, "public/manifest.webmanifest");
const layoutPath = resolve(root, "src/app/layout.tsx");

// 1. Verificación de existencia del archivo
assert.ok(existsSync(manifestPath), "El archivo public/manifest.webmanifest debe existir.");

// 2. Lectura y parseo del archivo manifest
const rawContent = await readFile(manifestPath, "utf8");
let manifest;
try {
  manifest = JSON.parse(rawContent);
} catch (error) {
  assert.fail("El archivo public/manifest.webmanifest debe ser un JSON válido.");
}

// 3. Validación de propiedades principales y estructura obligatoria
assert.strictEqual(typeof manifest.name, "string", "La propiedad 'name' debe ser un string.");
assert.ok(manifest.name.length > 0, "La propiedad 'name' no debe estar vacía.");

assert.strictEqual(typeof manifest.short_name, "string", "La propiedad 'short_name' debe ser un string.");
assert.ok(manifest.short_name.length > 0, "La propiedad 'short_name' no debe estar vacía.");

assert.strictEqual(typeof manifest.description, "string", "La propiedad 'description' debe ser un string.");

assert.strictEqual(typeof manifest.start_url, "string", "La propiedad 'start_url' debe ser un string.");
assert.ok(manifest.start_url.startsWith("/"), "La propiedad 'start_url' debe iniciar con '/'.");

assert.strictEqual(typeof manifest.scope, "string", "La propiedad 'scope' debe ser un string.");
assert.ok(manifest.scope.startsWith("/"), "La propiedad 'scope' debe iniciar con '/'.");

assert.ok(manifest.id !== undefined, "La propiedad 'id' debe estar definida.");

const validDisplayModes = ["fullscreen", "standalone", "minimal-ui", "browser"];
assert.ok(validDisplayModes.includes(manifest.display), `La propiedad 'display' debe ser una de: ${validDisplayModes.join(", ")}`);

assert.strictEqual(typeof manifest.lang, "string", "La propiedad 'lang' debe ser un string.");
assert.strictEqual(manifest.lang, "es-MX", "La propiedad 'lang' debe ser 'es-MX'.");

assert.strictEqual(typeof manifest.dir, "string", "La propiedad 'dir' debe ser un string ('ltr' o 'rtl').");

assert.strictEqual(typeof manifest.theme_color, "string", "La propiedad 'theme_color' debe ser un string de color válido.");
assert.strictEqual(typeof manifest.background_color, "string", "La propiedad 'background_color' debe ser un string de color válido.");

assert.ok(Array.isArray(manifest.categories), "La propiedad 'categories' debe ser un arreglo.");

// 4. Validación del arreglo de iconos
assert.ok(Array.isArray(manifest.icons), "La propiedad 'icons' debe ser un arreglo.");
assert.ok(manifest.icons.length > 0, "La propiedad 'icons' debe contener al menos un icono.");

for (const icon of manifest.icons) {
  assert.strictEqual(typeof icon.src, "string", "Cada icono debe especificar 'src'.");
  assert.strictEqual(typeof icon.sizes, "string", "Cada icono debe especificar 'sizes'.");
  assert.strictEqual(typeof icon.type, "string", "Cada icono debe especificar 'type'.");
  
  // Verificar existencia física del archivo del icono en la carpeta public
  const iconRelativePath = icon.src.startsWith("/") ? icon.src.slice(1) : icon.src;
  const iconAbsolutePath = resolve(root, "public", iconRelativePath);
  assert.ok(
    existsSync(iconAbsolutePath),
    `El archivo del icono referenciado '${icon.src}' debe existir físicamente en public/`
  );
}

// 5. Validación de accesos directos (shortcuts) si existen
if (manifest.shortcuts) {
  assert.ok(Array.isArray(manifest.shortcuts), "La propiedad 'shortcuts' debe ser un arreglo.");
  for (const shortcut of manifest.shortcuts) {
    assert.strictEqual(typeof shortcut.name, "string", "Cada acceso directo debe tener un 'name'.");
    assert.strictEqual(typeof shortcut.url, "string", "Cada acceso directo debe tener una 'url'.");
  }
}

// 6. Integración con layout de Next.js
assert.ok(existsSync(layoutPath), "El archivo src/app/layout.tsx debe existir.");
const layoutContent = await readFile(layoutPath, "utf8");
assert.match(
  layoutContent,
  /manifest:\s*["']\/manifest\.webmanifest["']/,
  "El layout.tsx debe configurar manifest: '/manifest.webmanifest' en el objeto metadata."
);

console.log("manifest.spec.mjs: PASS");
