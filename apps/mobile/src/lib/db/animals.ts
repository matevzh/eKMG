import { breedLabel, type Zival } from "@/constants/data";
import type { ApiAnimal } from "@/lib/api";

import { getDb } from "./client";
import { newClientId } from "./ids";
import { nextLocalId } from "./meta";

export interface AnimalRow {
  id: number;
  client_id: string;
  server_id: number | null;
  si_id: string;
  name: string;
  breed: string | null;
  gender: string | null;
  is_lactating: number;
  is_pregnant: number;
  date_of_birth: string | null;
  acquisition_date: string | null;
  date_of_tagging: string | null;
  lactation: number | null;
}

export interface LocalAnimalCreate {
  name: string;
  si_id: string;
  breed?: string;
  gender?: string;
  isLactating: boolean;
  isPregnant: boolean;
  dateOfBirth?: string;
  acquisitionDate?: string;
  dateOfTagging?: string;
  lactation?: number;
}

function rowToZival(row: AnimalRow): Zival {
  return {
    id: row.id,
    si_id: row.si_id,
    ime: row.name,
    pasma: row.breed ? breedLabel(row.breed) : "—",
    isLactating: !!row.is_lactating,
    isPregnant: !!row.is_pregnant,
    datum_rojstva: row.date_of_birth ?? "—",
    laktacija: row.lactation ?? 0,
  };
}

export function listAnimalsLocal(): Zival[] {
  const rows = getDb().getAllSync<AnimalRow>("SELECT * FROM animals ORDER BY name COLLATE NOCASE ASC");
  return rows.map(rowToZival);
}

export function getAnimalById(id: number): AnimalRow | null {
  return getDb().getFirstSync<AnimalRow>("SELECT * FROM animals WHERE id = ?", [id]) ?? null;
}

export function getAnimalByClientId(clientId: string): AnimalRow | null {
  return getDb().getFirstSync<AnimalRow>("SELECT * FROM animals WHERE client_id = ?", [clientId]) ?? null;
}

export function insertPendingAnimal(input: LocalAnimalCreate): { zival: Zival; clientId: string; localId: number } {
  const localId = nextLocalId();
  const clientId = newClientId();
  getDb().runSync(
    `INSERT INTO animals (
      id, client_id, server_id, si_id, name, breed, gender,
      is_lactating, is_pregnant, date_of_birth, acquisition_date, date_of_tagging, lactation
    ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      localId,
      clientId,
      input.si_id,
      input.name,
      input.breed ?? null,
      input.gender ?? null,
      input.isLactating ? 1 : 0,
      input.isPregnant ? 1 : 0,
      input.dateOfBirth ?? null,
      input.acquisitionDate ?? null,
      input.dateOfTagging ?? null,
      input.lactation ?? null,
    ],
  );
  return { zival: rowToZival(getAnimalById(localId)!), clientId, localId };
}

export function updateAnimalLocal(
  id: number,
  state: Partial<{ isLactating: boolean; isPregnant: boolean }>,
): Zival | null {
  const existing = getAnimalById(id);
  if (!existing) return null;
  const isLactating = state.isLactating ?? !!existing.is_lactating;
  const isPregnant = state.isPregnant ?? !!existing.is_pregnant;
  getDb().runSync("UPDATE animals SET is_lactating = ?, is_pregnant = ? WHERE id = ?", [
    isLactating ? 1 : 0,
    isPregnant ? 1 : 0,
    id,
  ]);
  return rowToZival(getAnimalById(id)!);
}

export function deleteAnimalLocal(id: number): void {
  getDb().runSync("DELETE FROM animals WHERE id = ?", [id]);
}

/** After a successful create, bind the local row to the server id and rewrite event FKs. */
export function bindAnimalServerId(clientId: string, serverId: number): void {
  const row = getAnimalByClientId(clientId);
  if (!row) return;
  if (row.id === serverId && row.server_id === serverId) return;

  const oldId = row.id;
  const db = getDb();
  db.execSync("BEGIN");
  try {
    db.runSync("UPDATE events SET animal_id = ? WHERE animal_id = ?", [serverId, oldId]);
    // Rewrite PK via delete+insert (SQLite is awkward about in-place PK updates).
    db.runSync("DELETE FROM animals WHERE client_id = ?", [clientId]);
    db.runSync(
      `INSERT INTO animals (
        id, client_id, server_id, si_id, name, breed, gender,
        is_lactating, is_pregnant, date_of_birth, acquisition_date, date_of_tagging, lactation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serverId,
        clientId,
        serverId,
        row.si_id,
        row.name,
        row.breed,
        row.gender,
        row.is_lactating,
        row.is_pregnant,
        row.date_of_birth,
        row.acquisition_date,
        row.date_of_tagging,
        row.lactation,
      ],
    );
    db.execSync("COMMIT");
  } catch (err) {
    db.execSync("ROLLBACK");
    throw err;
  }
}

/** Replace the local herd with a server snapshot (after a successful outbox drain). */
export function replaceAnimalsFromServer(animals: ApiAnimal[]): void {
  const db = getDb();
  db.execSync("BEGIN");
  try {
    db.runSync("DELETE FROM animals");
    for (const a of animals) {
      db.runSync(
        `INSERT INTO animals (
          id, client_id, server_id, si_id, name, breed, gender,
          is_lactating, is_pregnant, date_of_birth, acquisition_date, date_of_tagging, lactation
        ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, NULL, NULL, ?)`,
        [
          a.id,
          `server:${a.id}`,
          a.id,
          a.si_id,
          a.name,
          a.breed,
          a.isLactating ? 1 : 0,
          a.isPregnant ? 1 : 0,
          a.dateOfBirth,
          a.lactation,
        ],
      );
    }
    db.execSync("COMMIT");
  } catch (err) {
    db.execSync("ROLLBACK");
    throw err;
  }
}
