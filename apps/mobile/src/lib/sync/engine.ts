import NetInfo from "@react-native-community/netinfo";
import { AppState, type AppStateStatus } from "react-native";

import * as api from "@/lib/api";
import {
  bindAnimalServerId,
  getAnimalByClientId,
  getAnimalById,
  replaceAnimalsFromServer,
  resolveServerAnimalId,
} from "@/lib/db/animals";
import { getDb, wipeLocalData } from "@/lib/db/client";
import {
  bindEventServerId,
  getEventByClientId,
  replaceEventsFromServer,
} from "@/lib/db/events";
import { setFarmId, setMeta } from "@/lib/db/meta";
import { deleteOutbox, listOutbox, type OutboxRow } from "@/lib/db/outbox";
import { emitAnimalsDataChanged, emitEventsDataChanged } from "./bus";
import { refreshSyncStatusFromDb, setOnline, setSyncing } from "./status";

let authToken: string | null = null;
let farmId: number | null = null;
let syncPromise: Promise<void> | null = null;
let started = false;
let unsubNet: (() => void) | null = null;
let unsubApp: { remove: () => void } | null = null;

export function configureSync(token: string | null, nextFarmId: number | null): void {
  const prevFarm = farmId;
  authToken = token;
  farmId = nextFarmId;

  // Switching farms — wipe local herd/calendar so we never leak data across farms.
  if (prevFarm != null && nextFarmId != null && prevFarm !== nextFarmId) {
    getDb().execSync(`
      DELETE FROM animals;
      DELETE FROM events;
      DELETE FROM outbox;
    `);
    setMeta("last_sync_at", null);
    setMeta("sync_error", null);
    emitAnimalsDataChanged();
    emitEventsDataChanged();
  }

  if (nextFarmId != null) setFarmId(nextFarmId);

  if (token && nextFarmId != null) {
    void syncNow();
  }
}

/** Clear local SQLite data on sign-out. */
export function clearLocalOnSignOut(): void {
  authToken = null;
  farmId = null;
  wipeLocalData();
  emitAnimalsDataChanged();
  emitEventsDataChanged();
  refreshSyncStatusFromDb({ syncing: false });
}

export function startSyncListeners(): void {
  if (started) return;
  started = true;

  getDb();
  refreshSyncStatusFromDb();

  unsubNet = NetInfo.addEventListener((state) => {
    const online = !!(state.isConnected && state.isInternetReachable !== false);
    setOnline(online);
    if (online) void syncNow();
  });

  unsubApp = AppState.addEventListener("change", (next: AppStateStatus) => {
    if (next === "active") void syncNow();
  });

  void NetInfo.fetch().then((state) => {
    const online = !!(state.isConnected && state.isInternetReachable !== false);
    setOnline(online);
  });
}

export function stopSyncListeners(): void {
  unsubNet?.();
  unsubNet = null;
  unsubApp?.remove();
  unsubApp = null;
  started = false;
}

/** Drain outbox then full-pull replace. Concurrent callers share one promise. */
export function syncNow(): Promise<void> {
  if (syncPromise) return syncPromise;
  syncPromise = runSync().finally(() => {
    syncPromise = null;
  });
  return syncPromise;
}

async function runSync(): Promise<void> {
  if (!authToken || farmId == null) return;

  const net = await NetInfo.fetch();
  const online = !!(net.isConnected && net.isInternetReachable !== false);
  setOnline(online);
  if (!online) {
    refreshSyncStatusFromDb({ online: false, syncing: false });
    return;
  }

  setSyncing(true);
  setMeta("syncing", "1");
  refreshSyncStatusFromDb({ online: true, syncing: true });

  try {
    await drainOutbox(authToken);
    await pullSnapshot(authToken);

    setMeta("last_sync_at", new Date().toISOString());
    setMeta("sync_error", null);
    emitAnimalsDataChanged();
    emitEventsDataChanged();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sinhronizacija ni uspela.";
    setMeta("sync_error", message);
  } finally {
    setMeta("syncing", null);
    setSyncing(false);
    refreshSyncStatusFromDb({ online: true, syncing: false });
  }
}

