import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const page = await readFile(resolve(root, "src/app/page.tsx"), "utf8");
const appShell = await readFile(resolve(root, "src/components/app-shell.tsx"), "utf8");

assert.equal(packageJson.scripts.build, "next build");
assert.match(page, /AppShell/);
assert.match(appShell, /Inspecciones de laboratorio/);
assert.match(appShell, /sinteticos/i);
console.log("starter.spec.mjs: PASS");
