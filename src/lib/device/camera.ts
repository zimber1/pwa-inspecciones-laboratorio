/**
 * Módulo de capacidad de cámara y evidencia opcional.
 * Responsable: Felix
 * Permisos mínimos, manejo de errores y fallback cuando la capacidad no está disponible.
 */

export interface CameraOptions {
  facingMode?: 'user' | 'environment';
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  fallbackImageData?: string;
}

export interface CameraResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
  errorCode?: 'PERMISSION_DENIED' | 'NOT_FOUND' | 'NOT_READABLE' | 'NOT_SUPPORTED' | 'UNKNOWN_ERROR';
  isFallback: boolean;
  source?: 'camera' | 'file_fallback' | 'synthetic_fallback';
}

/**
 * Comprueba si la API de cámara está disponible en el entorno actual (dispositivo/navegador).
 */
export function isCameraSupported(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return Boolean(
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

/**
 * Solicita acceso a la cámara con permisos mínimos y captura una foto/evidencia.
 * Si la cámara no está disponible o el permiso es denegado, activa el fallback correspondiente.
 */
export async function captureCameraEvidence(options: CameraOptions = {}): Promise<CameraResult> {
  const facingMode = options.facingMode || 'environment';

  // 1. Comprobar si la capacidad está disponible (Capacidades opcionales)
  if (!isCameraSupported()) {
    return activateCameraFallback(
      'La API de cámara no está disponible en este navegador o entorno.',
      'NOT_SUPPORTED',
      options
    );
  }

  try {
    // 2. Solicitar permisos mínimos: solo video, sin audio, restricción facingMode preferida
    const constraints: MediaStreamConstraints = {
      video: { facingMode },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Intentar extraer un fotograma usando HTMLVideoElement y Canvas
    const dataUrl = await captureFrameFromStream(stream, options);

    // Detener los tracks del stream para liberar la cámara inmediatamente (permisos mínimos)
    stream.getTracks().forEach((track) => track.stop());

    return {
      success: true,
      dataUrl,
      isFallback: false,
      source: 'camera'
    };
  } catch (err: any) {
    // 3. Manejo de errores
    let errorCode: CameraResult['errorCode'] = 'UNKNOWN_ERROR';
    let errorMessage = 'Error desconocido al acceder a la cámara.';

    if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
      errorCode = 'PERMISSION_DENIED';
      errorMessage = 'Permiso de acceso a la cámara denegado por el usuario.';
    } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
      errorCode = 'NOT_FOUND';
      errorMessage = 'No se encontró ninguna cámara conectada en el dispositivo.';
    } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
      errorCode = 'NOT_READABLE';
      errorMessage = 'La cámara está ocupada o no se pudo acceder a ella.';
    } else if (typeof err?.message === 'string') {
      errorMessage = err.message;
    }

    // 4. Fallback cuando hay error o rechazo
    return activateCameraFallback(errorMessage, errorCode, options);
  }
}

/**
 * Captura un fotograma de la cámara a través de una etiqueta video y canvas.
 */
async function captureFrameFromStream(stream: MediaStream, options: CameraOptions): Promise<string> {
  if (typeof document === 'undefined') {
    return options.fallbackImageData || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play().then(() => {
        const canvas = document.createElement('canvas');
        const width = options.maxWidth || video.videoWidth || 640;
        const height = options.maxHeight || video.videoHeight || 480;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const quality = options.quality !== undefined ? options.quality : 0.8;
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } else {
          resolve(options.fallbackImageData || 'data:image/jpeg;base64,placeholder');
        }
      }).catch(() => {
        resolve(options.fallbackImageData || 'data:image/jpeg;base64,placeholder');
      });
    };
  });
}

/**
 * Mecanismo de fallback cuando la cámara falla o no está soportada.
 */
function activateCameraFallback(
  errorMessage: string,
  errorCode: CameraResult['errorCode'],
  options: CameraOptions
): CameraResult {
  const fallbackDataUrl =
    options.fallbackImageData ||
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  return {
    success: false,
    error: errorMessage,
    errorCode,
    dataUrl: fallbackDataUrl,
    isFallback: true,
    source: options.fallbackImageData ? 'file_fallback' : 'synthetic_fallback'
  };
}
