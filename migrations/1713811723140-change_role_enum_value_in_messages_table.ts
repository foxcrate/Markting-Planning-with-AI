import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRoleEnumValueInMessagesTable1713811723140 implements MigrationInterface {
    name = 'ChangeRoleEnumValueInMessagesTable1713811723140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`senderRole\` \`senderRole\` enum ('user', 'ai') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`senderRole\` \`senderRole\` enum ('user', 'openAi') NULL`);
    }

}
