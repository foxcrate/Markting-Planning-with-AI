import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrivateToTacticsTable1716789728157 implements MigrationInterface {
    name = 'AddPrivateToTacticsTable1716789728157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD \`private\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP COLUMN \`private\``);
    }

}
