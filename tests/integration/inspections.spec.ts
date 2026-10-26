import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createLocalInspection,
  InspectionCreationError,
  InspectionValidationError,
  loadUserInspections,
  type NewInspectionInput
} from "../../src/lib/data/create-inspection";
import { readLocalInspections } from "../../src/lib/storage/inspections";
import type { SyncOperation } from "../../src/lib/storage/schema";
import { subscribeToConnectivity } from "../../src/lib/sync/connectivity";
import { SyncQueue } from "../../src/lib/sync/queue";

const validInput: NewInspectionInput = {
  location: "Laboratorio sintético de integración",
  date: "2026-10-24",
  inspector: "Responsable de prueba",
  status: "attention",
  findings: 2,
  summary: "Registro sintético para probar persistencia y sincronización."
};

test("integración: crea una inspección válida, la persiste y la encola una vez", () => {
  const browser = createBrowser();
  try {
    const queue = new SyncQueue();
    const inspection = createLocalInspection(validInput, queue);
    const operation = queue.getAll()[0];

    assert.equal(inspection.location, validInput.location);
    assert.equal(inspection.statusLabel, "Requiere atención");
    assert.equal(inspection.isOfflineCreated, true);
    assert.deepEqual(readLocalInspections(), [inspection]);
    assert.equal(operation.action, "CREATE_INSPECTION");
    assert.equal(operation.payload.id, inspection.id);
    assert.equal(operation.idempotencyKey, `idem-CREATE_INSPECTION-${inspection.id}`);
    assert.equal(operation.status, "pending");
  } finally {
    browser.dispose();
  }
});

test("integración: rechaza datos inválidos antes de guardar o encolar", () => {
  const browser = createBrowser();
  try {
    const queue = new SyncQueue();
    assert.throws(
      () => createLocalInspection({ ...validInput, date: "fecha inválida" }, queue),
      InspectionValidationError
    );
    assert.deepEqual(readLocalInspections(), []);
    assert.deepEqual(queue.getAll(), []);
  } finally {
    browser.dispose();
  }
});

test("integración: informa fallos de escritura y recupera la cola desde el registro local", () => {
  const browser = createBrowser();
  try {
    const queue = new SyncQueue();
    browser.failWritesTo("pwa-inspecciones-sync-queue");

    assert.throws(
      () => createLocalInspection(validInput, queue),
      InspectionCreationError
    );
    const locallySaved = readLocalInspections();
    assert.equal(locallySaved.length, 1);
    assert.deepEqual(queue.getAll(), []);

    browser.failWritesTo(undefined);
    assert.deepEqual(loadUserInspections(queue), locallySaved);
    assert.equal(queue.getAll().length, 1);
    assert.equal(queue.getAll()[0].payload.id, locallySaved[0].id);
    assert.deepEqual(loadUserInspections(queue), locallySaved);
    assert.equal(queue.getAll().length, 1, "La recuperación repetida no debe duplicar la operación");
    assert.equal(queue.getAll()[0].id, `create-${locallySaved[0].id}`);
    assert.equal(
      queue.getAll()[0].idempotencyKey,
      `idem-CREATE_INSPECTION-${locallySaved[0].id}`
    );
  } finally {
    browser.dispose();
  }
});

test("integración: recupera inspecciones y operaciones al recargar sin duplicarlas", () => {
  const browser = createBrowser();
  try {
    const originalQueue = new SyncQueue();
    const saved = createLocalInspection(validInput, originalQueue);

    browser.reload();
    const restoredQueue = new SyncQueue();
    const restoredInspections = loadUserInspections(restoredQueue);
    const secondRead = loadUserInspections(restoredQueue);

    assert.deepEqual(restoredInspections, [saved]);
    assert.deepEqual(secondRead, [saved]);
    assert.deepEqual(readLocalInspections(), [saved]);
    assert.equal(restoredQueue.getAll().length, 1);
    assert.equal(restoredQueue.getAll()[0].idempotencyKey, `idem-CREATE_INSPECTION-${saved.id}`);
  } finally {
    browser.dispose();
  }
});

test("integración: conserva pendientes offline y procesa al recuperar conexión", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    const inspection = createLocalInspection(validInput, queue);
    let attempts = 0;
    let resolveResult!: (result: {
      processed: SyncOperation[];
      failed: SyncOperation[];
    }) => void;
    let rejectResult!: (error: unknown) => void;
    const resultPromise = new Promise<{
      processed: SyncOperation[];
      failed: SyncOperation[];
    }>((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = reject;
    });
    const stop = subscribeToConnectivity(
      queue,
      async (operation) => {
        attempts += 1;
        assert.equal(operation.action, "CREATE_INSPECTION");
        return true;
      },
      {
        onConnectionChange: () => undefined,
        onSyncResult: resolveResult,
        onError: rejectResult
      }
    );

    assert.equal(attempts, 0);
    assert.equal(queue.getPending().length, 1);
    browser.setOnline(true);
    const result = await resultPromise;
    stop();

    assert.equal(attempts, 1);
    assert.equal(result.processed.length, 1);
    assert.equal(result.failed.length, 0);
    assert.equal(queue.getById(`create-${inspection.id}`)?.status, "processed");
  } finally {
    browser.dispose();
  }
});

