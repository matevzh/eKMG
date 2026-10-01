import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1790869824212 implements MigrationInterface {
    name = 'InitialSchema1790869824212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "farms" ("id" SERIAL NOT NULL, "name" character varying, "location" character varying, "kmg_mid" character varying NOT NULL, "province" character varying, "postOffice" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c120554b1d00a9017b61b52bad" UNIQUE ("kmg_mid"), CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "farmId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "animals" ("id" SERIAL NOT NULL, "si_id" character varying NOT NULL, "name" character varying NOT NULL, "breed" character varying, "gender" character varying, "status" character varying, "pregnancyStatus" character varying, "birthCountry" character varying, "lactation" integer, "dateOfBirth" date, "acquisitionDate" date, "dateOfTagging" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fatherId" integer, "motherId" integer, "birthFarmId" integer NOT NULL, CONSTRAINT "UQ_008ee0dddcf13c9b2e519b339f4" UNIQUE ("si_id"), CONSTRAINT "PK_6154c334bbb19186788468bce5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "note" character varying, "date" date NOT NULL, "notificationId" character varying, "reminderSentAt" TIMESTAMP, "animalId" integer, "farmId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "push_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "platform" character varying, "userId" integer NOT NULL, "farmId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_869b4a9ba2c9e030aafc4b7dc7a" UNIQUE ("token"), CONSTRAINT "PK_32734e87f299c29ca3878861f4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_aae180b804ab3b8fd33c745c299" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animals" ADD CONSTRAINT "FK_7c02bdf15369db1743b6d9eef1c" FOREIGN KEY ("birthFarmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_847db4b72d837819ac87cd776e7" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_caff553b8bc4dcf85194a7c8639" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "push_tokens" ADD CONSTRAINT "FK_95b226ff93ba9b9edfd06136be0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_95b226ff93ba9b9edfd06136be0"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_caff553b8bc4dcf85194a7c8639"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_847db4b72d837819ac87cd776e7"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_7c02bdf15369db1743b6d9eef1c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_aae180b804ab3b8fd33c745c299"`);
        await queryRunner.query(`DROP TABLE "push_tokens"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "animals"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "farms"`);
    }

}
