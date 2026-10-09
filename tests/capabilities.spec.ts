import assert from "node:assert/strict";
import { isCameraSupported, captureCameraEvidence } from "../src/lib/device/camera";
import { isGeolocationSupported, getCurrentLocation, DEFAULT_FALLBACK_COORDINATES } from "../src/lib/device/geolocation";

async function main() {
  console.log("Ejecutando pruebas unitarias para Capacidades del Dispositivo (Felix)...");

  // Mock global window and navigator for test environment
  const originalGlobalWindow = (globalThis as any).window;
  const originalGlobalNavigator = (globalThis as any).navigator;

  try {
    // ============================================================
    // SECCIÓN 1: PRUEBAS DE CÁMARA
    // ============================================================

    // Test 1.1: Ausencia de capacidad (SSR / Sin navegador)
    delete (globalThis as any).window;
    delete (globalThis as any).navigator;
    assert.equal(isCameraSupported(), false, "isCameraSupported debe ser false cuando no existe navigator");

    const fallbackNoNav = await captureCameraEvidence({ fallbackImageData: 'data:image/png;base64,mock' });
    assert.equal(fallbackNoNav.success, false, "Debe indicar success=false en ausencia de cámara");
    assert.equal(fallbackNoNav.isFallback, true, "Debe activar isFallback=true");
    assert.equal(fallbackNoNav.errorCode, 'NOT_SUPPORTED', "El código de error debe ser NOT_SUPPORTED");
    assert.equal(fallbackNoNav.dataUrl, 'data:image/png;base64,mock', "Debe devolver los datos de fallback");

    // Test 1.2: Permiso denegado en la cámara
    (globalThis as any).window = {};
    (globalThis as any).navigator = {
      mediaDevices: {
        getUserMedia: async () => {
          const err: any = new Error("Permission denied");
          err.name = "NotAllowedError";
          throw err;
        }
      }
    };

    assert.equal(isCameraSupported(), true, "isCameraSupported debe ser true cuando getUserMedia está disponible");

    const deniedResult = await captureCameraEvidence();
    assert.equal(deniedResult.success, false, "Debe indicar success=false cuando se deniega el permiso");
    assert.equal(deniedResult.isFallback, true, "Debe activar el fallback ante permiso denegado");
    assert.equal(deniedResult.errorCode, 'PERMISSION_DENIED', "El código de error debe ser PERMISSION_DENIED");
    assert.equal(typeof deniedResult.dataUrl, 'string', "Debe retornar una imagen de fallback");

    // Test 1.3: Captura exitosa de cámara
    let tracksStopped = false;
    (globalThis as any).navigator = {
      mediaDevices: {
        getUserMedia: async (constraints: MediaStreamConstraints) => {
          assert.equal(constraints.audio, false, "Permisos mínimos: NO debe solicitar audio");
          return {
            getTracks: () => [
              {
                stop: () => {
                  tracksStopped = true;
                }
              }
            ]
          } as any;
        }
      }
    };

    const successResult = await captureCameraEvidence({ fallbackImageData: 'data:image/jpeg;base64,success' });
    assert.equal(successResult.success, true, "Debe indicar success=true cuando la captura es exitosa");
    assert.equal(successResult.isFallback, false, "isFallback debe ser false en captura nativa");
    assert.equal(tracksStopped, true, "Debe liberar los tracks de la cámara inmediatamente");

    // ============================================================
    // SECCIÓN 2: PRUEBAS DE GEOLOCALIZACIÓN
    // ============================================================

    // Test 2.1: Ausencia de capacidad de geolocalización
    delete (globalThis as any).navigator;
    assert.equal(isGeolocationSupported(), false, "isGeolocationSupported debe ser false sin navigator");

    const geoFallbackNoNav = await getCurrentLocation();
    assert.equal(geoFallbackNoNav.success, false, "Debe retornar success=false sin geolocalización");
    assert.equal(geoFallbackNoNav.isFallback, true, "Debe activar isFallback=true");
    assert.equal(geoFallbackNoNav.errorCode, 'NOT_SUPPORTED', "Código debe ser NOT_SUPPORTED");
    assert.equal(geoFallbackNoNav.coords?.latitude, DEFAULT_FALLBACK_COORDINATES.latitude, "Debe usar latitud de fallback");

    // Test 2.2: Permiso denegado en geolocalización
    (globalThis as any).navigator = {
      geolocation: {
        getCurrentPosition: (successCb: any, errorCb: any) => {
          errorCb({
            code: 1, // PERMISSION_DENIED
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
            message: "User denied Geolocation"
          });
        }
      }
    };

    assert.equal(isGeolocationSupported(), true, "isGeolocationSupported debe ser true");

    const geoDeniedResult = await getCurrentLocation();
    assert.equal(geoDeniedResult.success, false, "Debe indicar success=false si se rechaza el permiso");
    assert.equal(geoDeniedResult.isFallback, true, "Debe activar el fallback");
    assert.equal(geoDeniedResult.errorCode, 'PERMISSION_DENIED', "Debe categorizar PERMISSION_DENIED");
    assert.notEqual(geoDeniedResult.coords, undefined, "Debe proveer coordenadas de fallback");

    // Test 2.3: Geolocalización exitosa
    (globalThis as any).navigator = {
      geolocation: {
        getCurrentPosition: (successCb: any, _errorCb: any, options: PositionOptions) => {
          assert.equal(options.enableHighAccuracy, false, "Permisos mínimos: enableHighAccuracy debe ser false por defecto");
          successCb({
            coords: {
              latitude: 18.4700,
              longitude: -97.3900,
              accuracy: 10
            }
          });
        }
      }
    };

    const geoSuccessResult = await getCurrentLocation();
    assert.equal(geoSuccessResult.success, true, "Debe retornar success=true al obtener posición");
    assert.equal(geoSuccessResult.isFallback, false, "isFallback debe ser false en respuesta nativa");
    assert.equal(geoSuccessResult.coords?.latitude, 18.4700, "Latitud debe coincidir con los datos nativos");

    console.log("capabilities.spec.ts: PASS");
  } finally {
    // Restaurar globales
    if (originalGlobalWindow !== undefined) (globalThis as any).window = originalGlobalWindow;
    else delete (globalThis as any).window;

    if (originalGlobalNavigator !== undefined) (globalThis as any).navigator = originalGlobalNavigator;
    else delete (globalThis as any).navigator;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
