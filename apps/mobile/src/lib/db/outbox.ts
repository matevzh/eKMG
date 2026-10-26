import { getDb } from "./client";

export type OutboxOp =
  | "animal.create"
  | "animal.patch"
  | "animal.delete"
  | "event.create"
  | "event.delete";

export interface OutboxRow {
  id: number;
  created_at: string;
  op: OutboxOp;
  payload: Record<string, unknown>;
}

export function enqueueOutbox(op: OutboxOp, payload: Record<string, unknown>): number {
  const result = getDb().runSync(
    "INSERT INTO outbox (created_at, op, payload) VALUES (?, ?, ?)",
    [new Date().toISOString(), op, JSON.stringify(payload)],
  );
  return Number(result.lastInsertRowId);
}

export function listOutbox(): OutboxRow[] {
  const rows = getDb().getAllSync<{ id: number; created_at: string; op: string; payload: string }>(
    "SELECT id, created_at, op, payload FROM outbox ORDER BY id ASC",
  );
  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    op: r.op as OutboxOp,
    payload: JSON.parse(r.payload) as Record<string, unknown>,
  }));
}

export function deleteOutbox(id: number): void {
  getDb().runSync("DELETE FROM outbox WHERE id = ?", [id]);
}

export function deleteOutboxMatching(op: OutboxOp, predicate: (payload: Record<string, unknown>) => boolean): void {
  const rows = listOutbox().filter((r) => r.op === op && predicate(r.payload));
  for (const row of rows) deleteOutbox(row.id);
}

export function outboxCount(): number {
  const row = getDb().getFirstSync<{ n: number }>("SELECT COUNT(*) AS n FROM outbox");
  return row?.n ?? 0;
}
