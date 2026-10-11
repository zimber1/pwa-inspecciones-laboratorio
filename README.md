# PWA de inspecciones de laboratorio

Proyecto integrador para una PWA de inspecciones y mantenimiento de laboratorios. La Semana 2 agrega un shell instalable con manifest, navegación principal y estados de carga, error y vacío. La Semana 3 incorpora el registro del Service Worker, estrategias de caché, funcionamiento offline y actualización segura. Los registros usados por la interfaz son sintéticos.

## Entorno

- Node.js `>=20.19.0`
- npm `>=10.0.0`
- Git

La versión de Node.js debe ser compatible con el entorno definido por el curso. La verificación de las semanas se ejecuta mediante los scripts del proyecto y GitHub Actions.

## Setup

```bash
npm ci
```

El proyecto conserva `package-lock.json` para que la instalación sea reproducible.

## Ejecución

```bash
npm run dev
```

Abrir `http://localhost:3000`. La pantalla muestra el shell de inspecciones, navegación interna, resumen del manifest y las inspecciones sintéticas. La Semana 3 incorpora el registro del Service Worker para proporcionar estrategias de caché y recuperación ante interrupciones de conectividad.

## Verificación

```bash
npm test
npm run build
make verify
bash public-tests/check.sh
```

`make verify` ejecuta el equivalente local de `npm run verify`: prueba automatizada y build de Next.js. El reporte local se genera en `reports/verification.json` y no se versiona.

La suite incluye:

- `tests/starter.spec.mjs`
- `tests/manifest.spec.ts`
- `tests/register-service-worker.spec.ts`
- `tests/service-worker.spec.ts`
- `tests/offline.spec.ts`

La prueba de manifest valida `public/manifest.webmanifest`, iconos, referencia desde `layout.tsx`, uso de `AppShell` desde `page.tsx`, navegación y estados de carga, error y vacío.

La prueba de registro valida soporte de Service Worker, contexto seguro, registro exitoso y manejo de errores.

La prueba de Service Worker valida cachés, ciclo de vida, App Shell, peticiones GET, estrategias de caché y fallback offline.

La prueba offline valida `Network First`, `Cache First`, recuperación desde caché, almacenamiento de respuestas válidas y fallback HTTP 503.

Resultado verificado:

```text
starter.spec.mjs: PASS
manifest.spec.ts: PASS
register-service-worker.spec.ts: PASS
service-worker.spec.ts: PASS
offline.spec.ts: PASS
```

## Evidencia de Semana 2

- `public/manifest.webmanifest`
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`
- `public/icons/icon-maskable-512x512.png`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/app-shell.tsx`
- `tests/manifest.spec.ts`
- `.github/workflows/week-02-w02-shell-manifest.yml`
- `public-tests/check.sh`
- `evidence/individual.md`

## Evidencia de Semana 3

- `public/sw.js`
- `src/lib/pwa/register-service-worker.ts`
- `docs/cache-strategy.md`
- `tests/register-service-worker.spec.ts`
- `tests/service-worker.spec.ts`
- `tests/offline.spec.ts`
- `README.md`
- `evidence/individual.md`

## Service Worker

El Service Worker se encuentra en `public/sw.js`.

Implementa instalación, precaché del App Shell, activación, eliminación de cachés obsoletas, toma de control de clientes, interceptación de peticiones GET, `Network First`, `Cache First`, caché dinámica y fallback offline.

Durante la instalación se precargan:

```text
/
/manifest.webmanifest
```

Durante la activación se eliminan las cachés que no corresponden a las versiones actuales.

## Registro del Service Worker

El registro se encuentra en `src/lib/pwa/register-service-worker.ts`.

La función contempla ejecución en navegador, soporte de Service Worker, contexto seguro, registro exitoso y errores.

El registro se permite en `https`, `localhost` y `127.0.0.1`.

Cuando falla, devuelve un resultado controlado y registra una advertencia sin detener la aplicación.

## Estrategia de caché

La estrategia se documenta en `docs/cache-strategy.md`.

Se utilizan:

```text
pwa-static-v1
pwa-dynamic-v1
```

La caché estática contiene los recursos esenciales del App Shell.

La caché dinámica almacena respuestas obtenidas durante el funcionamiento de la aplicación.

Antes de almacenar una respuesta se valida:

```text
response.status === 200
response.type === "basic"
```

Las peticiones que no utilizan el método GET no son interceptadas por el Service Worker.

## Estrategia Network First

