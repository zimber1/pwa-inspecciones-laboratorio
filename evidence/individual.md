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

- **Commit SHA:** 75b87b71dd5387fcac08f36fd69d16f58b8a6170

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

## Semana 04 - Claudia Espindola Lopez (Integracion y pruebas)

- Mi contribucion concreta:

  Implemente la prueba automatizada `tests/rendering.spec.ts` para verificar de forma determinista las rutas CSR y SSR de la Semana 04. Tambien integre la prueba al script `npm test`.

  Prepare `docs/rendering-decision.md` para documentar la comparacion tecnica entre CSR y SSR, incluyendo contexto, alternativas, decision, consecuencias, limitaciones y validacion.

  Actualice `README.md` para documentar las rutas de Semana 04, los estados de carga y error, las pruebas de renderizado, las limitaciones y los resultados verificados.

  Tambien realice la integracion y revision final de los cambios de Semana 04 antes de la verificacion del proyecto.

- Commit SHA evaluado:

  `39ad525ebd9dff48a3497d0b5cd8825885763d26`

  Este SHA corresponde al commit de cierre de Semana 04 que contiene la implementacion de las pruebas CSR y SSR, la documentacion de la decision de renderizado, la actualizacion del README y la integracion de la prueba `rendering.spec.ts`. Esta version fue verificada mediante `npm run verify` y publicada en `main`.

- Decision tecnica que puedo explicar:

  Utilice pruebas automatizadas basadas en aserciones sobre los archivos de las rutas CSR y SSR para comprobar de forma reproducible que cada estrategia mantiene los elementos tecnicos esperados.

  Para CSR se verifica el uso de `"use client"`, `useEffect`, `useState`, los datos sinteticos y los estados `loading`, `ready` y `error`.

  Para SSR se verifica que la ruta no utilice `"use client"`, que implemente un componente asincrono, que utilice `params.id` y que maneje identificadores inexistentes mediante `notFound()`.

  La documentacion de `docs/rendering-decision.md` registra la razon tecnica para mantener CSR en el listado `/inspecciones` y SSR en el detalle `/inspecciones/[id]`.

- Prueba que ejecute y resultado:

  `npx tsx tests/rendering.spec.ts`

  Resultado:

  `rendering.spec.ts: PASS`

  Tambien ejecute:

  `npm test`

  Resultado:

  `starter.spec.mjs: PASS`
  `manifest.spec.ts: PASS`
  `register-service-worker.spec.ts: PASS`
  `service-worker.spec.ts: PASS`
  `offline.spec.ts: PASS`
  `rendering.spec.ts: PASS`

- Que verifica y que no verifica:

  `tests/rendering.spec.ts` verifica la existencia de las rutas, la configuracion CSR y SSR, los estados de carga y error, el uso de datos sinteticos, `params.id`, `notFound()` y los componentes asociados a los estados de carga y recurso no encontrado.

  La prueba es una validacion estructural y determinista de los archivos del proyecto. No sustituye una prueba real en navegador, dispositivo, red o comportamiento visual de la aplicacion.

- Limitacion o fallo diagnosticado:

  Las rutas CSR y SSR utilizan modelos de datos sinteticos diferentes. El listado utiliza `src/lib/data/inspections.ts`, mientras que el detalle mantiene sus datos sinteticos dentro de `src/app/inspecciones/[id]/page.tsx`.

  Por lo tanto, la implementacion demuestra las estrategias de renderizado de la Semana 04, pero todavia no utiliza una unica fuente de datos compartida ni un backend real.

  Otra limitacion es que la prueba automatizada no sustituye la validacion manual en navegador bajo diferentes condiciones de red.

- Cambio que podria defender o modificar en vivo:

  Puedo explicar la diferencia entre CSR y SSR en las rutas implementadas, el flujo de estados de carga y error, el uso de `useEffect` y `useState` en CSR, el uso de componentes de servidor en SSR y el manejo de rutas inexistentes mediante `notFound()`.

  Tambien puedo explicar como `tests/rendering.spec.ts` comprueba estos contratos tecnicos y como fue integrado al comando general `npm test`.

