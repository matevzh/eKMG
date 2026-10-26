import * as SQLite from "expo-sqlite";

import { runMigrations } from "./migrations";

let db: SQLite.SQLiteDatabase | null = null;

/** Open (or return) the app SQLite DB and apply pending migrations. */
export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync("krave.db");
    runMigrations(db);
  }
  return db;
}

/** Drop herd/calendar/outbox data (e.g. on sign-out or farm change). */
export function wipeLocalData(): void {
  const database = getDb();
  database.execSync(`
    DELETE FROM animals;
    DELETE FROM events;
    DELETE FROM outbox;
    DELETE FROM meta;
  `);
}
