import {
  validateLocalInspection,
  type LocalInspection
} from "./schema";

const STORAGE_KEY = "pwa-inspecciones-local-inspections";

export function readLocalInspections(): LocalInspection[] {
  const storage = getStorage();
  let stored: string | null;

  try {
    stored = storage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new Error(`No se pudieron leer las inspecciones locales: ${errorMessage(error)}`);
  }

  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    throw new Error(`El almacenamiento de inspecciones está dañado: ${errorMessage(error)}`);
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("inspections" in parsed) ||
    !Array.isArray(parsed.inspections)
  ) {
    throw new Error("El almacenamiento de inspecciones tiene un formato no válido");
  }

  return parsed.inspections.map((inspection: unknown, index: number) => {
    const validation = validateLocalInspection(inspection);
    if (!validation.valid) {
      throw new Error(
        `La inspección local ${index + 1} no es válida: ${validation.errors.join(", ")}`
      );
    }
    return inspection as LocalInspection;
  });
}

export function saveLocalInspection(inspection: LocalInspection): LocalInspection {
  const validation = validateLocalInspection(inspection);
  if (!validation.valid) {
    throw new Error(`No se puede guardar la inspección: ${validation.errors.join(", ")}`);
  }

  const inspections = readLocalInspections();
  const existing = inspections.find((item) => item.id === inspection.id);
  if (existing) {
    if (JSON.stringify(existing) === JSON.stringify(inspection)) return existing;
    throw new Error(`Ya existe una inspección local con el identificador ${inspection.id}`);
  }

  const nextInspections = [...inspections, inspection];
  try {
    getStorage().setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, inspections: nextInspections })
    );
  } catch (error) {
    throw new Error(`No se pudo guardar la inspección local: ${errorMessage(error)}`);
  }

  return inspection;
}

function getStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("El almacenamiento local solo está disponible en el navegador");
  }

  try {
    return window.localStorage;
  } catch (error) {
    throw new Error(`No se pudo acceder al almacenamiento local: ${errorMessage(error)}`);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
