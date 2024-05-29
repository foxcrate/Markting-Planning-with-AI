import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTitleToNameInTacticStepTable1716470480797 implements MigrationInterface {
    name = 'RenameTitleToNameInTacticStepTable1716470480797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactic_step\` CHANGE \`title\` \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactic_step\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` CHANGE \`name\` \`title\` varchar(255) NOT NULL`);
    }

}
