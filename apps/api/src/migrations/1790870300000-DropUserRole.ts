import { MigrationInterface, QueryRunner } from "typeorm";

// Removes the users.role column. The Lastnik/Član distinction was dropped from
// the app — farms here aren't business/ownership oriented — so the role is no
// longer collected or shown anywhere.
export class DropUserRole1790870300000 implements MigrationInterface {
    name = 'DropUserRole1790870300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore as NOT NULL with a default so existing rows remain valid.
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'Lastnik'`);
    }
}