- Uso declarado de IA (herramienta, proposito, validacion):

  Utilice ChatGPT como herramienta de apoyo para interpretar los requerimientos de la Semana 04, revisar la implementacion existente, estructurar `tests/rendering.spec.ts`, organizar `docs/rendering-decision.md` y actualizar la documentacion del `README.md`.

  Revise manualmente los cambios realizados y valide la implementacion ejecutando las pruebas correspondientes y la suite general del proyecto. Los resultados registrados en esta evidencia corresponden a ejecuciones realizadas en el entorno local del proyecto.
  ## Semana 05 - Claudia (Integración y Verificación)

- **Mi contribución concreta:**

  Integré y verifiqué los entregables de persistencia local y sincronización de la Semana 05. Revisé la integración entre `src/lib/storage/schema.ts`, `src/lib/sync/queue.ts`, `src/lib/sync/conflict-policy.ts`, `tests/queue.spec.ts` y `tests/sync.spec.ts`. También actualicé `README.md` con la documentación de Semana 05 y consolidé `docs/sync-policy.md` para reflejar el estado integrado del proyecto.

- **Commit SHA evaluado:**

  El SHA final se confirmará después del commit de cierre de la integración mediante `git rev-parse HEAD`.

- **Decisión técnica que puedo explicar:**

  Mantuve separadas las responsabilidades de persistencia, cola y resolución de conflictos. La cola conserva las operaciones pendientes y utiliza persistencia local, mientras que la política de conflictos determina de forma determinista qué versión de una inspección debe prevalecer. La integración conserva la responsabilidad individual de cada integrante y evita duplicar la implementación de sus componentes.

- **Pruebas ejecutadas y resultado:**

  `npm test`

  Resultado: las 8 pruebas terminaron correctamente:

  `starter.spec.mjs: PASS`  
  `manifest.spec.ts: PASS`  
  `register-service-worker.spec.ts: PASS`  
  `service-worker.spec.ts: PASS`  
  `offline.spec.ts: PASS`  
  `rendering.spec.ts: PASS`  
  `queue.spec.ts: PASS`  
  `sync.spec.ts: PASS`

  `npm run build`

  Resultado: compilación de producción correcta con Next.js `14.2.35`, incluyendo las rutas `/`, `/inspecciones` y `/inspecciones/[id]`.

  `npm run verify`

  Resultado: `Verificación técnica: pass`. El proceso volvió a ejecutar las pruebas y el build, y generó `reports/verification.json`.

- **Qué verifica y qué no verifica:**

  La validación confirma que los componentes y pruebas integrados de la Semana 05 funcionan conjuntamente dentro de la suite actual y que el proyecto mantiene compilación y verificación técnica correctas.

  No implica que exista una integración real con un servidor institucional ni que la revisión académica esté aprobada. Tampoco sustituye las pruebas específicas de cada componente individual.

- **Limitación o dificultad identificada:**

  La principal dificultad de integración fue coordinar componentes desarrollados en ramas individuales y conservar sus responsabilidades sin sobrescribir el trabajo de otros integrantes. También fue necesario actualizar la documentación para que reflejara el estado integrado de la Semana 05.

- **Uso declarado de IA herramienta, propósito, partes influenciadas y validación propia:**

  Utilicé ChatGPT/Codex como apoyo para revisar la integración de Semana 05, organizar la documentación, revisar la evidencia y estructurar las verificaciones. Validé personalmente los cambios ejecutando `npm test`, `npm run build` y `npm run verify`, y revisé los resultados obtenidos antes de preparar la entrega.

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

  ## Semana 04 - Felix (Ruta SSR: Detalle de Inspeccion)

- Mi contribucion concreta y enlace a archivo, commit anterior o revision:

  Implemente la ruta dinamica SSR para el detalle de inspecciones en src/app/inspecciones/[id]/page.tsx, trabajando con datos sinteticos y manejando los estados de carga con src/app/inspecciones/[id]/loading.tsx y src/components/loading-state.tsx, asi como el estado de error con src/app/inspecciones/[id]/not-found.tsx.

