import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const readText = (path: string) =>
  readFileSync(resolve(root, path), "utf8");

const manifest = JSON.parse(
  readText("public/manifest.webmanifest")
) as {
  name?: string;
  short_name?: string;
  start_url?: string;
  scope?: string;
  display?: string;
  theme_color?: string;
  background_color?: string;
  icons?: Array<{
    src?: string;
    sizes?: string;
    type?: string;
    purpose?: string;
  }>;
};

assert.equal(manifest.name, "Inspecciones de laboratorio UTT");
assert.equal(manifest.short_name, "Inspecciones");
assert.equal(manifest.start_url, "/");
assert.equal(manifest.scope, "/");
assert.equal(manifest.display, "standalone");

assert.match(manifest.theme_color ?? "", /^#[0-9a-f]{6}$/i);
assert.match(manifest.background_color ?? "", /^#[0-9a-f]{6}$/i);

assert.ok(
  manifest.icons?.some(
    (icon) =>
      icon.sizes === "192x192" &&
      icon.src === "/icons/icon-192x192.png"
  )
);

assert.ok(
  manifest.icons?.some(
    (icon) =>
      icon.sizes === "512x512" &&
      icon.src === "/icons/icon-maskable-512x512.png" &&
      icon.purpose?.includes("maskable")
  )
);

for (const icon of manifest.icons ?? []) {
  assert.ok(icon.src, "Cada icono declara src");

  assert.equal(
    existsSync(resolve(root, `public${icon.src}`)),
    true,
    `Existe ${icon.src}`
  );
}

const layout = readText("src/app/layout.tsx");

assert.match(
  layout,
  /manifest:\s*"\/manifest\.webmanifest"/
);

assert.match(
  layout,
  /themeColor:\s*"#1f6f5b"/
);

const page = readText("src/app/page.tsx");

assert.match(
  page,
  /<AppShell inspections=\{inspections\} status="ready" \/>/
);

const appShell = readText("src/components/app-shell.tsx");

assert.match(
  appShell,
  /<nav className="primary-nav" aria-label="Navegacion principal">/
);

assert.match(
  appShell,
  /Inspecciones de laboratorio/
);

assert.match(
  appShell,
  /sinteticos/i
);

assert.match(
  appShell,
  /role="status"/
);

assert.match(
  appShell,
  /role="alert"/
);

assert.match(
  appShell,
  /Cargando inspecciones/
);

assert.match(
  appShell,
  /No se pudo cargar la lista/
);

assert.match(
  appShell,
  /Sin inspecciones por mostrar/
);

console.log("manifest.spec.ts: PASS");