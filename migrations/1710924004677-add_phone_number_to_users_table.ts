import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberToUsersTable1710924004677 implements MigrationInterface {
    name = 'AddPhoneNumberToUsersTable1710924004677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNumber\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNumber\``);
    }

}
