# Requisitos del producto — documento del equipo

> Sustituyan las orientaciones por su análisis. Los ejemplos muestran el formato; pueden usar otros equivalentes. Los requisitos del producto futuro se documentan ahora y se implementarán en las semanas correspondientes. No hay una cantidad nueva obligatoria de requisitos.

## 1. Problema y contexto
El producto se enfocará en apoyar el proceso de inspección y mantenimiento de laboratorios mediante el registro, consulta y seguimiento de la información generada durante las revisiones. En una inspección pueden identificarse hallazgos que requieren atención y que deben quedar asociados al registro correspondiente para facilitar su seguimiento posterior.

Una dificultad del escenario es que la persona encargada puede encontrarse con una conexión de red inestable o interrumpida mientras realiza una inspección. La disponibilidad de conectividad puede afectar la posibilidad de registrar o consultar información en el momento en que se necesita. Por esta razón, el producto deberá considerar desde su diseño situaciones en las que la conexión no esté disponible de manera continua.

El objetivo del producto será proporcionar una forma organizada de gestionar las inspecciones y sus hallazgos, considerando la necesidad de mantener la continuidad del trabajo ante situaciones de conectividad intermitente. La solución se desarrollará progresivamente, por lo que las capacidades relacionadas con el funcionamiento sin conexión y la sincronización se consideran parte del producto futuro y se implementarán en las semanas correspondientes.

El proyecto se desarrollará utilizando exclusivamente información sintética. El escenario planteado representa el caso de uso definido para el proyecto y no constituye un diagnóstico de las condiciones reales de los laboratorios de la UTT.

Límites

El producto se limitará al registro, consulta y seguimiento de inspecciones y hallazgos dentro del escenario definido para el proyecto.

Quedan fuera del alcance el uso de datos reales de estudiantes, docentes o personal, la integración con sistemas institucionales reales, el uso de credenciales o secretos reales y cualquier servicio externo que no forme parte de los requisitos establecidos para el proyecto.


## 2. Usuarios y escenarios

### Usuarios

El producto contempla principalmente dos tipos de usuarios:

- **Persona encargada de realizar la inspección:** realiza la revisión del laboratorio, registra la información correspondiente a la inspección e identifica los hallazgos que requieren atención.

- **Persona responsable del seguimiento:** consulta las inspecciones realizadas, revisa los hallazgos registrados y da seguimiento a aquellos que requieren atención.

### Escenario 1 — Registro de una inspección con conectividad disponible

**Situación inicial:**  
La persona encargada realiza una inspección de un laboratorio y dispone de conexión de red.

**Acción:**  
Registra la información correspondiente a la inspección y los hallazgos identificados durante la revisión.

**Resultado esperado:**  
La información de la inspección queda registrada y puede ser consultada posteriormente para revisar sus datos y dar seguimiento a los hallazgos.

### Escenario 2 — Registro de una inspección con conectividad intermitente

**Situación inicial:**  
La persona encargada realiza una inspección y durante el proceso la conexión de red se vuelve inestable o se interrumpe.

**Acción:**  
Continúa registrando la información de la inspección y los hallazgos sin depender de que la conexión permanezca disponible durante todo el proceso.

**Resultado esperado:**  
La información registrada se conserva y puede procesarse posteriormente cuando la conectividad se restablezca.

### Escenario 3 — Consulta y seguimiento de una inspección

**Situación inicial:**  
La persona responsable del seguimiento necesita consultar una inspección realizada anteriormente.

**Acción:**  
Consulta el historial de inspecciones y localiza el registro correspondiente para revisar sus datos y los hallazgos asociados.

**Resultado esperado:**  
Puede consultar la información de la inspección e identificar los hallazgos que requieren seguimiento.

## 3. Requisitos funcionales

Los siguientes requisitos describen las acciones que deberá realizar el producto. Se distingue entre las capacidades que pueden comprobarse durante la Semana 1 y las que corresponden a etapas posteriores del proyecto.

