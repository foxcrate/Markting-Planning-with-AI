import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBenchmarksToTacticsTable1716875931349 implements MigrationInterface {
    name = 'AddBenchmarksToTacticsTable1716875931349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD \`benchmarkName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD \`benchmarkNumber\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP COLUMN \`benchmarkNumber\``);
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP COLUMN \`benchmarkName\``);
    }

}
