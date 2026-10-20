import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceAnimalStatusWithStates1792422100000 implements MigrationInterface {
  name = 'ReplaceAnimalStatusWithStates1792422100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animals" ADD COLUMN "isLactating" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD COLUMN "isPregnant" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`
      UPDATE "animals"
      SET
        "isLactating" = COALESCE("status" <> 'presušena', false),
        "isPregnant" = (
          "status" = 'brejost'
          OR LOWER(COALESCE("pregnancyStatus", '')) IN ('brejost', 'breja', 'true', 'yes')
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "isPregnant"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "isLactating"`);
  }
}
