import { MigrationInterface, QueryRunner } from "typeorm";

export class NullablePhoneNumberInUsersTable1710924150415 implements MigrationInterface {
    name = 'NullablePhoneNumberInUsersTable1710924150415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phoneNumber\` \`phoneNumber\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phoneNumber\` \`phoneNumber\` varchar(255) NOT NULL`);
    }

}