| ID | Acción del producto | Condición observable de aceptación | Ahora o futuro |
|---|---|---|---|
| RF-01 | Mostrar las inspecciones sintéticas proporcionadas por el starter | Al abrir la página se muestran las tres inspecciones sintéticas proporcionadas por el proyecto | Semana 1 |
| RF-02 | Mostrar la información principal de cada inspección | Cada inspección mostrada presenta su laboratorio, fecha, responsable, cantidad de hallazgos y resultado correspondiente | Semana 1 |
| RF-03 | Registrar una nueva inspección | Al proporcionar datos válidos de una inspección, el sistema registra la información y permite consultar el nuevo registro | Futuro |
| RF-04 | Registrar los hallazgos asociados a una inspección | Al registrar un hallazgo, este queda asociado a la inspección correspondiente y puede consultarse posteriormente | Futuro |
| RF-05 | Consultar el historial de inspecciones | Al seleccionar o buscar una inspección registrada, se muestra la información correspondiente y sus hallazgos | Futuro |
| RF-06 | Consultar el estado de seguimiento de un hallazgo | Al consultar una inspección con hallazgos, se puede identificar cuáles requieren atención y cuál es su estado de seguimiento | Futuro |
| RF-07 | Conservar información durante una interrupción de conectividad | Si la conexión se interrumpe durante el registro, la información introducida permanece disponible para su posterior procesamiento | Futuro |
| RF-08 | Sincronizar información pendiente después de recuperar la conectividad | Cuando se restablece la conexión, la información conservada durante la interrupción puede procesarse y quedar disponible para su consulta | Futuro |

## 4. Requisitos no funcionales

Los requisitos no funcionales establecen condiciones de calidad y operación que deberá cumplir el producto. Se distingue entre las condiciones que pueden comprobarse durante la Semana 1 y las que serán validadas cuando se implementen las funcionalidades correspondientes.

| ID | Aspecto | Condición | Método de comprobación | Momento de validación |
|---|---|---|---|---|
| RNF-01 | Reproducibilidad | El proyecto debe poder instalarse y verificarse en un entorno compatible utilizando Node.js 20.19 o posterior compatible, npm 10 o posterior y el `package-lock.json` proporcionado | Ejecutar `npm ci` y posteriormente `npm run verify`, registrando el resultado obtenido | Semana 1 y después de cambios relevantes |
| RNF-02 | Accesibilidad | La interfaz deberá permitir identificar el contenido y utilizar los controles principales mediante una estructura comprensible y navegación por teclado | Revisión manual de la interfaz y prueba de navegación mediante teclado; posteriormente se podrán utilizar herramientas automatizadas | Durante la implementación y evolución de la interfaz |
| RNF-03 | Seguridad | El repositorio y la aplicación no deberán contener credenciales, contraseñas, tokens ni claves reales | Revisar los archivos incluidos en el repositorio y comprobar que los datos utilizados sean sintéticos antes de cada entrega | Desde Semana 1 y durante todo el proyecto |
| RNF-04 | Privacidad | La aplicación deberá trabajar únicamente con datos sintéticos y no deberá utilizar información personal real | Revisión de los datos utilizados por la aplicación, archivos del proyecto y evidencias antes de cada entrega | Desde Semana 1 y durante todo el proyecto |
| RNF-05 | Rendimiento | Las pantallas que consulten inspecciones deberán responder dentro de un tiempo definido para el conjunto de datos sintéticos y dispositivo de prueba establecidos por el equipo | Medir el tiempo de respuesta utilizando un conjunto definido de registros sintéticos y realizar varias ejecuciones bajo las mismas condiciones de prueba | Cuando se implemente el manejo de datos y se realicen las pruebas de rendimiento |
| RNF-06 | Operación offline futura | Las funciones de registro que requieran conectividad deberán conservar la información necesaria cuando se produzca una interrupción de red | Desconectar intencionalmente el dispositivo durante una prueba, registrar información sintética y comprobar posteriormente que la información pendiente permanezca disponible | Durante la implementación de las capacidades offline |
| RNF-07 | Sincronización futura | La información registrada durante una interrupción deberá poder procesarse cuando la conectividad se restablezca, de acuerdo con las reglas de sincronización definidas por el producto | Realizar una prueba controlada con datos sintéticos, interrumpir la conexión, restablecerla y comprobar el resultado de la sincronización | Durante la implementación de sincronización |