test("integración: no consume reintentos cuando no hay handler remoto configurado", async () => {
  const browser = createBrowser(true);
  try {
    const queue = new SyncQueue();
    const inspection = createLocalInspection(validInput, queue);
    let online = false;
    let syncResults = 0;
    const stop = subscribeToConnectivity(queue, undefined, {
      onConnectionChange: (isOnline) => {
        online = isOnline;
      },
      onSyncResult: () => {
        syncResults += 1;
      },
      onError: (error) => {
        throw error;
      }
    });

    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(online, true);
    assert.equal(syncResults, 0);
    assert.equal(queue.getById(`create-${inspection.id}`)?.status, "pending");
    assert.equal(queue.getById(`create-${inspection.id}`)?.retryCount, 0);

    browser.setOnline(false);
    browser.setOnline(true);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(syncResults, 0);
    assert.equal(queue.getById(`create-${inspection.id}`)?.status, "pending");
    assert.equal(queue.getById(`create-${inspection.id}`)?.retryCount, 0);
    stop();
  } finally {
    browser.dispose();
  }
});

test("integración: conserva la operación cuando falla el transporte", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    const inspection = createLocalInspection(validInput, queue);
    let resolveResult!: (result: {
      processed: SyncOperation[];
      failed: SyncOperation[];
    }) => void;
    let rejectResult!: (error: unknown) => void;
    const resultPromise = new Promise<{
      processed: SyncOperation[];
      failed: SyncOperation[];
    }>((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = reject;
    });
    const stop = subscribeToConnectivity(
      queue,
      async () => {
        throw new Error("Fallo de transporte sintético");
      },
      {
        onConnectionChange: () => undefined,
        onSyncResult: resolveResult,
        onError: rejectResult
      }
    );

    browser.setOnline(true);
    const result = await resultPromise;
    stop();

    const failedOperation = queue.getById(`create-${inspection.id}`);
    assert.equal(result.failed.length, 1);
    assert.equal(result.processed.length, 0);
    assert.equal(failedOperation?.status, "failed");
    assert.equal(failedOperation?.errorMessage, "Fallo de transporte sintético");
    assert.equal(queue.getPending().length, 1);
    assert.equal(readLocalInspections()[0].id, inspection.id);
  } finally {
    browser.dispose();
  }
});

test("integración: SyncQueue comparte el procesamiento en llamadas concurrentes", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    createLocalInspection(validInput, queue);
    let attempts = 0;
    let finishAttempt!: (success: boolean) => void;
    const handler = () => {
      attempts += 1;
      return new Promise<boolean>((resolve) => {
        finishAttempt = resolve;
      });
    };

    const first = queue.processQueue(handler);
    const second = queue.processQueue(handler);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(attempts, 1);

    finishAttempt(true);
    const [firstResult, secondResult] = await Promise.all([first, second]);
    assert.equal(attempts, 1);
    assert.equal(firstResult.processed.length, 1);
    assert.deepEqual(secondResult, firstResult);
  } finally {
    browser.dispose();
  }
});

test("integración: restaura estado y payload si falla persistir el resultado del handler", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    createLocalInspection(validInput, queue);
    const original = JSON.parse(JSON.stringify(queue.getAll()[0]));
    browser.failWritesTo("pwa-inspecciones-sync-queue");

    let handlerCalls = 0;
    let duplicateHandlerCalls = 0;
    const first = queue.processQueue(async (operation) => {
      handlerCalls += 1;
      operation.payload.location = "Mutación del handler que no debe afectar el original";
      return true;
    });
    const second = queue.processQueue(async () => {
      duplicateHandlerCalls += 1;
      return true;
    });
    await Promise.all([
      assert.rejects(first, /No se pudo guardar la cola local/),
      assert.rejects(second, /No se pudo guardar la cola local/)
    ]);

    assert.equal(handlerCalls, 1);
    assert.equal(duplicateHandlerCalls, 0);
    assert.deepEqual(queue.getAll()[0], original);
    assert.equal(queue.getById(original.id)?.status, "pending");
    assert.equal(queue.getById(original.id)?.retryCount, 0);

    browser.failWritesTo(undefined);
    const retry = await queue.processQueue(async () => true);
    assert.equal(retry.processed.length, 1);
    assert.equal(queue.getById(original.id)?.payload.location, validInput.location);
    assert.equal(queue.getById(original.id)?.retryCount, 1);
  } finally {
    browser.dispose();
  }
});

