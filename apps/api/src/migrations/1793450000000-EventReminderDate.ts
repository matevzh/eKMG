import { MigrationInterface, QueryRunner } from "typeorm";

export class EventReminderDate1793450000000 implements MigrationInterface {
  name = "EventReminderDate1793450000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "reminderDate" date`);
    await queryRunner.query(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMP`);

    // Existing rows: target the event day; mark sent if either legacy slot was handled.
    await queryRunner.query(`
      UPDATE "events"
      SET "reminderDate" = "date"
      WHERE "reminderDate" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "events"
      SET "reminderSentAt" = COALESCE("reminderDaySentAt", "reminderWeekSentAt")
      WHERE "reminderSentAt" IS NULL
        AND ("reminderDaySentAt" IS NOT NULL OR "reminderWeekSentAt" IS NOT NULL)
    `);

    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN IF EXISTS "reminderWeekSentAt"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN IF EXISTS "reminderDaySentAt"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "reminderWeekSentAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "reminderDaySentAt" TIMESTAMP`);
    await queryRunner.query(`
      UPDATE "events"
      SET "reminderDaySentAt" = "reminderSentAt"
      WHERE "reminderSentAt" IS NOT NULL
    `);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN IF EXISTS "reminderSentAt"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN IF EXISTS "reminderDate"`);
  }
}
