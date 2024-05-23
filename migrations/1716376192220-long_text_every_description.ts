import { MigrationInterface, QueryRunner } from "typeorm";

export class LongTextEveryDescription1716376192220 implements MigrationInterface {
    name = 'LongTextEveryDescription1716376192220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stages\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`stages\` ADD \`description\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`funnels\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`funnels\` ADD \`description\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD \`description\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`global_stages\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`global_stages\` ADD \`description\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`global_stages\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`global_stages\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`funnels\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`funnels\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`stages\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`stages\` ADD \`description\` varchar(255) NOT NULL`);
    }

}
