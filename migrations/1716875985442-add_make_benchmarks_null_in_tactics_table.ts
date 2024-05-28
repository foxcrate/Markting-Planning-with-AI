import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMakeBenchmarksNullInTacticsTable1716875985442 implements MigrationInterface {
    name = 'AddMakeBenchmarksNullInTacticsTable1716875985442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` CHANGE \`benchmarkName\` \`benchmarkName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tactics\` CHANGE \`benchmarkNumber\` \`benchmarkNumber\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` CHANGE \`benchmarkNumber\` \`benchmarkNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tactics\` CHANGE \`benchmarkName\` \`benchmarkName\` varchar(255) NOT NULL`);
    }

}
