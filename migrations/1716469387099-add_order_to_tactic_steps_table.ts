import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderToTacticStepsTable1716469387099 implements MigrationInterface {
    name = 'AddOrderToTacticStepsTable1716469387099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactic_step\` ADD \`order\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactic_step\` DROP COLUMN \`order\``);
    }

}
