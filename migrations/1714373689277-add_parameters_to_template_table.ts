import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParametersToTemplateTable1714373689277 implements MigrationInterface {
    name = 'AddParametersToTemplateTable1714373689277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`templates\` DROP COLUMN \`flow\``);
        await queryRunner.query(`ALTER TABLE \`templates\` ADD \`openaiAssistantId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`templates\` ADD \`descriptions\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`templates\` ADD \`parameters\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`templates\` DROP COLUMN \`parameters\``);
        await queryRunner.query(`ALTER TABLE \`templates\` DROP COLUMN \`descriptions\``);
        await queryRunner.query(`ALTER TABLE \`templates\` DROP COLUMN \`openaiAssistantId\``);
        await queryRunner.query(`ALTER TABLE \`templates\` ADD \`flow\` longtext NOT NULL`);
    }

}
