import assert from "node:assert/strict";
import { SyncQueue } from "../src/lib/sync/queue";
import type { LocalInspection } from "../src/lib/storage/schema";

async function main() {
  console.log("Ejecutando pruebas unitarias para SyncQueue...");

  const sampleInspection: LocalInspection = {
    id: "INS-TEST-001",
    location: "Laboratorio de Inteligencia Artificial",
    date: "2026-10-03",
    inspector: "Felix",
    status: "ok",
    statusLabel: "Sin incidencias",
    findings: 0,
    summary: "Inspección de prueba sintética para cola offline."
  };

  const queue = new SyncQueue();

  // ============================================================
  // TEST 1: AGREGAR OPERACIÓN A LA COLA
  // ============================================================
  const op1 = queue.enqueue(sampleInspection, "CREATE_INSPECTION", {
    idempotencyKey: "idem-key-001"
  });

  assert.equal(op1.status, "pending", "La operación recién agregada debe tener estado 'pending'");
  assert.equal(op1.retryCount, 0, "El contador inicial de reintentos debe ser 0");
  assert.equal(op1.payload.id, "INS-TEST-001", "El payload debe contener los datos de la inspección");

  // ============================================================
  // TEST 2: RECUPERAR PENDIENTES
  // ============================================================
  const pendingOps = queue.getPending();
  assert.equal(pendingOps.length, 1, "Debe haber 1 operación pendiente registrada");
  assert.equal(pendingOps[0].id, op1.id, "La operación pendiente debe coincidir con op1");

  // ============================================================
  // TEST 3: PREVENCIÓN DE DUPLICADOS (IDEMPOTENCIA)
  // ============================================================
  const op1Duplicate = queue.enqueue(sampleInspection, "CREATE_INSPECTION", {
    idempotencyKey: "idem-key-001"
  });

  assert.equal(
    op1Duplicate.id,
    op1.id,
    "Agregar una operación con la misma clave de idempotencia debe devolver la existente sin crear duplicados"
  );
  assert.equal(
    queue.getAll().length,
    1,
    "La cola debe seguir teniendo solo 1 registro único gracias a la idempotencia"
  );

  // ============================================================
  // TEST 4: CONSERVAR FALLO E INCREMENTAR REINTENTOS
  // ============================================================
  // Definir handler sintético que simula un fallo de red
  let attemptCounter = 0;
  const failingHandler = async () => {
    attemptCounter++;
    return false; // Simular fallo de sincronización
  };

  // Procesar cola con fallo
  const resultFail = await queue.processQueue(failingHandler);
  assert.equal(resultFail.processed.length, 0, "Ninguna operación debe marcarse como procesada en fallo");
  assert.equal(resultFail.failed.length, 1, "La operación fallida debe ser retornada en el grupo de fallidas");

  const failedOp = queue.getById(op1.id);
  assert.notEqual(failedOp, undefined, "La operación fallida debe permanecer persistida en la cola");
  assert.equal(failedOp?.status, "failed", "El estado de la operación debe actualizarse a 'failed'");
  assert.equal(failedOp?.retryCount, 1, "El contador de reintentos debe incrementarse a 1");
  assert.notEqual(failedOp?.lastAttemptAt, undefined, "Debe registrarse la fecha del último intento");

  // La operación fallida debe continuar disponible para reintento en getPending()
  assert.equal(queue.getPending().length, 1, "Una operación fallida debe permanecer disponible para reintentos");

  // ============================================================
  // TEST 5: PROCESAMIENTO EXITOSO
  // ============================================================
  // Definir handler sintético que simula éxito en la red
  const successHandler = async () => true;

  const resultSuccess = await queue.processQueue(successHandler);
  assert.equal(resultSuccess.processed.length, 1, "La operación debe procesarse exitosamente");

  const processedOp = queue.getById(op1.id);
  assert.equal(processedOp?.status, "processed", "El estado final de la operación debe ser 'processed'");
  assert.equal(processedOp?.retryCount, 2, "El contador de reintentos debe reflejar 2 intentos en total");
  assert.equal(queue.getPending().length, 0, "Ya no deben quedar operaciones pendientes en la cola");

  console.log("queue.spec.ts: PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
