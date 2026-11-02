import NetInfo from "@react-native-community/netinfo";
import { AppState, type AppStateStatus } from "react-native";

import * as api from "@/lib/api";
import {
  bindAnimalServerId,
  getAnimalByClientId,
  getAnimalById,
  listPendingAnimals,
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
import {
  deleteOutbox,
  enqueueOutbox,
  hasOutboxOp,
  listOutbox,
  type OutboxRow,
} from "@/lib/db/outbox";
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

/**
 * Drain outbox, then replace local SQLite from the API.
 * Railway/Postgres is the multi-device source of truth: after a successful sync,
 * every phone’s herd/calendar matches the remote snapshot (other devices only
 * see animals that made it onto the server).
 * Concurrent callers share one promise.
 */
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
    // Local animals with no server_id must have an animal.create in the outbox.
    // If the create row was lost (or never written), re-queue before draining.
    ensurePendingAnimalCreatesEnqueued();
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

/**
 * Re-queue creates for on-device-only animals that have no matching outbox row.
 * Parents are queued before offspring so FIFO drain can succeed.
 */
function ensurePendingAnimalCreatesEnqueued(): void {
  const pending = listPendingAnimals();
  if (pending.length === 0) return;

  const queued = new Set(
    listOutbox()
      .filter((r) => r.op === "animal.create")
      .map((r) => String(r.payload.clientId)),
  );

  const remaining = [...pending];
  let guard = remaining.length + 2;
  while (remaining.length > 0 && guard-- > 0) {
    let progress = false;
    for (let i = 0; i < remaining.length; ) {
      const animal = remaining[i];
      if (queued.has(animal.client_id)) {
        remaining.splice(i, 1);
        continue;
      }

      const parentsReady = [animal.father_id, animal.mother_id].every((parentLocalId) => {
        if (parentLocalId == null) return true;
        const parent = getAnimalById(parentLocalId);
        if (!parent) return true;
        if (parent.server_id != null || parent.id > 0) return true;
        // Parent is also pending — wait until its create is queued first.
        return queued.has(parent.client_id);
      });

      if (!parentsReady) {
        i += 1;
        continue;
      }

      if (!hasOutboxOp("animal.create", (p) => p.clientId === animal.client_id)) {
        enqueueOutbox("animal.create", { clientId: animal.client_id });
      }
      queued.add(animal.client_id);
      remaining.splice(i, 1);
      progress = true;
    }

    if (!progress) {
      // Cycle / missing parent create — queue the rest so sync can surface an error.
      for (const animal of remaining) {
        if (!queued.has(animal.client_id)) {
          enqueueOutbox("animal.create", { clientId: animal.client_id });
          queued.add(animal.client_id);
        }
      }
      break;
    }
  }
}

function animalCreateBlockedByUnsyncedParent(row: OutboxRow): boolean {
  if (row.op !== "animal.create") return false;
  const local = getAnimalByClientId(String(row.payload.clientId));
  if (!local) return false;
  return [local.father_id, local.mother_id].some((parentLocalId) => {
    if (parentLocalId == null) return false;
    const parent = getAnimalById(parentLocalId);
    return !!(parent && resolveServerAnimalId(parentLocalId) == null);
  });
}

/**
 * Keep FIFO unless the head is an animal.create blocked on an unsynced parent —
 * then drain that parent's create first so the child can proceed.
 */
function pickNextOutboxRow(rows: OutboxRow[]): OutboxRow {
  const head = rows[0];
  if (!animalCreateBlockedByUnsyncedParent(head)) return head;
  for (const row of rows) {
    if (row.op === "animal.create" && !animalCreateBlockedByUnsyncedParent(row)) {
      return row;
    }
  }
  return head;
}

async function drainOutbox(token: string): Promise<void> {
  while (true) {
    const rows = listOutbox();
    if (rows.length === 0) return;
    const row = pickNextOutboxRow(rows);
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
          throw new Error("Starševska žival še ni sinhronizirana — poskusi znova.");
        }
      }

      let created: api.ApiAnimal;
      try {
        created = await api.createAnimal(token, {
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
      } catch (err) {
        // Converge on remote: if the ear tag (or clientId) already exists server-side,
        // bind to that row instead of leaving a phone-only orphan.
        const remote = await resolveRemoteAnimal(token, clientId, local.si_id);
        if (!remote) throw err;
        created = remote;
      }
      bindAnimalServerId(clientId, created.id);
      emitAnimalsDataChanged();
      return;
    }
    case "animal.patch": {
      const serverId = Number(p.serverId);
      if (!Number.isFinite(serverId) || serverId <= 0) return;
      await api.updateAnimal(token, serverId, {
        name: p.name != null ? String(p.name) : undefined,
        si_id: p.si_id != null ? String(p.si_id) : undefined,
        breed: p.breed !== undefined ? (p.breed as string | null) : undefined,
        gender: p.gender !== undefined ? (p.gender as string | null) : undefined,
        isLactating: p.isLactating != null ? !!p.isLactating : undefined,
        isPregnant: p.isPregnant != null ? !!p.isPregnant : undefined,
        dateOfBirth: p.dateOfBirth !== undefined ? (p.dateOfBirth as string | null) : undefined,
        acquisitionDate:
          p.acquisitionDate !== undefined ? (p.acquisitionDate as string | null) : undefined,
        lactation: p.lactation !== undefined ? (p.lactation as number | null) : undefined,
        fatherId: p.fatherId !== undefined ? (p.fatherId as number | null) : undefined,
        motherId: p.motherId !== undefined ? (p.motherId as number | null) : undefined,
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

async function resolveRemoteAnimal(
  token: string,
  clientId: string,
  siId: string,
): Promise<api.ApiAnimal | null> {
  const animals = await api.getAnimals(token);
  return (
    animals.find((a) => a.clientId === clientId) ??
    animals.find((a) => a.si_id === siId) ??
    null
  );
}

async function pullSnapshot(token: string): Promise<void> {
  const remaining = listOutbox();
  if (remaining.length > 0) {
    throw new Error("Outbox ni prazen — sinhronizacija prekinjena.");
  }

  // Remote wins: wipe-and-replace so every device matches Postgres.
  const [animals, events] = await Promise.all([api.getAnimals(token), api.getEvents(token)]);
  replaceAnimalsFromServer(animals);
  replaceEventsFromServer(events);
}