## 5. Datos sintéticos y límites

El proyecto utiliza exclusivamente datos sintéticos para representar las inspecciones de mantenimiento de laboratorios. Los registros incluidos en el starter tienen como finalidad permitir la ejecución y verificación del proyecto sin utilizar información real.

Los registros de inspección utilizan información ficticia relacionada con:

- Identificador de la inspección.
- Nombre ficticio del laboratorio.
- Fecha de la inspección.
- Responsable ficticio de la inspección.
- Cantidad de hallazgos identificados.
- Resultado o estado de la inspección.
- Información descriptiva sintética relacionada con los hallazgos.

Los datos actuales del starter representan únicamente ejemplos sintéticos de inspecciones y no corresponden a inspecciones reales realizadas en laboratorios.

En las siguientes etapas del proyecto se mantendrá el uso de datos sintéticos para las pruebas y demostraciones. Cuando se incorporen nuevas funcionalidades, los registros adicionales utilizados para probarlas también deberán ser ficticios.


## 6. Criterios de aceptación de la Semana 1

Los criterios de esta semana permiten comprobar el funcionamiento del starter, la reproducibilidad del proyecto y la existencia de la documentación solicitada. La verificación técnica no sustituye la revisión del contenido de los documentos.

| Entrega | Comprobación | Resultado esperado | Tipo de comprobación |
|---|---|---|---|
| Instalación reproducible | `npm ci` | Las dependencias se instalan correctamente utilizando el `package-lock.json` | Técnica |
| Pantalla inicial | `npm run dev` y revisión de `http://localhost:3000` | La aplicación inicia y muestra las tres inspecciones sintéticas proporcionadas por el starter | Técnica y visual |
| Prueba proporcionada | `npm test` | La prueba incluida en el starter termina correctamente y muestra `PASS` | Técnica |
| Compilación | `npm run build` | El proyecto compila correctamente sin errores | Técnica |
| Verificación del starter | `npm run verify` | La prueba proporcionada y el proceso de compilación terminan correctamente y se genera `reports/verification.json` | Técnica |
| Requisitos del producto | Revisión de `docs/requirements.md` | El documento contiene el problema, usuarios, escenarios, requisitos funcionales, requisitos no funcionales, datos sintéticos y límites definidos para el producto | Revisión de contenido |
| Decisión tecnológica | Revisión de `docs/decision-record.md` | El documento compara PWA, web tradicional, aplicación nativa y multiplataforma y justifica la estrategia seleccionada | Revisión de contenido |
| Evidencia individual | Revisión de `evidence/individual.md` | Cada integrante documenta su contribución, una decisión, una prueba ejecutada, su resultado, limitaciones y uso de IA | Revisión individual |

### Alcance de la verificación

La ejecución de `npm run verify` comprueba los archivos definidos por el starter, ejecuta la prueba proporcionada y realiza la compilación del proyecto. El resultado técnico `pass` no demuestra por sí mismo que el análisis de requisitos sea correcto, que la decisión tecnológica sea adecuada, que se cumplan los criterios de accesibilidad o rendimiento, ni que las capacidades futuras de operación offline y sincronización estén implementadas.

Las capacidades de instalación PWA, funcionamiento offline, persistencia local, sincronización, notificaciones y autenticación no forman parte de los criterios de implementación de la Semana 1 y serán verificadas en las etapas correspondientes del proyecto.