import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForgetPasswordToUsersTable1711392359379 implements MigrationInterface {
    name = 'AddForgetPasswordToUsersTable1711392359379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`forgetPasswordOtp\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`forgetPasswordOtp\``);
    }

}
