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

  ## Registro de Evidencia — Actividad 06 (Semana 6 - Claudia Espíndola López)

- **Estudiante:** Claudia Espíndola López
- **Rama de trabajo:** `feature/semana-06-claudia-integracion`
- **Commit SHA evaluado:** `44463ea6951ac8b2a4308601b5f684c48648edf6`

- **Mi contribución concreta y enlace a archivo, commit anterior o revisión:**

  Realicé la integración de las capacidades implementadas por los integrantes del equipo para la Semana 6. Incorporé la cámara y la geolocalización desarrolladas por Félix mediante `src/lib/device/camera.ts` y `src/lib/device/geolocation.ts`, y conservé el cliente de notificaciones implementado por César en `src/lib/notifications/client.ts`.

  Agregué `tests/device-capabilities.spec.ts` para comprobar los escenarios de cámara y geolocalización, actualicé el script de pruebas de `package.json` e integré la documentación de las tres capacidades en `docs/capabilities.md`. También incorporé las evidencias individuales correspondientes en `evidence/individual.md`.

  Mi contribución quedó registrada en el commit `44463ea`, publicado en la rama `feature/semana-06-claudia-integracion` y posteriormente integrado en `develop` mediante el Pull Request #16.

- **Decisión técnica que puedo explicar y justificar:**

  Mantuve separadas las pruebas de notificaciones y las de cámara y geolocalización para facilitar el diagnóstico de errores y comprobar cada capacidad de manera independiente. Después incorporé ambas suites al comando general `npm test`, de forma que la integración pudiera validarse junto con las pruebas existentes del proyecto.

  También conservé el enfoque de mejora progresiva: las capacidades opcionales del navegador deben manejar los permisos denegados, la ausencia de API y los errores sin impedir que continúe el flujo principal de la aplicación.

- **Comandos o pruebas que ejecuté:**

  `npx tsx tests/capabilities.spec.ts`

  `npx tsx tests/device-capabilities.spec.ts`

  `npm test`

  `npm run build`

  `npm run verify`

- **Resultado real que observé:**

  Las pruebas individuales de notificaciones y de cámara/geolocalización terminaron con resultado `PASS`.

  El comando `npm test` terminó correctamente y las 10 suites incluidas en el script reportaron `PASS`.

  El comando `npm run build` compiló correctamente la aplicación Next.js, completó la comprobación de tipos y linting, y generó las páginas correspondientes.

  El comando `npm run verify` terminó con el mensaje `Verificación técnica: pass` y generó el reporte `reports/verification.json`.

  La revisión académica aparece como pendiente en el reporte de verificación, por lo que no afirmo que la entrega ya haya sido aprobada académicamente.

- **Qué verifica y qué no verifica esta validación:**

  Las pruebas automatizadas comprueban los escenarios definidos para las notificaciones, la cámara y la geolocalización, además de ejecutar las pruebas existentes de la PWA. La compilación y la verificación general permiten comprobar que los cambios integrados no introducen errores detectados por esos controles.

  Estas pruebas no sustituyen la comprobación manual en dispositivos físicos con distintas cámaras, permisos, sensores y navegadores. Tampoco demuestran por sí solas que todas las capacidades funcionen en cualquier dispositivo o entorno de ejecución.

- **Limitación, dificultad o riesgo que identifiqué:**

  La integración requería combinar contribuciones realizadas en ramas diferentes y mantener las pruebas y la documentación coherentes con el código final. Por ello, recuperé e incorporé las capacidades del dispositivo, conservé la implementación de notificaciones y validé el conjunto mediante las pruebas automatizadas, el build y la verificación técnica.

  Las capacidades nativas siguen dependiendo de las API disponibles, los permisos concedidos por el usuario y el hardware del dispositivo. Los fallbacks permiten manejar escenarios de indisponibilidad, pero no reemplazan una prueba física de cada capacidad.

- **Cambio que podría defender o modificar en vivo:**

  Puedo explicar cómo se incorporan las pruebas de cámara y geolocalización al comando general `npm test`, cómo se organiza la documentación conjunta en `docs/capabilities.md` y cómo se verifica la integración mediante `npm run build` y `npm run verify`.

  También puedo explicar la diferencia entre la implementación individual de cada capacidad y el trabajo de integración que reúne los módulos, las pruebas y la documentación en una misma rama.

- **Uso declarado de IA: herramienta, propósito, partes influenciadas y validación propia:**

  Utilicé ChatGPT como apoyo para revisar la integración de ramas, analizar los conflictos, organizar las pruebas, actualizar la documentación y estructurar esta evidencia individual.

  La validación propia consistió en ejecutar las pruebas automatizadas, comprobar el resultado del build, ejecutar la verificación general y revisar el estado de Git antes de crear y publicar el commit de integración.

  La asistencia de IA se utilizó como apoyo al análisis y la documentación; los resultados declarados corresponden a los comandos ejecutados localmente.

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
## Registro de Evidencia — Actividad 06 (Semana 6 - Felix)

