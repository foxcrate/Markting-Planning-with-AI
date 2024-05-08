import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserTemplateFlowTable1714510879903 implements MigrationInterface {
    name = 'RemoveUserTemplateFlowTable1714510879903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1dbe92b2d2e5b53853f953cb716\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`userTemplateFlowId\``);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`finishTemplate\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`finishTemplate\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`userTemplateFlowId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1dbe92b2d2e5b53853f953cb716\` FOREIGN KEY (\`userTemplateFlowId\`) REFERENCES \`user_template_flows\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