Para navegación y documentos HTML se utiliza `Network First`.

```text
Solicitud
  |
  v
Intentar red
  |
  +-- Éxito --> Guardar respuesta en caché
  |
  +-- Error --> Buscar en caché
                   |
                   +-- Encontrada --> Responder
                   |
                   +-- No encontrada --> /
```

Se prioriza una respuesta actualizada cuando existe conexión y se recurre a caché cuando la red falla.

Si no existe una respuesta específica en caché, el fallback final es `/`.

## Estrategia Cache First

Para recursos que no corresponden a navegación se utiliza `Cache First`.

```text
Solicitud
  |
  v
Buscar en caché
  |
  +-- Encontrada --> Responder
  |
  +-- No encontrada --> Red
                           |
                           +-- Respuesta válida --> Guardar caché
                           |
                           +-- Error --> HTTP 503
```

Los recursos disponibles en caché se utilizan antes de realizar una solicitud a la red.

Cuando el recurso no existe en caché, se intenta obtenerlo desde la red.

Las respuestas válidas pueden almacenarse en la caché dinámica.

## Actualización y limpieza de cachés

Durante la instalación se utiliza `self.skipWaiting()` para permitir la activación de la nueva versión.

Durante la activación se eliminan cachés antiguas y se utiliza `self.clients.claim()` para tomar el control de los clientes disponibles.

La versión de las cachés se controla mediante sus nombres:

```text
pwa-static-v1
pwa-dynamic-v1
```

Esto permite realizar una invalidación controlada cuando cambie la estrategia de almacenamiento.

## Funcionamiento offline

Cuando una navegación no puede resolverse mediante la red, se intenta recuperar desde caché.

Si no existe una respuesta específica, se utiliza `/` como fallback.

Para recursos que no están disponibles ni en caché ni en red se devuelve:

```text
HTTP 503 Service Unavailable
Recurso no disponible sin conexión.
```

La experiencia offline depende de que los recursos necesarios hayan sido almacenados previamente.

## Decisiones y supuestos

En Semana 2 se separó el shell en `src/components/app-shell.tsx` para que `src/app/page.tsx` conecte datos sintéticos con la interfaz y facilite las pruebas.

El manifest utiliza `display: "standalone"`, `start_url: "/"` y `scope: "/"`. Los iconos son recursos PNG locales.

En Semana 3 se separaron las cachés estática y dinámica.

La navegación utiliza `Network First` para priorizar contenido actualizado cuando existe conexión.

Los recursos que no corresponden a navegación utilizan `Cache First`.

Las respuestas se validan antes de almacenarse.

Las peticiones que no son GET no son interceptadas.

La estrategia de caché se mantiene limitada a los recursos necesarios para evitar almacenar indiscriminadamente información sensible o datos personales.

Los datos utilizados por la aplicación son sintéticos.

## Límites conocidos

La experiencia offline completa depende de que los recursos necesarios hayan sido almacenados previamente.

Un recurso nunca almacenado y tampoco disponible en red devuelve HTTP 503.

Esta semana no implementa:

- sincronización de datos de negocio;
- autenticación;
- notificaciones;
- persistencia de datos de negocio;
- integraciones institucionales reales.

Los datos utilizados son sintéticos y no contienen datos personales reales.

La invalidación de caché se controla mediante las versiones definidas en el Service Worker.

`npm install --package-lock-only` reportó vulnerabilidades de dependencias transitivas. No se aplicó `npm audit fix --force` porque podría introducir cambios mayores fuera del alcance de la actividad.

## Seguridad

No se deben incluir en el repositorio contraseñas, tokens, claves API, secretos ni datos personales reales.

Las pruebas y los datos utilizados son sintéticos.

El Service Worker no debe utilizarse para almacenar indiscriminadamente información sensible.

Las peticiones que no utilizan el método GET no son interceptadas.

El registro del Service Worker valida el contexto de ejecución antes de intentar instalarlo.

## Pruebas de Semana 3

Las pruebas principales de la Semana 3 son:

```text
npx tsx tests/register-service-worker.spec.ts
npx tsx tests/service-worker.spec.ts
npx tsx tests/offline.spec.ts
npm test
```

Resultado verificado:

```text
service-worker.spec.ts: PASS
offline.spec.ts: PASS
starter.spec.mjs: PASS
manifest.spec.ts: PASS
register-service-worker.spec.ts: PASS
service-worker.spec.ts: PASS
offline.spec.ts: PASS
```

