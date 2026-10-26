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

`test:integration` ejecuta los seis casos de `queue.spec.ts`. `npm test`
tambien los ejecuta, y `npm run verify` ejecuta esa suite y el build;
es el equivalente exacto de `make verify` en el Makefile actual.
Una asercion fallida produce un codigo distinto de cero en todos esos comandos.

Para generar una salida TAP que pueda conservarse como artefacto:

```sh
node --import tsx --test --test-reporter=tap --test-reporter-destination=tests/integration/results.tap tests/integration/queue.spec.ts
```

## Escenarios y aislamiento

Se integra `SyncQueue` real con serializacion JSON y almacenamiento simulado.
Cada caso recibe una inspeccion sintetica nueva y un almacen vacio. `finally`
restaura el global `window` y limpia los datos incluso ante una asercion fallida.

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

Los E2E en navegador, unitarias adicionales, estrategia global, demostracion
del defecto controlado y workflow de Semana 08 son entregables coordinados
del equipo. Este aporte permite que el CI que invoque `npm test` ejecute
tambien la capa de integracion; no certifica las otras capas.
