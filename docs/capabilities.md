# Capacidades del dispositivo y notificaciones

## 1. Alcance de la Semana 6

Esta documentación reúne las capacidades opcionales del dispositivo y las notificaciones locales de la PWA Inspecciones de Laboratorio.

Las funcionalidades cubiertas son:

- Notificaciones locales del navegador.
- Captura opcional de evidencia mediante cámara.
- Geolocalización opcional.
- Manejo de permisos, errores y mecanismos de fallback.

Las capacidades del dispositivo no deben impedir que el usuario continúe con el flujo de inspección cuando no están disponibles o sus permisos son denegados.

## 2. Notificaciones locales

**Responsable de la implementación original:** César Gaspar Pacheco.

Archivo principal: `src/lib/notifications/client.ts`.

### 2.1. Política de permisos

La función `requestNotificationPermission` solo solicita permisos cuando recibe `userInitiated: true`. Esta restricción representa el requisito de pedir permiso desde una acción clara del usuario, por ejemplo, un botón dentro de la PWA.

Si la llamada no proviene de una acción del usuario, la función no invoca `Notification.requestPermission()` y devuelve un fallback con la razón `requires-user-action`.

### 2.2. Comportamiento cubierto

- Permiso concedido: se permite mostrar la notificación con la API nativa.
- Permiso denegado: se conserva el flujo mediante un mensaje interno de fallback.
- Permiso en `default`: no se fuerza la notificación; se informa fallback.
- API no disponible: la aplicación sigue funcionando con aviso interno.
- Error al solicitar permiso o crear notificación: se captura el error y se devuelve un resultado controlado.

### 2.3. Fallback funcional

Cuando las notificaciones no pueden usarse, la función devuelve un mensaje para mostrar dentro de la aplicación:

```text
Notificación no disponible. El cambio quedó visible dentro de la aplicación.
```

Esto evita que el registro de una inspección dependa de permisos del navegador. La notificación es una mejora progresiva, no un requisito para completar el flujo.

### 2.4. Privacidad y datos sintéticos

Las pruebas usan identificadores sintéticos como `INS-SYN-006`. No se incluyen credenciales, llaves privadas, ubicaciones reales, nombres reales de estudiantes ni datos personales. El cuerpo de la notificación debe mantenerse breve y no debe exponer información sensible.

### 2.5. Límites

La implementación cubre notificaciones locales del navegador y fallback. No registra push remoto ni utiliza un servidor de notificaciones.

## 3. Cámara y evidencia opcional

**Responsable de la implementación original:** Félix.

Archivo: `src/lib/device/camera.ts`.

### 3.1. Disponibilidad

La función `isCameraSupported()` comprueba que exista `window`, que exista `navigator` y que `navigator.mediaDevices.getUserMedia` esté disponible.

Esta comprobación permite que la capacidad sea opcional en entornos donde no existe una API de cámara, incluidos ciertos entornos de ejecución sin navegador.

### 3.2. Permisos mínimos

La función `captureCameraEvidence()` solicita vídeo sin audio mediante restricciones de `getUserMedia`. El modo de cámara predeterminado es `environment`, orientado a la cámara trasera cuando el dispositivo lo admite.

### 3.3. Captura y liberación de recursos

La implementación utiliza un elemento de vídeo y un canvas para intentar obtener una imagen en formato JPEG. Después de completar la captura, detiene los tracks del `MediaStream` para liberar la cámara.

La liberación de recursos debe verificarse también en los casos de error o interrupción de la captura.

### 3.4. Manejo de errores y fallback

La implementación contempla las siguientes categorías:

- `PERMISSION_DENIED`: permiso denegado.
- `NOT_FOUND`: no se encontró una cámara.
- `NOT_READABLE`: no se pudo acceder a la cámara.
- `NOT_SUPPORTED`: API no disponible.
- `UNKNOWN_ERROR`: otro error no clasificado.

Cuando la cámara no está disponible o la captura falla, `captureCameraEvidence()` devuelve un resultado controlado con `isFallback: true` y una imagen de respaldo.

## 4. Geolocalización

