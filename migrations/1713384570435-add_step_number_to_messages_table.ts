import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStepNumberToMessagesTable1713384570435 implements MigrationInterface {
    name = 'AddStepNumberToMessagesTable1713384570435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`templateFlowStepNumber\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`templateFlowStepNumber\``);
    }

}
