import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOpenAiIdToThreadsTables1711591633231 implements MigrationInterface {
    name = 'AddOpenAiIdToThreadsTables1711591633231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b4de2ead6a8ac64f93103410ef\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`openAiId\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`openAiId\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b4de2ead6a8ac64f93103410ef\` ON \`users\` (\`threadId\`)`);
    }

}
