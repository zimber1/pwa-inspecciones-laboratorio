export type NotificationFallbackReason =
  | "unsupported"
  | "requires-user-action"
  | "permission-denied"
  | "permission-default"
  | "not-granted"
  | "error";

export type NotificationPermissionResult = Readonly<{
  ok: boolean;
  permission: NotificationPermission | "unsupported";
  usedFallback: boolean;
  reason: NotificationFallbackReason | "permission-granted";
  fallbackMessage: string;
  errorMessage?: string;
}>;

export type NotificationDispatchResult = Readonly<{
  ok: boolean;
  shown: boolean;
  usedFallback: boolean;
  reason: "shown" | NotificationFallbackReason;
  fallbackMessage: string;
  errorMessage?: string;
}>;

export type NotificationOptions = Readonly<{
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
}>;

export type InspectionChangeNotification = Readonly<{
  inspectionId: string;
  title?: string;
  summary: string;
}>;

export type RequestNotificationPermissionOptions = Readonly<{
  userInitiated: boolean;
}>;

const FALLBACK_MESSAGE =
  "Notificacion no disponible. El cambio quedo visible dentro de la aplicacion.";

export function isNotificationSupported() {
  return getNotificationApi() !== null;
}

export function getNotificationFallbackMessage(
  reason: NotificationFallbackReason
) {
  if (reason === "permission-denied") {
    return "Permiso de notificaciones denegado. El aviso se muestra dentro de la aplicacion.";
  }

  if (reason === "requires-user-action") {
    return "La solicitud de permiso debe iniciarse desde una accion del usuario.";
  }

  if (reason === "unsupported") {
    return "Este navegador no expone la API de notificaciones. Se usa aviso interno.";
  }

  if (reason === "error") {
    return "No fue posible mostrar la notificacion. Se usa aviso interno.";
  }

  return FALLBACK_MESSAGE;
}

export async function requestNotificationPermission(
  options: RequestNotificationPermissionOptions = { userInitiated: false }
): Promise<NotificationPermissionResult> {
  const notificationApi = getNotificationApi();

  if (!notificationApi) {
    return buildPermissionResult("unsupported", "unsupported");
  }

  if (!options.userInitiated) {
    return buildPermissionResult(
      notificationApi.permission,
      "requires-user-action"
    );
  }

  try {
    const permission = await notificationApi.requestPermission();

    if (permission === "granted") {
      return {
        ok: true,
        permission,
        usedFallback: false,
        reason: "permission-granted",
        fallbackMessage: ""
      };
    }

    return buildPermissionResult(
      permission,
      permission === "denied" ? "permission-denied" : "permission-default"
    );
  } catch (error) {
    return {
      ok: false,
      permission: notificationApi.permission,
      usedFallback: true,
      reason: "error",
      fallbackMessage: getNotificationFallbackMessage("error"),
      errorMessage: getErrorMessage(error)
    };
  }
}

export function notifyInspectionChange(
  change: InspectionChangeNotification
): NotificationDispatchResult {
  return showNotification({
    title: change.title ?? "Inspeccion actualizada",
    body: `Inspeccion ${change.inspectionId}: ${change.summary}`,
    tag: `inspection-${change.inspectionId}`
  });
}

export function showNotification(
  options: NotificationOptions
): NotificationDispatchResult {
  const notificationApi = getNotificationApi();

  if (!notificationApi) {
    return buildDispatchResult("unsupported");
  }

  if (notificationApi.permission !== "granted") {
    return buildDispatchResult(
      notificationApi.permission === "denied"
        ? "permission-denied"
        : "not-granted"
    );
  }

  try {
    new notificationApi(options.title, {
      body: options.body,
      icon: options.icon,
      tag: options.tag
    });

    return {
      ok: true,
      shown: true,
      usedFallback: false,
      reason: "shown",
      fallbackMessage: ""
    };
  } catch (error) {
    return {
      ...buildDispatchResult("error"),
      errorMessage: getErrorMessage(error)
    };
  }
}

export async function sendNotification(options: NotificationOptions) {
  return showNotification(options).ok;
}

function buildPermissionResult(
  permission: NotificationPermission | "unsupported",
  reason: NotificationFallbackReason
): NotificationPermissionResult {
  return {
    ok: false,
    permission,
    usedFallback: true,
    reason,
    fallbackMessage: getNotificationFallbackMessage(reason)
  };
}

function buildDispatchResult(
  reason: NotificationFallbackReason
): NotificationDispatchResult {
  return {
    ok: false,
    shown: false,
    usedFallback: true,
    reason,
    fallbackMessage: getNotificationFallbackMessage(reason)
  };
}

function getNotificationApi() {
  const notificationApi =
    typeof Notification === "undefined" ? null : Notification;

  if (!notificationApi || typeof notificationApi.requestPermission !== "function") {
    return null;
  }

  return notificationApi;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error desconocido";
}
