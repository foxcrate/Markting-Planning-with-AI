import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneVerifiedToUsers1712544465427 implements MigrationInterface {
    name = 'AddPhoneVerifiedToUsers1712544465427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`emailVerified\` \`phoneVerified\` tinyint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phoneVerified\` \`emailVerified\` tinyint NOT NULL DEFAULT '0'`);
    }

}