La suite completa verifica:

- registro del Service Worker;
- contexto seguro;
- manejo de errores de registro;
- caché estática y dinámica;
- ciclo de vida del Service Worker;
- precaché del App Shell;
- interceptación de peticiones GET;
- estrategia `Network First`;
- estrategia `Cache First`;
- recuperación desde caché;
- almacenamiento de respuestas válidas;
- fallback offline HTTP 503.


## Evidencia de Semana 4

La Semana 4 implementa y compara dos estrategias de renderizado para el flujo de inspecciones:

- CSR para el listado.
- SSR para el detalle de una inspección.

Archivos principales:

- `src/app/inspecciones/page.tsx`
- `src/app/inspecciones/[id]/page.tsx`
- `src/components/loading-state.tsx`
- `src/app/inspecciones/[id]/loading.tsx`
- `src/app/inspecciones/[id]/not-found.tsx`
- `docs/rendering-decision.md`
- `tests/rendering.spec.ts`
- `evidence/individual.md`

### Ruta CSR

La ruta:

```text
/inspecciones
```

utiliza un Client Component mediante:

```text
"use client";
```

La carga de inspecciones se realiza en el navegador utilizando `useEffect` y `useState`.

La ruta contempla los estados:

```text
loading
ready
error
```

También permite:

- refrescar los datos;
- filtrar inspecciones con hallazgos;
- simular un error;
- reintentar la carga.

Los datos utilizados son sintéticos y provienen de:

```text
src/lib/data/inspections.ts
```

### Ruta SSR

La ruta:

```text
/inspecciones/[id]
```

utiliza un componente de servidor asíncrono.

El identificador se obtiene mediante:

```text
params.id
```

La implementación utiliza datos sintéticos y simula una latencia de servidor.

Cuando el identificador no corresponde a una inspección existente, se utiliza:

```text
notFound()
```

para presentar el estado definido en:

```text
src/app/inspecciones/[id]/not-found.tsx
```

### Estados de carga

La ruta dinámica utiliza:

```text
src/app/inspecciones/[id]/loading.tsx
```

Este archivo utiliza el componente:

```text
src/components/loading-state.tsx
```

para mostrar el estado de carga mientras se obtiene el detalle de la inspección.

### Decisión de renderizado

La comparación técnica entre CSR y SSR se documenta en:

```text
docs/rendering-decision.md
```

La decisión mantiene CSR para el listado porque requiere interacción directa del usuario, como refrescar y filtrar información.

El detalle utiliza SSR porque corresponde a una ruta dinámica identificada mediante un parámetro y permite gestionar el recurso no encontrado mediante `notFound()`.

La documentación también registra las limitaciones de la implementación, incluyendo el uso de modelos de datos sintéticos diferentes entre el listado y el detalle.

### Pruebas de Semana 4

La prueba específica de renderizado es:

```text
npx tsx tests/rendering.spec.ts
```

La prueba verifica de forma determinista:

- existencia de la ruta CSR;
- existencia de la ruta SSR;
- uso de `use client` en CSR;
- uso de `useEffect` y `useState`;
- carga de datos sintéticos;
- estados de carga y error del listado;
- acciones de refresco, filtrado, simulación de error y reintento;
- implementación SSR mediante función asíncrona;
- utilización de `params.id`;
- uso de `notFound()`;
- datos sintéticos del detalle;
- estado de carga;
- estado de recurso no encontrado.

Resultado verificado:

```text
rendering.spec.ts: PASS
```

La prueba se incorporó a la suite general mediante `npm test`.

Resultado verificado de la suite:

```text
starter.spec.mjs: PASS
manifest.spec.ts: PASS
register-service-worker.spec.ts: PASS
service-worker.spec.ts: PASS
offline.spec.ts: PASS
rendering.spec.ts: PASS
```

### Limitaciones de Semana 4

La implementación de esta semana utiliza datos sintéticos.

El listado CSR utiliza el modelo definido en:

```text
src/lib/data/inspections.ts
```

mientras que el detalle SSR utiliza datos sintéticos definidos directamente en su ruta.

Por lo tanto, las dos rutas permiten demostrar las estrategias CSR y SSR, pero todavía no utilizan una única fuente de datos compartida.

Las pruebas automatizadas de renderizado verifican el contrato estructural de los archivos y no sustituyen las pruebas reales en navegador, dispositivo o condiciones de red.

## Decisiones de Semana 4

