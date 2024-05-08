import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionToTemplateTable1714375134857 implements MigrationInterface {
    name = 'AddDescriptionToTemplateTable1714375134857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`templates\` CHANGE \`descriptions\` \`description\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`templates\` CHANGE \`description\` \`descriptions\` longtext NOT NULL`);
    }

}
