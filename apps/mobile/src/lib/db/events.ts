import type { ApiEvent } from "@/lib/api";

import { getAnimalById } from "./animals";
import { getDb } from "./client";
import { newClientId } from "./ids";
import { nextLocalId } from "./meta";

export interface EventRow {
  id: number;
  client_id: string;
  server_id: number | null;
  title: string;
  note: string | null;
  date: string;
  notification_id: string | null;
  reminder_sent: number;
  animal_id: number | null;
  animal_client_id: string | null;
  animal_name: string | null;
  animal_si_id: string | null;
}

export interface LocalEventCreate {
  title: string;
  note?: string;
  date: string;
  notificationId?: string | null;
  animalId?: number | null;
}

export function listEventRows(): EventRow[] {
  return getDb().getAllSync<EventRow>("SELECT * FROM events ORDER BY date ASC");
}

export function getEventById(id: number): EventRow | null {
  return getDb().getFirstSync<EventRow>("SELECT * FROM events WHERE id = ?", [id]) ?? null;
}

export function getEventByClientId(clientId: string): EventRow | null {
  return getDb().getFirstSync<EventRow>("SELECT * FROM events WHERE client_id = ?", [clientId]) ?? null;
}

export function insertPendingEvent(input: LocalEventCreate): { row: EventRow; clientId: string; localId: number } {
  const localId = nextLocalId();
  const clientId = newClientId();

  let animalClientId: string | null = null;
  let animalName: string | null = null;
  let animalSiId: string | null = null;
  const animalId = input.animalId ?? null;

  if (animalId != null) {
    const animal = getAnimalById(animalId);
    if (animal) {
      animalClientId = animal.client_id;
      animalName = animal.name;
      animalSiId = animal.si_id;
    }
  }

  getDb().runSync(
    `INSERT INTO events (
      id, client_id, server_id, title, note, date, notification_id, reminder_sent,
      animal_id, animal_client_id, animal_name, animal_si_id
    ) VALUES (?, ?, NULL, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
    [
      localId,
      clientId,
      input.title,
      input.note ?? null,
      input.date,
      input.notificationId ?? null,
      animalId,
      animalClientId,
      animalName,
      animalSiId,
    ],
  );

  return { row: getEventById(localId)!, clientId, localId };
}

export function deleteEventLocal(id: number): void {
  getDb().runSync("DELETE FROM events WHERE id = ?", [id]);
}

export function bindEventServerId(clientId: string, serverId: number): void {
  const row = getEventByClientId(clientId);
  if (!row) return;
  if (row.id === serverId && row.server_id === serverId) return;

  const db = getDb();
  db.execSync("BEGIN");
  try {
    db.runSync("DELETE FROM events WHERE client_id = ?", [clientId]);
    db.runSync(
      `INSERT INTO events (
        id, client_id, server_id, title, note, date, notification_id, reminder_sent,
        animal_id, animal_client_id, animal_name, animal_si_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serverId,
        clientId,
        serverId,
        row.title,
        row.note,
        row.date,
        row.notification_id,
        row.reminder_sent,
        row.animal_id,
        row.animal_client_id,
        row.animal_name,
        row.animal_si_id,
      ],
    );
    db.execSync("COMMIT");
  } catch (err) {
    db.execSync("ROLLBACK");
    throw err;
  }
}

/** Replace local events with a server snapshot (after a successful outbox drain). */
export function replaceEventsFromServer(events: ApiEvent[]): void {
  const db = getDb();
  db.execSync("BEGIN");
  try {
    db.runSync("DELETE FROM events");
    for (const e of events) {
      db.runSync(
        `INSERT INTO events (
          id, client_id, server_id, title, note, date, notification_id, reminder_sent,
          animal_id, animal_client_id, animal_name, animal_si_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
        [
          e.id,
          `server:${e.id}`,
          e.id,
          e.title,
          e.note,
          e.date,
          e.notificationId,
          e.reminderSent ? 1 : 0,
          e.animalId,
          e.animalName,
          e.animalSiId,
        ],
      );
    }
    db.execSync("COMMIT");
  } catch (err) {
    db.execSync("ROLLBACK");
    throw err;
  }
}
