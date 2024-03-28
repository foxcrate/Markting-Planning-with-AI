import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateThreadsTables1711590871368 implements MigrationInterface {
    name = 'CreateThreadsTables1711590871368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`threads\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`threadId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`threadId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_b4de2ead6a8ac64f93103410ef\` (\`threadId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_b4de2ead6a8ac64f93103410ef\` ON \`users\` (\`threadId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_15f9bd2bf472ff12b6ee20012d0\` FOREIGN KEY (\`threadId\`) REFERENCES \`threads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b4de2ead6a8ac64f93103410ef6\` FOREIGN KEY (\`threadId\`) REFERENCES \`threads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b4de2ead6a8ac64f93103410ef6\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_15f9bd2bf472ff12b6ee20012d0\``);
        await queryRunner.query(`DROP INDEX \`REL_b4de2ead6a8ac64f93103410ef\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_b4de2ead6a8ac64f93103410ef\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`threadId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`threadId\``);
        await queryRunner.query(`DROP TABLE \`threads\``);
    }

}