- **Estudiante:** Felix

- **Rama de trabajo:** `feature/semana-06-felix`

- **Commit SHA evaluado:** `340dc8f`

- **Decisión técnica que puedo explicar:**

  Implementación de capacidades del dispositivo (`camera.ts` y `geolocation.ts`) bajo demanda del usuario, aplicando permisos mínimos (`video: { facingMode: 'environment' }` en cámara y `enableHighAccuracy: false` en geolocalización), deteniendo los `MediaStreamTrack` inmediatamente después de la captura para evitar consumo inútil de batería/recursos, y utilizando un patrón de respuesta unificado `{ success, dataUrl/coords, error, errorCode, isFallback }` que maneja degradación elegante y fallbacks sin interrumpir la experiencia de usuario.

- **Prueba que ejecuté y resultado:**
  Ejecución de suite automatizada `npm test` incluyendo `tests/capabilities.spec.ts`.
  Resultado: 9/9 suites PASS (cubriendo capacidad disponible, rechazo de permisos `NotAllowedError` / `PERMISSION_DENIED`, y ausencia de API / fallback activado).

- **Limitación o fallo diagnosticado:**
  En entornos de navegador con permisos denegados o sin hardware de cámara/GPS nativo (o ejecuciones en servidor/headless), las llamadas nativas fallan. Se diagnosticó y manejó mediante capturas con `try/catch` y mapeo de errores, activando una imagen/coordenada sintética de fallback con `isFallback: true`.

- **Cambio que podría defender o modificar en vivo:**
  La estructura de retorno tipada de `CameraResult` y `GeolocationResult`, el método de liberación de recursos mediante `track.stop()`, y la lógica del fallback sintético.

- **Uso declarado de IA (herramienta, propósito, validación):**
  - Herramienta: Antigravity AI
  - Propósito: Estructurar la lógica modular de `camera.ts` y `geolocation.ts` y diseñar la suite de pruebas unitarias.
  - Validación: Verificación manual mediante ejecución local de `npm test` (PASS) e inspección de código.

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

## Semana 06 - Cesar Gaspar Pacheco (3522110305)

- Grupo:

  `10B`

- Commit SHA de implementacion:

  `3eaf66925c218652565f212fb9f4bf3cfcc2aa36`

- Mi contribucion concreta:

  Implemente mi parte individual de Semana 06 en `src/lib/notifications/client.ts`: cliente de notificaciones con solicitud de permiso bajo accion del usuario, manejo de permiso concedido, permiso denegado, API no disponible, errores y fallback funcional. Tambien agregue `tests/capabilities.spec.ts` para validar estos escenarios y documente la decision en `docs/capabilities.md`.

- Decision tecnica que puedo explicar:

  La solicitud de permiso requiere `userInitiated: true`. Si no existe una accion explicita del usuario, no se llama `Notification.requestPermission()` y se devuelve un resultado controlado con fallback. Tome esta decision para respetar permisos minimos y evitar que la PWA solicite capacidades del navegador durante carga automatica o ejecucion no solicitada.

- Prueba que ejecute y resultado:

  `npx tsx tests/capabilities.spec.ts`

  Resultado: `capabilities.spec.ts: PASS`.

  `npm test`

  Resultado: la suite completa termino correctamente, incluyendo `capabilities.spec.ts: PASS`.

  `npm run build`

  Resultado: compilacion correcta de Next.js.

  `npm run verify`

  Resultado: `Verificacion tecnica: pass` y se genero `reports/verification.json`.

  `npm ci`

  Resultado: instalacion correcta con aviso de version porque esta terminal usa Node.js `v20.10.0` y el proyecto declara `>=20.19.0`. Tambien reporto vulnerabilidades transitivas; no ejecute arreglos automaticos porque podrian cambiar dependencias fuera del alcance individual.

  `make verify`

  Resultado: no pudo ejecutarse porque `make` no esta instalado en esta terminal. El equivalente exacto del Makefile, `npm run verify`, si fue ejecutado y aprobado.

  `bash public-tests/check.sh`

  Resultado: no ejecuto sus validaciones porque el archivo compartido actual tiene finales de linea Windows y `bash` se detuvo en `set -euo pipefail`. No modifique ese script porque no forma parte de mi asignacion individual.

- Que verifica y que no verifica:

  `tests/capabilities.spec.ts` verifica API no disponible, solicitud bloqueada sin accion del usuario, permiso concedido, permiso denegado, error al pedir permiso, error al crear notificacion y fallback funcional.

  No verifica envio push remoto, servidor de notificaciones, camara ni geolocalizacion. Esos puntos quedan fuera de mi PDF individual, que asigna `src/lib/notifications/client.ts`.

- Limitacion o fallo diagnosticado:

  La implementacion cubre notificaciones locales del navegador y fallback dentro de la aplicacion, pero no integra un servicio remoto de push ni una UI final para disparar el flujo desde pantalla. Tambien observe que el check publico completo de Semana 06 espera archivos de camara y geolocalizacion del equipo, por lo que esa validacion depende de la integracion de los demas integrantes.