- Commit SHA evaluado:

  SHA del commit principal de mi implementacion SSR: 783099b. (El SHA final exacto se reportara al enviar la entrega, usando git rev-parse HEAD).

- Decision tecnica que puedo explicar:

  Utilice Server-Side Rendering (SSR) de Next.js (Componentes de Servidor asincronos). AÃ±adi un retraso artificial de 1500ms mediante una Promesa para poder comprobar visualmente el estado de carga y validar que el archivo loading.tsx funciona. Maneje los identificadores inexistentes utilizando notFound() de next/navigation, lo cual delega automaticamente la UI a not-found.tsx.

- Prueba que ejecute y resultado:

  Verificacion del renderizado en entorno de desarrollo. Navegue a /inspecciones/INS-001 y /inspecciones/INS-002, comprobando la aparicion del componente de carga y posterior renderizado exitoso de los detalles (Laboratorio, Estado, Fecha, Inspector, etc.). Al ingresar a /inspecciones/INVALID, comprobe que la UI muestra la pantalla de "Inspeccion no encontrada".

- Limitacion o fallo diagnosticado:

  La principal limitacion es que la data es 100% sintetica y en memoria (mock data). Si la base de datos creciera significativamente, no habria paginacion y al ser SSR, cada peticion realiza un "fetching" (simulado) que retiene el servidor. Todavia no estamos usando pre-renderizado (SSG) ni validaciones con un backend real.

- Uso declarado de IA:

  Utilice Antigravity (modelo Gemini) como asistente para generar la estructura inicial de los componentes page.tsx, loading.tsx y not-found.tsx, y para la redaccion de este formato de evidencia asegurando el cumplimiento de la rubrica de evaluacion, validando los resultados mediante revision de codigo en conjunto.


- Uso de IA: herramienta, prop+�sito, partes influenciadas y validaci+�n propia:

  Utilic+� ChatGPT/Codex como apoyo para interpretar el kit de Semana 2, revisar los checks, implementar el shell, redactar pruebas y organizar esta evidencia. Valid+� manualmente los archivos modificados y ejecut+� los comandos de prueba, build, verificaci+�n y check p+�blico antes de preparar la entrega.

  ## Semana 05 - Felix (Persistencia Local y Cola de Sincronización)

- **Mi contribución concreta:**

  Definí e implementé la estructura de datos en `src/lib/storage/schema.ts` y la clase/módulo de cola de sincronización en `src/lib/sync/queue.ts`. Adicionalmente creé la suite de pruebas unitarias `tests/queue.spec.ts` e integré la verificación en el script `test` de `package.json`.

- **Commit SHA evaluado:**

  El SHA final se confirmará al enviar el commit de cierre de la entrega mediante `git rev-parse HEAD`.

- **Decisión técnica que puedo explicar:**

  1. **Estructura del Esquema (`schema.ts`):** Diseñé la interfaz `SyncOperation` con identificador único (`id`), clave de idempotencia (`idempotencyKey`), tipo de acción (`action`), payload sintético (`LocalInspection`), estados explícitos (`'pending'`, `'processed'`, `'failed'`), contador de reintentos (`retryCount`), marca de tiempo (`createdAt`, `lastAttemptAt`) y registro de error (`errorMessage`).
  2. **Cola de Sincronización (`queue.ts`):** Implementé la clase `SyncQueue` que garantiza la adición idempotente de operaciones (evitando duplicados ante reintentos o inserciones múltiples de una misma inspección).
  3. **Manejo de Reintentos y Fallos:** El método `processQueue` itera sobre las operaciones pendientes. Si el intento de envío/sincronización falla, la operación permanece persistida con estado `'failed'`, incrementa su contador de reintentos y almacena el mensaje de error para poder ser reintentada en ciclos posteriores sin perder datos.

