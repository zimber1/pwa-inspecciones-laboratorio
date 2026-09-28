# Decisión técnica — CSR y SSR para inspecciones

## Estado
**Estado:** Aceptada
**Fecha:** 27 de septiembre de 2026
**Alcance:** Semana 4 — comparación de rutas CSR y SSR

## Contexto y objetivo

La Semana 4 requiere implementar y comparar rutas de renderizado del lado del cliente y del lado del servidor para el flujo de inspecciones del proyecto.

El objetivo es comprobar cómo se comportan ambas estrategias dentro de la aplicación de inspecciones de mantenimiento de laboratorios, utilizando únicamente datos sintéticos y manteniendo el alcance definido para la actividad.

Se implementaron dos rutas:

- `/inspecciones` para el listado.
- `/inspecciones/[id]` para el detalle de una inspección.

La comparación considera también los estados de carga y error asociados a cada ruta.

## Restricciones

La implementación debe respetar las siguientes restricciones:

- Utilizar el starter basado en Next.js.
- Utilizar datos sintéticos.
- No utilizar datos reales de estudiantes, docentes o personal.
- No utilizar credenciales, tokens ni secretos.
- Mantener las funcionalidades dentro del alcance de la Semana 4.
- Contar con pruebas reproducibles.
- Mantener las implementaciones verificables mediante archivos y pruebas del repositorio.

## Alternativas de renderizado

Para las rutas de esta semana se consideraron dos estrategias principales.

### Client-Side Rendering — CSR

En CSR, el componente se ejecuta en el navegador y los datos se cargan después de que la aplicación se monta.

En `/inspecciones`, la implementación utiliza:

- `"use client"`;
- `useState`;
- `useEffect`;
- `useMemo`.

La carga de los datos sintéticos se realiza mediante una función asíncrona ejecutada desde el navegador.

La ruta también permite:

- refrescar los datos;
- filtrar inspecciones con hallazgos;
- simular un error;
- reintentar la carga.

El estado de la interfaz se representa mediante los estados:

- `loading`;
- `ready`;
- `error`.

### Server-Side Rendering — SSR

En SSR, la página se ejecuta como un componente de servidor.

La ruta `/inspecciones/[id]` no utiliza `"use client"` y su componente principal es una función asíncrona.

La ruta recibe el identificador dinámico mediante `params.id`, consulta los datos sintéticos definidos para el detalle y genera el contenido de la inspección.

Cuando el identificador no existe, se utiliza `notFound()` para delegar el resultado al componente `not-found.tsx`.

La ruta también cuenta con:

- `loading.tsx`;
- `loading-state.tsx`;
- `not-found.tsx`.

## Implementación actual

### Listado — CSR

Archivo:

```text
src/app/inspecciones/page.tsx
```

La ruta se declara como Client Component mediante:

```text
"use client";
```

Los datos se obtienen desde:

```text
src/lib/data/inspections.ts
```

La carga sintética se ejecuta después del montaje mediante `useEffect`.

El componente mantiene el estado de la interfaz con `useState` y calcula el listado visible mediante `useMemo`.

Los estados implementados son:

```text
loading → ready
loading → error
error → loading → ready
```

El usuario puede iniciar nuevamente la carga mediante el botón de refresco o recuperarse de un error mediante la acción de reintento.

### Detalle — SSR

Archivo:

```text
src/app/inspecciones/[id]/page.tsx
```

La ruta utiliza un componente de servidor asíncrono y recibe el identificador dinámico mediante:

```text
params.id
```

La implementación contiene datos sintéticos para tres inspecciones y simula una latencia de 1500 ms para hacer observable el estado de carga.

Cuando no existe el identificador solicitado, la implementación ejecuta:

```text
notFound()
```

Esto permite que Next.js utilice:

```text
src/app/inspecciones/[id]/not-found.tsx
```

para presentar el estado de recurso no encontrado.

### Estado de carga

La ruta dinámica utiliza:

```text
src/app/inspecciones/[id]/loading.tsx
```

Este archivo delega la representación visual al componente:

```text
src/components/loading-state.tsx
```

De esta forma, la UI de carga queda separada de la página principal del detalle.

### Estado no encontrado

El archivo:

```text
src/app/inspecciones/[id]/not-found.tsx
```

presenta un mensaje indicando que la inspección no fue encontrada y proporciona un enlace para regresar al listado.

## Comparación técnica

