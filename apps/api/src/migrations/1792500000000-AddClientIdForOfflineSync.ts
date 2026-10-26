import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientIdForOfflineSync1792500000000 implements MigrationInterface {
  name = 'AddClientIdForOfflineSync1792500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD COLUMN "clientId" character varying`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_events_farm_clientId" ON "events" ("farmId", "clientId") WHERE "clientId" IS NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "animals" ADD COLUMN "clientId" character varying`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_animals_farm_clientId" ON "animals" ("birthFarmId", "clientId") WHERE "clientId" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_animals_farm_clientId"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "clientId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_events_farm_clientId"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "clientId"`);
  }
}
