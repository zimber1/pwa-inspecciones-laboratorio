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
