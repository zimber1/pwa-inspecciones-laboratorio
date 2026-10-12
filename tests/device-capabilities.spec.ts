import assert from "node:assert/strict";
import {
  isCameraSupported,
  captureCameraEvidence
} from "../src/lib/device/camera";
import {
  isGeolocationSupported,
  getCurrentLocation,
  DEFAULT_FALLBACK_COORDINATES
} from "../src/lib/device/geolocation";

async function main() {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");

  try {
    // 1. Cámara no disponible: debe usar fallback.
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "navigator");

    assert.equal(isCameraSupported(), false);

    const cameraUnsupported = await captureCameraEvidence({
      fallbackImageData: "data:image/png;base64,mock"
    });

    assert.equal(cameraUnsupported.success, false);
    assert.equal(cameraUnsupported.isFallback, true);
    assert.equal(cameraUnsupported.errorCode, "NOT_SUPPORTED");
    assert.equal(cameraUnsupported.dataUrl, "data:image/png;base64,mock");

    // 2. Cámara disponible, pero el permiso es denegado.
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {}
    });

    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        mediaDevices: {
          getUserMedia: async () => {
            const error = new Error("Permission denied");
            error.name = "NotAllowedError";
            throw error;
          }
        }
      }
    });

    assert.equal(isCameraSupported(), true);

    const cameraDenied = await captureCameraEvidence();

    assert.equal(cameraDenied.success, false);
    assert.equal(cameraDenied.isFallback, true);
    assert.equal(cameraDenied.errorCode, "PERMISSION_DENIED");
    assert.equal(typeof cameraDenied.dataUrl, "string");

    // 3. Cámara disponible: captura y liberación de tracks.
    let tracksStopped = false;

    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        mediaDevices: {
          getUserMedia: async (constraints: MediaStreamConstraints) => {
            assert.equal(constraints.audio, false);

            return {
              getTracks: () => [
                {
                  stop: () => {
                    tracksStopped = true;
                  }
                }
              ]
            };
          }
        }
      }
    });

    const cameraSuccess = await captureCameraEvidence({
      fallbackImageData: "data:image/jpeg;base64,success"
    });

    assert.equal(cameraSuccess.success, true);
    assert.equal(cameraSuccess.isFallback, false);
    assert.equal(tracksStopped, true);

    // 4. Geolocalización no disponible: debe usar coordenadas fallback.
    Reflect.deleteProperty(globalThis, "navigator");

    assert.equal(isGeolocationSupported(), false);

    const geoUnsupported = await getCurrentLocation();

    assert.equal(geoUnsupported.success, false);
    assert.equal(geoUnsupported.isFallback, true);
    assert.equal(geoUnsupported.errorCode, "NOT_SUPPORTED");
    assert.equal(
      geoUnsupported.coords?.latitude,
      DEFAULT_FALLBACK_COORDINATES.latitude
    );

    // 5. Geolocalización disponible, pero el permiso es denegado.
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        geolocation: {
          getCurrentPosition: (
            _successCallback: PositionCallback,
            errorCallback: PositionErrorCallback
          ) => {
            errorCallback({
              code: 1,
              message: "User denied Geolocation",
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3
            } as GeolocationPositionError);
          }
        }
      }
    });

    assert.equal(isGeolocationSupported(), true);

    const geoDenied = await getCurrentLocation();

    assert.equal(geoDenied.success, false);
    assert.equal(geoDenied.isFallback, true);
    assert.equal(geoDenied.errorCode, "PERMISSION_DENIED");
    assert.ok(geoDenied.coords);

    // 6. Geolocalización exitosa con opciones de precisión mínima.
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        geolocation: {
          getCurrentPosition: (
            successCallback: PositionCallback,
            _errorCallback: PositionErrorCallback,
            options?: PositionOptions
          ) => {
            assert.equal(options?.enableHighAccuracy, false);

            successCallback({
              coords: {
                latitude: 18.47,
                longitude: -97.39,
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
              },
              timestamp: Date.now()
            } as GeolocationPosition);
          }
        }
      }
    });

    const geoSuccess = await getCurrentLocation();

    assert.equal(geoSuccess.success, true);
    assert.equal(geoSuccess.isFallback, false);
    assert.equal(geoSuccess.coords?.latitude, 18.47);

    console.log("device-capabilities.spec.ts: PASS");
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }

    if (originalNavigator) {
      Object.defineProperty(globalThis, "navigator", originalNavigator);
    } else {
      Reflect.deleteProperty(globalThis, "navigator");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});