**Responsable de la implementación original:** Félix.

Archivo: `src/lib/device/geolocation.ts`.

### 4.1. Disponibilidad

La función `isGeolocationSupported()` comprueba la existencia de `window`, `navigator` y la API `navigator.geolocation.getCurrentPosition`.

La comprobación permite evitar invocaciones cuando la capacidad no está disponible en el entorno actual.

### 4.2. Permisos mínimos

La función `getCurrentLocation()` obtiene la ubicación bajo demanda. De forma predeterminada, utiliza `enableHighAccuracy: false`, un tiempo de espera de 10 000 milisegundos y una antigüedad máxima de posición de 60 000 milisegundos.

Estos valores pueden modificarse mediante `GeolocationOptions`.

### 4.3. Manejo de errores y fallback

La implementación contempla:

- `PERMISSION_DENIED`: el usuario denegó el permiso.
- `POSITION_UNAVAILABLE`: la información de ubicación no está disponible.
- `TIMEOUT`: se agotó el tiempo de espera.
- `NOT_SUPPORTED`: la API no está disponible.
- `UNKNOWN_ERROR`: error no clasificado.

Cuando no se puede obtener una ubicación del dispositivo, la función devuelve coordenadas de respaldo y marca el resultado con `isFallback: true`.

Las coordenadas sintéticas predeterminadas están declaradas en `DEFAULT_FALLBACK_COORDINATES`, con valores de referencia de Tehuacán, Puebla. No representan necesariamente la ubicación actual del usuario.

## 5. Matriz de recuperación y fallback

| Capacidad | Condición | Comportamiento esperado |
|---|---|---|
| Notificaciones | API no disponible | Mantener el flujo mediante aviso interno |
| Notificaciones | Sin acción explícita del usuario | No solicitar permiso |
| Notificaciones | Permiso denegado | Informar fallback sin bloquear la inspección |
| Notificaciones | Error al solicitar permiso o crear notificación | Devolver un resultado controlado |
| Cámara | API no disponible | Devolver imagen de respaldo |
| Cámara | Permiso denegado | Devolver resultado de fallback |
| Cámara | Error al acceder a la cámara | Clasificar el error y devolver fallback |
| Geolocalización | API no disponible | Devolver coordenadas de respaldo |
| Geolocalización | Permiso denegado | Devolver coordenadas de respaldo |
| Geolocalización | Posición no disponible o tiempo agotado | Devolver fallback controlado |

## 6. Pruebas

### 6.1. Notificaciones

Archivo: `tests/capabilities.spec.ts`.

Las pruebas cubren:

- API no disponible.
- Solicitud bloqueada si no hay acción del usuario.
- Permiso concedido.
- Permiso denegado.
- Error al pedir permiso.
- Error al crear la notificación.
- Fallback funcional.

### 6.2. Cámara y geolocalización

Archivo: `tests/device-capabilities.spec.ts`.

Las pruebas cubren:

- Cámara no disponible.
- Permiso de cámara denegado.
- Captura simulada y liberación de tracks.
- Geolocalización no disponible.
- Permiso de geolocalización denegado.
- Obtención simulada de coordenadas con precisión mínima predeterminada.

Las pruebas utilizan APIs simuladas; no requieren capturar imágenes reales ni obtener la ubicación real del dispositivo.

### 6.3. Ejecución

Para ejecutar todas las pruebas del proyecto:

```bash
npm test
```

El script de pruebas incluye tanto `tests/capabilities.spec.ts` como `tests/device-capabilities.spec.ts`.

## 7. Privacidad y límites

Las capacidades del dispositivo son opcionales. La aplicación debe poder mantener su flujo cuando el navegador no las admite o el usuario deniega sus permisos.

Las pruebas deben usar datos sintéticos y evitar credenciales, llaves privadas, información personal real o ubicaciones reales de usuarios.

La cámara y la geolocalización requieren validación adicional de su comportamiento ante interrupciones y errores para garantizar la liberación de recursos y la continuidad del flujo.

Las notificaciones implementadas son locales; esta documentación no afirma que exista un sistema de push remoto.