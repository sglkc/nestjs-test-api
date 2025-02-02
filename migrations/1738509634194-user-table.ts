import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1738509634194 implements MigrationInterface {
    name = 'UserTable1738509634194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_username" ON "user" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_email" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."user_email"`);
        await queryRunner.query(`DROP INDEX "public"."user_username"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
