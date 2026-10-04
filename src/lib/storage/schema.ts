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
