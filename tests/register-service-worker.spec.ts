import assert from "node:assert/strict";
import { registerServiceWorker } from "../src/lib/pwa/register-service-worker";

const originalWindow = globalThis.window;
const originalNavigator = globalThis.navigator;
const originalConsoleWarn = console.warn;

function setBrowserMocks({
  protocol = "https:",
  hostname = "localhost",
  register
}: {
  protocol?: string;
  hostname?: string;
  register: (url: string) => Promise<{ scope: string }>;
}) {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { protocol, hostname }
    }
  });

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      serviceWorker: { register }
    }
  });
}

function restoreGlobals() {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: originalWindow
  });

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: originalNavigator
  });

  console.warn = originalConsoleWarn;
}

async function main() {
  let registeredUrl = "";
  setBrowserMocks({
    register: async (url) => {
      registeredUrl = url;
      return { scope: "https://example.test/" };
    }
  });

  const success = await registerServiceWorker();
  assert.equal(success.supported, true);
  assert.equal(success.registered, true);
  assert.equal(success.scope, "https://example.test/");
  assert.equal(registeredUrl, "/sw.js");

  setBrowserMocks({
    protocol: "http:",
    hostname: "laboratorio.test",
    register: async () => {
      throw new Error("No debe registrar en contexto inseguro");
    }
  });

  const insecure = await registerServiceWorker();
  assert.equal(insecure.supported, true);
  assert.equal(insecure.registered, false);
  assert.equal(insecure.reason, "insecure-context");

  let warning = "";
  console.warn = (...args: unknown[]) => {
    warning = args.join(" ");
  };

  setBrowserMocks({
    register: async () => {
      throw new Error("sw no disponible");
    }
  });

  const failed = await registerServiceWorker();
  assert.equal(failed.supported, true);
  assert.equal(failed.registered, false);
  assert.equal(failed.reason, "registration-failed");
  assert.match(warning, /service worker/i);

  console.log("register-service-worker.spec.ts: PASS");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    restoreGlobals();
  });
