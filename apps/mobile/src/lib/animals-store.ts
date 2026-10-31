import { useSyncExternalStore } from "react";

import type { Zival } from "@/constants/data";
import {
  deleteAnimalLocal,
  getAnimalById,
  insertPendingAnimal,
  listAnimalsLocal,
  resolveServerAnimalId,
  updateAnimalLocal,
  type LocalAnimalUpdate,
} from "@/lib/db/animals";
import { getDb } from "@/lib/db/client";
import { deleteOutboxMatching, enqueueOutbox } from "@/lib/db/outbox";
import { emitEventsDataChanged } from "@/lib/sync/bus";
import { onAnimalsDataChanged } from "@/lib/sync/bus";
import { syncNow } from "@/lib/sync/engine";
import { refreshSyncStatusFromDb } from "@/lib/sync/status";

// Live animal list backed by SQLite. Screens read it with `useAnimals()`;
// mutations write locally + outbox, then kick the sync engine.
let animals: Zival[] = [];
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

function getSnapshot() {
  return animals;
}

function reloadFromDb() {
  animals = listAnimalsLocal();
  emit();
}

onAnimalsDataChanged(reloadFromDb);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Data collected by the add-animal form before it is persisted locally.
export interface NewAnimalInput {
  ime: string;
  si_id: string;
  breed: string; // breed code
  spol: string; // gender
  isLactating: boolean;
  isPregnant: boolean;
  datum_rojstva: string;
  datum_pridobitve: string;
  laktacija: number;
  /** Local animal ids; optional. */
  fatherId?: number | null;
  motherId?: number | null;
}

function isoOrUndefined(value: string): string | undefined {
  return DATE_RE.test(value) ? value : undefined;
}

export async function loadAnimals(_token?: string): Promise<void> {
  reloadFromDb();
  if (_token) void syncNow();
}

export async function addAnimal(_token: string, input: NewAnimalInput): Promise<Zival> {
  const { zival, clientId } = insertPendingAnimal({
    name: input.ime,
    si_id: input.si_id,
    breed: input.breed || undefined,
    gender: input.spol || undefined,
    isLactating: input.isLactating,
    isPregnant: input.isPregnant,
    dateOfBirth: isoOrUndefined(input.datum_rojstva),
    acquisitionDate: isoOrUndefined(input.datum_pridobitve),
    lactation: input.laktacija,
    fatherId: input.fatherId ?? null,
    motherId: input.motherId ?? null,
  });

  enqueueOutbox("animal.create", { clientId });
  reloadFromDb();
  refreshSyncStatusFromDb();
  void syncNow();
  return zival;
}

export type EditAnimalInput = NewAnimalInput;

export async function updateAnimal(_token: string, id: number, input: EditAnimalInput): Promise<Zival | null> {
  const row = getAnimalById(id);
  if (!row) return null;

  const patch: LocalAnimalUpdate = {
    name: input.ime,
    si_id: input.si_id,
    breed: input.breed || null,
    gender: input.spol || null,
    isLactating: input.isLactating,
    isPregnant: input.isPregnant,
    dateOfBirth: isoOrUndefined(input.datum_rojstva) ?? null,
    acquisitionDate: isoOrUndefined(input.datum_pridobitve) ?? null,
    lactation: input.laktacija,
    fatherId: input.fatherId ?? null,
    motherId: input.motherId ?? null,
  };

  const zival = updateAnimalLocal(id, patch);
  if (!zival) return null;

  // Never-synced animal: create outbox will read current row at flush time.
  if (row.server_id == null && id < 0) {
    reloadFromDb();
    void syncNow();
    return zival;
  }

  const serverId = row.server_id ?? (id > 0 ? id : null);
  if (serverId != null) {
    enqueueOutbox("animal.patch", {
      serverId,
      clientId: row.client_id,
      name: patch.name,
      si_id: patch.si_id,
      breed: patch.breed,
      gender: patch.gender,
      isLactating: patch.isLactating,
      isPregnant: patch.isPregnant,
      dateOfBirth: patch.dateOfBirth,
      acquisitionDate: patch.acquisitionDate,
      lactation: patch.lactation,
      fatherId: resolveServerAnimalId(patch.fatherId ?? null) ?? null,
      motherId: resolveServerAnimalId(patch.motherId ?? null) ?? null,
    });
  }

  reloadFromDb();
  refreshSyncStatusFromDb();
  void syncNow();
  return zival;
}

export async function updateAnimalState(
  _token: string,
  id: number,
  state: Partial<Pick<Zival, "isLactating" | "isPregnant">>,
): Promise<void> {
  const row = getAnimalById(id);
  if (!row) return;

  updateAnimalLocal(id, state);

  // Never-synced animal: create outbox will read current row at flush time.
  if (row.server_id == null && id < 0) {
    reloadFromDb();
    void syncNow();
    return;
  }

  const serverId = row.server_id ?? (id > 0 ? id : null);
  if (serverId != null) {
    enqueueOutbox("animal.patch", {
      serverId,
      clientId: row.client_id,
      isLactating: state.isLactating,
      isPregnant: state.isPregnant,
    });
  }

  reloadFromDb();
  refreshSyncStatusFromDb();
  void syncNow();
}

export async function removeAnimal(_token: string, id: number): Promise<void> {
  const row = getAnimalById(id);
  if (!row) return;

  // Never-synced: drop local row + matching create outbox; never hit the API.
  if (row.server_id == null && id < 0) {
    deleteOutboxMatching("animal.create", (p) => p.clientId === row.client_id);
    deleteOutboxMatching("event.create", (p) => p.animalClientId === row.client_id);
    // Drop local events that pointed at this pending animal.
    getDb().runSync("DELETE FROM events WHERE animal_client_id = ? OR animal_id = ?", [
      row.client_id,
      id,
    ]);
    deleteAnimalLocal(id);
    emitEventsDataChanged();
    reloadFromDb();
    refreshSyncStatusFromDb();
    return;
  }

  const serverId = row.server_id ?? id;
  deleteAnimalLocal(id);
  enqueueOutbox("animal.delete", { serverId, clientId: row.client_id });
  reloadFromDb();
  refreshSyncStatusFromDb();
  void syncNow();
}

export function useAnimals(): Zival[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}
