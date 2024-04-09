import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpColumnToOtpsTable1712631661412 implements MigrationInterface {
    name = 'AddOtpColumnToOtpsTable1712631661412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` ADD \`otp\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` DROP COLUMN \`otp\``);
    }

}
