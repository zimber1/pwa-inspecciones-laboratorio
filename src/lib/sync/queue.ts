import { SyncOperation, LocalInspection, SyncActionType } from "../storage/schema";

export type ProcessSyncHandler = (operation: SyncOperation) => Promise<boolean> | boolean;

/**
 * Clase principal para la administración de la cola de sincronización local.
 * Implementa agregación idempotente, recuperación de pendientes,
 * procesamiento con manejo de reintentos y persistencia de operaciones fallidas.
 */
export class SyncQueue {
  private operations: Map<string, SyncOperation> = new Map();

  constructor() {
    this.operations = new Map();
  }

  /**
   * Agrega una nueva operación a la cola de sincronización de forma idempotente.
   * Si ya existe una operación con la misma clave de idempotencia (idempotencyKey) o id,
   * no genera un duplicado y devuelve la operación existente.
   */
  public enqueue(
    payload: LocalInspection,
    action: SyncActionType = "CREATE_INSPECTION",
    options?: { id?: string; idempotencyKey?: string; maxRetries?: number }
  ): SyncOperation {
    const id = options?.id || payload.id || `op-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const idempotencyKey = options?.idempotencyKey || `idem-${action}-${payload.id || id}`;

    const existingOps = Array.from(this.operations.values());
    for (const existingOp of existingOps) {
      if (existingOp.idempotencyKey === idempotencyKey || existingOp.id === id) {
        return existingOp;
      }
    }

    const newOperation: SyncOperation = {
      id,
      idempotencyKey,
      action,
      payload,
      status: "pending",
      retryCount: 0,
      maxRetries: options?.maxRetries ?? 3,
      createdAt: new Date().toISOString()
    };

    this.operations.set(id, newOperation);
    return newOperation;
  }

  /**
   * Recupera todas las operaciones que todavía requieren procesamiento ('pending' o 'failed').
   */
  public getPending(): SyncOperation[] {
    return Array.from(this.operations.values()).filter(
      (op) => op.status === "pending" || op.status === "failed"
    );
  }

  /**
   * Recupera todas las operaciones registradas en la cola.
   */
  public getAll(): SyncOperation[] {
    return Array.from(this.operations.values());
  }

  /**
   * Obtiene una operación por su identificador único.
   */
  public getById(id: string): SyncOperation | undefined {
    return this.operations.get(id);
  }

  /**
   * Obtiene una operación por su clave de idempotencia.
   */
  public getByIdempotencyKey(key: string): SyncOperation | undefined {
    return Array.from(this.operations.values()).find((op) => op.idempotencyKey === key);
  }

  /**
   * Intenta procesar todas las operaciones pendientes mediante un handler de sincronización.
   * Si la sincronización resulta exitosa:
   *   - Se marca como 'processed'.
   * Si la sincronización falla:
   *   - Permanece persistida con estado 'failed'.
   *   - Se incrementa el contador de reintentos (`retryCount`).
   *   - Se registra la fecha del intento (`lastAttemptAt`) y el mensaje de error.
   */
  public async processQueue(handler: ProcessSyncHandler): Promise<{
    processed: SyncOperation[];
    failed: SyncOperation[];
  }> {
    const pending = this.getPending();
    const processed: SyncOperation[] = [];
    const failed: SyncOperation[] = [];

    for (const op of pending) {
      op.retryCount += 1;
      op.lastAttemptAt = new Date().toISOString();

      try {
        const success = await handler(op);
        if (success) {
          op.status = "processed";
          op.errorMessage = undefined;
          processed.push(op);
        } else {
          op.status = "failed";
          op.errorMessage = op.errorMessage || "Error durante el intento de sincronización";
          failed.push(op);
        }
      } catch (err) {
        op.status = "failed";
        op.errorMessage = err instanceof Error ? err.message : String(err);
        failed.push(op);
      }

      this.operations.set(op.id, op);
    }

    return { processed, failed };
  }

  /**
   * Elimina o reinicia las operaciones de la cola (útil para pruebas y limpieza).
   */
  public clear(): void {
    this.operations.clear();
  }
}

// Instancia singleton por defecto para el proyecto
export const syncQueue = new SyncQueue();

// Funciones exportadas directamente para flexibilidad de uso
export const enqueueOperation = (
  payload: LocalInspection,
  action?: SyncActionType,
  options?: { id?: string; idempotencyKey?: string; maxRetries?: number }
) => syncQueue.enqueue(payload, action, options);

export const getPendingOperations = () => syncQueue.getPending();
export const getAllOperations = () => syncQueue.getAll();
export const processQueue = (handler: ProcessSyncHandler) => syncQueue.processQueue(handler);
export const clearQueue = () => syncQueue.clear();
