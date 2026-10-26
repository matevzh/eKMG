import { getDb } from "./client";

export type MetaKey = "farm_id" | "last_sync_at" | "sync_error" | "next_local_id" | "syncing";

export function getMeta(key: MetaKey): string | null {
  const row = getDb().getFirstSync<{ value: string | null }>("SELECT value FROM meta WHERE key = ?", [key]);
  return row?.value ?? null;
}

export function setMeta(key: MetaKey, value: string | null): void {
  if (value == null) {
    getDb().runSync("DELETE FROM meta WHERE key = ?", [key]);
    return;
  }
  getDb().runSync(
    `INSERT INTO meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  );
}

/** Allocate the next negative local row id for unsynced creates. */
export function nextLocalId(): number {
  const raw = getMeta("next_local_id");
  const next = raw != null ? Number(raw) : -1;
  setMeta("next_local_id", String(next - 1));
  return next;
}

export function getFarmId(): number | null {
  const raw = getMeta("farm_id");
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function setFarmId(farmId: number): void {
  setMeta("farm_id", String(farmId));
}
