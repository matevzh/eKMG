import { MigrationInterface, QueryRunner } from "typeorm";

// Makes push_tokens.farmId a real foreign key (it was a bare integer column).
// Any pre-existing token whose farmId points at a farm that no longer exists
// would violate the new constraint, so those orphans are deleted first. The
// ON DELETE CASCADE then keeps tokens tied to the lifetime of their farm.
export class PushTokenFarmFk1790870100000 implements MigrationInterface {
    name = 'PushTokenFarmFk1790870100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "push_tokens" WHERE "farmId" NOT IN (SELECT "id" FROM "farms")`);
        await queryRunner.query(`ALTER TABLE "push_tokens" ADD CONSTRAINT "FK_push_tokens_farmId" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_push_tokens_farmId"`);
    }
}
