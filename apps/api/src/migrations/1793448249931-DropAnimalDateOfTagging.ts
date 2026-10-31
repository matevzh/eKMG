import { MigrationInterface, QueryRunner } from "typeorm";

export class DropAnimalDateOfTagging1793448249931 implements MigrationInterface {
  name = "DropAnimalDateOfTagging1793448249931";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN IF EXISTS "dateOfTagging"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" ADD COLUMN "dateOfTagging" date`);
  }
}