| Aspecto | CSR — `/inspecciones` | SSR — `/inspecciones/[id]` |
|---|---|---|
| Tipo de componente | Client Component | Server Component |
| `"use client"` | Sí | No |
| Ejecución principal | Navegador | Servidor |
| Carga de datos | Después del montaje | Durante la ejecución del componente de servidor |
| Estado local | `useState` | No depende de estado React del cliente |
| Efectos | `useEffect` | No utiliza `useEffect` |
| Interacción | Refrescar, filtrar y simular error | Consulta de detalle mediante identificador |
| Carga | Estado `loading` dentro del componente | `loading.tsx` de Next.js |
| Error de dato inexistente | Estado de error controlado | `notFound()` |
| Datos | Sintéticos | Sintéticos |
| Ruta | `/inspecciones` | `/inspecciones/[id]` |

## Decisión técnica

Para la Semana 4 se mantiene una combinación de CSR y SSR en lugar de utilizar una única estrategia para todas las rutas.

El listado `/inspecciones` utiliza CSR porque la pantalla requiere interacción directa en el navegador. La implementación permite refrescar, filtrar y simular errores sin cambiar de ruta.

El detalle `/inspecciones/[id]` utiliza SSR porque representa un recurso identificado mediante un parámetro dinámico y permite resolver el contenido del detalle en el servidor. Además, Next.js proporciona mecanismos específicos para gestionar el estado de carga y el recurso no encontrado mediante `loading.tsx` y `not-found.tsx`.

La decisión permite comparar ambas estrategias dentro del mismo proyecto y observar sus diferencias mediante rutas concretas, en lugar de realizar una comparación únicamente teórica.

## Supuestos

Los siguientes supuestos forman parte de la implementación de esta semana:

- Los datos de inspecciones son sintéticos.
- La carga de datos de CSR se simula mediante una operación asíncrona local.
- La latencia del detalle SSR se simula mediante una espera de 1500 ms.
- No existe todavía un backend real para estas rutas.
- La persistencia y sincronización de información no forman parte de esta actividad.
- La aplicación continuará evolucionando en semanas posteriores.

## Limitaciones

Existe una diferencia entre los modelos de datos utilizados por las dos rutas.

El listado CSR utiliza:

```text
src/lib/data/inspections.ts
```

con propiedades como:

```text
id
location
date
inspector
status
statusLabel
findings
summary
```

Mientras que el detalle SSR utiliza un conjunto sintético definido directamente en:

```text
src/app/inspecciones/[id]/page.tsx
```

con propiedades como:

```text
id
laboratorio
estado
fecha
inspector
observaciones
```

Por lo tanto, la comparación de Semana 4 demuestra las estrategias de renderizado, pero todavía no representa un flujo conectado a una única fuente de datos.

Otra limitación es que la prueba automatizada de renderizado verifica el contrato estructural de las implementaciones leyendo los archivos del proyecto. No sustituye una prueba real de navegador, dispositivo o red.

## Seguridad y alcance

La implementación utiliza únicamente datos sintéticos.

No se incorporan:

- credenciales;
- contraseñas;
- tokens;
- datos personales reales;
- integraciones con sistemas institucionales.

No se agregan mecanismos de autenticación, persistencia real ni sincronización en esta actividad.

## Validación

La implementación se valida mediante:

```text
npx tsx tests/rendering.spec.ts
```

Resultado:

```text
rendering.spec.ts: PASS
```

La prueba se integró al comando general:

```text
npm test
```

El conjunto actual de pruebas ejecuta:

```text
starter.spec.mjs
manifest.spec.ts
register-service-worker.spec.ts
service-worker.spec.ts
offline.spec.ts
rendering.spec.ts
```

El resultado esperado y obtenido para la ejecución realizada es:

```text
starter.spec.mjs: PASS
manifest.spec.ts: PASS
register-service-worker.spec.ts: PASS
service-worker.spec.ts: PASS
offline.spec.ts: PASS
rendering.spec.ts: PASS
```

## Conclusión

La Semana 4 deja implementadas dos rutas con estrategias de renderizado diferentes:

```text
/inspecciones
        ↓
       CSR

/inspecciones/[id]
        ↓
       SSR
```

La comparación permite identificar las diferencias de ejecución, manejo de estado, carga y errores entre ambas estrategias.

La implementación se mantiene dentro del alcance de la actividad y utiliza datos sintéticos. Las limitaciones identificadas, principalmente la utilización de modelos de datos sintéticos diferentes y la ausencia de pruebas reales de navegador, quedan documentadas para su consideración en etapas posteriores del proyecto.