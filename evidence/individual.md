# Evidencia individual del equipo

> Un solo archivo compartido. Repitan la sección siguiente por cada integrante; cada persona escribe y explica su propia evidencia. Se aceptan evidencias previas equivalentes. El SHA final se entrega en Classroom después del último commit, para evitar modificar el commit que se está identificando.

- Grupo y equipo: 9B-E05
- Repositorio del equipo: https://github.com/zimber1/pwa-inspecciones-laboratorio.git

## Integrante: Claudia Espíndola López

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Preparé el entorno de desarrollo requerido para el proyecto, revisé el starter proporcionado y realicé las comprobaciones técnicas iniciales. También participé en la elaboración de la documentación de requisitos y en el registro de la decisión sobre la estrategia de aplicación. La evidencia de Git se vinculará en el commit correspondiente una vez que se realice.

- Decisión que puedo explicar y por qué:

  Participé en la decisión de utilizar una PWA para el proyecto. La elección se relaciona con la necesidad de considerar escenarios de conectividad intermitente, además de permitir una distribución basada en tecnologías web y una evolución progresiva hacia instalación, almacenamiento local y sincronización.

- Comando o prueba proporcionada que ejecuté:

  `npm ci`

  `npm test`

  `npm run build`

  `npm run verify`

- Resultado real que observé:

  `npm ci` instaló correctamente las dependencias utilizando el `package-lock.json`.

  `npm test` ejecutó la prueba proporcionada por el starter y mostró `starter.spec.mjs: PASS`.

  `npm run build` compiló correctamente el proyecto en la ubicación definitiva fuera de la carpeta sincronizada por OneDrive.

  `npm run verify` ejecutó correctamente la prueba y la compilación, mostrando `Verificación técnica: pass` y generando el reporte `reports/verification.json`.

- Qué verifica esa prueba y qué no verifica:

  La prueba proporcionada comprueba aspectos básicos del starter, incluyendo la existencia del script de compilación y elementos esperados en la página inicial. `npm run build` permite comprobar que el proyecto puede compilarse correctamente y `npm run verify` reúne estas comprobaciones y genera el reporte de verificación.

  Estas pruebas no verifican por sí mismas la accesibilidad, el rendimiento, el funcionamiento offline, la sincronización ni todas las funcionalidades futuras del producto.

- Limitación, dificultad o riesgo que identifiqué:

  Durante la ejecución inicial del proyecto ubicado dentro de OneDrive, `npm run build` permaneció detenido después de iniciar `next build`. Para comprobar si el problema estaba relacionado con el proyecto o con el entorno, se realizó una copia del starter fuera de OneDrive. En esa ubicación el build y `npm run verify` terminaron correctamente. Por ello, la situación se identificó como una dificultad del entorno de ejecución y no se modificó el código del starter para ocultarla.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia:

  Utilicé ChatGPT como herramienta de apoyo para analizar las instrucciones de la actividad, organizar la documentación y revisar la redacción de los documentos del proyecto. La IA influyó en la estructura y redacción de `docs/requirements.md`, `docs/decision-record.md` y esta evidencia individual. Las decisiones finales y los resultados técnicos fueron revisados personalmente y se basan en las ejecuciones realizadas en el entorno del proyecto.

### Registro de Evidencia — Actividad 02

- Commit SHA:
    `92a3b7d024b75fdd6a794df025c94ce58ea930ae`

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Actualicé `src/app/layout.tsx` para alinear la configuración de iconos de Next.js con los recursos PNG disponibles en `public/icons/` y con los iconos declarados por el manifest de la Semana 2. También actualicé `README.md` para documentar correctamente el entorno requerido, los artefactos de la semana y la decisión de utilizar iconos PNG locales.

- Decisión técnica y justificación:

  Actualicé la configuración de iconos de `layout.tsx` para que coincidiera con los archivos PNG disponibles en `public/icons/` y con los recursos declarados por el manifest. Esta decisión evita referencias inconsistentes entre la configuración de Next.js y los recursos reales del proyecto. También actualicé `README.md` para mantener documentados los artefactos y decisiones correspondientes a la Semana 2.

