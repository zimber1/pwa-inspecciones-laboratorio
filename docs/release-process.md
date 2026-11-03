# Proceso de Release y Construcción en Producción

## 1. Propósito y Alcance

Este documento define el procedimiento reproducible para construir, etiquetar, ejecutar y verificar en producción la **PWA de inspecciones y mantenimiento de laboratorios** mediante contenedores Docker.

El proceso garantiza:

- **Construcción determinista y reproducible** a partir de `package-lock.json` (`npm ci`) y Node.js `20.19.6-alpine`.
- **Imagen optimizada de producción** mediante empaquetado `output: "standalone"` de Next.js y arquitectura Docker multi-stage.
- **Ejecución endurecida sin privilegios** bajo el usuario del sistema `nextjs` (`UID 1001`, `GID 1001`).
- **Trazabilidad de versión y revisión** inyectando `APP_VERSION` y `COMMIT_SHA` tanto en metadatos OCI de la imagen como en tiempo de compilación y ejecución.
- **Verificación continua de salud** a través del endpoint `GET /api/health` y la directiva `HEALTHCHECK` del contenedor.

---

## 2. Arquitectura de Empaquetado Multi-Stage

La definición en `Dockerfile` divide el ciclo de construcción en tres etapas aisladas para reducir la superficie de ataque y el tamaño final de la imagen:

| Etapa | Imagen base | Propósito | Artefactos transferidos |
|---|---|---|---|
| `deps` | `node:20.19.6-alpine` | Instalar dependencias exactas del lockfile con `npm ci --ignore-scripts --no-audit --no-fund`. | `node_modules/` hacia `builder` |
| `builder` | `node:20.19.6-alpine` | Recibir `APP_VERSION` y `COMMIT_SHA`, validar tipos TypeScript y compilar el paquete standalone (`npm run build`). | `.next/standalone/`, `.next/static/` y `public/` hacia `runner` |
| `runner` | `node:20.19.6-alpine` | Entorno mínimo de producción con `NODE_ENV=production`, usuario `nextjs:nodejs` (`1001:1001`) y `HEALTHCHECK` activo. | Imagen final ejecutable (`node server.js`) |

### Ajustes de producción en `next.config.mjs` y `.dockerignore`

