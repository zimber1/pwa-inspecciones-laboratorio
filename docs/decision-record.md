# ADR-001 — Decisión sobre la estrategia de aplicación

> ADR significa registro de decisión arquitectónica. Este documento explica la comparación, la elección y sus consecuencias. Es un documento del equipo; adapten los ejemplos al caso.

## Estado

**Estado:**  Aceptada  
**Fecha:** 6 de septiembre de 2026

## Contexto y restricciones

El proyecto consiste en desarrollar una aplicación web progresiva orientada al registro, consulta y seguimiento de inspecciones de mantenimiento de laboratorios. La aplicación busca facilitar el manejo de la información generada durante las inspecciones y de los hallazgos que requieran atención.

Los principales usuarios serán las personas encargadas de realizar las inspecciones y las personas responsables de consultar y dar seguimiento a los resultados obtenidos.

Uno de los principales problemas considerados es la conectividad intermitente. Durante una inspección puede presentarse una interrupción de la conexión a Internet, por lo que la aplicación deberá evolucionar para permitir que el trabajo continúe y que la información pueda procesarse cuando la conexión se restablezca.

La solución se desarrollará utilizando tecnologías web y seguirá la estructura proporcionada por el starter del proyecto. La estrategia PWA permitirá incorporar progresivamente capacidades como instalación, almacenamiento local y operación ante interrupciones de conectividad, de acuerdo con las etapas establecidas en el curso.

Como parte del proyecto se utilizarán únicamente datos sintéticos para las inspecciones, pruebas y demostraciones. No se utilizarán datos reales de estudiantes, docentes o personal, ni credenciales, contraseñas, tokens o información proveniente de sistemas institucionales.

Durante la Semana 1 se mantendrá el alcance establecido para el arranque del proyecto. Se conservará el starter proporcionado y se verificará su funcionamiento, sin implementar todavía las funcionalidades correspondientes a semanas posteriores, como operación offline, sincronización, notificaciones o autenticación.

## Alternativas consideradas

Para definir la estrategia de aplicación se consideraron cuatro alternativas: PWA, web tradicional, aplicación nativa y aplicación multiplataforma. La comparación se realizó tomando en cuenta las necesidades del proyecto, principalmente la conectividad intermitente, la distribución, el mantenimiento y la posibilidad de utilizar diferentes dispositivos.

| Criterio | PWA | Web tradicional | Aplicación nativa | Multiplataforma |
|---|---|---|---|---|
| Instalación | Puede instalarse en dispositivos compatibles desde el navegador. | No requiere instalación. | Requiere instalación específica para el sistema operativo. | Requiere instalación en las plataformas que se quieran utilizar. |
| Offline | Puede incorporar almacenamiento local y sincronización para trabajar durante interrupciones de conexión. | Requiere implementar mecanismos adicionales para conservar información sin conexión. | Puede diseñarse para funcionar sin conexión mediante almacenamiento local. | Puede implementar funcionamiento offline mediante las herramientas del framework utilizado. |
| Distribución | Se puede acceder mediante la web y posteriormente instalar. | Se distribuye mediante una URL. | Depende del sistema operativo y sus mecanismos de distribución. | Depende de las plataformas que se quieran soportar. |
| Costo de desarrollo | Permite aprovechar tecnologías web y mantener una base de código común. | Tiene un desarrollo web sencillo, pero requiere soluciones adicionales para el escenario de conectividad intermitente. | Puede requerir mayor esfuerzo cuando se necesitan diferentes sistemas operativos. | Permite compartir código, aunque requiere utilizar un framework adicional. |
| Mantenimiento | Se mantiene una aplicación web común, considerando la compatibilidad entre navegadores. | El mantenimiento es centralizado. | Puede requerir mantenimiento específico para cada plataforma. | Requiere mantener el framework y comprobar su compatibilidad con las plataformas. |
| Acceso al dispositivo | Puede utilizar las capacidades disponibles mediante las APIs del navegador. | El acceso depende de las capacidades disponibles en el navegador. | Ofrece mayor acceso a las capacidades del dispositivo y del sistema operativo. | El acceso depende del framework y de las capacidades disponibles. |
| Riesgos | Diferencias entre navegadores y complejidad al implementar almacenamiento y sincronización. | Dependencia de la conectividad para las funciones que requieren comunicación con el servidor. | Mayor esfuerzo de desarrollo y mantenimiento entre plataformas. | Dependencia del framework y posibles diferencias entre plataformas. |

La **PWA** es la alternativa que mejor se adapta al proyecto porque permite mantener una aplicación basada en tecnologías web y, al mismo tiempo, incorporar progresivamente características de instalación y continuidad ante problemas de conectividad.

La **web tradicional** sería suficiente si el proyecto dependiera de una conexión estable y no necesitara características de instalación o funcionamiento ante interrupciones. La **aplicación nativa** sería más conveniente si se requiriera un acceso amplio a funciones específicas del dispositivo. La alternativa **multiplataforma** sería adecuada si fuera necesario desarrollar aplicaciones específicas para diferentes sistemas operativos compartiendo una parte importante del código.

