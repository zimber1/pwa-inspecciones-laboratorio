# Estrategia de pruebas — Semana 8

## 1. Objetivo

Definir cómo se verifican la calidad, la persistencia local, el comportamiento de la cola de operaciones y los flujos críticos de la PWA de inspecciones de laboratorio.

## 2. Alcance

La estrategia contempla tres niveles:

- **Unitarias:** validación de datos, idempotencia y comportamiento de funciones aisladas.
- **Integración:** interacción entre persistencia local, creación de inspecciones y cola de sincronización.
- **End-to-end (E2E):** recorrido de usuario para crear una inspección sintética y comprobar que permanece disponible después de recargar la página.

## 3. Datos de prueba

Se utilizan datos sintéticos. Las pruebas no deben incluir datos personales reales, credenciales ni secretos.

## 4. Ejecución local

Requisitos: Node.js 20.19.0 o posterior compatible con el proyecto y npm 10 o posterior.
Next.js 16.4.3 permite React 18.3.1, aunque informa que ese soporte se
deprecará en Next.js 17. Se debe validar la migración a React 19 antes de
actualizar el framework a esa versión.

```powershell
npm ci
npm run verify
```

`npm run verify` es la ruta completa recomendada y ejecuta cada etapa una
sola vez. Para ejecutar una capa de forma aislada:

```powershell
npm run typecheck
npm run test:unit
npm run test:integration
npx playwright install chromium
npm run test:e2e
npm run build
npm test
```

`npm run test:unit` ejecuta los casos unitarios de validación e idempotencia.
`npm run test:integration` utiliza `node:test` para probar creación,
almacenamiento local, recuperación, conectividad, cola y fallos simulados.
`npm run test:e2e` usa Playwright/Chromium para comprobar el flujo de captura
en navegador, incluida la persistencia después de recargar. `npm test` ejecuta
la regresión y la integración.

Para ejecutar E2E con el navegador visible:

```powershell
npm run test:e2e:headed
```

La primera ejecución de Playwright requiere instalar el navegador Chromium:

```powershell
npx playwright install chromium
```

## 5. Criterios de aprobación

- La comprobación de tipos termina sin errores.
- Las pruebas unitarias e integración terminan con código de salida cero.
- Las pruebas E2E se ejecutan mediante Playwright y terminan sin fallos.
- La compilación de producción termina correctamente.
- La verificación registra los resultados técnicos y distingue estos de la evaluación académica.

## 6. Evidencias y reportes

`npm run test:coverage` genera `coverage/lcov.info` y `test-results/junit.xml`.
En CI, Playwright produce `test-results/e2e-junit.xml` y `playwright-report/`;
localmente guarda trazas y capturas cuando una prueba falla.
`npm run verify` ejecuta tipos, regresión/unitarias/integración, E2E y build en
ese orden, y genera `reports/verification.json`. CI publica los reportes con un
paso `always()` aunque fallen las comprobaciones.

Las evidencias individuales deben registrar los comandos ejecutados, sus resultados reales, las decisiones técnicas, las limitaciones conocidas y el uso de herramientas de IA.

## 7. Limitaciones conocidas

La prueba E2E actual valida la creación y persistencia local de una inspección sintética. No demuestra sincronización exitosa con un servidor remoto. El proyecto no debe declarar una sincronización remota confirmada mientras no exista un servicio remoto configurado y verificado.

La cobertura medida corresponde únicamente a los archivos incluidos en el comando de cobertura; no equivale a cobertura total de la aplicación.

## 8. Integración continua

GitHub Actions instala las dependencias de forma reproducible, instala
Chromium y ejecuta `npm run verify`. La verificación invoca cada etapa una vez;
la ausencia o el fallo de una prueba obligatoria produce un resultado distinto
de cero.

## 9. Revisión académica

La automatización informa resultados técnicos, pero no asigna una calificación académica. La revisión de requisitos, decisiones, documentación y evidencias por integrante permanece pendiente de evaluación.
