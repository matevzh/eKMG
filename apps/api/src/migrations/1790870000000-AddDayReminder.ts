import { MigrationInterface, QueryRunner } from "typeorm";

// Splits the single event reminder into two independently-tracked reminders:
// one week before and one day before the event. The existing "reminderSentAt"
// held the week-before timestamp, so it is renamed rather than dropped — events
// that already got their week reminder won't re-fire it, and their day reminder
// (new column, null) will still fire when due.
export class AddDayReminder1790870000000 implements MigrationInterface {
    name = 'AddDayReminder1790870000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "reminderSentAt" TO "reminderWeekSentAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "reminderDaySentAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "reminderDaySentAt"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "reminderWeekSentAt" TO "reminderSentAt"`);
    }
}