- Cambio que podria defender o modificar en vivo:

  Puedo explicar el flujo de `requestNotificationPermission`, `showNotification` y `notifyInspectionChange`, asi como modificar los mensajes de fallback o la regla que impide pedir permisos sin accion del usuario.

- Uso declarado de IA:

  Utilice ChatGPT/Codex como apoyo para interpretar el `SKILL.md`, el PDF individual y el kit de Semana 06, disenar el cliente de notificaciones, redactar la prueba automatizada y organizar esta evidencia. Valide personalmente los cambios ejecutando pruebas, build e instalacion local antes de preparar la entrega.




## Semana 08 - Cesar Gaspar Pacheco (3522110305) - Pruebas de integracion

- Grupo: `10B`. Trabajo individual limitado a la asignacion del PDF de Cesar.
- Rama: `feature/semana-08-cesar-integration`, creada desde `origin/develop` (`90f6ecd459739a7b4fa735b77710d6962f796518`). El PDF menciona `devop`; el usuario confirmo `develop` como destino del PR. El SHA final comun del equipo se entrega en Classroom despues de la integracion, sin agregar un commit para escribir su propio hash.
- Contribucion: [pruebas ejecutables](../tests/integration/queue.spec.ts) y [fixtures aislados](../tests/integration/fixtures.ts). Se conserva la evidencia de semanas anteriores y de los demas integrantes.
- Decision y motivo: integrar la clase real `SyncQueue` con su serializacion y recuperacion, simulando solo `window.localStorage` y el handler remoto. Se usan `node:test`, `node:assert/strict` y `tsx`, ya disponibles. Se agrega `test:integration` y se invoca desde `npm test` para que un fallo bloquee la verificacion habitual. No se modifica codigo de la aplicacion ni dependencias.

### Diagnostico y precondiciones

Comprobacion local del 24 de octubre de 2026. La cola real persiste el payload de la inspeccion dentro de la operacion, recupera estados `pending` y `failed`, y conserva `processed` sin volver a enviarlo. La interfaz actual no consume esta cola. No hay cliente HTTP de sincronizacion: `processQueue` recibe un handler que devuelve `true`/`false` o lanza un error.

Se ejecuto `npm ci` el 24 de octubre de 2026: codigo 0, 31 paquetes instalados desde el lockfile sin modificarlo. npm uso el Node predeterminado v20.10.0 y advirtio que el proyecto requiere >=20.19.0. Reporto tres vulnerabilidades transitivas; no se aplicaron actualizaciones automaticas fuera del alcance individual.

