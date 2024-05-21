import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderToStagesTable1716248305379 implements MigrationInterface {
    name = 'AddOrderToStagesTable1716248305379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stages\` ADD \`order\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stages\` DROP COLUMN \`order\``);
    }

}
