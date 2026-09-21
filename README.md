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