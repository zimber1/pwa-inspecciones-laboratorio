import assert from "node:assert/strict";
import { SyncQueue } from "../../src/lib/sync/queue";
import {
  resolveInspectionConflict,
  type InspectionConflictVersion
} from "../../src/lib/sync/conflict-policy";
import type { LocalInspection } from "../../src/lib/storage/schema";

async function main() {
  console.log("Ejecutando pruebas unitarias de idempotencia (tests/unit/idempotency.spec.ts)...");

  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

  try {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: (key: string) => storage.get(key) ?? null,
          setItem: (key: string, value: string) => {
            storage.set(key, value);
          },
          removeItem: (key: string) => {
            storage.delete(key);
          }
        }
      }
    });

    const queue = new SyncQueue();
    queue.clear();

    const inspectionPayload: LocalInspection = {
      id: "INS-IDEM-001",
      location: "Laboratorio de Redes y Telecomunicaciones",
      date: "2026-10-22",
      inspector: "Felix Garcia",
      status: "attention",
      statusLabel: "Requiere atención",
      findings: 1,
      summary: "Conector RJ45 dañado en nodo 14.",
      version: 1,
      isOfflineCreated: true
    };

    // =========================================================================
    // 1. IDEMPOTENCIA POR CLAVE EXPLÍCITA (idempotencyKey)
    // =========================================================================
    const firstEnqueue = queue.enqueue(inspectionPayload, "CREATE_INSPECTION", {
      id: "op-idem-001",
      idempotencyKey: "idem-create-INS-IDEM-001"
    });

    const duplicateByKey = queue.enqueue(
      { ...inspectionPayload, summary: "Intento repetido con misma clave" },
      "CREATE_INSPECTION",
      {
        id: "op-idem-999",
        idempotencyKey: "idem-create-INS-IDEM-001"
      }
    );

    assert.equal(
      duplicateByKey.id,
      firstEnqueue.id,
      "Repetir enqueue con la misma idempotencyKey debe devolver la operación original"
    );
    assert.equal(
      duplicateByKey.payload.summary,
      "Conector RJ45 dañado en nodo 14.",
      "No debe sobrescribir ni duplicar el payload original ante un reintento idempotente"
    );
    assert.equal(
      queue.getAll().length,
      1,
      "La cola debe mantener exactamente 1 operación sin duplicados"
    );

    // =========================================================================
    // 2. IDEMPOTENCIA POR IDENTIFICADOR DE OPERACIÓN (id) Y CLAVE IMPLÍCITA
    // =========================================================================
    const duplicateById = queue.enqueue(inspectionPayload, "CREATE_INSPECTION", {
      id: "op-idem-001",
      idempotencyKey: "idem-otra-clave-distinta"
    });

    assert.equal(
      duplicateById.id,
      firstEnqueue.id,
      "Repetir enqueue con el mismo id de operación no debe crear un registro duplicado"
    );
    assert.equal(queue.getAll().length, 1);

    // Clave determinista generada por defecto: idem-${action}-${payload.id}
    const secondInspection: LocalInspection = {
      ...inspectionPayload,
      id: "INS-IDEM-002",
      location: "Laboratorio de IoT"
    };

    const autoKeyFirst = queue.enqueue(secondInspection, "CREATE_INSPECTION");
    const autoKeySecond = queue.enqueue(secondInspection, "CREATE_INSPECTION");

    assert.equal(autoKeyFirst.idempotencyKey, "idem-CREATE_INSPECTION-INS-IDEM-002");
    assert.equal(autoKeySecond.id, autoKeyFirst.id);
    assert.equal(
      queue.getAll().length,
      2,
      "Solo deben existir 2 operaciones únicas para las 2 inspecciones distintas"
    );

    // =========================================================================
    // 3. IDEMPOTENCIA DURANTE REINTENTOS Y RECUPERACIÓN DESDE LOCALSTORAGE
    // =========================================================================
    let processedIds: string[] = [];

    // Primer intento falla para todas las operaciones
    const firstAttempt = await queue.processQueue(async () => false);
    assert.equal(firstAttempt.failed.length, 2);
    assert.equal(firstAttempt.processed.length, 0);
    assert.equal(queue.getAll().length, 2, "Un fallo de red no debe duplicar entradas en la cola");

    // Recargar cola desde localStorage y reintentar la misma operación antes de sincronizar
    const reloadedQueue = new SyncQueue();
    const retryEnqueueAfterReload = reloadedQueue.enqueue(
      inspectionPayload,
      "CREATE_INSPECTION",
      {
        id: "op-idem-001",
        idempotencyKey: "idem-create-INS-IDEM-001"
      }
    );

    assert.equal(retryEnqueueAfterReload.id, "op-idem-001");
    assert.equal(retryEnqueueAfterReload.retryCount, 1);
    assert.equal(reloadedQueue.getAll().length, 2);

    // Segundo intento sincroniza con éxito
    const secondAttempt = await reloadedQueue.processQueue(async (op) => {
      processedIds.push(op.id);
      return true;
    });

    assert.equal(secondAttempt.processed.length, 2);
    assert.equal(secondAttempt.failed.length, 0);
    assert.deepEqual(processedIds, ["op-idem-001", "INS-IDEM-002"]);
    assert.equal(reloadedQueue.getPending().length, 0);

    // Un tercer llamado a processQueue no vuelve a ejecutar operaciones ya procesadas
    const thirdAttempt = await reloadedQueue.processQueue(async (op) => {
      processedIds.push(op.id);
      return true;
    });
    assert.equal(thirdAttempt.processed.length, 0);
    assert.equal(
      processedIds.length,
      2,
      "Las operaciones ya procesadas no deben re-ejecutarse en sincronizaciones posteriores"
    );

    // =========================================================================
    // 4. REGLA DE OPERACIÓN DUPLICADA EN POLÍTICA DE CONFLICTOS
    // =========================================================================
    const currentVersion: InspectionConflictVersion = Object.freeze({
      inspectionId: "INS-IDEM-001",
      version: 1,
      updatedAt: "2026-10-22T15:00:00.000Z",
      operationId: "op-idem-001",
      source: "local",
      payload: Object.freeze({ status: "attention", findings: 1 })
    });

    const repeatedSyncEcho: InspectionConflictVersion = Object.freeze({
      inspectionId: "INS-IDEM-001",
      version: 1,
      updatedAt: "2026-10-22T15:00:00.000Z",
      operationId: "op-idem-001",
      source: "sync-response",
      payload: Object.freeze({ status: "attention", findings: 1 })
    });

    const conflictDecision = resolveInspectionConflict(currentVersion, repeatedSyncEcho);
    assert.equal(conflictDecision.hasConflict, true);
    assert.equal(conflictDecision.applied, "current");
    assert.equal(conflictDecision.reason, "duplicate-operation");
    assert.equal(conflictDecision.winner, currentVersion);
    assert.equal(conflictDecision.discarded, repeatedSyncEcho);
    assert.ok(
      conflictDecision.trace.includes("decision:duplicate-operation:keep-current"),
      "La traza debe registrar explícitamente la decisión duplicate-operation:keep-current"
    );

    console.log("idempotency.spec.ts: PASS");
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
