
import { expect, test } from "@playwright/test";

test("crea una inspección sintética y la conserva al recargar", async ({
  page,
}) => {
  const location = "Laboratorio E2E sintético";

  await page.goto("/inspecciones");

  await expect(
    page.getByRole("heading", { name: "Crear inspección" }),
  ).toBeVisible();

  await page.getByLabel("Ubicación").fill(location);
  await page.getByLabel("Fecha").fill("2026-10-24");
  await page.getByLabel("Responsable").fill("Responsable E2E sintético");
  await page.locator('select[name="status"]').selectOption("attention");
  await page.getByLabel("Hallazgos").fill("2");
  await page
    .getByRole("textbox", { name: "Resumen", exact: true })
    .fill("Prueba E2E de persistencia local con datos sintéticos.");

  await page.getByRole("button", { name: "Guardar inspección" }).click();

  await expect(
    page.getByRole("status").filter({
      hasText: "Inspección guardada localmente",
    }),
  ).toBeVisible();

  await expect(
    page.locator(".inspection-card").filter({ hasText: location }),
  ).toBeVisible();

  await expect(
    page.getByText("Operación en cola con estado pendiente"),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.locator(".inspection-card").filter({ hasText: location }),
  ).toBeVisible();

  await expect(
    page.getByText("No hay backend remoto configurado.", { exact: false }),
  ).toBeVisible();
  const queueSummary = page.locator('dl[aria-label="Resumen de la cola local"]');
  await expect(queueSummary.locator("dd").nth(0)).toHaveText("1");
  await expect(queueSummary.locator("dd").nth(1)).toHaveText("0");
});