- **Prueba que ejecuté y resultado:**

  `npm test`

  Resultado:
  `starter.spec.mjs: PASS`
  `manifest.spec.ts: PASS`
  `register-service-worker.spec.ts: PASS`
  `service-worker.spec.ts: PASS`
  `offline.spec.ts: PASS`
  `rendering.spec.ts: PASS`
  `queue.spec.ts: PASS`

- **Qué verifica y qué no verifica:**

  `tests/queue.spec.ts` verifica la incorporación de operaciones, la recuperación de pendientes, la prevención de registros duplicados por clave de idempotencia, la conservación de operaciones tras fallos de red simulados con incremento de reintentos y el cambio de estado a procesado tras una sincronización exitosa.

  Esta prueba valida el contrato de persistencia local y ciclo de vida de la cola en el entorno de ejecución Node/TypeScript. No sustituye la integración visual en interfaz ni la resolución de conflictos remotos avanzada que son responsabilidad de otros integrantes del equipo.

- **Limitación o fallo diagnosticado:**

  La implementación actual utiliza un almacenamiento en memoria respaldado por la estructura de esquemas persistibles para mantener compatibilidad tanto en entorno Node.js (`tsx`) como en navegador. No se incluye en este alcance individual la política de conflictos (`conflict-policy.ts`) ni la vista UI dedicada a sincronización, las cuales corresponden a la asignación de los demás integrantes del equipo.

- **Cambio que podría defender o modificar en vivo:**

  Puedo explicar en detalle el ciclo de vida de una operación en la cola (`pending` -> `failed` con reintento -> `processed`), el funcionamiento del mecanismo de idempotencia por `idempotencyKey` para evitar registros duplicados, y la suite de pruebas en `tests/queue.spec.ts`.

- **Uso declarado de IA (herramienta, propósito, validación):**

  Utilicé Antigravity (modelo Gemini) como asistente de programación para definir el esquema de datos TypeScript, estructurar la clase de cola de sincronización de manera idempotente, preparar la suite de pruebas unitarias y redactar esta evidencia técnica. Validé personalmente la compilación, la ejecución de las 7 pruebas unitarias y el build de producción antes de confirmar cada commit atómico.

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

## Semana 04 - Cesar Gaspar Pacheco (3522110305)

- Mi contribuci+�n concreta:

  Implement+� mi parte individual de la Semana 04 en `src/app/inspecciones/page.tsx`: la ruta `/inspecciones` usa CSR, carga datos sint+�ticos desde el navegador, muestra listado verificable y contempla estados de carga, contenido y error.

- Commit SHA evaluado:

  El SHA final se obtiene despu+�s del commit con `git rev-parse HEAD` y se reporta en la entrega. No lo escribo aqu+� como valor fijo porque modificar este archivo cambiar+�a el hash del commit.

- Decisi+�n t+�cnica que puedo explicar:

  Us+� CSR para el listado porque esta pantalla necesita interacci+�n inmediata del navegador: refrescar datos, filtrar inspecciones con hallazgos y simular un fallo controlado. Dej+� la carga de datos dentro de `useEffect` y `useState`, de modo que el HTML inicial muestra el estado de carga y el listado se completa despu+�s en cliente.

- Prueba que ejecut+� y resultado:

  `npm test` termin+� correctamente con `starter.spec.mjs: PASS` y `manifest.spec.ts: PASS`.

  `npm run build` compil+� correctamente e incluy+� la ruta `/inspecciones`.

  `npm run verify` termin+� con `Verificaci+�n t+�cnica: pass` y gener+� `reports/verification.json`.

  Tambi+�n comprob+� manualmente `http://localhost:3000/inspecciones`: el HTML inicial contiene `Cargando listado CSR`, contiene el bot+�n `Refrescar datos` y no contiene `Laboratorio de Redes`, lo que confirma que la lista no llega prerenderizada como SSR.

- Limitaci+�n o fallo diagnosticado:

  Mi tarjeta individual solo cubre la ruta CSR del listado. No implement+� `src/app/inspecciones/[id]/page.tsx`, `src/components/loading-state.tsx`, `docs/rendering-decision.md` ni `tests/rendering.spec.ts`, porque esos entregables corresponden al trabajo de otros integrantes o a la integraci+�n del equipo.

