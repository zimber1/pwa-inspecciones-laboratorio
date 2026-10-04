import assert from "node:assert/strict";
import {
  resolveInspectionConflict,
  shouldApplyIncomingInspection,
  type InspectionConflictVersion
} from "../src/lib/sync/conflict-policy";

const currentInspection: InspectionConflictVersion = Object.freeze({
  inspectionId: "inspection-002",
  version: 3,
  updatedAt: "2026-10-02T18:25:00.000Z",
  operationId: "op-cesar-003",
  source: "local",
  payload: Object.freeze({
    status: "requires-maintenance",
    note: "Dato sintetico: revision actualizada en laboratorio de redes"
  })
});

const delayedSyncResponse: InspectionConflictVersion = Object.freeze({
  inspectionId: "inspection-002",
  version: 2,
  updatedAt: "2026-10-02T18:10:00.000Z",
  operationId: "op-cesar-002",
  source: "sync-response",
  payload: Object.freeze({
    status: "open",
    note: "Dato sintetico: respuesta anterior recibida tarde"
  })
});

const originalCurrent = JSON.stringify(currentInspection);
const originalIncoming = JSON.stringify(delayedSyncResponse);

const outOfOrderDecision = resolveInspectionConflict(
  currentInspection,
  delayedSyncResponse
);

assert.equal(outOfOrderDecision.hasConflict, true);
assert.equal(outOfOrderDecision.inspectionId, "inspection-002");
assert.equal(outOfOrderDecision.applied, "current");
assert.equal(outOfOrderDecision.reason, "higher-version");
assert.equal(outOfOrderDecision.winner.operationId, "op-cesar-003");
assert.equal(outOfOrderDecision.discarded?.operationId, "op-cesar-002");
assert.equal(
  shouldApplyIncomingInspection(currentInspection, delayedSyncResponse),
  false
);

assert.equal(JSON.stringify(currentInspection), originalCurrent);
assert.equal(JSON.stringify(delayedSyncResponse), originalIncoming);

const remoteTieBreaker: InspectionConflictVersion = Object.freeze({
  inspectionId: "inspection-002",
  version: 3,
  updatedAt: "2026-10-02T18:25:00.000Z",
  operationId: "op-cesar-004",
  source: "remote",
  payload: Object.freeze({
    status: "requires-maintenance",
    note: "Dato sintetico: misma version con operacion posterior"
  })
});

const repeatedDecisions = Array.from({ length: 3 }, () =>
  resolveInspectionConflict(currentInspection, remoteTieBreaker)
).map((decision) => ({
  winner: decision.winner.operationId,
  discarded: decision.discarded?.operationId,
  applied: decision.applied,
  reason: decision.reason,
  trace: decision.trace
}));

assert.deepEqual(repeatedDecisions[0], repeatedDecisions[1]);
assert.deepEqual(repeatedDecisions[1], repeatedDecisions[2]);
assert.equal(repeatedDecisions[0].winner, "op-cesar-004");
assert.equal(repeatedDecisions[0].reason, "operation-id-tiebreaker");

const duplicateDecision = resolveInspectionConflict(
  currentInspection,
  currentInspection
);

assert.equal(duplicateDecision.applied, "current");
assert.equal(duplicateDecision.reason, "duplicate-operation");

console.log("sync.spec.ts: PASS");
