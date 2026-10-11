# Documentación de Capacidades del Dispositivo (Semana 6)

**Responsable:** Felix  
**Proyecto:** PWA Inspecciones de Laboratorio  
**Fecha:** Octubre 2026  

---

## 1. Cámara y Evidencia Opcional (`src/lib/device/camera.ts`)

### Decisiones Técnicas y Permisos Mínimos
- **Permisos mínimos:** Se solicita acceso a `navigator.mediaDevices.getUserMedia` indicando restricciones estrictas de únicamente video (`video: { facingMode: 'environment' }` o `video: true`), descartando completamente la captura de audio o requerimientos de hardware innecesarios.
- **Liberación inmediata de recursos:** Inmediatamente después de capturar el fotograma deseado, se invocan los métodos `.stop()` en todos los `MediaStreamTrack` para liberar la cámara del dispositivo y evitar el consumo inútil de batería/recursos.
- **Manejo de Errores:** Se capturan y categorizan adecuadamente los errores nativos de la API (`NotAllowedError`, `NotFoundError`, `NotReadableError`).
- **Mecanismo de Fallback:** Si la API de cámara no está soportada en el navegador/entorno o si el usuario deniega el permiso, la función `captureCameraEvidence` retorna una respuesta con `isFallback: true` y una imagen sintética/selector de archivos de reemplazo para no interrumpir el flujo del usuario al registrar una inspección.

---

## 2. Geolocalización (`src/lib/device/geolocation.ts`)

### Decisiones Técnicas y Permisos Mínimos
- **Permisos mínimos:** Se utiliza `navigator.geolocation.getCurrentPosition` bajo demanda explícita, configurado con `enableHighAccuracy: false` por defecto para reducir el tiempo de respuesta y consumo energético.
- **Capacidad Opcional:** Se verifica preliminarmente la existencia de `'geolocation' in navigator` antes de cualquier llamada para garantizar compatibilidad SSR y soporte en dispositivos/navegadores limitados.
- **Manejo de Errores:** Mapeo de errores estandarizados (`PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, `TIMEOUT`).
- **Mecanismo de Fallback:** Ante la denegación de permisos o falla de señal de GPS, el sistema retorna coordenadas sintéticas predeterminadas (Ubicación de referencia en Tehuacán) marcadas con `isFallback: true`, asegurando que la inspección pueda guardarse correctamente sin geolocalización nativa.

---

## 3. Matriz de Recuperación y Fallback

| Capacidad | Condición de Fallo | Comportamiento / Fallback |
|---|---|---|
| Cámara | Permiso denegado (`NotAllowedError`) | Retorna `isFallback: true` con imagen base64 de respaldo / opción de archivo |
| Cámara | API no soportada / Entorno headless | Invocación a `activateCameraFallback` sin lanzar excepciones no capturadas |
| Geolocalización | Permiso denegado (`PERMISSION_DENIED`) | Retorna coordenadas sintéticas por defecto (Tehuacán) con `isFallback: true` |
| Geolocalización | Tiempo de espera agotado (`TIMEOUT`) | Fallback a ubicación predeterminada |
# Capacidades del dispositivo y notificaciones

## Alcance individual de Cesar

La asignacion individual de Cesar Gaspar Pacheco para Semana 06 se concentra en
`src/lib/notifications/client.ts`. Camara y geolocalizacion forman parte del
alcance del equipo, pero no fueron implementadas en esta rama para evitar
invadir archivos asignados a otros integrantes.

## Politica de permisos

La funcion `requestNotificationPermission` solo solicita permisos cuando recibe
`userInitiated: true`. Esta restriccion representa el requisito de pedir permiso
desde una accion clara del usuario, por ejemplo un boton dentro de la PWA.

Si la llamada no proviene de una accion del usuario, la funcion no invoca
`Notification.requestPermission()` y devuelve un fallback con la razon
`requires-user-action`.

## Comportamiento cubierto

- Permiso concedido: se permite mostrar la notificacion con la API nativa.
- Permiso denegado: se conserva el flujo mediante un mensaje interno de fallback.
- Permiso en `default`: no se fuerza la notificacion; se informa fallback.
- API no disponible: la aplicacion sigue funcionando con aviso interno.
- Error al solicitar permiso o crear notificacion: se captura el error y se
  devuelve un resultado controlado.

## Fallback funcional

Cuando las notificaciones no pueden usarse, la funcion devuelve un mensaje para
mostrar dentro de la aplicacion:

```text
Notificacion no disponible. El cambio quedo visible dentro de la aplicacion.
```

Esto evita que el registro de una inspeccion dependa de permisos del navegador.
La notificacion es una mejora progresiva, no un requisito para completar el
flujo.

## Privacidad y datos sinteticos

Las pruebas usan identificadores sinteticos como `INS-SYN-006`. No se incluyen
credenciales, llaves privadas, ubicaciones reales, nombres reales de estudiantes
ni datos personales. El cuerpo de la notificacion debe mantenerse breve y no
debe exponer informacion sensible.

## Prueba

`tests/capabilities.spec.ts` verifica el contrato de notificaciones:

- API no disponible;
- solicitud bloqueada si no hay accion de usuario;
- permiso concedido;
- permiso denegado;
- error al pedir permiso;
- error al crear la notificacion;
- fallback funcional.

Comando:

```bash
npm test
```

## Limites

La implementacion no registra push remoto ni utiliza un servidor de
notificaciones. Solo cubre notificaciones locales del navegador y fallback. La
integracion con camara y geolocalizacion queda pendiente de la rama de los
integrantes responsables de esos archivos.
