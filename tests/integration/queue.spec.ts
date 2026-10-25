import assert from "node:assert/strict";
import { test } from "node:test";
import { SyncQueue } from "../../src/lib/sync/queue";
import { createBrowserStorage, createInspection, createRemoteHandler } from "./fixtures";

// Los casos se ejecutan en serie porque simulan window dentro del proceso.
test("integracion: guardar offline y recuperar el payload completo al recargar", () => {
  const browser = createBrowserStorage();
  try {
    const inspection = createInspection();
    const queue = new SyncQueue();
    assert.deepEqual(queue.getAll(), []);
    assert.equal(window.navigator.onLine, false);
    const saved = queue.enqueue(inspection);
    const snapshot = JSON.parse(JSON.stringify(saved));

    browser.reload();
    const reloaded = new SyncQueue();
    const recovered = reloaded.getById(saved.id);
    assert.notStrictEqual(recovered, saved);
    assert.notStrictEqual(recovered?.payload, inspection);
    assert.deepEqual(recovered, snapshot);
    assert.deepEqual(recovered?.payload, inspection);
    assert.equal(recovered?.status, "pending");
    assert.equal(recovered?.retryCount, 0);
    assert.deepEqual(reloaded.getPending(), [recovered]);
    assert.equal(reloaded.getAll().length, 1);
    assert.equal(window.navigator.onLine, false);
  } finally {
    browser.dispose();
  }
});

for (const [name, outcome] of [
  ["respuesta fallida", false],
  ["excepcion de transporte", new Error("Fallo de red sintetico")]
] as const) {
  test(`integracion: ${name} conserva la operacion para reintento tras recargar`, async () => {
    const browser = createBrowserStorage();
    try {
      const queue = new SyncQueue();
      assert.deepEqual(queue.getAll(), []);
      const inspection = createInspection();
      const saved = queue.enqueue(inspection);
      const remote = createRemoteHandler(outcome);
      const result = await queue.processQueue(remote.handler);
      assert.deepEqual(result.processed, []);
      assert.equal(result.failed.length, 1);
      assert.equal(remote.attempts.length, 1);
      assert.deepEqual(remote.records, []);

      browser.reload();
      const reloaded = new SyncQueue();
      const failed = reloaded.getById(saved.id);
      assert.ok(failed);
      assert.equal(failed.status, "failed");
      assert.equal(failed.retryCount, 1);
      assert.ok(Number.isFinite(Date.parse(failed.lastAttemptAt ?? "")));
      assert.ok(failed.errorMessage);
      if (outcome instanceof Error) assert.equal(failed.errorMessage, outcome.message);
      assert.equal(failed.idempotencyKey, saved.idempotencyKey);
      assert.equal(failed.createdAt, saved.createdAt);
      assert.deepEqual(failed.payload, inspection);
      assert.deepEqual(reloaded.getPending(), [failed]);
      assert.equal(reloaded.getAll().length, 1);
    } finally {
      browser.dispose();
    }
  });
}

test("integracion: respuesta exitosa persiste processed y retira el pendiente", async () => {
  const browser = createBrowserStorage();
  try {
    const queue = new SyncQueue();
    assert.deepEqual(queue.getAll(), []);
    const inspection = createInspection();
    const saved = queue.enqueue(inspection);
    const remote = createRemoteHandler(true);
    const result = await queue.processQueue(remote.handler);
    assert.deepEqual(result.failed, []);
    assert.equal(result.processed.length, 1);
    assert.deepEqual(remote.records, [inspection]);
    assert.equal(remote.attempts.length, 1);

    browser.reload();
    const reloaded = new SyncQueue();
    const processed = reloaded.getById(saved.id);
    assert.ok(processed);
    assert.equal(processed.status, "processed");
    assert.equal(processed.retryCount, 1);
    assert.ok(Number.isFinite(Date.parse(processed.lastAttemptAt ?? "")));
    assert.equal(processed.errorMessage, undefined);
    assert.deepEqual(processed.payload, inspection);
    assert.deepEqual(reloaded.getPending(), []);
    assert.equal(reloaded.getAll().length, 1);
  } finally {
    browser.dispose();
  }
});

for (const duplicateBy of ["id", "idempotencyKey"] as const) {
  test(`integracion: fallo, recarga y reintento por ${duplicateBy} sin duplicar`, async () => {
    const browser = createBrowserStorage();
    try {
      const queue = new SyncQueue();
      assert.deepEqual(queue.getAll(), []);
      const inspection = createInspection();
      const options = { id: "op-integration-008", idempotencyKey: "idem-integration-008" };
      const saved = queue.enqueue(inspection, "CREATE_INSPECTION", options);
      const original = JSON.parse(JSON.stringify(saved));
      const remote = createRemoteHandler(false, true);
      await queue.processQueue(remote.handler);

      browser.reload();
      const reloaded = new SyncQueue();
      assert.equal(reloaded.getById(saved.id)?.status, "failed");
      // Cambiar el otro identificador comprueba ambas protecciones por separado.
      const duplicateOptions = duplicateBy === "id"
        ? { ...options, idempotencyKey: "otra-clave-sintetica" }
        : { ...options, id: "otra-operacion-sintetica" };
      const repeated = reloaded.enqueue(inspection, "CREATE_INSPECTION", duplicateOptions);
      assert.equal(repeated.id, original.id);
      assert.equal(repeated.idempotencyKey, original.idempotencyKey);
      assert.equal(repeated.createdAt, original.createdAt);
      assert.equal(reloaded.getAll().length, 1);

      const retry = await reloaded.processQueue(remote.handler);
      assert.equal(retry.processed.length, 1);
      assert.deepEqual(retry.failed, []);
      assert.equal(remote.attempts.length, 2);
      for (const attempt of remote.attempts) {
        assert.equal(attempt.id, original.id);
        assert.equal(attempt.idempotencyKey, original.idempotencyKey);
        assert.equal(attempt.createdAt, original.createdAt);
        assert.deepEqual(attempt.payload, inspection);
      }
      assert.deepEqual(remote.records, [inspection]);

      browser.reload();
      const confirmed = new SyncQueue();
      const processed = confirmed.enqueue(inspection, "CREATE_INSPECTION", duplicateOptions);
      assert.equal(processed.id, original.id);
      assert.equal(processed.status, "processed");
      assert.equal(processed.retryCount, 2);
      assert.equal(processed.errorMessage, undefined);
      assert.equal(confirmed.getAll().length, 1);
      assert.deepEqual(confirmed.getPending(), []);
      assert.deepEqual(await confirmed.processQueue(remote.handler), { processed: [], failed: [] });
      assert.equal(remote.attempts.length, 2, "Una operacion confirmada no se vuelve a enviar");
      assert.deepEqual(remote.records, [inspection]);
    } finally {
      browser.dispose();
    }
  });
}
