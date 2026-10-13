import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstAndLastName1791642155733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "firstName" VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "lastName" VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "name" VARCHAR(255)`);
    }

}
