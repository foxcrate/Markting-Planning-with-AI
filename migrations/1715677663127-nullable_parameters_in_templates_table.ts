import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableParametersInTemplatesTable1715677663127 implements MigrationInterface {
    name = 'NullableParametersInTemplatesTable1715677663127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`templates\` CHANGE \`parameters\` \`parameters\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`templates\` CHANGE \`parameters\` \`parameters\` longtext NOT NULL`);
    }

}
