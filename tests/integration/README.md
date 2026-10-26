# Semana 08 - Integracion de Cesar

## Preparacion

Usar Node >=20.19.0 y npm >=10.0.0 desde la raiz del repositorio.
Instalar con `npm ci`. No se necesita servidor ni cuenta externa.

## Ejecucion

```sh
npm run test:integration
npm test
npm run verify
```

`test:integration` ejecuta `queue.spec.ts` e `inspections.spec.ts`.
`npm test` también ejecuta la integración después de la regresión.
`npm run verify` ejecuta tipos, regresión/unitarias/integración, E2E y build
una sola vez, además de producir los reportes. Una aserción fallida produce un
código distinto de cero.

Para generar una salida TAP que pueda conservarse como artefacto:

```sh
node --import tsx --test --test-reporter=tap --test-reporter-destination=tests/integration/results.tap tests/integration/queue.spec.ts
```

## Escenarios y aislamiento

Se integra `SyncQueue` real con serializacion JSON y almacenamiento simulado.
Cada caso recibe una inspeccion sintetica nueva y un almacen vacio. `finally`
restaura el global `window` y limpia los datos incluso ante una asercion fallida.
`inspections.spec.ts` además integra los servicios reales de validación,
creación, persistencia local y conectividad; incluye fallos de almacenamiento,
reconstrucción, reintentos agotados y llamadas concurrentes. Un caso confirma
que la ausencia de handler remoto mantiene la operación pendiente sin consumir
reintentos.

| Riesgo | Accion | Aserciones |
| --- | --- | --- |
| Perder una captura offline | Encolar y reconstruir la cola desde cadenas persistidas | Payload completo, identidad, estado pending y un solo registro |
| Perder una operacion tras rechazo | Handler devuelve false y se reconstruye la cola | failed, contador 1, error y operacion reintentable |
| Perder una operacion tras fallo de transporte | Handler lanza una excepcion | Error conservado y payload e identidad intactos |
| No confirmar un envio exitoso | Handler devuelve true y se reconstruye la cola | processed, sin error y sin pendientes |
| Duplicar por ID al reintentar | Fallo, reconstruccion, mismo ID y otra clave, exito | Identidad original, dos intentos y un solo registro remoto |
| Duplicar por clave al reintentar | Fallo, reconstruccion, misma clave y otro ID, exito | Misma operacion y ninguna nueva llamada tras confirmacion |

El servidor de prueba no deduplica: cada respuesta exitosa agregaria un registro.
Esto permite detectar envios repetidos de una operacion ya confirmada.

## Limites y coordinacion

La recarga es una reconstruccion de instancias con almacenamiento simulado.
No demuestra una recarga real de pagina ni captura desde la interfaz. La cola
no consulta onLine: la prueba controla explicitamente el procesamiento.
El handler remoto usa el contrato booleano existente, sin HTTP real.
No se prueba idempotencia de un backend ante perdida de acuse ni concurrencia.

Los E2E de navegador están en `tests/e2e/inspections.spec.ts`; no se sustituyen
por estas pruebas de integración. La estrategia general y los resultados de CI
se documentan por separado; la ejecución local no certifica que GitHub Actions
haya pasado.
