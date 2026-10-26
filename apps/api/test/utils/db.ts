import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";

/** Wipe farm-scoped tables between e2e cases (FK-safe order). */
export async function truncateAll(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(`
    TRUNCATE TABLE
      "events",
      "animals",
      "push_tokens",
      "users",
      "farms"
    RESTART IDENTITY CASCADE
  `);
}
