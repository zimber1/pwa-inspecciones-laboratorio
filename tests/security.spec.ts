import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createSecurityHeaders } from "../src/lib/security/headers.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const headers = new Map(
  createSecurityHeaders(false).map(({ key, value }) => [
    key.toLowerCase(),
    value,
  ]),
);

function parseCsp(policy: string): Map<string, string[]> {
  return new Map(
    policy
      .split(";")
      .map((directive) => directive.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...sources]) => [name, sources] as const),
  );
}

test("CSP limita los recursos a orígenes permitidos y bloquea objetos/frames", () => {
  const policy = headers.get("content-security-policy");
  assert.ok(policy, "Debe configurarse Content-Security-Policy");

  const directives = parseCsp(policy);
  assert.deepEqual(directives.get("default-src"), ["'self'"]);
  assert.deepEqual(directives.get("base-uri"), ["'self'"]);
  assert.deepEqual(directives.get("object-src"), ["'none'"]);
  assert.deepEqual(directives.get("frame-ancestors"), ["'none'"]);
  assert.deepEqual(directives.get("form-action"), ["'self'"]);

  const allowedSources: Record<string, ReadonlySet<string>> = {
    "default-src": new Set(["'self'"]),
    "object-src": new Set(["'none'"]),
    "script-src": new Set(["'self'", "'unsafe-inline'"]),
    "style-src": new Set(["'self'", "'unsafe-inline'"]),
    "img-src": new Set(["'self'", "data:", "blob:"]),
    "font-src": new Set(["'self'"]),
    "connect-src": new Set(["'self'"]),
    "manifest-src": new Set(["'self'"]),
    "worker-src": new Set(["'self'"]),
    "media-src": new Set(["'self'", "blob:"]),
  };
  for (const [directive, sources] of directives) {
    if (directive.endsWith("-src")) {
      const allowed = allowedSources[directive];
      assert.ok(allowed, `No se definió una lista para ${directive}`);
      for (const source of sources) {
        assert.ok(
          allowed.has(source),
          `${directive} no debe permitir el origen ${source}`,
        );
      }
    }
  }
  assert.equal(policy.includes("'unsafe-eval'"), false);

  const developmentPolicy = createSecurityHeaders(true)
    .find(({ key }) => key === "Content-Security-Policy")
    ?.value;
  assert.ok(developmentPolicy?.includes("'unsafe-eval'"));
});

test("cabeceras HTTP adicionales aplican controles compatibles con la PWA", () => {
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(
    headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(
    headers.get("permissions-policy"),
    "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()",
  );
});

test("robots.txt existe y solicita no rastrear el prototipo", async () => {
  const robots = await readFile(resolve(root, "public/robots.txt"), "utf8");
  assert.match(robots, /^User-agent:\s*\*\s*$/m);
  assert.match(robots, /^Disallow:\s*\/\s*$/m);
});
