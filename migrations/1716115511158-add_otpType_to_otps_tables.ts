import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpTypeToOtpsTables1716115511158 implements MigrationInterface {
    name = 'AddOtpTypeToOtpsTables1716115511158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` ADD \`otpType\` enum ('signin', 'signup', 'social') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` DROP COLUMN \`otpType\``);
    }

}
