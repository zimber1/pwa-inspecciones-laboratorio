export type ServiceWorkerRegistrationResult = {
  supported: boolean;
  registered: boolean;
  reason?: "server" | "unsupported" | "insecure-context" | "registration-failed";
  scope?: string;
  errorMessage?: string;
};

const DEFAULT_SERVICE_WORKER_URL = "/sw.js";

function canUseServiceWorker() {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator
  );
}

function isAllowedContext() {
  const { protocol, hostname } = window.location;
  return protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1";
}

export async function registerServiceWorker(
  serviceWorkerUrl = DEFAULT_SERVICE_WORKER_URL
): Promise<ServiceWorkerRegistrationResult> {
  if (!canUseServiceWorker()) {
    return { supported: false, registered: false, reason: "server" };
  }

  if (!isAllowedContext()) {
    return { supported: true, registered: false, reason: "insecure-context" };
  }

  try {
    const registration = await navigator.serviceWorker.register(serviceWorkerUrl);
    return {
      supported: true,
      registered: true,
      scope: registration.scope
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("No se pudo registrar el service worker.", errorMessage);
    return {
      supported: true,
      registered: false,
      reason: "registration-failed",
      errorMessage
    };
  }
}
