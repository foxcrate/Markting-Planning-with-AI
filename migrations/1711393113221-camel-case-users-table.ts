import { MigrationInterface, QueryRunner } from "typeorm";

export class CamelCaseUsersTable1711393113221 implements MigrationInterface {
    name = 'CamelCaseUsersTable1711393113221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstname\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastname\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`google_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`facebook_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`firstName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`googleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`facebookId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`facebookId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`googleId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`facebook_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`google_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastname\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`firstname\` varchar(255) NOT NULL`);
    }

}
