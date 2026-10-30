# Inventario de privacidad - Semana 09

Responsable: Cesar. Revision: 30 de octubre de 2026.
Base inspeccionada: develop, b5e6faa6c3aa7134321c2b258c28085738ca0169.
Alcance: codigo y configuracion del repositorio; no certifica un despliegue ni cumplimiento legal.

## Inventario real

| Categoria y estado | Finalidad y origen | Ubicacion | Acceso | Retencion y eliminacion |
| --- | --- | --- | --- | --- |
| Catalogos sinteticos: id, laboratorio, fecha, responsable, estado, etiqueta, hallazgos y resumen | Demostracion; arreglos incluidos en el codigo | src/lib/data/inspections.ts y src/app/inspecciones/[id]/page.tsx; bundles/HTML | Visitantes de las rutas y lectores del repositorio | Hasta modificar el codigo; pueden quedar copias en caches e historial Git |
| Inspecciones capturadas: mismos campos, version, isOfflineCreated, createdAt y updatedAt | Registrar mantenimiento; formulario del usuario y UUID/fechas generados por createLocalInspection | localStorage, clave pwa-inspecciones-local-inspections; estado React | Perfil del navegador y scripts del mismo origen; sin segregacion por usuario | Sin TTL ni borrado individual implementado en storage/inspections.ts; borrar datos del sitio y ambas claves locales |
| Operaciones: id, idempotencyKey, action, payload completo, status, retryCount, maxRetries, createdAt, lastAttemptAt y errorMessage | Conservar cambios y controlar reintentos; SyncQueue | localStorage, clave pwa-inspecciones-sync-queue, y Map en memoria | Mismo origen/perfil; handler proporcionado al procesar | Sin TTL; processed tambien se conserva. clear() vacia solo la cola, no el almacen de inspecciones |
| HTML, JS, CSS, iconos y manifest | Uso offline; solicitudes GET y precache | Cache Storage: pwa-static-v1 y pwa-dynamic-v1, public/sw.js | Service Worker y scripts del origen; usuario con acceso al navegador | Sin TTL ni limite de entradas. activate elimina caches con otros nombres, no vacia las dos actuales; borrar Cache Storage manualmente |
| Errores, estados de carga, conectividad y mensajes | Diagnostico y respuesta al usuario; excepciones, navigator.onLine y eventos online/offline | Memoria/interfaz; errorMessage de cola persistido; console.warn en registro de SW | Usuario, consola y scripts del origen | Memoria hasta desmontar/recargar; error de cola hasta exito o borrado; conservacion de consola depende de navegador |
| Imagen opcional: dataUrl, origen y errores (capacidad disponible, sin consumidor en interfaz actual) | captureCameraEvidence puede capturar video sin audio o devolver imagen sintetica de fallback | Variables de la funcion y resultado; no se almacena por el modulo | Llamador; navegador con permiso de camara | Tracks detenidos en finally; resultado hasta que el llamador lo libere. No hay plazo de almacenamiento porque no hay persistencia integrada |
| Coordenadas: latitud, longitud, precision y errores (capacidad disponible, sin consumidor en interfaz actual) | getCurrentLocation puede consultar dispositivo con permiso; fallback fijo de prueba | Resultado en memoria; no se adjunta al modelo LocalInspection | Llamador y servicio de ubicacion del navegador, cuyo funcionamiento externo no se audito | Sin persistencia propia; maximumAge es cache de posicion del navegador, no politica de borrado de registros |
| Permiso y contenido de notificacion (modulo sin consumidor en interfaz actual) | Avisar cambios mediante Notification; titulo, cuerpo, icono y tag | Resultado en memoria; permiso administrado por navegador; aviso por SO si se invoca con permiso | Llamador, usuario y potenciales observadores de pantalla | Sin archivo historico propio; historial/permiso dependen del navegador y SO |
| Fixtures, reportes y evidencia academica | Verificacion y autoria; pruebas sinteticas y documentos del equipo | tests/, evidence/, reports/, test-results/, coverage/ y artefactos configurados en .github/workflows | Colaboradores y usuarios con acceso al repo/Actions; si se hace publico, publico | Historial Git y retencion de artefactos segun configuracion; no se verifico un plazo remoto. La evidencia contiene nombres/matriculas reales de integrantes, distintos de los datos sinteticos de prueba |
| Cuentas, contrasenas, sesiones, cookies de autenticacion, audio, analitica y suscripciones push | No se observa recopilacion implementada en src ni API correspondiente | Sin almacen de aplicacion identificado | No aplica al codigo revisado | No aplica; no afirma ausencia de logs/cookies de un futuro proveedor de hosting |

