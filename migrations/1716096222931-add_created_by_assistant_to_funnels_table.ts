import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByAssistantToFunnelsTable1716096222931 implements MigrationInterface {
    name = 'AddCreatedByAssistantToFunnelsTable1716096222931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` DROP COLUMN \`otpType\``);
        await queryRunner.query(`ALTER TABLE \`funnels\` ADD \`createdByAssistant\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funnels\` DROP COLUMN \`createdByAssistant\``);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD \`otpType\` enum ('signin', 'signup', 'social') NULL`);
    }

}
