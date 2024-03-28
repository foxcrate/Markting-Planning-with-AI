import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThreadIdToUsersTables1711598937529 implements MigrationInterface {
    name = 'AddThreadIdToUsersTables1711598937529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threads\` DROP FOREIGN KEY \`FK_256dd2e4946d6768c5583caa072\``);
        await queryRunner.query(`DROP INDEX \`IDX_256dd2e4946d6768c5583caa07\` ON \`threads\``);
        await queryRunner.query(`DROP INDEX \`REL_256dd2e4946d6768c5583caa07\` ON \`threads\``);
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`threadId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_b4de2ead6a8ac64f93103410ef\` (\`threadId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_b4de2ead6a8ac64f93103410ef\` ON \`users\` (\`threadId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b4de2ead6a8ac64f93103410ef6\` FOREIGN KEY (\`threadId\`) REFERENCES \`threads\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b4de2ead6a8ac64f93103410ef6\``);
        await queryRunner.query(`DROP INDEX \`REL_b4de2ead6a8ac64f93103410ef\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_b4de2ead6a8ac64f93103410ef\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`threadId\``);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`userId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_256dd2e4946d6768c5583caa07\` ON \`threads\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_256dd2e4946d6768c5583caa07\` ON \`threads\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD CONSTRAINT \`FK_256dd2e4946d6768c5583caa072\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
