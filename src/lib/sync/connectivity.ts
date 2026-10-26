import type { SyncOperation } from "../storage/schema";
import type { SyncQueue, ProcessSyncHandler } from "./queue";

export type ConnectivitySyncCallbacks = {
  onConnectionChange: (online: boolean) => void;
  onSyncResult: (result: {
    processed: SyncOperation[];
    failed: SyncOperation[];
  }) => void;
  onError: (error: unknown) => void;
};

export function subscribeToConnectivity(
  queue: SyncQueue,
  handler: ProcessSyncHandler | undefined,
  callbacks: ConnectivitySyncCallbacks
): () => void {
  if (typeof window === "undefined") return () => undefined;

  let active = true;
  let processing = false;

  const processPending = () => {
    if (!active || processing || !handler) return;
    processing = true;

    void (async () => {
      try {
        const result = await queue.processQueue(handler);
        if (active) callbacks.onSyncResult(result);
      } catch (error) {
        if (active) callbacks.onError(error);
      } finally {
        processing = false;
      }
    })();
  };

  const onOnline = () => {
    callbacks.onConnectionChange(true);
    processPending();
  };
  const onOffline = () => callbacks.onConnectionChange(false);

  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  callbacks.onConnectionChange(window.navigator.onLine);
  if (window.navigator.onLine) processPending();

  return () => {
    active = false;
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}
