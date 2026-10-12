import assert from "node:assert/strict";
import {
  isNotificationSupported,
  notifyInspectionChange,
  requestNotificationPermission,
  showNotification
} from "../src/lib/notifications/client";

type MockNotificationConstructor = {
  permission: NotificationPermission;
  created: Array<{ title: string; options?: NotificationOptions }>;
  requestPermission: () => Promise<NotificationPermission>;
  new (title: string, options?: NotificationOptions): Notification;
};

const originalNotification = globalThis.Notification;

function installNotificationMock(input: {
  permission: NotificationPermission;
  requestedPermission?: NotificationPermission;
  throwOnRequest?: boolean;
  throwOnCreate?: boolean;
}) {
  const created: Array<{ title: string; options?: NotificationOptions }> = [];

  const MockNotification = function (
    this: Notification,
    title: string,
    options?: NotificationOptions
  ) {
    if (input.throwOnCreate) {
      throw new Error("synthetic notification creation failure");
    }

    created.push({ title, options });
  } as unknown as MockNotificationConstructor;

  MockNotification.permission = input.permission;
  MockNotification.created = created;
  MockNotification.requestPermission = async () => {
    if (input.throwOnRequest) {
      throw new Error("synthetic permission failure");
    }

    const permission = input.requestedPermission ?? input.permission;
    MockNotification.permission = permission;
    return permission;
  };

  Object.defineProperty(globalThis, "Notification", {
    configurable: true,
    value: MockNotification
  });

  return MockNotification;
}

async function main() {
  delete (globalThis as { Notification?: typeof Notification }).Notification;
  assert.equal(isNotificationSupported(), false);

  const unsupported = await requestNotificationPermission({
    userInitiated: true
  });
  assert.equal(unsupported.ok, false);
  assert.equal(unsupported.reason, "unsupported");
  assert.equal(unsupported.usedFallback, true);

  const blockedWithoutUserAction = await requestNotificationPermission({
    userInitiated: false
  });
  assert.equal(blockedWithoutUserAction.reason, "unsupported");

  const grantedMock = installNotificationMock({
    permission: "default",
    requestedPermission: "granted"
  });

  const noGesture = await requestNotificationPermission({
    userInitiated: false
  });
  assert.equal(noGesture.ok, false);
  assert.equal(noGesture.reason, "requires-user-action");
  assert.equal(grantedMock.permission, "default");

  const granted = await requestNotificationPermission({
    userInitiated: true
  });
  assert.equal(granted.ok, true);
  assert.equal(granted.permission, "granted");
  assert.equal(granted.usedFallback, false);

  const shown = showNotification({
    title: "Cambio de inspeccion",
    body: "Dato sintetico actualizado"
  });
  assert.equal(shown.ok, true);
  assert.equal(shown.shown, true);
  assert.equal(grantedMock.created.length, 1);
  assert.equal(grantedMock.created[0]?.title, "Cambio de inspeccion");

  installNotificationMock({
    permission: "default",
    requestedPermission: "denied"
  });

  const denied = await requestNotificationPermission({
    userInitiated: true
  });
  assert.equal(denied.ok, false);
  assert.equal(denied.reason, "permission-denied");
  assert.match(denied.fallbackMessage, /aplicacion/i);

  const fallbackWhenDenied = notifyInspectionChange({
    inspectionId: "INS-SYN-006",
    summary: "Dato sintetico: se registro mantenimiento preventivo"
  });
  assert.equal(fallbackWhenDenied.ok, false);
  assert.equal(fallbackWhenDenied.usedFallback, true);
  assert.equal(fallbackWhenDenied.reason, "permission-denied");

  installNotificationMock({
    permission: "default",
    throwOnRequest: true
  });

  const requestError = await requestNotificationPermission({
    userInitiated: true
  });
  assert.equal(requestError.ok, false);
  assert.equal(requestError.reason, "error");
  assert.match(requestError.errorMessage ?? "", /synthetic permission failure/);

  installNotificationMock({
    permission: "granted",
    throwOnCreate: true
  });

  const creationError = showNotification({
    title: "Cambio sintetico"
  });
  assert.equal(creationError.ok, false);
  assert.equal(creationError.reason, "error");
  assert.match(creationError.errorMessage ?? "", /synthetic notification creation failure/);

  console.log("capabilities.spec.ts: PASS");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
  if (originalNotification) {
    Object.defineProperty(globalThis, "Notification", {
      configurable: true,
      value: originalNotification
    });
  } else {
    delete (globalThis as { Notification?: typeof Notification }).Notification;
  }
  });
