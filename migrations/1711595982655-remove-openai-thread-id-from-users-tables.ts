import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOpenaiThreadIdFromUsersTables1711595982655 implements MigrationInterface {
    name = 'RemoveOpenaiThreadIdFromUsersTables1711595982655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`openAiThreadId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`openAiThreadId\` varchar(255) NOT NULL`);
    }

}
