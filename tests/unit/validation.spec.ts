import assert from "node:assert/strict";
import {
  validateLocalInspection,
  type LocalInspection
} from "../../src/lib/storage/schema";
import {
  resolveInspectionConflict,
  type InspectionConflictVersion
} from "../../src/lib/sync/conflict-policy";

function main() {
  console.log("Ejecutando pruebas unitarias de validación (tests/unit/validation.spec.ts)...");

  // =========================================================================
  // 1. VALIDACIÓN DE CAPTURA DE INSPECCIÓN LOCAL (ENTRADAS VÁLIDAS)
  // =========================================================================
  const validInspectionOk: LocalInspection = {
    id: "INS-W08-001",
    location: "Laboratorio de Cómputo 3",
    date: "2026-10-22",
    inspector: "Felix Garcia",
    status: "ok",
    statusLabel: "Sin incidencias",
    findings: 0,
    summary: "Estaciones operativas y red local estable.",
    version: 1,
    isOfflineCreated: true
  };

  const validResultOk = validateLocalInspection(validInspectionOk);
  assert.equal(validResultOk.valid, true, "Una inspección completa con estado 'ok' debe ser válida");
  assert.deepEqual(validResultOk.errors, [], "Una inspección válida no debe producir errores");

  const validInspectionAttention: LocalInspection = {
    ...validInspectionOk,
    id: "INS-W08-002",
    status: "attention",
    statusLabel: "Requiere atención",
    findings: 3,
    version: 2
  };

  const validResultAttention = validateLocalInspection(validInspectionAttention);
  assert.equal(
    validResultAttention.valid,
    true,
    "Una inspección completa con hallazgos y estado 'attention' debe ser válida"
  );
  assert.deepEqual(validResultAttention.errors, []);

  // =========================================================================
  // 2. VALIDACIÓN DE CAPTURA DE INSPECCIÓN LOCAL (ENTRADAS INVÁLIDAS)
  // =========================================================================
  const nullResult = validateLocalInspection(null);
  assert.equal(nullResult.valid, false, "Un payload nulo debe ser rechazado");
  assert.deepEqual(nullResult.errors, ["inspection payload must be a non-null object"]);

  const emptyIdAndLocation = validateLocalInspection({
    ...validInspectionOk,
    id: "   ",
    location: ""
  });
  assert.equal(emptyIdAndLocation.valid, false, "ID o ubicación vacíos deben invalidar la inspección");
  assert.ok(emptyIdAndLocation.errors.includes("id is required"));
  assert.ok(emptyIdAndLocation.errors.includes("location is required"));

  const invalidDateAndStatus = validateLocalInspection({
    ...validInspectionOk,
    date: "fecha-invalida",
    status: "unknown-status" as unknown as LocalInspection["status"],
    findings: -1,
    version: 0
  });
  assert.equal(invalidDateAndStatus.valid, false, "Fecha, estado, hallazgos o versión inválidos deben fallar");
  assert.ok(invalidDateAndStatus.errors.includes("date must be a valid ISO date string"));
  assert.ok(invalidDateAndStatus.errors.includes("status must be 'ok' or 'attention'"));
  assert.ok(invalidDateAndStatus.errors.includes("findings must be a non-negative integer"));
  assert.ok(invalidDateAndStatus.errors.includes("version must be a positive number"));

  const missingInspectorAndSummary = validateLocalInspection({
    ...validInspectionOk,
    inspector: " ",
    statusLabel: "",
    summary: "   "
  });
  assert.equal(missingInspectorAndSummary.valid, false);
  assert.ok(missingInspectorAndSummary.errors.includes("inspector is required"));
  assert.ok(missingInspectorAndSummary.errors.includes("statusLabel is required"));
  assert.ok(missingInspectorAndSummary.errors.includes("summary is required"));

  const invalidCalendarDate = validateLocalInspection({
    ...validInspectionOk,
    date: "2026-02-30"
  });
  assert.equal(invalidCalendarDate.valid, false);
  assert.ok(
    invalidCalendarDate.errors.includes("date must be a valid ISO date string")
  );

  const oversizedFields = validateLocalInspection({
    ...validInspectionOk,
    location: "L".repeat(121),
    inspector: "I".repeat(121),
    summary: "S".repeat(501)
  });
  assert.equal(oversizedFields.valid, false);
  assert.ok(oversizedFields.errors.includes("location must be 120 characters or fewer"));
  assert.ok(oversizedFields.errors.includes("inspector must be 120 characters or fewer"));
  assert.ok(oversizedFields.errors.includes("summary must be 500 characters or fewer"));

  // =========================================================================
  // 3. VALIDACIÓN DE CANDIDATOS DE SINCRONIZACIÓN (ENTRADAS VÁLIDAS E INVÁLIDAS)
  // =========================================================================
  const validCandidate: InspectionConflictVersion = {
    inspectionId: "inspection-001",
    version: 1,
    updatedAt: "2026-10-22T12:00:00.000Z",
    operationId: "op-valid-001",
    source: "local",
    payload: { status: "ok" }
  };

  const validIncoming: InspectionConflictVersion = {
    ...validCandidate,
    version: 2,
    updatedAt: "2026-10-22T12:05:00.000Z",
    operationId: "op-valid-002",
    source: "remote"
  };

  const resolution = resolveInspectionConflict(validCandidate, validIncoming);
  assert.equal(resolution.applied, "incoming");
  assert.equal(resolution.reason, "higher-version");

  assert.throws(
    () =>
      resolveInspectionConflict(
        { ...validCandidate, inspectionId: "   " },
        validIncoming
      ),
    /current\.inspectionId is required/,
    "Debe rechazar un candidato actual con inspectionId vacío"
  );

  assert.throws(
    () =>
      resolveInspectionConflict(
        validCandidate,
        { ...validIncoming, version: -1 }
      ),
    /incoming\.version must be a non-negative number/,
    "Debe rechazar una versión negativa en el candidato entrante"
  );

  assert.throws(
    () =>
      resolveInspectionConflict(
        { ...validCandidate, version: Number.NaN },
        validIncoming
      ),
    /current\.version must be a non-negative number/,
    "Debe rechazar una versión NaN en el candidato actual"
  );

  assert.throws(
    () =>
      resolveInspectionConflict(
        validCandidate,
        { ...validIncoming, updatedAt: "  " }
      ),
    /incoming\.updatedAt is required/,
    "Debe rechazar un candidato entrante sin fecha de actualización"
  );

  assert.throws(
    () =>
      resolveInspectionConflict(
        { ...validCandidate, operationId: "" },
        validIncoming
      ),
    /current\.operationId is required/,
    "Debe rechazar un candidato actual sin identificador de operación"
  );

  console.log("validation.spec.ts: PASS");
}

main();
