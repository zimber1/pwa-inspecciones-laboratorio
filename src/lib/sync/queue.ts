import { SyncOperation, LocalInspection, SyncActionType } from "../storage/schema";

export type ProcessSyncHandler = (operation: SyncOperation) => Promise<boolean> | boolean;

const STORAGE_KEY = "pwa-inspecciones-sync-queue";

/**
 * Clase principal para la administración de la cola de sincronización local.
 * Implementa agregación idempotente, recuperación de pendientes,
 * procesamiento con manejo de reintentos y persistencia de operaciones fallidas.
 */
export class SyncQueue {
  private operations: Map<string, SyncOperation> = new Map();
  private storageLoadError: Error | undefined;
  private processing: Promise<{
    processed: SyncOperation[];
    failed: SyncOperation[];
  }> | undefined;

  constructor() {
    this.operations = new Map();
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storage = window.localStorage;
      if (!storage) throw new Error("El navegador no ofrece almacenamiento local");
      const stored = storage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as {
        version: number;
        operations: SyncOperation[];
      };

      if (!Array.isArray(parsed.operations)) {
        throw new Error("El formato de la cola no contiene una lista de operaciones");
      }

      this.operations = new Map(
        parsed.operations.map((operation) => [operation.id, operation])
      );
    } catch (error) {
      this.storageLoadError = new Error(
        `No se pudo recuperar la cola local: ${errorMessage(error)}`
      );
    }
  }

  private assertStorageReady(): void {
    if (this.storageLoadError) {
      throw this.storageLoadError;
    }
  }

  private saveToStorage(): void {
    this.assertStorageReady();
    if (typeof window === "undefined") {
      return;
    }

    const data = {
      version: 1,
      operations: Array.from(this.operations.values())
    };

    try {
      const storage = window.localStorage;
      if (!storage) throw new Error("El navegador no ofrece almacenamiento local");
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      throw new Error(`No se pudo guardar la cola local: ${errorMessage(error)}`);
    }
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
    this.assertStorageReady();
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
    try {
      this.saveToStorage();
    } catch (error) {
      this.operations.delete(id);
      throw error;
    }

    return newOperation;
  }

  /**
   * Recupera todas las operaciones que todavía requieren procesamiento ('pending' o 'failed').
   */
  public getPending(): SyncOperation[] {
    this.assertStorageReady();
    return Array.from(this.operations.values()).filter(
      (op) =>
        (op.status === "pending" || op.status === "failed") &&
        op.retryCount < (op.maxRetries ?? 3)
    );
  }

  /**
   * Recupera fallos cuyo límite de intentos ya se agotó, sin eliminarlos.
   */
  public getExhausted(): SyncOperation[] {
    this.assertStorageReady();
    return Array.from(this.operations.values()).filter(
      (op) =>
        (op.status === "pending" || op.status === "failed") &&
        op.retryCount >= (op.maxRetries ?? 3)
    );
  }

  /**
   * Recupera todas las operaciones registradas en la cola.
   */
  public getAll(): SyncOperation[] {
    this.assertStorageReady();
    return Array.from(this.operations.values());
  }

  /**
   * Obtiene una operación por su identificador único.
   */
  public getById(id: string): SyncOperation | undefined {
    this.assertStorageReady();
    return this.operations.get(id);
  }

  /**
   * Obtiene una operación por su clave de idempotencia.
   */
  public getByIdempotencyKey(key: string): SyncOperation | undefined {
    this.assertStorageReady();
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
    this.assertStorageReady();
    if (this.processing) return this.processing;

    const processing = this.processPendingOperations(handler);
    this.processing = processing;
    try {
      return await processing;
    } finally {
      this.processing = undefined;
    }
  }

  private async processPendingOperations(handler: ProcessSyncHandler): Promise<{
    processed: SyncOperation[];
    failed: SyncOperation[];
  }> {
    const pending = this.getPending();
    const processed: SyncOperation[] = [];
    const failed: SyncOperation[] = [];

    for (const op of pending) {
      const nextOperation: SyncOperation = {
        ...op,
        retryCount: op.retryCount + 1,
        lastAttemptAt: new Date().toISOString()
      };
      let succeeded = false;

      try {
        const handlerOperation: SyncOperation = {
          ...op,
          payload: JSON.parse(JSON.stringify(op.payload)) as SyncOperation["payload"]
        };
        const success = await handler(handlerOperation);
        if (success) {
          nextOperation.status = "processed";
          nextOperation.errorMessage = undefined;
          succeeded = true;
        } else {
          nextOperation.status = "failed";
          nextOperation.errorMessage =
            op.errorMessage || "Error durante el intento de sincronización";
        }
      } catch (err) {
        nextOperation.status = "failed";
        nextOperation.errorMessage = errorMessage(err);
      }

      this.operations.set(op.id, nextOperation);
      try {
        this.saveToStorage();
      } catch (error) {
        this.operations.set(op.id, op);
        throw error;
      }

      (succeeded ? processed : failed).push(nextOperation);
    }

    return { processed, failed };
  }

  /**
   * Elimina o reinicia las operaciones de la cola (útil para pruebas y limpieza).
   */
  public clear(): void {
    this.assertStorageReady();
    const previousOperations = new Map(this.operations);
    this.operations.clear();
    try {
      this.saveToStorage();
    } catch (error) {
      this.operations = previousOperations;
      throw error;
    }
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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
