import { expect, test } from "@playwright/test";

test("seguridad: las páginas entregan las cabeceras de endurecimiento", async ({
  request,
}) => {
  const response = await request.get("/");

  expect(response.status()).toBe(200);
  const headers = response.headers();
  const policy = headers["content-security-policy"];

  expect(policy).toContain("default-src 'self'");
  expect(policy).toContain("frame-ancestors 'none'");
  expect(policy).toContain("object-src 'none'");
  expect(policy).toContain("'unsafe-eval'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=(self)");
  expect(headers["permissions-policy"]).toContain("geolocation=(self)");
});

test("seguridad: robots.txt se sirve con la regla configurada", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/text\/plain/i);

  const robots = await response.text();
  expect(robots).toMatch(/^User-agent:\s*\*\s*$/m);
  expect(robots).toMatch(/^Disallow:\s*\/\s*$/m);
});
