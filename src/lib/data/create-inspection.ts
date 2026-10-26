import type { Inspection } from "./inspections";
import {
  readLocalInspections,
  saveLocalInspection
} from "../storage/inspections";
import {
  validateLocalInspection,
  type LocalInspection
} from "../storage/schema";
import { syncQueue, type SyncQueue } from "../sync/queue";

export type NewInspectionInput = Pick<
  Inspection,
  "location" | "date" | "inspector" | "status" | "findings" | "summary"
>;

export class InspectionValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Revisa los datos de la inspección: ${errors.join(", ")}`);
    this.name = "InspectionValidationError";
  }
}

export class InspectionCreationError extends Error {
  constructor(
    message: string,
    public readonly inspection: LocalInspection,
    public readonly cause: unknown
  ) {
    super(message);
    this.name = "InspectionCreationError";
  }
}

export function createLocalInspection(
  input: NewInspectionInput,
  queue: SyncQueue = syncQueue
): LocalInspection {
  const now = new Date().toISOString();
  const inspection: LocalInspection = {
    ...input,
    id: `inspection-${crypto.randomUUID()}`,
    statusLabel: input.status === "attention" ? "Requiere atención" : "Sin incidencias",
    version: 1,
    isOfflineCreated: true,
    createdAt: now,
    updatedAt: now
  };

  const validation = validateLocalInspection(inspection);
  if (!validation.valid) {
    throw new InspectionValidationError(validation.errors);
  }

  saveLocalInspection(inspection);
  try {
    enqueueCreateOperation(queue, inspection);
  } catch (error) {
    throw new InspectionCreationError(
      "La inspección se guardó localmente, pero no se pudo guardar su operación de sincronización.",
      inspection,
      error
    );
  }

  return inspection;
}

export function loadUserInspections(queue: SyncQueue = syncQueue): LocalInspection[] {
  const inspections = new Map(
    readLocalInspections().map((inspection) => [inspection.id, inspection])
  );

  for (const operation of queue.getAll()) {
    if (operation.action !== "CREATE_INSPECTION") continue;
    const validation = validateLocalInspection(operation.payload);
    if (!validation.valid) {
      throw new Error(
        `La operación ${operation.id} contiene una inspección no válida: ${validation.errors.join(", ")}`
      );
    }
    inspections.set(operation.payload.id, operation.payload);
  }

  for (const inspection of Array.from(inspections.values())) {
    if (!inspection.isOfflineCreated) continue;
    saveLocalInspection(inspection);
    enqueueCreateOperation(queue, inspection);
  }

  return Array.from(inspections.values());
}

function enqueueCreateOperation(queue: SyncQueue, inspection: LocalInspection): void {
  queue.enqueue(inspection, "CREATE_INSPECTION", {
    id: `create-${inspection.id}`,
    idempotencyKey: `idem-CREATE_INSPECTION-${inspection.id}`
  });
}