1. **`output: "standalone"`**: Next.js rastrea únicamente los módulos requeridos en tiempo de ejecución y genera `.next/standalone/server.js`, evitando copiar el árbol completo de `node_modules` de desarrollo a la etapa `runner`.
2. **`poweredByHeader: false` y `compress: true`**: Se suprime la cabecera `X-Powered-By` y se mantiene la compresión HTTP junto con las cabeceras de seguridad (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`).
3. **Variables públicas de versión**: `next.config.mjs` expone `NEXT_PUBLIC_APP_VERSION` y `NEXT_PUBLIC_COMMIT_SHA` tomando como fuente `APP_VERSION`, `COMMIT_SHA` y la versión declarada en `package.json`.
4. **Higiene del contexto (`.dockerignore`)**: Se excluyen `.git`, `.github`, `node_modules`, `.next`, `coverage`, `test-results`, `playwright-report`, `reports` y archivos `.env*`, reduciendo el contexto transferido al demonio de Docker a pocos kilobytes y previniendo filtraciones de configuración local.

---

## 3. Identificación de Versión y SHA del Commit

Cada artefacto de release se identifica de forma unívoca mediante dos argumentos de construcción (`--build-arg`):

- **`APP_VERSION`**: Versión semántica del release (por defecto `0.1.0`, alineada con `package.json`).
- **`COMMIT_SHA`**: Hash corto o completo del commit de Git a partir del cual se construye la imagen (`git rev-parse --short HEAD`).

Estos valores quedan registrados en tres niveles:

1. **Etiquetas OCI de la imagen (`LABEL`)**:
   - `org.opencontainers.image.title="pwa-inspecciones-laboratorio"`
   - `org.opencontainers.image.version="${APP_VERSION}"`
   - `org.opencontainers.image.revision="${COMMIT_SHA}"`
2. **Variables de entorno del contenedor (`ENV`)**:
   - `APP_VERSION`, `COMMIT_SHA`, `NEXT_PUBLIC_APP_VERSION` y `NEXT_PUBLIC_COMMIT_SHA`.
3. **Respuesta HTTP y cabeceras de `/api/health`**:
   - Cuerpo JSON con `version`, `commitSha`, `sha` y `commit`.
   - Cabeceras HTTP `X-App-Version` y `X-Commit-Sha`.

---

## 4. Endpoint de Salud (`GET /api/health`)

El archivo `src/app/api/health/route.ts` implementa los manejadores `GET` y `HEAD` con ejecución dinámica forzada (`export const dynamic = "force-dynamic"`) y cabecera `Cache-Control: no-store, no-cache, must-revalidate` para impedir respuestas obsoletas en intermediarios o en caché.

### Estructura de respuesta (`HTTP 200 OK`)

```json
{
  "status": "ok",
  "healthy": true,
  "service": "pwa-inspecciones-laboratorio",
  "version": "0.1.0",
  "commitSha": "5ec7980",
  "sha": "5ec7980",
  "commit": "5ec7980",
  "environment": "production",
  "timestamp": "2026-11-03T23:20:06.965Z",
  "uptime": 11
}
```

---

## 5. Procedimiento Paso a Paso de Construcción, Ejecución y Verificación

### 5.1. Obtener versión y SHA del commit actual

En **Bash**:

```bash
APP_VERSION=$(node -p "require('./package.json').version")
COMMIT_SHA=$(git rev-parse --short HEAD)
echo "Versión: ${APP_VERSION} | Commit SHA: ${COMMIT_SHA}"
```

En **PowerShell**:

```powershell
$APP_VERSION = node -p "require('./package.json').version"
$COMMIT_SHA = git rev-parse --short HEAD
Write-Output "Versión: $APP_VERSION | Commit SHA: $COMMIT_SHA"
```

### 5.2. Construcción y etiquetado reproducible de la imagen

Se etiqueta simultáneamente con la versión semántica (`0.1.0`) y con la etiqueta inmutable del commit (`<COMMIT_SHA>`):

En **Bash**:

```bash
docker build \
  --build-arg APP_VERSION="${APP_VERSION}" \
  --build-arg COMMIT_SHA="${COMMIT_SHA}" \
  -t "pwa-inspecciones:${APP_VERSION}" \
  -t "pwa-inspecciones:${COMMIT_SHA}" \
  .
```

En **PowerShell**:

```powershell
docker build `
  --build-arg APP_VERSION="$APP_VERSION" `
  --build-arg COMMIT_SHA="$COMMIT_SHA" `
  -t "pwa-inspecciones:$APP_VERSION" `
  -t "pwa-inspecciones:$COMMIT_SHA" `
  .
```

### 5.3. Arranque del contenedor de producción

```bash
docker run -d \
  --name pwa-release-check \
  -p 3000:3000 \
  "pwa-inspecciones:${APP_VERSION}"
```

### 5.4. Comprobación de usuario no root, endpoint `/api/health` y versión/SHA

1. **Verificar que el contenedor se ejecuta con el usuario no root (`nextjs`, UID `1001`)**:

   ```bash
   docker exec pwa-release-check id
   ```

   Salida esperada:

   ```text
   uid=1001(nextjs) gid=1001(nodejs) groups=1001(nodejs)
   ```

2. **Consultar el endpoint `/api/health` y comprobar versión y SHA**:

   En **Bash**:

   ```bash
   curl -i http://127.0.0.1:3000/api/health
   ```

   En **PowerShell**:

   ```powershell
   Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/api/health | Select-Object StatusCode, Headers, Content
   ```

3. **Verificar el estado `healthy` del `HEALTHCHECK` y etiquetas OCI del contenedor**:

   ```bash
   docker inspect --format "User={{.Config.User}} Health={{.State.Health.Status}} Labels={{json .Config.Labels}}" pwa-release-check
   ```

   Salida verificada:

   ```text
   User=nextjs Health=healthy Labels={"org.opencontainers.image.description":"PWA de inspecciones y mantenimiento de laboratorios","org.opencontainers.image.revision":"5ec7980","org.opencontainers.image.title":"pwa-inspecciones-laboratorio","org.opencontainers.image.version":"0.1.0"}
   ```

4. **Detener y retirar el contenedor de validación**:

   ```bash
   docker rm -f pwa-release-check
   ```

---

## 6. Decisiones Técnicas, Trade-offs y Límites

- **Salida `standalone` sobre `node:20.19.6-alpine`**: Reduce drásticamente las dependencias presentes en el contenedor final frente a una imagen con `node_modules` completo, manteniendo compatibilidad total con las rutas SSR (`/inspecciones/[id]`) y dinámicas (`/api/health`) de Next.js 16.
- **`HEALTHCHECK` nativo mediante Node.js (`fetch`)**: En lugar de instalar paquetes adicionales del sistema operativo (`curl` o `wget`) en la etapa `runner`, el `HEALTHCHECK` invoca el cliente `fetch` integrado en Node.js 20. Esto evita paquetes innecesarios en Alpine y valida tanto el código HTTP `200` como el contrato JSON `status === "ok"`.
- **Etiquetado dual (`<APP_VERSION>` + `<COMMIT_SHA>`)**: La etiqueta de versión facilita el despliegue legible, mientras que la etiqueta con el SHA del commit permite identificar exactamente el árbol fuente ejecutado y regresar de inmediato a una imagen previa conocida en caso de incidente (en coordinación con `docs/runbook.md`).
- **Límites del alcance**: La imagen empaqueta la aplicación con datos sintéticos y almacenamiento local en el navegador (`localStorage` + Service Worker); no requiere conexión a bases de datos externas ni credenciales de servicios privados.