## Datos personales potenciales y minimizacion

Los catalogos y fixtures se usan como datos sinteticos. El formulario acepta texto libre
en responsable, ubicacion y resumen: no existe un control que garantice que el usuario
introduzca datos ficticios. Ademas, responsable usa autoComplete="name". Por tanto,
capturas reales podrian identificar personas, revelar ubicaciones o describir incidentes.
No usar nombres, contactos ni informacion sensible en demostraciones; utilizar alias
sinteticos y descripciones minimas. Los limites de longitud validan estructura, no anonimizan.

Fotos y coordenadas podrian revelar rostros, documentos y ubicacion personal si se conecta
su captura. Actualmente no hay invocaciones de esos modulos desde la UI revisada.
Mantener capacidades opcionales y solicitar permisos solo tras accion del usuario.
El parametro userInitiated de notificaciones expresa un contrato del llamador; no prueba
por si mismo un gesto real. No exponer resumen sensible en pantalla bloqueada.

## Acceso, transporte y transferencias

Rutas de pagina verificadas: `/`, `/inspecciones` y `/inspecciones/[id]`.
Los detalles usan datos sinteticos propios; no se debe asumir que consultan el almacen local.
Tambien son publicos los recursos de public/, como manifest, sw.js e iconos.
No hay autenticacion ni autorizacion de usuario implementada en estas rutas.
localStorage no tiene cifrado propio ni aislamiento por cuenta: un XSS o un perfil
compartido puede exponer tanto inspecciones como copias en la cola.

La UI pasa handler undefined a subscribeToConnectivity: no hay envio remoto de
inspecciones configurado. SyncQueue recibe un handler; las pruebas simulan respuestas.
No se identifica API de negocio, base remota ni servicio push activo. El SW si hace
fetch de recursos web: no confundir esas solicitudes con sincronizacion de negocio.
HTTPS y logs de hosting deben comprobarse en el despliegue; no se verifico ninguno aqui.
Antes de incorporar un backend, definir destinatario, campos minimos, permisos,
retencion, borrado y transporte; no se presenta esa transferencia futura como activa.

## Eliminacion y riesgos pendientes para el equipo

Para eliminar capturas locales, cerrar pestanas de la PWA y borrar ambas claves de
localStorage del origen; borrar tambien Cache Storage y desregistrar SW si se busca
retirar copias offline. Recargar puede recrear recursos sinteticos del precache.
No basta con clear() de la cola: loadUserInspections puede reencolar las inspecciones
que siguen en el otro almacen. No hay boton de borrado integral ni expiracion automatica.
Esto no elimina copias del repo, reportes compartidos o historial del SO.

El SW guarda navegaciones/HTML sin comprobar estado o sensibilidad en esa rama;
si posteriormente hay paginas privadas, podria conservarlas. La cache dinamica
no tiene TTL. Documentar el riesgo y coordinar su correccion con el responsable.
Los errores propagados por handlers pueden contener texto sensible y persistirse.
La evidencia academica merece acceso restringido; no copiar identidades a fixtures.
Estos hallazgos no se corrigen en esta tarea documental.

## Politica de rastreo

public/robots.txt contiene `User-agent: *` y `Disallow: /`: solicita no rastrear
todo este prototipo educativo, incluyendo las tres rutas reales, sin enumerar rutas
inexistentes ni divulgar supuestas rutas privadas. No se declara Sitemap sin uno real.
robots.txt comunica preferencias: no impide abrir URLs, no garantiza desindexacion
y no reemplaza autenticacion, autorizacion ni controles HTTP de acceso.

## Trazabilidad y limites

Fuentes: src/lib/data/create-inspection.ts, src/lib/storage/{inspections,schema}.ts,
src/lib/sync/{queue,connectivity}.ts, src/app/inspecciones/page.tsx,
src/lib/device/{camera,geolocation}.ts, src/lib/notifications/client.ts,
src/lib/pwa/register-service-worker.ts, public/sw.js y next.config.mjs.
Se contrastaron tests/integration y tests/e2e/inspections.spec.ts: existen simulaciones
y un caso de persistencia tras recarga, sin demostrar una transferencia de produccion.
No se auditaron infraestructura externa ni datos de navegadores de otras personas.
package.json contiene claves de scripts duplicadas en la base: se informa al equipo,
sin modificar archivos fuera de la responsabilidad de Cesar.