Para este proyecto, la operación offline no se considera una característica automática de la tecnología utilizada. Será necesario diseñar posteriormente mecanismos de **almacenamiento local y sincronización** para conservar y procesar la información cuando la conexión se interrumpa y posteriormente se restablezca.

Por estas razones, se selecciona **PWA** como estrategia para el proyecto, manteniendo el starter basado en **Next.js** 


## Decisión
Se selecciona **PWA (Progressive Web App)** como estrategia para el desarrollo de la aplicación de inspecciones de mantenimiento de laboratorios.

La elección se basa principalmente en las características del escenario y en las restricciones establecidas para el proyecto. La posibilidad de encontrar conectividad intermitente hace necesario que la aplicación pueda evolucionar posteriormente hacia un funcionamiento con menor dependencia de la conexión. La estrategia PWA permite incorporar progresivamente mecanismos de almacenamiento local, recuperación de información y sincronización, manteniendo la base tecnológica web.

Además, esta alternativa permite que la aplicación sea accesible mediante un navegador y pueda instalarse en dispositivos compatibles, sin requerir inicialmente el desarrollo de aplicaciones independientes para cada sistema operativo. Esto resulta adecuado para un producto que debe poder utilizarse en diferentes dispositivos y que seguirá desarrollándose de manera progresiva durante el curso.

Para esta decisión se mantendrá el **starter proporcionado basado en Next.js**, respetando el stack establecido para el proyecto. La elección de PWA no implica implementar todas sus características durante la Semana 1.

En esta primera etapa se conservará el alcance del starter y se comprobará su funcionamiento. Las capacidades de instalación PWA, operación offline, almacenamiento local, sincronización y demás funcionalidades previstas se incorporarán posteriormente de acuerdo con las semanas correspondientes del curso.

Se considera que una aplicación nativa sería preferible si el proyecto necesitara un acceso profundo a capacidades específicas del sistema operativo, mientras que una solución multiplataforma podría ser más conveniente si se requirieran aplicaciones específicas para varias plataformas. Una web tradicional sería suficiente para un escenario con conectividad estable y sin necesidad de instalación o continuidad sin conexión.

Por lo tanto, el equipo adopta **PWA como estrategia de aplicación**, manteniendo Next.js como base del proyecto y desarrollando sus capacidades de manera progresiva conforme al alcance establecido.

## Consecuencias y riesgos

La elección de PWA permite desarrollar el proyecto sobre una base web y avanzar progresivamente hacia las características necesarias para atender el escenario de conectividad intermitente. Esta decisión también implica considerar nuevos aspectos de desarrollo y pruebas conforme se incorporen las funcionalidades previstas.

### Consecuencias

- Se mantiene el uso de Next.js y las tecnologías web proporcionadas por el starter.
- La aplicación podrá evolucionar hacia una solución instalable sin desarrollar aplicaciones independientes para cada sistema operativo.
- Será necesario diseñar posteriormente mecanismos de almacenamiento local para conservar información durante una interrupción de conectividad.
- La sincronización requerirá establecer reglas para procesar la información cuando se recupere la conexión.
- Será necesario realizar pruebas en diferentes navegadores y dispositivos para comprobar el comportamiento de la aplicación.

### Riesgos

| Riesgo | Consecuencia | Mitigación |
|---|---|---|
| Interrupción de conectividad durante una inspección | La información podría no registrarse correctamente. | Implementar y probar posteriormente mecanismos de almacenamiento local. |
| Conflictos durante la sincronización | La información local podría no coincidir con la información disponible al recuperar la conexión. | Definir reglas de sincronización y resolución de conflictos antes de implementar esta funcionalidad. |
| Diferencias entre navegadores y dispositivos | Algunas funcionalidades podrían presentar comportamientos diferentes. | Realizar pruebas de compatibilidad durante las etapas de desarrollo correspondientes. |
| Mayor complejidad en el manejo de información offline | El desarrollo y las pruebas pueden requerir mayor esfuerzo. | Diseñar las funcionalidades de almacenamiento y sincronización de forma progresiva y validarlas mediante pruebas controladas. |

Durante la Semana 1 estos riesgos no se consideran resueltos, ya que las funcionalidades de operación offline y sincronización todavía no forman parte de la implementación. Su validación se realizará en las etapas posteriores correspondientes.

## Validación

La decisión de utilizar una PWA se validará mediante pruebas que permitan comprobar si la aplicación responde adecuadamente a las necesidades del proyecto.

Se considerarán las siguientes validaciones:

- Comprobar la instalación de la aplicación en dispositivos compatibles.
- Verificar el comportamiento de la aplicación ante una interrupción de la conexión a Internet.
- Comprobar que la información de una inspección pueda conservarse durante una interrupción de conectividad.
- Verificar que la información pendiente pueda procesarse correctamente al recuperar la conexión.
- Probar la sincronización utilizando datos sintéticos.
- Evaluar el comportamiento de la aplicación en diferentes navegadores y dispositivos.
- Medir el rendimiento utilizando un conjunto de datos sintéticos definido para las pruebas.

Los resultados de estas pruebas permitirán determinar si los supuestos considerados para seleccionar PWA se cumplen y si es necesario realizar ajustes en la implementación.