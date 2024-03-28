import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtAndUpdatedAtToAllTables1711599929013 implements MigrationInterface {
    name = 'AddCreatedAtAndUpdatedAtToAllTables1711599929013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_15f9bd2bf472ff12b6ee20012d0\``);
        await queryRunner.query(`DROP INDEX \`IDX_b4de2ead6a8ac64f93103410ef\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`threads\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_15f9bd2bf472ff12b6ee20012d0\` FOREIGN KEY (\`threadId\`) REFERENCES \`threads\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_15f9bd2bf472ff12b6ee20012d0\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`threads\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b4de2ead6a8ac64f93103410ef\` ON \`users\` (\`threadId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_15f9bd2bf472ff12b6ee20012d0\` FOREIGN KEY (\`threadId\`) REFERENCES \`threads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
