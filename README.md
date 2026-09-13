# PWA de inspecciones de laboratorio

Proyecto integrador para una PWA de inspecciones y mantenimiento de laboratorios. La Semana 2 agrega un shell instalable con manifest, navegacion principal y estados de carga, error y vacio. Los registros usados por la interfaz son sinteticos.

## Entorno

- Node.js `>=20.19.0`
- npm `>=10.0.0`
- Git

En esta maquina se observo Node.js `v20.10.0` y npm `10.2.3`. Los scripts se dejaron compatibles con esa version local, pero el requisito declarado del curso sigue siendo Node.js `20.19` o posterior compatible.

## Setup

```bash
npm ci
```

El proyecto conserva `package-lock.json` para que la instalacion sea reproducible.

## Ejecucion

```bash
npm run dev
```

Abrir `http://localhost:3000`. La pantalla muestra el shell de inspecciones, navegacion interna, resumen del manifest y las inspecciones sinteticas.

## Verificacion

```bash
npm test
npm run build
make verify
bash public-tests/check.sh
```

`make verify` ejecuta el equivalente local de `npm run verify`: prueba automatizada y build de Next.js. El reporte local se genera en `reports/verification.json` y no se versiona.

La prueba `tests/manifest.spec.ts` valida comportamiento critico de esta semana: propiedades principales de `public/manifest.webmanifest`, existencia de iconos, referencia del manifest desde `layout.tsx`, uso de `AppShell` desde `page.tsx`, navegacion principal y textos de estados de carga, error y vacio.

## Evidencia de Semana 2

Artefactos agregados o actualizados:

- `public/manifest.webmanifest`
- `public/icons/icon-192.svg`
- `public/icons/icon-512.svg`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/app-shell.tsx`
- `tests/manifest.spec.ts`
- `.github/workflows/week-02-w02-shell-manifest.yml`
- `public-tests/check.sh`
- `evidence/individual.md`

## Decisiones y supuestos

La decision principal fue separar el shell en `src/components/app-shell.tsx` para que `src/app/page.tsx` solo conecte datos sinteticos con la interfaz. Esto permite probar el manifest y los estados sin mezclar la pagina de Next.js con todo el marcado de presentacion.

El manifest usa `display: "standalone"`, `start_url: "/"` y `scope: "/"` porque esta entrega solo cubre instalacion progresiva del shell. Los iconos se entregan como SVG locales para evitar depender de servicios externos o archivos generados fuera del repositorio.

## Limites conocidos

Esta semana no implementa service worker, cache offline, sincronizacion, autenticacion, notificaciones ni persistencia local. El shell muestra y documenta estados de carga, error y vacio, pero los datos actuales siguen cargandose desde el arreglo sintetico del proyecto.

`npm install --package-lock-only` reporto vulnerabilidades de dependencias transitivas. No se aplico `npm audit fix --force` porque podria introducir cambios mayores fuera del alcance de la actividad.

## Entrega

Antes de entregar, fijar el commit con:

```bash
git rev-parse HEAD
```

Entregar ese SHA junto con el enlace del repositorio o pull request y la seccion correspondiente de `evidence/individual.md`.
