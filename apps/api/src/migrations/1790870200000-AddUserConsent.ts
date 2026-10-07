import { MigrationInterface, QueryRunner } from "typeorm";

// Adds GDPR consent columns to users: when the user accepted the Terms/Privacy
// texts and which version. Existing rows stay NULL (they predate consent
// capture); every new registration sets both.
export class AddUserConsent1790870200000 implements MigrationInterface {
    name = 'AddUserConsent1790870200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "consentAcceptedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "consentVersion" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "consentVersion"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "consentAcceptedAt"`);
    }
}
