import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToOtpsTable1715293110502 implements MigrationInterface {
    name = 'AddTypeToOtpsTable1715293110502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`finishTemplate\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD \`otpType\` enum ('signin', 'signup', 'social') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` DROP COLUMN \`otpType\``);
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`finishTemplate\``);
    }

}
