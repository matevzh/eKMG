import * as api from "./api";

// UI shape for a calendar event (opravilo), mapped from the backend event.
export interface Opravilo {
  id: number;
  naslov: string;
  opomba?: string;
  datum: string; // "YYYY-MM-DD"
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
  notificationId: string | null;
  zivalId?: number | null;
}

function toOpravilo(e: api.ApiEvent): Opravilo {
  return {
    id: e.id,
    naslov: e.title,
    opomba: e.note ?? undefined,
    datum: e.date,
    notificationId: e.notificationId,
    reminderSent: e.reminderSent,
    zivalId: e.animalId,
    zivalIme: e.animalName,
    zivalSiId: e.animalSiId,
  };
}

export async function loadOpravila(token: string): Promise<Opravilo[]> {
  const events = await api.getEvents(token);
  return events.map(toOpravilo);
}

export async function createOpravilo(token: string, input: NewOpravilo): Promise<Opravilo> {
  const created = await api.createEvent(token, {
    title: input.naslov,
    note: input.opomba,
    date: input.datum,
    notificationId: input.notificationId,
    animalId: input.zivalId ?? null,
  });
  return toOpravilo(created);
}

export async function deleteOpravilo(token: string, id: number): Promise<void> {
  await api.deleteEvent(token, id);
}
