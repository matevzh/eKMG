import type { SQLiteDatabase } from "expo-sqlite";

const MIGRATIONS: { version: number; sql: string }[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY NOT NULL,
        client_id TEXT NOT NULL UNIQUE,
        server_id INTEGER,
        si_id TEXT NOT NULL,
        name TEXT NOT NULL,
        breed TEXT,
        gender TEXT,
        is_lactating INTEGER NOT NULL DEFAULT 0,
        is_pregnant INTEGER NOT NULL DEFAULT 0,
        date_of_birth TEXT,
        acquisition_date TEXT,
        date_of_tagging TEXT,
        lactation INTEGER
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY NOT NULL,
        client_id TEXT NOT NULL UNIQUE,
        server_id INTEGER,
        title TEXT NOT NULL,
        note TEXT,
        date TEXT NOT NULL,
        notification_id TEXT,
        reminder_sent INTEGER NOT NULL DEFAULT 0,
        animal_id INTEGER,
        animal_client_id TEXT,
        animal_name TEXT,
        animal_si_id TEXT
      );

      CREATE TABLE IF NOT EXISTS outbox (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        op TEXT NOT NULL,
        payload TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );
    `,
  },
  {
    version: 2,
    sql: `
      ALTER TABLE animals ADD COLUMN father_id INTEGER;
      ALTER TABLE animals ADD COLUMN mother_id INTEGER;
    `,
  },
  {
    version: 3,
    sql: `
      ALTER TABLE animals DROP COLUMN date_of_tagging;
    `,
  },
  {
    version: 4,
    sql: `
      ALTER TABLE events ADD COLUMN reminder_date TEXT;
      UPDATE events SET reminder_date = date WHERE reminder_date IS NULL;
    `,
  },
];

export function runMigrations(db: SQLiteDatabase): void {
  const row = db.getFirstSync<{ user_version: number }>("PRAGMA user_version");
  let version = row?.user_version ?? 0;

  for (const migration of MIGRATIONS) {
    if (migration.version <= version) continue;
    db.execSync("BEGIN");
    try {
      db.execSync(migration.sql);
      db.execSync(`PRAGMA user_version = ${migration.version}`);
      db.execSync("COMMIT");
      version = migration.version;
    } catch (err) {
      db.execSync("ROLLBACK");
      throw err;
    }
  }
}
