# Politica de sincronizacion offline y conflictos

## Alcance de esta semana

Esta decision documenta la parte individual de Cesar Gaspar Pacheco para la Semana 05: resolucion de conflictos cuando existen dos versiones de la misma inspeccion. La implementacion esta en `src/lib/sync/conflict-policy.ts` y se verifica con `tests/sync.spec.ts`.

En esta integracion ya se encuentran disponibles `src/lib/sync/queue.ts` y `src/lib/storage/schema.ts`, por lo que las operaciones offline, el almacenamiento local y los reintentos se integran con la politica de conflictos. No se modificaron entregables asignados a otros integrantes.

## Operacion offline

La cola de sincronizacion utiliza almacenamiento local mediante `localStorage` para conservar las operaciones pendientes cuando no hay conectividad.

Las operaciones sinteticas de inspeccion conservan metadatos minimos de trazabilidad: `inspectionId`, `version`, `updatedAt` y `operationId`. La politica de conflictos definida aqui depende de esos campos para poder decidir sin usar el orden de llegada de red.

## Sincronizacion

`SyncQueue` conserva las operaciones pendientes y permite procesarlas cuando existe conectividad.

Cada operacion enviada debe procesarse de forma idempotente. Si el servidor o una respuesta tardia devuelve una version de la misma inspeccion, la aplicacion debe pasar la version actual y la version entrante por `resolveInspectionConflict` antes de reemplazar datos locales.

La politica determina cual de las dos versiones debe conservarse de acuerdo con los metadatos de version, fecha de actualizacion y `operationId`.

## Reintentos

Los reintentos no deben crear una operacion nueva si representan el mismo cambio. Cada intento conserva el mismo `operationId` para que una respuesta duplicada pueda identificarse como `duplicate-operation`.

De esta forma, repetir el envio de una misma operacion no debe producir una segunda operacion con una identidad diferente.

## Duplicados

La politica considera duplicada una entrada de la misma inspeccion cuando tiene la misma `version`, el mismo `updatedAt` y el mismo `operationId`. En ese caso se conserva la version actual y se descarta la entrante con la razon `duplicate-operation`. Esto permite recibir varias veces una respuesta de sync sin mutar el estado.

La cola utiliza el identificador de operacion para conservar la identidad de cada cambio y evitar que un mismo cambio se trate como una operacion nueva.

## Conflictos

Un conflicto existe cuando dos candidatos tienen el mismo `inspectionId`. La politica es determinista y no depende del orden de llegada:

1. Gana la version numerica mas alta.
2. Si la version empata, gana el `updatedAt` mas reciente.
3. Si version y fecha empatan, gana el `operationId` lexicograficamente mayor.
4. Si tambien empata el `operationId`, se trata como operacion duplicada y se conserva la version actual.

Esta decision responde a la pregunta: si existen dos versiones de una inspeccion, se conserva la version con mayor evidencia de actualidad y se deja traza de la candidata descartada. Asi se evita que una respuesta antigua de sincronizacion sobrescriba una edicion local mas reciente.

Ejemplo sintetico:

- Actual local: `inspection-002`, version `3`, `updatedAt` `2026-10-02T18:25:00.000Z`, `operationId` `op-cesar-003`.
- Respuesta tardia: `inspection-002`, version `2`, `updatedAt` `2026-10-02T18:10:00.000Z`, `operationId` `op-cesar-002`.
- Resultado: gana la actual local por `higher-version`; la respuesta tardia se conserva como descartada para trazabilidad, pero no se aplica.

## Orden de respuesta

La politica no usa "llego primero" ni "llego al ultimo" como criterio de verdad. Una respuesta que llegue tarde solo se aplica si supera a la version actual por version, fecha o desempate estable. Esto cubre el caso critico de una respuesta vieja que aparece despues de que el usuario ya genero una version mas reciente.

## Limites

- La politica no persiste por si misma; solo decide entre dos candidatos.
- La politica no resuelve merges por campo. La version ganadora reemplaza a la descartada cuando el flujo de sync decida aplicar el resultado.
- La politica requiere metadatos confiables (`inspectionId`, `version`, `updatedAt`, `operationId`).
- Si `updatedAt` no puede parsearse como fecha, se usa comparacion textual para mantener determinismo, pero el equipo debe preferir fechas ISO 8601.
- La persistencia de las operaciones pendientes corresponde a `SyncQueue` y al almacenamiento local definido para la cola.

## Fallos encontrados

- La politica de conflictos se valida mediante las pruebas de `tests/sync.spec.ts`, que comprueban los casos de versiones antiguas, determinismo, duplicados e inmutabilidad de los objetos de entrada.
- La persistencia de la cola y el manejo de operaciones pendientes corresponden a `src/lib/sync/queue.ts` y se validan mediante las pruebas asociadas a la cola.
- El check publico de Semana 05 depende de que todos los entregables de la semana esten integrados correctamente.

## Trade-offs

Se eligio una politica simple de "ultima version verificable gana" en lugar de un merge campo por campo. Es mas facil de probar, explicar y ejecutar de forma idempotente en una PWA educativa. El costo es que, si dos personas editan campos distintos de la misma inspeccion sin reconciliacion de servidor, una version completa puede desplazar a la otra. Ese riesgo queda documentado para una fase posterior de merge semantico o revision manual.

## Prueba reproducible

La prueba `tests/sync.spec.ts` valida:

- que una respuesta vieja de sincronizacion no sobrescribe una version actual mas reciente;
- que la decision es determinista al repetir el mismo conflicto;
- que una operacion duplicada conserva la version actual;
- que los objetos de entrada no se mutan durante la resolucion.

Comando:

```bash
npm test