- Prueba ejecutada:

  `npm run build`

- Resultado real:

  La compilación de producción de Next.js terminó correctamente. Se obtuvo `Compiled successfully`, se completó la validación de tipos y se generaron las páginas estáticas sin errores.

- Qué verifica y qué no verifica:

  `npm run build` verifica que los cambios realizados en `layout.tsx` y la configuración actual del proyecto sean válidos para la compilación de producción de Next.js.

  Esta prueba no verifica por sí sola la instalación real de la PWA, el funcionamiento offline, la sincronización, la persistencia local ni todas las funcionalidades del producto.

- Limitación o dificultad identificada:

  Durante la revisión se identificó una inconsistencia entre los iconos referenciados originalmente desde `layout.tsx` y los recursos PNG utilizados actualmente por el manifest. Se corrigió la referencia para mantener coherencia entre los metadatos de la aplicación y los archivos disponibles en el repositorio.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia:

  Utilicé ChatGPT como herramienta de apoyo para revisar la correspondencia entre los archivos de la Semana 2, analizar la configuración existente y estructurar la documentación de esta evidencia. Los cambios realizados fueron revisados manualmente y validé el resultado ejecutando `npm run build`.

  ### Registro de Evidencia — Actividad 03 (Semana 3)

- **Rama de trabajo:** `feature/PWA-03-Claudia`

- **Commit SHA:** Se agregará después del commit final con `git rev-parse HEAD`.

- **Contribución:** 
Implementé `tests/service-worker.spec.ts` y `tests/offline.spec.ts` para validar el ciclo de vida del Service Worker, las cachés `pwa-static-v1` y `pwa-dynamic-v1`, el App Shell, peticiones GET, las estrategias `Network First` y `Cache First` y el fallback HTTP `503`. También actualicé `README.md` con la documentación técnica de la Semana 3 y realicé la verificación de integración.

- **Decisión técnica:** 
Utilicé pruebas automatizadas basadas en aserciones sobre `public/sw.js` para validar comportamientos críticos de forma reproducible y detectar regresiones sin depender únicamente de pruebas manuales.
- **Pruebas ejecutadas:** 
`npm test`, 
`npm run build`, 
`npx tsx tests/service-worker.spec.ts` 
 `npx tsx tests/offline.spec.ts`.

- **Resultado:** 
La suite completa terminó correctamente: `starter.spec.mjs`, `manifest.spec.ts`, `register-service-worker.spec.ts`, `service-worker.spec.ts` y `offline.spec.ts` en `PASS`. El build de Next.js también finalizó correctamente.

- **Aporte técnico:** 
Las pruebas cubren ciclo de vida, estrategias de caché, recuperación offline y fallback controlado. Esto permite verificar automáticamente parte del comportamiento crítico implementado durante la Semana 3.

- **Limitación:**
 Las pruebas no sustituyen la validación en navegadores y dispositivos reales bajo diferentes condiciones de conectividad. Si un recurso no está disponible en caché y no existe conexión, el Service Worker devuelve HTTP `503`.

- **Cambio que puedo defender:** Puedo explicar y modificar las pruebas relacionadas con `install`, `activate` y `fetch`, `Cache Storage`, `Network First`, `Cache First` y el fallback `503`.

- **Uso de IA:** Utilicé ChatGPT como apoyo para interpretar los requerimientos, estructurar las pruebas y revisar la documentación. Revisé los cambios y validé personalmente la implementación mediante las pruebas y el build.

## Integrante: Felix Ivan Garcia Flores (3523110172)

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Ejecuté las pruebas y verificaciones del entorno técnico del starter de la Actividad 01 en la rama `feature/felix-evidencias`. Revisé la estructura del proyecto y colaboré en la revisión de la documentación técnica (`docs/requirements.md` y `docs/decision-record.md`). Archivo modificado: `evidence/individual.md`.

