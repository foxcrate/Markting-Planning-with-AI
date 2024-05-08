import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSenderEnumInMessagesTable1714285647199 implements MigrationInterface {
    name = 'ChangeSenderEnumInMessagesTable1714285647199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`senderRole\` \`senderRole\` enum ('user', 'assistant') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`senderRole\` \`senderRole\` enum ('user', 'ai') NULL`);
    }

}
