# Estrategia de pruebas — Semana 09

## Objetivo y alcance

La verificación combina pruebas automatizadas de distintas capas y registra por
separado los resultados técnicos y la revisión académica. Los datos de prueba
son sintéticos; no deben incluir datos personales, credenciales ni secretos.

- **Regresión:** `tests/starter.spec.mjs`, `tests/manifest.spec.ts`,
  `tests/register-service-worker.spec.ts`,
  `tests/service-worker.spec.ts`, `tests/offline.spec.ts`,
  `tests/rendering.spec.ts`, `tests/queue.spec.ts`, `tests/sync.spec.ts`,
  `tests/capabilities.spec.ts` y `tests/device-capabilities.spec.ts`.
- **Unitarias:** `tests/unit/validation.spec.ts` y
  `tests/unit/idempotency.spec.ts`; verifican reglas aisladas de validación e
  idempotencia.
- **Integración:** `tests/integration/queue.spec.ts` y
  `tests/integration/inspections.spec.ts`; ejercitan la cola, la creación de
  inspecciones, el almacenamiento local, la recuperación, conectividad y
  fallos usando almacenamiento y un handler simulado.
- **E2E:** Playwright comprueba la creación y persistencia local de una
  inspección sintética (`tests/e2e/inspections.spec.ts`) y que el servidor
  entregue la política presente en `public/robots.txt`
  (`tests/e2e/security.spec.ts`).
- **Seguridad:** solo se valida automáticamente la respuesta HTTP de
  `robots.txt` y sus directivas actuales. Las pruebas existentes del Service
  Worker comprueban, entre otros comportamientos, el filtrado de respuestas
  en la estrategia Cache First y el fallback offline; no cubren todos los
  controles de seguridad descritos a continuación.

## Comandos

Requisitos: Node.js `>=20.19.0` y npm `>=10.0.0`.

```powershell
npm ci
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:coverage
npx playwright install chromium
npm run test:e2e
npm run build
npm run verify
```

`npm test` ejecuta la regresión, las pruebas unitarias y las dos suites de
integración. `npm run test:integration` ejecuta ambas suites de integración;
`npm run test:e2e` ejecuta todas las pruebas de `tests/e2e/`. Para probar solo
la política HTTP de robots con Playwright:

```powershell
npx playwright test tests/e2e/security.spec.ts
```

La primera ejecución E2E puede requerir instalar Chromium. Para abrir el
navegador durante las pruebas se puede usar `npm run test:e2e:headed`.

## Reportes

`npm run test:coverage` ejecuta una vez las pruebas de regresión, unitarias y
ambas suites de integración. Genera:

- `coverage/lcov.info` (LCOV).
- `test-results/junit.xml` (JUnit).

La cobertura corresponde solamente a los archivos instrumentados por ese
comando; no representa cobertura total ni incluye los flujos E2E del navegador.
Playwright usa un reporter de lista en local; en CI configura JUnit en
`test-results/e2e-junit.xml` y el reporte HTML `playwright-report/`. Sus
trazas y capturas se aíslan en `test-results/e2e-results/` para que Playwright
no elimine los reportes JUnit de la suite automatizada al iniciar E2E.

## Verificación técnica y evaluación académica

`npm run verify` comprueba primero la estructura requerida. Si está completa,
ejecuta, en orden y una sola vez cada etapa: comprobación de tipos, pruebas
automatizadas con cobertura, E2E y compilación de producción. Si falta
estructura, registra las etapas no ejecutadas como `skipped`, produce el
reporte y termina con un código distinto de cero. Cualquier fallo de una etapa
también produce un código distinto de cero. El reporte técnico se escribe en
`reports/verification.json`.

El reporte distingue la **verificación técnica** automatizada de la
**evaluación académica**, que permanece `pending` y requiere revisión humana de
requisitos, decisiones y evidencia. La existencia de archivos o pruebas no
asigna una calificación ni acredita por sí sola la calidad del producto.

## Hallazgos de seguridad y limitaciones

- `public/robots.txt` se sirve y declara `User-agent: *` y `Disallow: /`. Esto
  solicita a los rastreadores que no recorran ninguna ruta; no es un control de
  acceso ni protege información frente a clientes o rastreadores que ignoren
  la directiva.
- `next.config.mjs` no configura `Content-Security-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`,
  `Referrer-Policy` ni `Permissions-Policy`. No se reportan estas cabeceras
  como verificadas. No se introduce una CSP en esta contribución porque no hay
  una política validada frente a los scripts y recursos actuales.
- En `public/sw.js`, la estrategia Network First almacena respuestas de red
  sin comprobar su estado HTTP; una respuesta 500 puede entrar en la caché
  dinámica. Las ramas de caché no excluyen respuestas con
  `Cache-Control: no-store`; la validación de estado y tipo existente solo
  protege la escritura de respuestas no exitosas/no básicas en Cache First.
  Las pruebas actuales no verifican que un 500 o una respuesta `no-store` se
  excluyan de la caché.
- La sincronización se prueba con un handler simulado. No existe en estas
  pruebas una integración remota real ni evidencia de que un servidor remoto
  haya confirmado operaciones.
- `tests/manifest.spec.mjs` es un archivo legado no incluido en los scripts
  existentes; ejecutarlo directamente falla porque exige una propiedad `id`
  que no está en el manifest actual. La suite activa de manifiesto es
  `tests/manifest.spec.ts`; no se cambió la funcionalidad ni el test legado.
- E2E requiere un navegador compatible instalado. La ejecución local no
  certifica el estado de GitHub Actions ni la ausencia de secretos.