- Decisión que puedo explicar y por qué:

  Justifiqué la selección de PWA sobre aplicaciones nativas o web tradicionales, explicando que PWA permite mantener un único código base en Next.js y evolucionar gradualmente hacia el almacenamiento local y sincronización ante escenarios de conectividad intermitente, reduciendo costos de desarrollo y manteniendo distribución web.

- Comando o prueba proporcionada que ejecuté:

  `node -v`

  `npm -v`

  `npm ci`

  `npm test`

  `npm run build`

  `npm run verify`

- Resultado real que observé:

  `node -v` devolvió la versión `v20.19.5`.

  `npm -v` devolvió la versión `10.8.2`.

  `npm ci` instaló correctamente las dependencias utilizando el `package-lock.json` (`added 28 packages in 34s`).

  `npm test` ejecutó la prueba del starter y reportó `starter.spec.mjs: PASS`.

  `npm run build` realizó la compilación de producción de Next.js de manera exitosa (`✓ Compiled successfully`).

  `npm run verify` ejecutó el flujo completo de prueba y build, mostrando `Verificación técnica: pass` y generando el reporte `reports/verification.json`.

- Qué verifica esa prueba y qué no verifica:

  Verifica la integridad sintáctica de la página inicial del starter, que las dependencias instalen de manera reproducible con el lockfile y que el proyecto compile adecuadamente sin errores de compilación.

  No verifica la funcionalidad offline, service worker, manifest, sincronización en segundo plano, notificaciones, ni criterios de accesibilidad o rendimiento que se abordarán en semanas futuras.

- Limitación, dificultad o riesgo que identifiqué:

  Se identificó la necesidad de asegurar la ejecución bajo Node.js 20.19.5 mediante NVM para mantener reproducibilidad exacta con las restricciones de la actividad, así como asegurar que el ejecutable `next` se invoque a través del entorno de scripts de npm (`node_modules/.bin`) para evitar errores de comandos no encontrados.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia:

  Utilicé Antigravity como herramienta de apoyo para organizar la ejecución de comandos de verificación en el entorno local, estructurar los resultados observados y redactar de forma clara esta evidencia individual. Las pruebas y resultados técnicos fueron verificados directamente por mí en el sistema.

### Registro de Evidencia — Actividad 02

- Commit SHA:

  55c4e54ebea7d7ea3d63c78f5989ce11e524f12b

- Decisión Técnica (Justificación):

  Decidí adaptar la suite de pruebas del manifest al formato nativo `.mjs` (`tests/manifest.spec.mjs`). Esta adaptación fue necesaria para asegurar la compatibilidad con el entorno Node.js 20.19.6 de GitHub Actions, el cual no soporta ejecución nativa de `.ts` ni banderas experimentales como `--experimental-strip-types`, garantizando así que las comprobaciones pasen exitosamente sin alterar la configuración del repositorio.

- Prueba Ejecutada:

  `npm test` y `npm run verify`

- Resultado (Obtenido vs. Esperado):

  Esperado: Que las pruebas validen exitosamente todas las propiedades del PWA manifest (W3C) y logren un `PASS` verde en el flujo automatizado de GitHub Actions.
  Obtenido: La prueba local aprobó (`manifest.spec.mjs: PASS`) y la validación remota completó el build y los checks técnicos exitosamente (Exit code 0).

- Limitación (Obstáculos / Retos):

  El obstáculo principal fue el quiebre del pipeline en GitHub Actions debido al uso de características de TypeScript no soportadas nativamente por la versión antigua de Node en el servidor. El reto se superó diagnosticando el log de CI y migrando la prueba al formato ESM aceptado por el proyecto original, estabilizando el pipeline.

- Uso de IA (Si corresponde, describir):

  Utilicé el asistente para diagnosticar rápidamente el error del pipeline CI ("bad option: --experimental-strip-types") y para estructurar correctamente los commits bajo el estándar Conventional Commits. Revisé y verifiqué los resultados localmente antes del push final.

### Registro de Evidencia — Actividad 03 (Semana 3)

- Commit SHA:

  8f43241254e0591e9edc8a68dfe90a1a145fc638

