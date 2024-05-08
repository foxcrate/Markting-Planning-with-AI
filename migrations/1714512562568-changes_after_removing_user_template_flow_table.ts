import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesAfterRemovingUserTemplateFlowTable1714512562568 implements MigrationInterface {
    name = 'ChangesAfterRemovingUserTemplateFlowTable1714512562568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`templateFlowStepNumber\``);
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`currentTemplateFlowStep\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`currentTemplateFlowStep\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`templateFlowStepNumber\` int NULL`);
    }

}
