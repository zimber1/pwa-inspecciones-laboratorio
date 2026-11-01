import { expect, test } from "@playwright/test";

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