La decisión técnica de renderizado se encuentra en:

```text
docs/rendering-decision.md
```

La implementación mantiene el alcance de la actividad y utiliza únicamente datos sintéticos.

No se incorporan en esta semana:

- datos personales reales;
- credenciales;
- tokens;
- secretos;
- backend real;
- persistencia de datos de negocio;
- sincronización de datos de negocio.

## Semana 5 — Persistencia local y sincronización offline

La Semana 5 incorpora persistencia local de operaciones de inspección, una cola
de sincronización y una política determinista para resolver conflictos entre
versiones de una misma inspección.

### Esquema de almacenamiento

El contrato de datos se encuentra en:

```text
src/lib/storage/schema.ts
```

Define:

- `LocalInspection` para representar inspecciones locales;
- `SyncOperation` para representar operaciones de sincronización;
- estados `pending`, `processed` y `failed`;
- `idempotencyKey` para evitar operaciones duplicadas;
- `retryCount` y `lastAttemptAt` para registrar los intentos;
- `errorMessage` para conservar información de fallos.

### Cola de sincronización

La implementación se encuentra en:

```text
src/lib/sync/queue.ts
```

`SyncQueue` conserva las operaciones pendientes, aplica idempotencia y permite
procesarlas mediante un handler de sincronización.

La cola utiliza `localStorage` para conservar las operaciones entre instancias
de la aplicación cuando el entorno dispone de almacenamiento local.

Cuando una operación falla, conserva su estado `failed`, incrementa el contador
de reintentos y registra el error para permitir un procesamiento posterior.

### Política de conflictos

La resolución de conflictos se encuentra en:

```text
src/lib/sync/conflict-policy.ts
```

La política se aplica cuando existen dos versiones de la misma inspección y
utiliza una decisión determinista:

1. Gana la versión numérica más alta.
2. Si la versión empata, gana el `updatedAt` más reciente.
3. Si versión y fecha empatan, gana el `operationId` lexicográficamente mayor.
4. Si también coincide el `operationId`, se considera una operación duplicada
   y se conserva la versión actual.

La decisión completa se documenta en:

```text
docs/sync-policy.md
```

### Pruebas de Semana 5

Las pruebas de la cola se encuentran en:

```text
tests/queue.spec.ts
```

y las pruebas de resolución de conflictos en:

```text
tests/sync.spec.ts
```

`tests/queue.spec.ts` verifica:

- incorporación de operaciones;
- recuperación de operaciones pendientes;
- idempotencia;
- conservación de operaciones después de un fallo;
- incremento de reintentos;
- procesamiento exitoso;
- persistencia y recuperación mediante `localStorage`.

`tests/sync.spec.ts` verifica:

- que una versión antigua no sobrescriba una versión más reciente;
- que la decisión sea determinista;
- que una operación duplicada conserve la versión actual;
- que los objetos de entrada no sean mutados.

La suite completa se ejecuta mediante:

```bash
npm test
```

### Alcance y limitaciones

La persistencia implementada corresponde a las operaciones de sincronización y
no representa todavía una base de datos remota de negocio.

La política de conflictos no realiza merge campo por campo; selecciona una
versión completa mediante reglas deterministas.

El proyecto continúa utilizando datos sintéticos y no incorpora datos
personales reales, credenciales, tokens ni secretos.

La cola y la política de conflictos constituyen la base técnica para una
sincronización posterior con un servicio remoto, pero esta semana no incorpora
una integración institucional real.

## Semana 6 — Notificaciones

La parte individual de Cesar Gaspar Pacheco implementa el cliente de
notificaciones en:

```text
src/lib/notifications/client.ts
```

La implementacion solicita permiso solo desde una accion del usuario, contempla
permiso concedido, permiso denegado, API no disponible, errores y fallback
funcional dentro de la aplicacion.

La decision y limites se documentan en:

```text
docs/capabilities.md
```

La prueba especifica de notificaciones se integra a la suite mediante:

```text
tests/capabilities.spec.ts
```

Esta rama no implementa `src/lib/device/camera.ts` ni
`src/lib/device/geolocation.ts` porque el PDF individual de Cesar asigna
unicamente `src/lib/notifications/client.ts`.

## Entrega

Antes de entregar:

```bash
npm ci
npm test
npm run build
```

Fijar el commit evaluado con:

```bash
git rev-parse HEAD
```

Entregar ese SHA junto con el enlace del repositorio o pull request y la sección correspondiente de `evidence/individual.md`.
