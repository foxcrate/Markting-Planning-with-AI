import { MigrationInterface, QueryRunner } from "typeorm";

export class OnDeleteUserCascadeThreads1712055475188 implements MigrationInterface {
    name = 'OnDeleteUserCascadeThreads1712055475188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP FOREIGN KEY \`FK_256dd2e4946d6768c5583caa072\``);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD CONSTRAINT \`FK_256dd2e4946d6768c5583caa072\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP FOREIGN KEY \`FK_256dd2e4946d6768c5583caa072\``);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD CONSTRAINT \`FK_256dd2e4946d6768c5583caa072\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
