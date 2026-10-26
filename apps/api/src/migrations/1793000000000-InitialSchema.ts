import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Squashed schema for a fresh database (current entity model).
 * Replaces the previous incremental migration chain after resetting hosted Postgres.
 */
export class InitialSchema1793000000000 implements MigrationInterface {
  name = "InitialSchema1793000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "farms" (
        "id" SERIAL NOT NULL,
        "name" character varying,
        "location" character varying,
        "kmg_mid" character varying NOT NULL,
        "province" character varying,
        "postOffice" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_farms_kmg_mid" UNIQUE ("kmg_mid"),
        CONSTRAINT "PK_farms" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "consentAcceptedAt" TIMESTAMP,
        "consentVersion" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "farmId" integer NOT NULL,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "animals" (
        "id" SERIAL NOT NULL,
        "si_id" character varying NOT NULL,
        "clientId" character varying,
        "name" character varying NOT NULL,
        "breed" character varying,
        "gender" character varying,
        "isLactating" boolean NOT NULL DEFAULT false,
        "isPregnant" boolean NOT NULL DEFAULT false,
        "birthCountry" character varying,
        "lactation" integer,
        "dateOfBirth" date,
        "acquisitionDate" date,
        "dateOfTagging" date,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "fatherId" integer,
        "motherId" integer,
        "birthFarmId" integer NOT NULL,
        CONSTRAINT "UQ_animals_si_id" UNIQUE ("si_id"),
        CONSTRAINT "PK_animals" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "clientId" character varying,
        "note" character varying,
        "date" date NOT NULL,
        "notificationId" character varying,
        "reminderWeekSentAt" TIMESTAMP,
        "reminderDaySentAt" TIMESTAMP,
        "animalId" integer,
        "farmId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "push_tokens" (
        "id" SERIAL NOT NULL,
        "token" character varying NOT NULL,
        "platform" character varying,
        "userId" integer NOT NULL,
        "farmId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_push_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_push_tokens" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_animals_farm_clientId" ON "animals" ("birthFarmId", "clientId") WHERE "clientId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_events_farm_clientId" ON "events" ("farmId", "clientId") WHERE "clientId" IS NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_farmId" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "animals" ADD CONSTRAINT "FK_animals_birthFarmId" FOREIGN KEY ("birthFarmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_events_animalId" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_events_farmId" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "push_tokens" ADD CONSTRAINT "FK_push_tokens_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "push_tokens" ADD CONSTRAINT "FK_push_tokens_farmId" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_push_tokens_farmId"`);
    await queryRunner.query(`ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_push_tokens_userId"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_events_farmId"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_events_animalId"`);
    await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_animals_birthFarmId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_farmId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_events_farm_clientId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_animals_farm_clientId"`);
    await queryRunner.query(`DROP TABLE "push_tokens"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "animals"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "farms"`);
  }
}
