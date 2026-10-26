import type { Inspection } from "../data/inspections";

/**
 * Estados posibles de una operación en la cola de sincronización.
 * - 'pending': Registrada y pendiente de intento de envío.
 * - 'processed': Sincronizada exitosamente con la fuente remota.
 * - 'failed': Falló en un intento previo y permanece disponible para reintento.
 */
export type SyncStatus = "pending" | "processed" | "failed";

/**
 * Tipo de acción a sincronizar.
 */
export type SyncActionType = "CREATE_INSPECTION" | "UPDATE_INSPECTION" | "DELETE_INSPECTION";

/**
 * Estructura de datos para representar una inspección almacenada localmente.
 * Reutiliza la definición de Inspection y añade metadatos de persistencia local.
 */
export type LocalInspection = Inspection & {
  isOfflineCreated?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version: number;
};

/**
 * Estructura de datos para representar una operación de sincronización en la cola.
 * Cumple con los criterios de:
 * - Identificación única (`id`)
 * - Idempotencia y prevención de duplicados (`idempotencyKey`)
 * - Control del ciclo de vida y reintentos (`status`, `retryCount`, `lastAttemptAt`, `errorMessage`)
 * - Conservación del payload (`payload`)
 */
export type SyncOperation<T = LocalInspection> = {
  id: string;
  idempotencyKey: string;
  action: SyncActionType;
  payload: T;
  status: SyncStatus;
  retryCount: number;
  maxRetries?: number;
  createdAt: string;
  lastAttemptAt?: string;
  errorMessage?: string;
};

/**
 * Estructura para el estado persistible de la cola de sincronización.
 */
export type SyncStorageSchema = {
  version: number;
  operations: SyncOperation[];
};

export type InspectionValidationResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Valida que un objeto de inspección local cumpla con las reglas de dominio
 * antes de registrarse o encolarse para sincronización.
 */
export function validateLocalInspection(
  input: unknown
): InspectionValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object") {
    return {
      valid: false,
      errors: ["inspection payload must be a non-null object"]
    };
  }

  const candidate = input as Partial<LocalInspection>;

  if (typeof candidate.id !== "string" || !candidate.id.trim()) {
    errors.push("id is required");
  }

  if (typeof candidate.location !== "string" || !candidate.location.trim()) {
    errors.push("location is required");
  }

  if (
    typeof candidate.date !== "string" ||
    !isValidISODate(candidate.date)
  ) {
    errors.push("date must be a valid ISO date string");
  }

  if (typeof candidate.inspector !== "string" || !candidate.inspector.trim()) {
    errors.push("inspector is required");
  } else if (candidate.inspector.length > 120) {
    errors.push("inspector must be 120 characters or fewer");
  }

  if (candidate.status !== "ok" && candidate.status !== "attention") {
    errors.push("status must be 'ok' or 'attention'");
  }

  if (
    typeof candidate.location === "string" &&
    candidate.location.length > 120
  ) {
    errors.push("location must be 120 characters or fewer");
  }

  if (
    typeof candidate.statusLabel !== "string" ||
    !candidate.statusLabel.trim()
  ) {
    errors.push("statusLabel is required");
  }

  if (
    typeof candidate.findings !== "number" ||
    !Number.isInteger(candidate.findings) ||
    candidate.findings < 0
  ) {
    errors.push("findings must be a non-negative integer");
  }

  if (typeof candidate.summary !== "string" || !candidate.summary.trim()) {
    errors.push("summary is required");
  } else if (candidate.summary.length > 500) {
    errors.push("summary must be 500 characters or fewer");
  }

  if (
    typeof candidate.version !== "number" ||
    !Number.isFinite(candidate.version) ||
    candidate.version < 1
  ) {
    errors.push("version must be a positive number");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}
