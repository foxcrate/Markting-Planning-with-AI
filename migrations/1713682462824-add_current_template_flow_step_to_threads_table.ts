import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrentTemplateFlowStepToThreadsTable1713682462824 implements MigrationInterface {
    name = 'AddCurrentTemplateFlowStepToThreadsTable1713682462824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`currentTemplateFlowStep\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`currentTemplateFlowStep\``);
    }

}
