import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTemplateFlowsTable1713357001028 implements MigrationInterface {
    name = 'CreateUserTemplateFlowsTable1713357001028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_template_flows\` (\`id\` int NOT NULL AUTO_INCREMENT, \`current_step\` int NOT NULL, \`lastSummarization\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`templateId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`userTemplateFlowId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1dbe92b2d2e5b53853f953cb716\` FOREIGN KEY (\`userTemplateFlowId\`) REFERENCES \`user_template_flows\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_template_flows\` ADD CONSTRAINT \`FK_7a286f2eaf98ee86c9456fcca97\` FOREIGN KEY (\`templateId\`) REFERENCES \`templates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_template_flows\` ADD CONSTRAINT \`FK_56ab70261e360eb1be2ecef4392\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_template_flows\` DROP FOREIGN KEY \`FK_56ab70261e360eb1be2ecef4392\``);
        await queryRunner.query(`ALTER TABLE \`user_template_flows\` DROP FOREIGN KEY \`FK_7a286f2eaf98ee86c9456fcca97\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1dbe92b2d2e5b53853f953cb716\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`userTemplateFlowId\``);
        await queryRunner.query(`DROP TABLE \`user_template_flows\``);
    }

}