- Cambio que podr+�a defender o modificar en vivo:

  Puedo explicar c+�mo se demuestran los tres estados: `loading` aparece antes de cargar los datos, `ready` muestra las inspecciones sint+�ticas y `error` se activa con el bot+�n `Simular error` sin romper la ruta.

- Uso declarado de IA (herramienta, prop+�sito, validaci+�n):

  Utilic+� ChatGPT/Codex para interpretar el kit de Semana 04, contrastarlo con mi PDF individual, implementar la ruta CSR y organizar la evidencia. Valid+� manualmente el comportamiento de la ruta y ejecut+� pruebas, build y verificaci+�n antes de preparar el commit.

  ### Registro de Evidencia — Actividad 05

- Commit SHA de implementacion:

  `174e0f3e1d6f4867d76daf5ade664d122810c892`

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Implementé la política determinista de resolución de conflictos para inspecciones en `src/lib/sync/conflict-policy.ts`, documenté la decisión en `docs/sync-policy.md`, agregué la prueba reproducible `tests/sync.spec.ts` y conecté esa prueba al script `npm test`. La documentación aclara que `queue.ts` y `schema.ts` quedan pendientes de integración porque no estaban presentes en `develop` al iniciar esta rama.

- Decisión técnica y justificación:

  Decidí resolver conflictos de una misma inspección comparando primero `version`, después `updatedAt` y al final `operationId` como desempate estable. Esta política no depende del orden de llegada de red, por lo que una respuesta antigua de sincronización no puede sobrescribir una versión local más reciente.

- Prueba ejecutada:

  `npm ci`

  `npm test`

  `npm run build`

  `npm run verify`

  `make verify`

  `bash public-tests/check.sh`

- Resultado real:

  `npm ci` instaló correctamente las dependencias, pero mostró aviso porque esta máquina usa Node.js `v20.10.0` y el proyecto declara `>=20.19.0`. También reportó vulnerabilidades transitivas; no ejecuté `npm audit fix --force` porque podría cambiar versiones fuera del alcance individual.

  `npm test` pasó y mostró `starter.spec.mjs: PASS`, `manifest.spec.ts: PASS` y `sync.spec.ts: PASS`.

  `npm run build` compiló correctamente la aplicación con Next.js.

  `npm run verify` terminó con `Verificación técnica: pass` y generó `reports/verification.json`.

  `make verify` no pudo ejecutarse porque `make` no está instalado en esta terminal. El equivalente exacto del Makefile, `npm run verify`, sí fue ejecutado y aprobado.

  `bash public-tests/check.sh` no ejecutó sus validaciones porque el archivo compartido tiene finales de línea Windows y `bash` se detuvo en `set -euo pipefail`. No modifiqué ese script porque no forma parte de mi asignación individual.

- Qué verifica y qué no verifica:

  `tests/sync.spec.ts` verifica que una respuesta vieja de sincronización no reemplace una versión actual más reciente, que el desempate por `operationId` sea determinista, que una operación duplicada conserve la versión actual y que las entradas no se muten durante la resolución.

  La persistencia offline, los reintentos de cola y el almacenamiento local corresponden a la implementación de `src/lib/sync/queue.ts` y `src/lib/storage/schema.ts`, integrada por otro integrante. La prueba de César se concentra en la resolución determinista de conflictos.

- Limitación o dificultad identificada:

  La principal dificultad fue trabajar inicialmente sobre una rama que no contenía todavía los archivos de cola y esquema de almacenamiento. Por ello, la política de conflictos se implementó y validó de forma independiente antes de la integración del trabajo del equipo.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia:

  Utilicé ChatGPT/Codex como apoyo para interpretar las instrucciones de Semana 05, revisar el PDF de asignación, diseñar la política determinista, redactar la documentación y preparar pruebas automatizadas. Validé personalmente los cambios ejecutando instalación, pruebas, build y verificación local antes de preparar la entrega.