test("integración: conserva los intentos agotados para diagnóstico sin reintentos automáticos", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    createLocalInspection(validInput, queue);
    const original = queue.getAll()[0];
    queue.clear();
    queue.enqueue(original.payload, original.action, {
      id: original.id,
      idempotencyKey: original.idempotencyKey,
      maxRetries: 2
    });

    let attempts = 0;
    await queue.processQueue(async () => {
      attempts += 1;
      return false;
    });
    await queue.processQueue(async () => {
      attempts += 1;
      return false;
    });

    const exhausted = queue.getExhausted();
    assert.equal(attempts, 2);
    assert.equal(queue.getPending().length, 0);
    assert.equal(exhausted.length, 1);
    assert.equal(exhausted[0].status, "failed");
    assert.equal(exhausted[0].retryCount, 2);
    assert.equal(exhausted[0].errorMessage, "Error durante el intento de sincronización");

    browser.reload();
    const recoveredQueue = new SyncQueue();
    assert.deepEqual(recoveredQueue.getExhausted(), exhausted);
    assert.equal(recoveredQueue.getAll().length, 1);
    assert.deepEqual(
      await recoveredQueue.processQueue(async () => {
        attempts += 1;
        return true;
      }),
      { processed: [], failed: [] }
    );
    assert.equal(attempts, 2, "Una operación agotada no debe ejecutarse otra vez automáticamente");
    assert.deepEqual(recoveredQueue.getExhausted(), exhausted);
  } finally {
    browser.dispose();
  }
});

test("integración: desuscribirse limpia los listeners de conectividad", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    createLocalInspection(validInput, queue);
    let attempts = 0;
    const stop = subscribeToConnectivity(
      queue,
      async () => {
        attempts += 1;
        return true;
      },
      {
        onConnectionChange: () => undefined,
        onSyncResult: () => undefined,
        onError: (error) => {
          throw error;
        }
      }
    );

    stop();
    browser.setOnline(true);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(attempts, 0);
    assert.equal(queue.getPending().length, 1);
  } finally {
    browser.dispose();
  }
});

test("integración: serializa ejecuciones concurrentes, respeta reintentos y limpia listeners", async () => {
  const browser = createBrowser(false);
  try {
    const queue = new SyncQueue();
    const inspection = createLocalInspection(validInput, queue);
    const operation = queue.getAll()[0];
    queue.clear();
    queue.enqueue(operation.payload, operation.action, {
      id: operation.id,
      idempotencyKey: operation.idempotencyKey,
      maxRetries: 1
    });

    let attempts = 0;
    let finishAttempt!: (success: boolean) => void;
    let resolveResult!: (result: {
      processed: SyncOperation[];
      failed: SyncOperation[];
    }) => void;
    let rejectResult!: (error: unknown) => void;
    const resultPromise = new Promise<{
      processed: SyncOperation[];
      failed: SyncOperation[];
    }>((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = reject;
    });
    const stop = subscribeToConnectivity(
      queue,
      () => {
        attempts += 1;
        return new Promise<boolean>((resolve) => {
          finishAttempt = resolve;
        });
      },
      {
        onConnectionChange: () => undefined,
        onSyncResult: resolveResult,
        onError: rejectResult
      }
    );

    browser.setOnline(true);
    await new Promise((resolve) => setImmediate(resolve));
    browser.setOnline(true);
    assert.equal(attempts, 1);

    finishAttempt(false);
    await resultPromise;
    browser.setOnline(true);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(attempts, 1, "No debe exceder maxRetries");

    stop();
    browser.setOnline(false);
    browser.setOnline(true);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(attempts, 1, "Los listeners no deben continuar activos después de limpiarlos");
    assert.equal(queue.getById(operation.id)?.status, "failed");
    assert.equal(queue.getById(operation.id)?.retryCount, 1);
    assert.ok(inspection.id);
  } finally {
    browser.dispose();
  }
});

function createBrowser(initiallyOnline = false) {
  const storage = new Map<string, string>();
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const listeners = new Map<string, Set<() => void>>();
  let online = initiallyOnline;
  let failingWriteKey: string | undefined;

  const install = () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        get navigator() {
          return { onLine: online };
        },
        localStorage: {
          getItem: (key: string) => storage.get(key) ?? null,
          setItem: (key: string, value: string) => {
            if (key === failingWriteKey) throw new Error("Fallo de escritura simulado");
            storage.set(key, value);
          }
        },
        addEventListener: (event: string, listener: () => void) => {
          const current = listeners.get(event) ?? new Set();
          current.add(listener);
          listeners.set(event, current);
        },
        removeEventListener: (event: string, listener: () => void) => {
          listeners.get(event)?.delete(listener);
        }
      }
    });
  };

  const dispatch = (event: string) => {
    for (const listener of listeners.get(event) ?? []) listener();
  };

  install();
  return {
    reload: install,
    failWritesTo(key: string | undefined) {
      failingWriteKey = key;
    },
    setOnline(value: boolean) {
      online = value;
      dispatch(value ? "online" : "offline");
    },
    dispose() {
      storage.clear();
      listeners.clear();
      if (originalWindow) {
        Object.defineProperty(globalThis, "window", originalWindow);
      } else {
        Reflect.deleteProperty(globalThis, "window");
      }
    }
  };
}