- Decisión Técnica (Justificación):

  Decidí implementar una estrategia de Network First para la navegación HTML para asegurar que los usuarios siempre tengan la versión más reciente de la aplicación cuando haya red, cayendo a un fallback offline si falla. Para los recursos estáticos (App Shell, CSS, JS), elegí Cache First, priorizando la velocidad y el ahorro de ancho de banda. Todo esto quedó documentado con diagramas de Mermaid en `docs/cache-strategy.md`.

- Prueba Ejecutada:

  Verificación manual del registro e intercepción a través de Chrome DevTools (Application > Service Workers y Cache Storage). Simulación de conectividad "Offline" en la pestaña Network y recarga de página para observar el comportamiento de fallback.

- Resultado (Obtenido vs. Esperado):

  Esperado: El Service Worker se instala, cachea los recursos estáticos definidos y, al desactivar la red, la aplicación continúa mostrando la interfaz (App Shell) o una respuesta fallback sin colgar el navegador con el error predeterminado.
  Obtenido: La caché estática se pobló correctamente en el evento de instalación y la intercepción de peticiones estáticas entregó recursos locales (Status 200 via Service Worker).

- Limitación (Obstáculos / Retos):

  La principal limitación fue gestionar el ciclo de vida del Service Worker (evitar el estado "waiting" usando `self.skipWaiting()` y `self.clients.claim()`) para asegurar que la nueva estrategia de caché entrara en vigor inmediatamente sin que el usuario tuviera que cerrar todas las pestañas. 

- Cambio que puede explicar o modificar:

  Podría modificar y mejorar el manejo de la caché estática, por ejemplo, implementando un mecanismo de versionado más dinámico (como añadir un hash al nombre de los archivos cacheables) para evitar problemas si cambian los recursos estáticos pero no se actualiza la versión `pwa-static-v1`.

- Uso de IA (Si corresponde, describir):

  Utilicé Antigravity (Gemini) como asistente de programación por pares (pair programming) para estructurar el núcleo del `sw.js` (incluyendo los eventos install, activate y fetch), redactar el documento técnico `docs/cache-strategy.md` con la sintaxis de diagramas Mermaid, y formular de forma clara la presente evidencia técnica bajo el formato requerido. Se realizaron commits atómicos locales revisados en conjunto.

## Integrante: Cesar Gaspar Pacheco (3522110305)

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Implementé el incremento de Semana 2 para el shell instalable de la PWA. Agregué `public/manifest.webmanifest`, iconos locales, el componente `src/components/app-shell.tsx`, la integración desde `src/app/layout.tsx` y `src/app/page.tsx`, la prueba `tests/manifest.spec.ts`, el check público de Semana 2 y la documentación de verificación en `README.md`.

- Decisión que puedo explicar y por qué:

  Separé el shell en `src/components/app-shell.tsx` para que `src/app/page.tsx` solo conecte los datos sintéticos con la interfaz. Esta decisión deja el manifest, la navegación principal y los estados de carga, error y vacío en un componente inspeccionable y más fácil de probar, sin implementar todavía funcionalidades futuras como offline o sincronización.

- Comando o prueba proporcionada que ejecuté:

  `npm ci`

  `npm run test -- --run`

  `npm run build`

  `npm run verify`

  `bash public-tests/check.sh`

- Resultado real que observé:

  `npm ci` instaló correctamente las dependencias, aunque mostró un aviso porque la terminal local usa Node.js `v20.10.0` y el proyecto declara `>=20.19.0`.

  `npm run test -- --run` terminó correctamente y mostró `starter.spec.mjs: PASS` y `manifest.spec.ts: PASS`.

  `npm run build` compiló correctamente el proyecto con Next.js.

  `npm run verify` terminó con `Verificación técnica: pass` y generó `reports/verification.json`.

  `bash public-tests/check.sh` terminó con `PUBLIC_OK`.

