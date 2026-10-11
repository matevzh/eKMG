import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstAndLastName1791642155733 implements MigrationInterface {

    //TODO: RUN THE MIGRATION AFTER THE NEXT DEPLOYMENT TO ADD FIRST AND LAST NAME COLUMNS TO THE USER TABLE

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "firstName" VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "lastName" VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "name" VARCHAR(255)`);
    }

}
