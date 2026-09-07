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

## Integrante: Felix Ivan Garcia Flores

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

## Integrante: Cesar 3522110305

- Mi contribución concreta y enlace a archivo, commit anterior o revisión:

  Revisé la evidencia individual solicitada para la actividad y agregué mi sección personal en `evidence/individual.md`. Mi aportación se enfoca en documentar mi verificación del proyecto del equipo y el alcance real de la prueba ejecutada.

- Decisión que puedo explicar y por qué:

  Puedo explicar la decisión de utilizar una PWA para este proyecto. Esta estrategia es adecuada porque el producto se orienta al registro y consulta de inspecciones de laboratorio, y en etapas futuras deberá considerar situaciones de conectividad intermitente sin cambiar el stack de Next.js indicado para el curso.

- Comando o prueba proporcionada que ejecuté:

  `npm ci`

  `npm run verify`

- Resultado real que observé:

  `npm ci` instaló correctamente las dependencias usando el `package-lock.json`.

  Al ejecutar la verificación con Node.js `v24.19.0`, `npm run verify` terminó con `Verificación técnica: pass`. La prueba `starter.spec.mjs` mostró `PASS`, el build de Next.js compiló correctamente y se generó `reports/verification.json`.

- Qué verifica esa prueba y qué no verifica:

  La verificación comprueba que la estructura requerida esté presente, que la prueba proporcionada del starter pase y que el proyecto compile correctamente.

  No comprueba una calificación académica automática, no valida por completo la calidad del análisis de requisitos, no certifica ausencia de secretos y no prueba todavía instalación PWA, funcionamiento offline, sincronización, notificaciones ni autenticación.

- Limitación, dificultad o riesgo que identifiqué:

  La instalación local tiene Node.js `v20.10.0`, pero la actividad pide Node.js `20.19` o posterior compatible. Con esa versión local, `npm test` y `npm run verify` fallaron por incompatibilidad con `import.meta.dirname`. Por eso la verificación correcta se ejecutó con Node.js `v24.19.0`, que sí es compatible. Además, `npm ci` reportó 2 vulnerabilidades altas en dependencias, sin corregirlas porque cambiar dependencias queda fuera del alcance de esta evidencia individual.

- Uso de IA: herramienta, propósito, partes influenciadas y validación propia:

  Utilicé ChatGPT/Codex como apoyo para interpretar el enunciado, identificar qué faltaba en mi evidencia individual, ejecutar los comandos de verificación y redactar esta sección. La IA influyó en la organización y redacción de mi evidencia, pero revisé que el texto correspondiera a los comandos ejecutados y al alcance solicitado por la actividad.
