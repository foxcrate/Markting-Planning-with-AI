import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeOfContentColumnInMessagesTable1713815877960 implements MigrationInterface {
    name = 'ChangeTypeOfContentColumnInMessagesTable1713815877960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`content\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`content\` varchar(255) NOT NULL`);
    }

}
