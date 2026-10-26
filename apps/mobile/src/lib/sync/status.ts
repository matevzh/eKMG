import { useSyncExternalStore } from "react";

import { getMeta } from "@/lib/db/meta";
import { outboxCount } from "@/lib/db/outbox";

export interface SyncStatus {
  online: boolean;
  syncing: boolean;
  lastSyncAt: string | null;
  error: string | null;
  pendingCount: number;
}

let status: SyncStatus = {
  online: true,
  syncing: false,
  lastSyncAt: null,
  error: null,
  pendingCount: 0,
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): SyncStatus {
  return status;
}

/** Refresh status fields that live in SQLite (last sync, error, pending). */
export function refreshSyncStatusFromDb(partial?: Partial<Pick<SyncStatus, "online" | "syncing">>): void {
  status = {
    online: partial?.online ?? status.online,
    syncing: partial?.syncing ?? status.syncing,
    lastSyncAt: getMeta("last_sync_at"),
    error: getMeta("sync_error"),
    pendingCount: outboxCount(),
  };
  emit();
}

export function setOnline(online: boolean): void {
  if (status.online === online) return;
  status = { ...status, online };
  emit();
}

export function setSyncing(syncing: boolean): void {
  if (status.syncing === syncing) return;
  status = { ...status, syncing };
  emit();
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribe, getSnapshot);
}
