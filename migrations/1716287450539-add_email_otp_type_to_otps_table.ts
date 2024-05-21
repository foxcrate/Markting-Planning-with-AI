import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailOtpTypeToOtpsTable1716287450539 implements MigrationInterface {
    name = 'AddEmailOtpTypeToOtpsTable1716287450539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` CHANGE \`otpType\` \`otpType\` enum ('signin', 'signup', 'social', 'email') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` CHANGE \`otpType\` \`otpType\` enum ('signin', 'signup', 'social') NULL`);
    }

}
