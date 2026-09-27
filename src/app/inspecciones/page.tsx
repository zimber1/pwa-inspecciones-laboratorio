"use client";

import { useEffect, useMemo, useState } from "react";
import { inspections, type Inspection } from "@/lib/data/inspections";

type LoadState = "loading" | "ready" | "error";
type FilterMode = "all" | "attention";

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

  async function loadInspections(shouldFail = false) {
    setState("loading");

    try {
      const loaded = await loadSyntheticInspections(shouldFail);
      setItems(loaded);
      setLastUpdated(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setState("ready");
    } catch {
      setItems([]);
      setState("error");
    }
  }

  useEffect(() => {
    void loadInspections();
  }, []);

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
        </dl>
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
            <p>El fallo sintético fue controlado sin romper la ruta.</p>
            <button type="button" onClick={() => void loadInspections()}>
              Reintentar
            </button>
          </div>
        ) : null}

        {state === "ready" ? (
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
