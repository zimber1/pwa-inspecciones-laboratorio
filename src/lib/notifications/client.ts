/**
 * Módulo de cliente de notificaciones (Stub / Base).
 * Semana 6 - Capacidades de Dispositivo y Notificaciones.
 */

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
}

export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return await Notification.requestPermission();
}

export async function sendNotification(options: NotificationOptions): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }
  new Notification(options.title, {
    body: options.body,
    icon: options.icon
  });
  return true;
}
