import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerifiedInUsersTable1711006709719 implements MigrationInterface {
    name = 'AddEmailVerifiedInUsersTable1711006709719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`emailVerified\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`emailVerified\``);
    }

}