- Qué verifica esa prueba y qué no verifica:

  La prueba de Semana 2 verifica que el manifest tenga nombre, `short_name`, `start_url`, `scope`, `display`, colores e iconos esperados; también comprueba que `layout.tsx` referencie el manifest, que `page.tsx` use `AppShell` y que el shell contenga navegación principal y estados de carga, error y vacío.

  No verifica instalación real en todos los navegadores, funcionamiento offline, service worker, sincronización, notificaciones, autenticación ni persistencia local. Esas capacidades quedan fuera del alcance de esta semana.

- Limitación, dificultad o riesgo que identifiqué:

  `make verify` no se pudo ejecutar porque `make` no está instalado en esta máquina; ejecuté el equivalente exacto `npm run verify`, que es el comando llamado por el Makefile. También identifiqué que `npm ci` reporta vulnerabilidades de dependencias transitivas y no apliqué `npm audit fix --force` porque podría cambiar versiones fuera del alcance de la actividad.

- Commit SHA evaluado:

  El SHA final se fija al cerrar la entrega con `git rev-parse HEAD` y se reporta fuera de este archivo para no modificar el mismo commit que se está identificando.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia:

  Utilicé ChatGPT/Codex como apoyo para interpretar el kit de Semana 2, revisar los checks, implementar el shell, redactar pruebas y organizar esta evidencia. Validé manualmente los archivos modificados y ejecuté los comandos de prueba, build, verificación y check público antes de preparar la entrega.

## Semana 03 - Cesar Gaspar Pacheco (3522110305)

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Implementé mi parte individual de la Semana 03. Creé `src/lib/pwa/register-service-worker.ts`, integré su llamada desde `src/components/app-shell.tsx`, revisé la duplicidad entre `src/app/manifest.ts` y `public/manifest.webmanifest`, y agregué `tests/register-service-worker.spec.ts` para comprobar el comportamiento del registro sin depender del navegador real.

- Commit SHA evaluado:

  El SHA final se obtiene después del commit con `git rev-parse HEAD` y se reporta en la entrega. No lo escribo aquí como valor fijo porque modificar este archivo cambiaría el hash del commit.

- Decisión técnica que puedo explicar:

  Conservé `public/manifest.webmanifest` como manifest activo y eliminé `src/app/manifest.ts`. Lo hice porque `layout.tsx` ya enlaza explícitamente `/manifest.webmanifest` y porque, al probar la aplicación con ambos archivos, Next.js devolvió error 500 por conflicto entre el archivo público y la ruta especial generada por `src/app/manifest.ts`. Después de eliminar la ruta duplicada, `curl http://localhost:3000/manifest.webmanifest` respondió `200 application/manifest+json` con el manifest público.

- Prueba que ejecuté y resultado:

  `npm run test -- --run` terminó correctamente con `starter.spec.mjs: PASS`, `manifest.spec.ts: PASS` y `register-service-worker.spec.ts: PASS`.

  `npm run build` compiló correctamente la aplicación con Next.js.

  `npm run verify` terminó con `Verificación técnica: pass` y generó `reports/verification.json`.

  También comprobé manualmente `http://localhost:3000/manifest.webmanifest` y respondió `200 application/manifest+json`.

- Limitación o fallo diagnosticado:

  `public/sw.js`, `docs/cache-strategy.md`, `tests/service-worker.spec.ts` y `tests/offline.spec.ts` corresponden a otros integrantes según mi tarjeta de actividad. Por eso mi cambio registra `/sw.js` de forma segura y maneja el fallo si el archivo aún no existe, pero no implementa el contenido del service worker ni la estrategia completa de caché offline.

- Cambio que podría defender o modificar en vivo:

  Puedo explicar el guardado del registro del service worker: solo se ejecuta en navegador, requiere soporte de `navigator.serviceWorker`, evita contextos inseguros fuera de localhost/HTTPS y registra errores con `console.warn` sin bloquear la carga de la aplicación.

- Uso declarado de IA (herramienta, propósito, validación):

  Utilicé ChatGPT/Codex para interpretar el kit de Semana 03, contrastarlo con mi tarjeta individual, revisar el conflicto real de manifests, redactar el registro del service worker y preparar pruebas. Validé personalmente los archivos modificados y ejecuté las pruebas, build, verificación y comprobación manual del manifest antes de entregar.
