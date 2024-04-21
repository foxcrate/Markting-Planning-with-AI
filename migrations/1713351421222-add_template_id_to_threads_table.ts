import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplateIdToThreadsTable1713351421222 implements MigrationInterface {
    name = 'AddTemplateIdToThreadsTable1713351421222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`templateId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD CONSTRAINT \`FK_e0a288c44536234d56bc1887dec\` FOREIGN KEY (\`templateId\`) REFERENCES \`templates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP FOREIGN KEY \`FK_e0a288c44536234d56bc1887dec\``);
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`templateId\``);
    }

}
