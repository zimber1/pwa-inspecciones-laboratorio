import type { Inspection } from "@/lib/data/inspections";

type AppShellStatus = "ready" | "loading" | "error";

type AppShellProps = {
  inspections: Inspection[];
  status?: AppShellStatus;
};

export function AppShell({ inspections, status = "ready" }: AppShellProps) {
  const hasInspections = inspections.length > 0;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <header className="topbar">
        <div>
          <p className="eyebrow">Semana 2 · App shell instalable</p>
          <h1>Inspecciones de laboratorio</h1>
        </div>
        <nav className="primary-nav" aria-label="Navegacion principal">
          <a href="#inspecciones">Inspecciones</a>
          <a href="#estados">Estados</a>
          <a href="#evidencia">Evidencia</a>
        </nav>
      </header>

      <main id="contenido" className="main-layout">
        <section className="intro-panel" aria-labelledby="intro-heading">
          <div>
            <p className="eyebrow">Datos sinteticos</p>
            <h2 id="intro-heading">Shell listo para instalacion progresiva</h2>
            <p>
              Registro de mantenimiento para trabajar con conectividad intermitente.
              Los datos mostrados son sinteticos y no representan laboratorios reales.
            </p>
          </div>
          <dl className="summary-list" aria-label="Resumen del shell">
            <div>
              <dt>Manifest</dt>
              <dd>standalone</dd>
            </div>
            <div>
              <dt>Registros</dt>
              <dd>{inspections.length}</dd>
            </div>
            <div>
              <dt>Alcance</dt>
              <dd>sin offline aun</dd>
            </div>
          </dl>
        </section>

        <section id="inspecciones" aria-labelledby="inspections-heading" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Navegacion principal</p>
              <h2 id="inspections-heading">Inspecciones recientes</h2>
            </div>
            <span className="count">{inspections.length} registros</span>
          </div>

          {status === "loading" ? <LoadingState /> : null}
          {status === "error" ? <ErrorState /> : null}
          {status === "ready" && !hasInspections ? <EmptyState /> : null}
          {status === "ready" && hasInspections ? <InspectionGrid inspections={inspections} /> : null}
        </section>

        <section id="estados" aria-labelledby="states-heading" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Estados verificables</p>
              <h2 id="states-heading">Carga, error y vacio</h2>
            </div>
          </div>
          <div className="state-grid">
            <LoadingState compact />
            <ErrorState compact />
            <EmptyState compact />
          </div>
        </section>

        <section id="evidencia" aria-labelledby="evidence-heading" className="content-section">
          <div className="evidence-panel">
            <p className="eyebrow">Verificacion</p>
            <h2 id="evidence-heading">Comportamiento cubierto por pruebas</h2>
            <p>
              La prueba de semana 2 inspecciona el manifest, la referencia desde el layout,
              la separacion del shell y los textos de estados criticos.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function InspectionGrid({ inspections }: { inspections: Inspection[] }) {
  return (
    <div className="inspection-grid">
      {inspections.map((inspection) => (
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
  );
}

function LoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <strong>Cargando inspecciones</strong>
      <p>{compact ? "El shell reserva el espacio del contenido." : "La interfaz informa que los registros sinteticos se estan preparando."}</p>
    </div>
  );
}

function ErrorState({ compact = false }: { compact?: boolean }) {
  return (
    <div className="state-panel state-panel-error" role="alert">
      <strong>No se pudo cargar la lista</strong>
      <p>{compact ? "El shell muestra recuperacion clara." : "El usuario puede identificar el fallo sin perder la navegacion principal."}</p>
    </div>
  );
}

function EmptyState({ compact = false }: { compact?: boolean }) {
  return (
    <div className="state-panel">
      <strong>Sin inspecciones por mostrar</strong>
      <p>{compact ? "El estado vacio no parece un error." : "Cuando no existan registros sinteticos, el shell mantiene una respuesta comprensible."}</p>
    </div>
  );
}
