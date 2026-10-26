"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { inspections, type Inspection } from "@/lib/data/inspections";
import {
  createLocalInspection,
  InspectionCreationError,
  InspectionValidationError,
  loadUserInspections
} from "@/lib/data/create-inspection";
import { syncQueue } from "@/lib/sync/queue";
import type { SyncOperation } from "@/lib/storage/schema";
import { subscribeToConnectivity } from "@/lib/sync/connectivity";

type LoadState = "loading" | "ready" | "error";
type FilterMode = "all" | "attention";
type QueueCounts = {
  pending: number;
  failed: number;
  exhausted: number;
  confirmed: number;
};

function loadSyntheticInspections(shouldFail: boolean) {
  return new Promise<Inspection[]>((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Fallo sintético al cargar inspecciones"));
        return;
      }

      resolve(inspections);
    }, 250);
  });
}

export default function InspeccionesPage() {
  const [items, setItems] = useState<Inspection[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("pendiente");
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [creationNotice, setCreationNotice] = useState("");
  const [connectionOnline, setConnectionOnline] = useState(false);
  const [syncMessage, setSyncMessage] = useState(
    "No hay backend remoto configurado. Las operaciones permanecen locales y no se consideran sincronizadas."
  );
  const [queueCounts, setQueueCounts] = useState<QueueCounts>({
    pending: 0,
    failed: 0,
    exhausted: 0,
    confirmed: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const submitLock = useRef(false);

  async function loadInspections(shouldFail = false) {
    setState("loading");
    setLoadError("");

    try {
      const synthetic = await loadSyntheticInspections(shouldFail);
      const userCreated = loadUserInspections();
      setItems(mergeInspections(synthetic, userCreated));
      setQueueCounts(summarizeQueue(syncQueue.getAll()));
      setLastUpdated(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setState("ready");
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al cargar las inspecciones."
      );
      setState("error");
    }
  }

  useEffect(() => {
    void loadInspections();
  }, []);

  useEffect(
    () =>
      subscribeToConnectivity(syncQueue, undefined, {
        onConnectionChange: setConnectionOnline,
        onSyncResult: ({ processed, failed }) => {
          setQueueCounts(summarizeQueue(syncQueue.getAll()));
          if (processed.length > 0) {
            setSyncMessage(
              `El manejador configurado devolvió éxito para ${processed.length} operación(es); esto no acredita sincronización con un backend remoto.`
            );
          } else if (failed.length > 0) {
            setSyncMessage(failedAttemptMessage(failed));
          }
        },
        onError: (error) => {
          let queueReadError = "";
          try {
            setQueueCounts(summarizeQueue(syncQueue.getAll()));
          } catch (readError) {
            queueReadError = ` Tampoco se pudo leer el estado de la cola: ${
              readError instanceof Error ? readError.message : String(readError)
            }`;
          }
          setSyncMessage(
            `Falló la persistencia del resultado de la cola; se conserva el estado anterior. ${
              error instanceof Error ? error.message : String(error)
            }${queueReadError}`
          );
        }
      }),
    []
  );

  function handleCreateInspection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;
    submitLock.current = true;
    setIsSaving(true);
    setFormError("");
    setFormErrors([]);
    setCreationNotice("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const findingsValue = String(formData.get("findings") ?? "");

    try {
      const statusValue = String(formData.get("status") ?? "");
      if (statusValue !== "ok" && statusValue !== "attention") {
        throw new InspectionValidationError(["status must be 'ok' or 'attention'"]);
      }

      const created = createLocalInspection({
        location: String(formData.get("location") ?? ""),
        date: String(formData.get("date") ?? ""),
        inspector: String(formData.get("inspector") ?? ""),
        status: statusValue,
        findings: findingsValue.trim() ? Number(findingsValue) : Number.NaN,
        summary: String(formData.get("summary") ?? "")
      });
      setItems((current) => mergeInspections(current, [created]));
      setState("ready");
      setLastUpdated(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCreationNotice("Inspección guardada localmente en este dispositivo.");
      setQueueCounts(summarizeQueue(syncQueue.getAll()));
      setSyncMessage("Operación en cola con estado pendiente. No hay backend remoto configurado.");
      form.reset();
    } catch (error) {
      if (error instanceof InspectionCreationError) {
        setItems((current) => mergeInspections(current, [error.inspection]));
        setState("ready");
        setCreationNotice("Inspección guardada localmente en este dispositivo.");
        setFormError(
          `${error.message} El registro se conservará y la siguiente carga intentará reconstruir una única operación idempotente. ${
            error.cause instanceof Error ? error.cause.message : String(error.cause)
          }`
        );
      } else if (error instanceof InspectionValidationError) {
        setFormErrors(error.errors.map(translateValidationError));
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : "No se pudo guardar la inspección. Intenta nuevamente."
        );
      }
    } finally {
      submitLock.current = false;
      setIsSaving(false);
    }
  }

  const visibleInspections = useMemo(() => {
    if (filter === "attention") {
      return items.filter((inspection) => inspection.status === "attention");
    }

    return items;
  }, [filter, items]);

  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="csr-heading">
        <div>
          <p className="eyebrow">Ruta CSR</p>
          <h1 id="csr-heading">Inspecciones</h1>
          <p>
            Este listado usa datos sintéticos y se carga desde el navegador. La
            interacción de refrescar, filtrar y simular error permite comprobar
            el comportamiento del cliente.
          </p>
        </div>
        <dl className="summary-list" aria-label="Resumen del renderizado">
          <div>
            <dt>Enfoque</dt>
            <dd>CSR</dd>
          </div>
          <div>
            <dt>Actualizaciones</dt>
            <dd>{refreshCount}</dd>
          </div>
          <div>
            <dt>Última carga</dt>
            <dd>{lastUpdated}</dd>
          </div>
          <div>
            <dt>Conectividad</dt>
            <dd>{connectionOnline ? "En línea" : "Sin conexión"}</dd>
          </div>
        </dl>
      </section>

      <section className="content-section" aria-labelledby="crear-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Captura local</p>
            <h2 id="crear-heading">Crear inspección</h2>
          </div>
        </div>
        <form className="inspection-form" noValidate onSubmit={handleCreateInspection}>
          <div className="form-grid">
            <label>
              Ubicación
              <input name="location" required maxLength={120} autoComplete="organization" />
            </label>
            <label>
              Fecha
              <input name="date" type="date" required />
            </label>
            <label>
              Responsable
              <input name="inspector" required maxLength={120} autoComplete="name" />
            </label>
            <label>
              Estado
              <select name="status" defaultValue="ok" required>
                <option value="ok">Sin incidencias</option>
                <option value="attention">Requiere atención</option>
              </select>
            </label>
            <label>
              Hallazgos
              <input name="findings" type="number" min="0" step="1" required defaultValue="0" />
            </label>
            <label className="form-field-wide">
              Resumen
              <textarea name="summary" required maxLength={500} rows={3} />
            </label>
          </div>
          {formErrors.length > 0 ? (
            <div className="state-panel state-panel-error" role="alert">
              <strong>Revisa los siguientes campos</strong>
              <ul>
                {formErrors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
          ) : null}
          {formError ? <p className="form-message form-message-error" role="alert">{formError}</p> : null}
          {creationNotice ? <p className="form-message" role="status">{creationNotice}</p> : null}
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando…" : "Guardar inspección"}
          </button>
        </form>
        <div className="queue-status" aria-label="Estado local de operaciones">
          <p className="form-message" role="status">{syncMessage}</p>
          <dl className="summary-list" aria-label="Resumen de la cola local">
            <div><dt>Pendientes reintentables</dt><dd>{queueCounts.pending}</dd></div>
            <div><dt>Fallidas reintentables</dt><dd>{queueCounts.failed}</dd></div>
            <div><dt>Intentos agotados</dt><dd>{queueCounts.exhausted}</dd></div>
            <div><dt>Confirmadas por el manejador</dt><dd>{queueCounts.confirmed}</dd></div>
          </dl>
        </div>
      </section>

      <section className="content-section" aria-labelledby="listado-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Datos del navegador</p>
            <h2 id="listado-heading">Listado verificable</h2>
          </div>
          <span className="count">{visibleInspections.length} registros</span>
        </div>

        <div className="primary-nav" aria-label="Acciones del listado CSR">
          <button
            type="button"
            onClick={() => {
              setRefreshCount((count) => count + 1);
              void loadInspections();
            }}
          >
            Refrescar datos
          </button>
          <button
            type="button"
            aria-pressed={filter === "attention"}
            onClick={() => setFilter((current) => (current === "all" ? "attention" : "all"))}
          >
            {filter === "all" ? "Ver con hallazgos" : "Ver todos"}
          </button>
          <button type="button" onClick={() => void loadInspections(true)}>
            Simular error
          </button>
        </div>

        {state === "loading" ? (
          <div className="state-panel" role="status" aria-live="polite">
            <strong>Cargando listado CSR</strong>
            <p>El navegador está preparando las inspecciones sintéticas.</p>
          </div>
        ) : null}

        {state === "error" ? (
          <div className="state-panel state-panel-error" role="alert">
            <strong>No se pudo cargar el listado</strong>
            <p>{loadError || "El fallo fue controlado sin romper la ruta."}</p>
            <button type="button" onClick={() => void loadInspections()}>
              Reintentar
            </button>
          </div>
        ) : null}

        {state === "ready" || (state === "error" && items.length > 0) ? (
          <div className="inspection-grid">
            {visibleInspections.map((inspection) => (
              <article className="inspection-card" key={inspection.id}>
                <div className="card-topline">
                  <span className={`badge badge-${inspection.status}`}>{inspection.statusLabel}</span>
                  <time className="muted" dateTime={inspection.date}>
                    {inspection.date}
                  </time>
                </div>
                <h3>{inspection.location}</h3>
                <p>{inspection.summary}</p>
                <dl>
                  <div>
                    <dt>Responsable</dt>
                    <dd>{inspection.inspector}</dd>
                  </div>
                  <div>
                    <dt>Hallazgos</dt>
                    <dd>{inspection.findings}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function summarizeQueue(operations: SyncOperation[]): QueueCounts {
  return operations.reduce<QueueCounts>(
    (counts, operation) => {
      if (operation.status === "processed") {
        counts.confirmed += 1;
      } else if (operation.retryCount >= (operation.maxRetries ?? 3)) {
        counts.exhausted += 1;
      } else if (operation.status === "failed") {
        counts.failed += 1;
      } else {
        counts.pending += 1;
      }
      return counts;
    },
    { pending: 0, failed: 0, exhausted: 0, confirmed: 0 }
  );
}

function failedAttemptMessage(operations: SyncOperation[]): string {
  const exhausted = operations.filter(
    (operation) => operation.retryCount >= (operation.maxRetries ?? 3)
  ).length;
  const retryable = operations.length - exhausted;
  const parts = [`Falló el intento de ${operations.length} operación(es).`];
  if (retryable > 0) {
    parts.push(`${retryable} queda(n) fallida(s) y disponible(s) para reintento.`);
  }
  if (exhausted > 0) {
    parts.push(`${exhausted} agotó sus intentos y se conserva para diagnóstico, sin reintentos automáticos.`);
  }
  parts.push("No se confirmó sincronización remota.");
  return parts.join(" ");
}

function mergeInspections(
  current: Inspection[],
  additional: Inspection[]
): Inspection[] {
  const merged = new Map(current.map((inspection) => [inspection.id, inspection]));
  for (const inspection of additional) merged.set(inspection.id, inspection);
  return Array.from(merged.values());
}

function translateValidationError(error: string): string {
  const messages: Record<string, string> = {
    "id is required": "No se pudo generar un identificador válido.",
    "location is required": "La ubicación es obligatoria.",
    "date must be a valid ISO date string": "Ingresa una fecha válida.",
    "inspector is required": "El responsable es obligatorio.",
    "status must be 'ok' or 'attention'": "Selecciona un estado válido.",
    "statusLabel is required": "El estado debe incluir una etiqueta.",
    "findings must be a non-negative integer": "Los hallazgos deben ser un número entero igual o mayor que cero.",
    "summary is required": "El resumen es obligatorio.",
    "version must be a positive number": "No se pudo asignar una versión válida."
  };
  return messages[error] ?? "Uno de los datos ingresados no es válido.";
}
