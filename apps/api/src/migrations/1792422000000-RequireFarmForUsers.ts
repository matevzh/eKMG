import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequireFarmForUsers1792422000000 implements MigrationInterface {
  name = 'RequireFarmForUsers1792422000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const result: unknown = await queryRunner.query(
      `SELECT COUNT(*)::int AS count FROM "users" WHERE "farmId" IS NULL`,
    );
    const row: unknown = Array.isArray(result) ? result[0] : undefined;

    if (
      typeof row !== 'object' ||
      row === null ||
      !('count' in row) ||
      typeof row.count !== 'number'
    ) {
      throw new Error('Could not verify that every user has a farm.');
    }

    if (row.count > 0) {
      throw new Error(
        `Cannot require a farm for every user: ${row.count} user(s) have no farm. Assign each to a farm before rerunning this migration.`,
      );
    }

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "farmId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "farmId" DROP NOT NULL`,
    );
  }
}