async function drainOutbox(token: string): Promise<void> {
  while (true) {
    const rows = listOutbox();
    if (rows.length === 0) return;
    const row = rows[0];
    await applyOutboxRow(token, row);
    deleteOutbox(row.id);
  }
}

async function applyOutboxRow(token: string, row: OutboxRow): Promise<void> {
  const p = row.payload;

  switch (row.op) {
    case "animal.create": {
      const clientId = String(p.clientId);
      const local = getAnimalByClientId(clientId);
      if (!local) return;

      // If a chosen parent exists locally but is not on the server yet, wait —
      // the parent's animal.create should drain first (FIFO outbox).
      for (const parentLocalId of [local.father_id, local.mother_id]) {
        if (parentLocalId == null) continue;
        if (getAnimalById(parentLocalId) && resolveServerAnimalId(parentLocalId) == null) {
          throw new Error("Parent animal is not synced yet");
        }
      }

      const created = await api.createAnimal(token, {
        name: local.name,
        si_id: local.si_id,
        breed: local.breed ?? undefined,
        gender: local.gender ?? undefined,
        isLactating: !!local.is_lactating,
        isPregnant: !!local.is_pregnant,
        dateOfBirth: local.date_of_birth ?? undefined,
        acquisitionDate: local.acquisition_date ?? undefined,
        lactation: local.lactation ?? undefined,
        fatherId: resolveServerAnimalId(local.father_id) ?? null,
        motherId: resolveServerAnimalId(local.mother_id) ?? null,
        clientId,
      });
      bindAnimalServerId(clientId, created.id);
      emitAnimalsDataChanged();
      return;
    }
    case "animal.patch": {
      const serverId = Number(p.serverId);
      if (!Number.isFinite(serverId) || serverId <= 0) return;
      await api.updateAnimal(token, serverId, {
        isLactating: p.isLactating != null ? !!p.isLactating : undefined,
        isPregnant: p.isPregnant != null ? !!p.isPregnant : undefined,
      });
      return;
    }
    case "animal.delete": {
      const serverId = Number(p.serverId);
      if (!Number.isFinite(serverId) || serverId <= 0) return;
      try {
        await api.deleteAnimal(token, serverId);
      } catch {
        // Already gone on the server — treat as success.
      }
      return;
    }
    case "event.create": {
      const clientId = String(p.clientId);
      const local = getEventByClientId(clientId);
      if (!local) return;

      let animalId: number | null = null;
      const animalClientId =
        (p.animalClientId != null ? String(p.animalClientId) : null) ?? local.animal_client_id;

      if (animalClientId) {
        const animal = getAnimalByClientId(animalClientId);
        if (animal) {
          animalId = animal.server_id ?? (animal.id > 0 ? animal.id : null);
        }
      } else if (local.animal_id != null && local.animal_id > 0) {
        animalId = local.animal_id;
      }

      const reminderDate = local.reminder_date ?? local.date;
      const created = await api.createEvent(token, {
        title: local.title,
        note: local.note ?? undefined,
        date: local.date,
        reminderDate,
        notificationId: local.notification_id,
        animalId,
        clientId,
      });
      bindEventServerId(clientId, created.id);
      emitEventsDataChanged();
      return;
    }
    case "event.delete": {
      const serverId = Number(p.serverId);
      if (!Number.isFinite(serverId) || serverId <= 0) return;
      try {
        await api.deleteEvent(token, serverId);
      } catch {
        // Already gone.
      }
      return;
    }
    default:
      return;
  }
}

async function pullSnapshot(token: string): Promise<void> {
  const remaining = listOutbox();
  if (remaining.length > 0) {
    throw new Error("Outbox ni prazen — sinhronizacija prekinjena.");
  }

  const [animals, events] = await Promise.all([api.getAnimals(token), api.getEvents(token)]);
  replaceAnimalsFromServer(animals);
  replaceEventsFromServer(events);
}
