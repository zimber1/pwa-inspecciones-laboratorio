import type { LocalInspection, SyncOperation } from "../../src/lib/storage/schema";
import type { ProcessSyncHandler } from "../../src/lib/sync/queue";

export function createInspection(): LocalInspection {
  return {
    id: "INS-INTEGRATION-008",
    location: "Laboratorio sintetico 08",
    date: "2026-10-24",
    inspector: "Persona sintetica 08",
    status: "ok",
    statusLabel: "Sin incidencias",
    findings: 0,
    summary: "Datos sinteticos para integracion offline.",
    version: 1,
    isOfflineCreated: true
  };
}

// Solo se simulan las APIs que consume SyncQueue. Cada caso recibe su almacen.
export function createBrowserStorage() {
  const values = new Map<string, string>();
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const install = () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        navigator: { onLine: false },
        localStorage: {
          getItem: (key: string) => values.get(key) ?? null,
          setItem: (key: string, value: string) => values.set(key, String(value))
        }
      }
    });
  };
  install();
  return {
    // Reemplaza window conservando solo las cadenas persistidas, no la cola.
    reload: install,
    dispose() {
      values.clear();
      if (originalWindow) {
        Object.defineProperty(globalThis, "window", originalWindow);
      } else {
        Reflect.deleteProperty(globalThis, "window");
      }
    }
  };
}

// El proyecto expone un handler booleano, no un cliente HTTP.
// No hay deduplicacion en este servidor: cada exito agregaria otro registro.
export function createRemoteHandler(...outcomes: Array<boolean | Error>) {
  const attempts: SyncOperation[] = [];
  const records: LocalInspection[] = [];
  const handler: ProcessSyncHandler = async (operation) => {
    attempts.push(JSON.parse(JSON.stringify(operation)) as SyncOperation);
    if (attempts.length > outcomes.length) {
      throw new Error("Intento remoto no previsto por el escenario");
    }
    const result = outcomes[attempts.length - 1];
    if (result instanceof Error) throw result;
    if (result) records.push(JSON.parse(JSON.stringify(operation.payload)) as LocalInspection);
    return result;
  };
  return { handler, attempts, records };
}