El proyecto requiere Node >=20.19.0 y npm >=10.0.0. El Node predeterminado de esta maquina es v20.10.0. El reporte TAP y la comprobacion explicita de tipos se ejecutaron con Node v24.22.1, invocado por su ruta completa. El verificador se inicio con ese mismo runtime; los subprocesos npm.cmd pueden usar el Node predeterminado instalado junto a npm. No se cambio la configuracion global. Para comprobar el runtime disponible:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --version
```

En otro equipo basta con usar una version de Node compatible; esa ruta local no es un requisito del proyecto. No se necesita servidor, cuenta, red real ni dispositivo fisico para ejecutar estos casos.

### Ejecucion reproducible

Desde la raiz del repositorio:

```sh
npm run test:integration
npm test
npm run verify
node node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --esModuleInterop --moduleResolution bundler --module esnext --target es2020 tests/integration/fixtures.ts tests/integration/queue.spec.ts
```

La integracion se ejecuta con el primer comando y tambien desde `npm test`. `npm run verify` ejecuta todas esas pruebas y el build; es el equivalente exacto de `make verify`. Se conserva la suite compartida y no se modifican workflows. El reporte real de esta capa se conserva en [results.tap](../tests/integration/results.tap); [README de integracion](../tests/integration/README.md) documenta como regenerarlo.

### Preparacion, acciones y resultados por escenario

Cada caso comienza con un almacen vacio y la misma inspeccion sintetica nueva. Se restaura el descriptor original de `window` y se vacia el almacen mediante `finally`, incluso si falla una asercion. Los casos son secuenciales para no compartir el global simulado de forma concurrente.

| Escenario en queue.spec.ts | Preparacion y accion | Resultado esperado y observado |
| --- | --- | --- |
| Guardar offline y recuperar el payload completo al recargar | `onLine: false`; encolar, reemplazar `window` conservando las cadenas del almacen y crear otra `SyncQueue` | Se recupera una unica operacion `pending`, con payload completo, identidad y metadatos iguales; los objetos recuperados son distintos de los originales y `retryCount` sigue en 0. PASS. |
| Respuesta fallida | Handler devuelve `false`; procesar y reconstruir desde almacenamiento | Cero confirmaciones, un fallo, ninguna inspeccion remota, estado `failed`, contador 1, error y fecha registrados; payload e identidad intactos y disponible para reintento. PASS. |
| Excepcion de transporte | Handler lanza `Error("Fallo de red sintetico")`; procesar y reconstruir | Se conserva el mismo estado reintentable y el mensaje exacto del error, sin perder la inspeccion. PASS. |
| Respuesta exitosa | Handler devuelve `true`; procesar y reconstruir | Una confirmacion y un registro remoto sintetico; se conserva una operacion `processed`, contador 1, sin error ni pendientes. PASS. |
| Reintento por ID | Fallo, recarga, reencolado con mismo ID y distinta clave, exito y otra recarga | Una sola operacion; ambos intentos conservan ID, clave original, fecha y payload. Contador 2, error eliminado, un registro remoto y ningun nuevo envio al procesar otra vez. PASS. |
| Reintento por clave de idempotencia | Misma secuencia, conservando la clave y cambiando el ID propuesto | Se recupera la operacion original, se confirma una sola inspeccion y no se envia de nuevo una operacion ya procesada. PASS. |

Salida real resumida del runner de integracion (codigo de salida 0):

```text
tests 6
suites 0
pass 6
fail 0
cancelled 0
skipped 0
todo 0
```

`npm run verify` termino con codigo 0 e incluyo `npm test` y `npm run build`. La suite existente aprobo y ademas se ejecutaron los seis casos nuevos con PASS. El [reporte TAP](../tests/integration/results.tap) conserva la salida real del runner especifico.

`npm run build` termino con codigo 0: `Compiled successfully`, validacion de tipos y generacion de las cinco paginas completadas. La comprobacion de tipos explicita de los dos archivos de integracion tambien termino con codigo 0 y sin diagnosticos; se ejecuto por separado porque el tsconfig compartido incluye `src/`, no `tests/`.

### Que demuestra y limites conocidos

- Demuestra la integracion de cola, serializacion, almacenamiento simulado y handler remoto, con aserciones sobre estados persistidos, payload e identidad; no se limita a buscar nombres en el codigo.
- La recarga se simula reemplazando `window` y creando otra instancia que lee las cadenas guardadas. No es una recarga real de pagina ni una prueba E2E; no certifica persistencia fisica de un navegador, Service Worker o IndexedDB.
- `onLine: false` describe el entorno del fixture. La cola no consulta conectividad ni inicia envios automaticamente: el test decide cuando llamar a `processQueue`. No se demuestra deteccion de reconexion ni captura offline desde la interfaz.
- El servidor se representa por el contrato booleano real del handler. Se simulan rechazo, exito y excepcion; no se comprueban HTTP, endpoints, autenticacion ni un backend de produccion.
- El fixture remoto no deduplica: cada exito agregaria otro registro. Los casos comprueban que solo se registra un exito y que una operacion confirmada no se reenvia. No certifican idempotencia real del backend, concurrencia, perdida de acuse despues de una escritura remota ni exactamente una escritura ante fallos distribuidos.
- No se imponen reglas nuevas sobre `maxRetries`, backoff ni conflictos. Unitarias nuevas, E2E, estrategia global, defecto controlado y CI corresponden al trabajo coordinado del equipo y quedan fuera de esta contribucion individual.
- Esta evidencia registra la validacion local. El PR se dirige a `develop`, segun confirmacion del usuario. Los enlaces y resultados remotos del SHA individual se reportan al cerrar la entrega; el SHA final comun y la validacion completa de Semana 08 corresponden a la integracion posterior del equipo.

### Uso de IA

Se utilizo ChatGPT/Codex para contrastar PDF y ZIP con el repositorio, preparar los fixtures y las seis pruebas y redactar esta seccion. La validacion automatizada realizada en la sesion consistio en ejecutar los comandos anteriores y revisar resultados y diferencias. Esta declaracion no atribuye al estudiante una revision manual que aun no haya realizado; debe revisar y poder explicar su contribucion antes de entregarla.
# Evidencia individual · semana 8

## Nombre: Felix Ivan Garcia Flores (3523110172)

- Grupo y equipo: 9B-E05 (10B)
- Mi contribución de esta semana y enlace:
  Implementé las pruebas unitarias de validación y de la regla de idempotencia en `tests/unit/validation.spec.ts` y `tests/unit/idempotency.spec.ts`, el validador de capturas locales `validateLocalInspection` en `src/lib/storage/schema.ts`, los scripts de verificación de tipos y cobertura en `package.json`, y el workflow de integración continua en `.github/workflows/academic-evaluation.yml` en la rama `feature/semana-08-felix-unit-ci` (commits `50a03a5` y `24f6bff`).
- Decisión técnica y motivo:
  1. **Pruebas unitarias con casos válidos e inválidos y regla de idempotencia:** Separé las pruebas en `tests/unit/validation.spec.ts` (que comprueba entradas válidas e inválidas tanto para la captura de una inspección local mediante `validateLocalInspection` como para los candidatos de sincronización en `resolveInspectionConflict`) y `tests/unit/idempotency.spec.ts` (que comprueba la prevención de duplicados por `idempotencyKey` e `id` en `SyncQueue.enqueue`, la conservación de una única operación a través de fallos de red simulados, recargas desde `localStorage` y reintentos exitosos en `processQueue`, así como la decisión `duplicate-operation` en `resolveInspectionConflict`).
  2. **Cobertura y reportes nativos en CI con `if: always()`:** Configuré `npm run test:coverage` utilizando el corredor nativo de Node.js 20 (`node --experimental-test-coverage --import tsx --test`) con reporteros `spec`, `lcov` (`coverage/lcov.info`) y `junit` (`test-results/junit.xml`). Tomé esta decisión para generar métricas reales de cobertura y reportes estructurados sin agregar dependencias externas que alteraran `package-lock.json`, garantizando que `npm ci` sea 100% reproducible y que `.github/workflows/academic-evaluation.yml` publique siempre los artefactos (`coverage/`, `test-results/`, `reports/verification.json`) mediante `if: always()`, incluso si una etapa previa falla.
- Prueba/comando que ejecuté:
  - `npm run typecheck` (`tsc --noEmit --incremental false`)
  - `npm run test:unit` (`tsx tests/unit/validation.spec.ts && tsx tests/unit/idempotency.spec.ts`)
  - `npm run test:coverage`
  - `npm test`
  - `npm run build`
  - `npm run verify`
  - Prueba de defecto controlado sobre `src/lib/sync/queue.ts` ejecutando `npx tsx tests/unit/idempotency.spec.ts` (fallo provocado y posterior recuperación).
- Resultado observado y enlace al reporte:
  - `npm run typecheck`: terminó con código de salida `0` sin errores de tipos.
  - `npm run test:unit`: `validation.spec.ts: PASS` e `idempotency.spec.ts: PASS`.
  - `npm run test:coverage`: `12/12` archivos de prueba en `PASS` (`82.35%` de cobertura de líneas, `84.85%` de ramas y `75.00%` de funciones en el conjunto evaluado; `94.78%` en `src/lib/storage/schema.ts`, `87.29%` en `src/lib/sync/conflict-policy.ts` y `87.24%` en `src/lib/sync/queue.ts`), generando `coverage/lcov.info` y `test-results/junit.xml`.
  - `npm run verify`: ejecutó las 12 suites de pruebas (`starter.spec.mjs`, `manifest.spec.ts`, `register-service-worker.spec.ts`, `service-worker.spec.ts`, `offline.spec.ts`, `rendering.spec.ts`, `queue.spec.ts`, `sync.spec.ts`, `capabilities.spec.ts`, `device-capabilities.spec.ts`, `tests/unit/validation.spec.ts`, `tests/unit/idempotency.spec.ts`), compiló la aplicación de producción con Next.js `14.2.35` (`✓ Compiled successfully`) y generó `reports/verification.json` con `Verificación técnica: pass`.
  - **Evidencia del defecto controlado (fallo y recuperación):**
    - *Preparación:* En `src/lib/sync/queue.ts` se omitió de manera temporal la guarda de duplicados en `SyncQueue.enqueue` (`if (existingOp.idempotencyKey === idempotencyKey || existingOp.id === id)`).
    - *Acción / Comando:* `npx tsx tests/unit/idempotency.spec.ts`.
    - *Resultado esperado con defecto:* La prueba unitaria debe fallar con código distinto de `0` al detectar que una operación repetida con la misma `idempotencyKey` genera un registro duplicado en lugar de devolver la operación original.
    - *Resultado observado con defecto (Fallo real, exit code `1`):*
      ```text
      Ejecutando pruebas unitarias de idempotencia (tests/unit/idempotency.spec.ts)...
      AssertionError [ERR_ASSERTION]: Repetir enqueue con la misma idempotencyKey debe devolver la operación original
      + actual - expected

      + 'op-idem-999'
      - 'op-idem-001'
      Exit code con defecto: 1
      ```
    - *Recuperación tras restaurar la solución (exit code `0`):* Se restauró la verificación de `idempotencyKey` en `src/lib/sync/queue.ts` y se reejecutó `npx tsx tests/unit/idempotency.spec.ts`, obteniendo `idempotency.spec.ts: PASS` y código de salida `0`.
- Qué demuestra y qué no demuestra:
  - **Qué demuestra:** Demuestra que las reglas de validación rechazan entradas inválidas (campos vacíos, fechas inválidas, hallazgos negativos, versiones negativas o `NaN`) y aceptan entradas válidas; que la cola de sincronización y la política de conflictos garantizan idempotencia sin duplicar operaciones al reintentar o recargar desde `localStorage`; que las pruebas detectan un defecto real cuando se omite la guarda de idempotencia; y que el flujo de CI compila, ejecuta las pruebas y conserva los artefactos de resultados y cobertura.
  - **Qué no demuestra:** Las pruebas unitarias por sí solas no demuestran la interacción visual completa en un navegador real ni sustituyen las capas de integración (`tests/integration/`) y End-to-End (`tests/e2e/`) ni el documento grupal `docs/test-strategy.md`, los cuales corresponden a las responsabilidades de los demás integrantes del equipo y a la integración en `develop`.
- Limitación o riesgo:
  - En el entorno local con Windows, el shim predeterminado de NVM presentaba un bloqueo de firma (`NVM4306`) sobre la versión `22.22.0`, por lo que se utilizó directamente la instalación verificada de Node.js `v20.19.5` (compatible con `engines.node >= 20.19.0` y con la versión `20.19.6` del workflow de GitHub Actions). Asimismo, se identificó que la rama de integración en el repositorio remoto se denomina `develop` (y no `devop`), lo cual se verificó con `git ls-remote --heads origin` antes de preparar la entrega.
- IA: herramienta, propósito, partes influidas y validación propia; o «no utilicé IA»:
  - Utilicé Antigravity (modelo Gemini) como asistente de programación para estructurar las pruebas unitarias en `tests/unit/validation.spec.ts` y `tests/unit/idempotency.spec.ts`, configurar la generación de reportes `lcov`/`junit` en `.github/workflows/academic-evaluation.yml` y documentar esta sección de evidencia. Validé personalmente cada archivo ejecutando las suites de regresión y de la Semana 08, comprobando el fallo y recuperación del defecto controlado y verificando el build de producción con `npm run verify`.

# Evidencia individual · Semana 8
## Nombre: Claudia Espinosa López
**Grupo y equipo:** 10 B · Equipo 5
**Rama de trabajo:** `feature/semana-08-claudia-e2e-docs`
**Responsabilidad:** QA, pruebas end-to-end (E2E), documentación técnica y verificación de la integración.

## 1. Mi contribución de esta semana y archivos relacionados

Durante la Semana 8 trabajé en el aseguramiento de la calidad de la PWA de inspecciones de laboratorio, con énfasis en las pruebas automatizadas, la documentación técnica y la verificación del flujo de trabajo.

Los archivos relacionados con mi contribución incluyen:

- `tests/e2e/inspections.spec.ts`: prueba E2E para crear una inspección sintética y comprobar su persistencia local después de recargar la página.
- `playwright.config.ts`: configuración de Playwright, Chromium, servidor local, trazas, capturas ante fallos y reportes para CI.
- `docs/test-strategy.md`: documentación de la estrategia de pruebas, comandos de ejecución, criterios de aceptación y limitaciones.
- `tests/integration/inspections.spec.ts`: pruebas de integración para la creación de inspecciones, el almacenamiento local y la cola de operaciones.
- `tests/integration/README.md`: instrucciones y descripción de las pruebas de integración.
- `README.md`: actualización de instrucciones y documentación general del proyecto.
- `scripts/verify.mjs`: ampliación de la verificación automatizada y generación del reporte `reports/verification.json`.
- `.github/workflows/academic-evaluation.yml`: actualización del flujo de evaluación para instalar Chromium, ejecutar la verificación y publicar los reportes.
- `package.json` y `package-lock.json`: incorporación de Playwright y actualización de los comandos de pruebas.
- `evidence/individual.md`: registro de las contribuciones, resultados y limitaciones de la Semana 8.

La rama también contiene cambios compartidos de interfaz, almacenamiento, validación y cola de sincronización. Esta evidencia identifica los archivos relacionados con mi entrega sin atribuirme individualmente toda la implementación del equipo.

## 2. Decisión técnica y justificación

Se incorporó una prueba end-to-end mediante Playwright para comprobar un recorrido de usuario desde el navegador. La prueba utiliza datos sintéticos y valida que una inspección pueda crearse desde la interfaz, guardarse localmente y continuar visible después de recargar la página.

Esta prueba complementa los demás niveles de verificación:

- **Pruebas unitarias:** comprueban funciones y reglas de validación de forma aislada.
- **Pruebas de integración:** verifican la interacción entre la creación de inspecciones, el almacenamiento local y la cola de operaciones.
- **Pruebas E2E:** validan el flujo de usuario desde la interfaz hasta la persistencia local.

También se documentaron las limitaciones de la persistencia local y la ausencia de un backend remoto configurado y verificado en el flujo descrito.

## Pruebas y comandos ejecutados

Los comandos registrados durante la verificación local fueron:

    npm ci
    npm run typecheck
    npm run test:unit
    npm run test:integration
    npm run test:e2e
    npm run build
    npm run verify

El comando `npm run verify` comprueba la estructura del proyecto, ejecuta la verificación de tipos, las pruebas automatizadas configuradas y la compilación de producción.

##  Resultados observados y reporte técnico

Los resultados registrados en el entorno local fueron los siguientes:

| Comprobación | Resultado registrado |
|---|---|
| Estructura obligatoria | Aprobada |
| Verificación de TypeScript | Aprobada |
| Pruebas unitarias, regresión e integración | Aprobadas |
| Pruebas de integración | 18 de 18 aprobadas |
| Pruebas E2E | 1 de 1 aprobada |
| Compilación de producción | Aprobada |
| Verificación general | `pass` |
| Revisión académica | `pending` |

**Reporte técnico:** `reports/verification.json`

El reporte registra los resultados técnicos y mantiene la revisión académica en estado `pending`, ya que la automatización no asigna calificaciones.

Estos resultados corresponden a la ejecución local registrada. Para confirmar la ejecución remota, es necesario consultar el resultado del workflow en GitHub Actions.

Estas limitaciones deben considerarse al interpretar los resultados y definir las siguientes actividades de mantenimiento y validación.

##  Uso de inteligencia artificial y validación propia

La declaración de herramientas de inteligencia artificial debe corresponder exclusivamente a las herramientas que se utilizaron realmente durante el desarrollo.

En los registros de la evidencia se mencionan Antigravity (Gemini) y Codex. Debe verificarse cuáles se utilizaron efectivamente durante la Semana 8 para evitar atribuir acciones a herramientas que no participaron en el trabajo.

La validación propia incluyó la revisión de los cambios, la ejecución de los comandos de prueba registrados y la identificación de las limitaciones técnicas de la solución.

La validación remota del workflow de GitHub Actions permanece pendiente hasta consultar sus resultados en el repositorio.

## Identificación del commit
**Rama de trabajo:** `feature/semana-08-claudia-e2e-docs`
- **Mensaje del commit registrado:** `pruebas(semana-08): agregar pruebas E2E y documentación de QA
- **SHA del commit registrado antes de esta actualización de la evidencia: `ad267c0a05afcfd6c70c9d0f4a3176699643c9ac
El SHA definitivo se registrará después del último commit y se entregará en Classroom, conforme a las instrucciones del proyecto.

## Felix — Semana 09: Modelo de amenazas

- **Estudiante:** Felix Ivan Garcia Flores (`3523110172`)
- **Grupo y equipo:** `10B` (`9B-E05`)
- **Rama de trabajo:** `feature/semana-09-felix-threat-model`
- **Commit SHA evaluado:**
  - Commit del modelo de amenazas (`docs/threat-model.md`): `41ecd36d46ccef80a17db0a6de784039d1a59bc1` (`41ecd36`).
  - El SHA final de la rama tras registrar esta evidencia se obtiene mediante `git rev-parse HEAD` y se adjunta en la entrega y en la Pull Request hacia la rama de integración acordada por el equipo (`develop`), evitando un commit extra que altere el hash reportado.
- **Pull Request:** Pendiente de apertura tras revisión del equipo hacia `develop` desde `feature/semana-09-felix-threat-model`.
- **Enlaces a mis cambios:**
  - Modelo de amenazas completo: [docs/threat-model.md](../docs/threat-model.md)
  - Registro de evidencia individual: [evidence/individual.md](./individual.md)
- **Archivos del repositorio revisados para fundamentar el análisis:**
  - Configuración y rutas: `next.config.mjs`, `package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/app-shell.tsx`, `src/app/inspecciones/page.tsx` y `src/app/inspecciones/[id]/page.tsx`.
  - Almacenamiento, validación y sincronización: `src/lib/storage/schema.ts`, `src/lib/storage/inspections.ts`, `src/lib/data/create-inspection.ts`, `src/lib/data/inspections.ts`, `src/lib/sync/queue.ts`, `src/lib/sync/conflict-policy.ts` y `src/lib/sync/connectivity.ts`.
  - PWA y capacidades del dispositivo: `public/manifest.webmanifest`, `public/sw.js`, `src/lib/pwa/register-service-worker.ts`, `src/lib/device/camera.ts`, `src/lib/device/geolocation.ts` y `src/lib/notifications/client.ts`.
  - Integración continua y pruebas existentes: `.github/workflows/academic-evaluation.yml`, `public-tests/check.sh`, `scripts/verify.mjs` y las suites en `tests/`.
- **Decisión técnica que puedo explicar:**
  - Estructuré `docs/threat-model.md` separando explícitamente cuatro estados de control (**Verificado**, **Parcial**, **Pendiente de verificar** y **Propuesto**) sobre las cuatro fronteras de confianza reales de la PWA (Dispositivo/Sensores ↔ Navegador, `localStorage`/`Cache Storage` ↔ Aplicación, Cliente CSR ↔ Servidor SSR Next.js, y Aplicación ↔ Backend remoto proyectado).
  - En lugar de asumir que existen controles de autenticación o sesiones que el código aún no tiene, documenté como vulnerabilidad real la ausencia de inicio/cierre de sesión y la edición libre del campo `inspector` en `src/app/inspecciones/page.tsx` (amenazas `T-01`, `T-02` y `T-03`), diferenciándolos de los controles que sí están implementados y verificados con pruebas en el repositorio: validación de esquema y longitud (`validateLocalInspection` en `src/lib/storage/schema.ts`), revalidación al leer `localStorage` (`readLocalInspections` en `src/lib/storage/inspections.ts`), idempotencia y tope de reintentos (`maxRetries = 3` en `src/lib/sync/queue.ts`), registro de Service Worker solo en contextos seguros (`src/lib/pwa/register-service-worker.ts`), intercepción exclusiva de `GET` con validación `status === 200` y `type === 'basic'` en `Cache First` (`public/sw.js`), y mínimo privilegio en cámara (`audio: false` y `track.stop()`), geolocalización (`enableHighAccuracy: false`) y notificaciones (`userInitiated: true`).
- **Pruebas ejecutadas y resultados reales observados:**
  - `npm ci --ignore-scripts --no-audit --no-fund`: código de salida `0` (`added 38 packages in 37s`), sincronizando `node_modules` con Next.js `16.4.3` y Playwright `1.64.1`.
  - `npm run typecheck` (`tsc --noEmit --incremental false`): código de salida `0` sin errores de tipos.
  - `npm test`: código de salida `0`. Aprobaron las 12 suites (`starter.spec.mjs`, `manifest.spec.ts`, `register-service-worker.spec.ts`, `service-worker.spec.ts`, `offline.spec.ts`, `rendering.spec.ts`, `queue.spec.ts`, `sync.spec.ts`, `capabilities.spec.ts`, `device-capabilities.spec.ts`, `tests/unit/validation.spec.ts` y `tests/unit/idempotency.spec.ts`) más la suite de integración `tests/integration/queue.spec.ts` (`6/6` subtests en `PASS`).
  - `node --import tsx --test tests/integration/queue.spec.ts tests/integration/inspections.spec.ts`: código de salida `0` (`18/18` subtests de integración en `PASS`, comprobando rechazo de entradas inválidas, recuperación ante fallos de escritura en `localStorage`, idempotencia, agotamiento de reintentos y concurrencia).
  - `npx playwright install chromium` y `npm run verify`: código de salida `0`. Ejecutó verificación de estructura (`pass`), `typecheck` (`pass`), cobertura unitaria/regresión (`12/12 PASS`, `80.56%` líneas, `83.46%` ramas, `68.18%` funciones), Playwright E2E (`1 passed (21.5s)` en `tests/e2e/inspections.spec.ts`) y `npm run build` con Next.js `16.4.3 (Turbopack)` (`✓ Compiled successfully in 272ms`, `4/4` páginas generadas), produciendo `reports/verification.json` con `Verificacion tecnica: pass`.
  - Escaneo de patrones sensibles sobre `docs/threat-model.md` y `evidence/individual.md`: `0` coincidencias prohibidas.
- **Limitaciones y riesgos diagnosticados:**
  1. **Ausencia de autenticación, RBAC y flujo de cierre de sesión en UI:** Las pruebas de seguridad sobre acceso sin autenticación (`SEC-01`), permisos insuficientes entre roles (`SEC-02`) y vaciado completo al cerrar sesión en equipos compartidos (`SEC-03`) quedan documentadas como **propuestas** en `docs/threat-model.md`, ya que la aplicación aún opera de forma local sin backend remoto ni sesiones.
  2. **Guarda parcial en `Network First` del Service Worker:** Mientras que la rama `Cache First` en `public/sw.js` (líneas 98–104) comprueba `response.status === 200 && response.type === 'basic'`, la rama `Network First` (líneas 65–75) almacena en `pwa-dynamic-v1` cualquier respuesta devuelta por `fetch` sin verificar el código de estado. Se documentó el riesgo (`T-04` / `CTL-12`) sin modificar `public/sw.js` para respetar el alcance individual documental.
  3. **Dependencia de los demás entregables de la Semana 09:** El check público de la Semana 09 exige además `docs/privacy-data-inventory.md`, `src/lib/security/`, `tests/security.spec.ts` y `public/robots.txt`, los cuales corresponden a las tareas de los otros integrantes del equipo y se validarán conjuntamente al integrar en `develop`.
- **Cambio que puedo defender o modificar en vivo:**
  - Puedo explicar y defender cada activo, actor, frontera de confianza y amenaza en `docs/threat-model.md`, demostrar en el código exactamente dónde operan los controles verificados (`validateLocalInspection`, `SyncQueue`, `registerServiceWorker`, `public/sw.js`, `camera.ts`, `geolocation.ts`, `notifications/client.ts`) y agregar o ajustar nuevas amenazas, controles o casos de prueba de seguridad en vivo.
- **Uso declarado de IA (herramienta, propósito, validación):**
  - Utilicé Antigravity (modelo Gemini) como asistente de apoyo para inspeccionar las rutas y módulos del repositorio, estructurar las tablas de activos, fronteras de confianza, amenazas y controles en `docs/threat-model.md` y dar formato a esta sección de evidencia. Validé personalmente que cada afirmación coincida con los archivos reales del proyecto y comprobé los resultados ejecutando `npm run typecheck`, `npm test` y `npm run verify`.
