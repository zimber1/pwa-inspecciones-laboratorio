/**
 * Módulo de capacidad de geolocalización.
 * Responsable: Felix
 * Permisos mínimos, manejo de errores y fallback cuando la capacidad no está disponible.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  fallbackCoords?: Coordinates;
}

export interface GeolocationResult {
  success: boolean;
  coords?: Coordinates;
  error?: string;
  errorCode?: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED' | 'UNKNOWN_ERROR';
  isFallback: boolean;
  source?: 'device' | 'fallback_coords';
}

// Coordenadas sintéticas de fallback por defecto (Ubicación de referencia: Tehuacán, Puebla)
export const DEFAULT_FALLBACK_COORDINATES: Coordinates = {
  latitude: 18.4627,
  longitude: -97.3927,
  accuracy: 100
};

/**
 * Comprueba si la API de geolocalización está disponible en el entorno actual (dispositivo/navegador).
 */
export function isGeolocationSupported(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return Boolean(
    navigator &&
    'geolocation' in navigator &&
    typeof navigator.geolocation.getCurrentPosition === 'function'
  );
}

/**
 * Obtiene la ubicación actual del dispositivo solicitando permisos mínimos.
 * Si la geolocalización no está disponible, el permiso es denegado o falla, activa el fallback.
 */
export async function getCurrentLocation(options: GeolocationOptions = {}): Promise<GeolocationResult> {
  const fallbackCoords = options.fallbackCoords || DEFAULT_FALLBACK_COORDINATES;

  // 1. Comprobar si la capacidad está disponible (Capacidades opcionales)
  if (!isGeolocationSupported()) {
    return activateGeolocationFallback(
      'La API de geolocalización no está disponible en este navegador o entorno.',
      'NOT_SUPPORTED',
      fallbackCoords
    );
  }

  // 2. Permisos mínimos y opciones optimizadas
  const geoOptions: PositionOptions = {
    enableHighAccuracy: options.enableHighAccuracy !== undefined ? options.enableHighAccuracy : false,
    timeout: options.timeout !== undefined ? options.timeout : 10000,
    maximumAge: options.maximumAge !== undefined ? options.maximumAge : 60000
  };

  return new Promise<GeolocationResult>((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          resolve({
            success: true,
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            },
            isFallback: false,
            source: 'device'
          });
        },
        (err: GeolocationPositionError) => {
          // 3. Manejo de errores
          let errorCode: GeolocationResult['errorCode'] = 'UNKNOWN_ERROR';
          let errorMessage = 'Error desconocido al obtener la geolocalización.';

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorCode = 'PERMISSION_DENIED';
              errorMessage = 'Permiso de geolocalización denegado por el usuario.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorCode = 'POSITION_UNAVAILABLE';
              errorMessage = 'La información de ubicación no está disponible en el dispositivo.';
              break;
            case err.TIMEOUT:
              errorCode = 'TIMEOUT';
              errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación.';
              break;
            default:
              if (err.message) errorMessage = err.message;
              break;
          }

          // 4. Fallback cuando hay error o permiso denegado
          resolve(activateGeolocationFallback(errorMessage, errorCode, fallbackCoords));
        },
        geoOptions
      );
    } catch (error: any) {
      resolve(
        activateGeolocationFallback(
          error?.message || 'Error inesperado al invocar la API de geolocalización.',
          'UNKNOWN_ERROR',
          fallbackCoords
        )
      );
    }
  });
}

/**
 * Activa el mecanismo de fallback devolviendo las coordenadas sintéticas/predeterminadas.
 */
function activateGeolocationFallback(
  errorMessage: string,
  errorCode: GeolocationResult['errorCode'],
  fallbackCoords: Coordinates
): GeolocationResult {
  return {
    success: false,
    error: errorMessage,
    errorCode,
    coords: fallbackCoords,
    isFallback: true,
    source: 'fallback_coords'
  };
}
