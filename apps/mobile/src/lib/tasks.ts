import { useSyncExternalStore } from "react";

import { getAnimalById } from "@/lib/db/animals";
import {
  deleteEventLocal,
  getEventById,
  insertPendingEvent,
  listEventRows,
  type EventRow,
} from "@/lib/db/events";
import { deleteOutboxMatching, enqueueOutbox } from "@/lib/db/outbox";
import { onEventsDataChanged } from "@/lib/sync/bus";
import { syncNow } from "@/lib/sync/engine";
import { refreshSyncStatusFromDb } from "@/lib/sync/status";

// UI shape for a calendar event (opravilo), mapped from the local SQLite row.
export interface Opravilo {
  id: number;
  naslov: string;
  opomba?: string;
  datum: string; // "YYYY-MM-DD"
  reminderDate: string | null;
  notificationId: string | null;
  reminderSent: boolean;
  zivalId?: number | null;
  zivalIme?: string | null;
  zivalSiId?: string | null;
}

export interface NewOpravilo {
  naslov: string;
  opomba?: string;
  datum: string;
  reminderDate: string;
  notificationId: string | null;
  zivalId?: number | null;
}

function rowToOpravilo(row: EventRow): Opravilo {
  return {
    id: row.id,
    naslov: row.title,
    opomba: row.note ?? undefined,
    datum: row.date,
    reminderDate: row.reminder_date,
    notificationId: row.notification_id,
    reminderSent: !!row.reminder_sent,
    zivalId: row.animal_id,
    zivalIme: row.animal_name,
    zivalSiId: row.animal_si_id,
  };
}

let opravila: Opravilo[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function reloadFromDb() {
  opravila = listEventRows().map(rowToOpravilo);
  emit();
}

onEventsDataChanged(reloadFromDb);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return opravila;
}

export async function loadOpravila(_token?: string): Promise<Opravilo[]> {
  reloadFromDb();
  if (_token) void syncNow();
  return opravila;
}

export function useOpravila(): Opravilo[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export async function createOpravilo(_token: string, input: NewOpravilo): Promise<Opravilo> {
  const animal = input.zivalId != null ? getAnimalById(input.zivalId) : null;
  const { row, clientId } = insertPendingEvent({
    title: input.naslov,
    note: input.opomba,
    date: input.datum,
    reminderDate: input.reminderDate,
    notificationId: input.notificationId,
    animalId: input.zivalId ?? null,
  });

  enqueueOutbox("event.create", {
    clientId,
    animalClientId: animal?.client_id ?? null,
  });

  reloadFromDb();
  refreshSyncStatusFromDb();
  void syncNow();
  return rowToOpravilo(row);
}

export async function deleteOpravilo(_token: string, id: number): Promise<void> {
  const row = getEventById(id);
  if (!row) return;

  // Never-synced: drop local row + matching create outbox.
  if (row.server_id == null && id < 0) {
    deleteOutboxMatching("event.create", (p) => p.clientId === row.client_id);
    deleteEventLocal(id);
    reloadFromDb();
    refreshSyncStatusFromDb();
    return;
  }

  const serverId = row.server_id ?? id;
  deleteEventLocal(id);
  enqueueOutbox("event.delete", { serverId, clientId: row.client_id });
  reloadFromDb();
  refreshSyncStatusFromDb();
  void syncNow();
}
