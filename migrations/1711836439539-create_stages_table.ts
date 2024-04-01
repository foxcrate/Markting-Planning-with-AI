import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStagesTable1711836439539 implements MigrationInterface {
    name = 'CreateStagesTable1711836439539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`stages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`funnelId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`stages\` ADD CONSTRAINT \`FK_ab66efa0d88b380cbcdaa6fbbf6\` FOREIGN KEY (\`funnelId\`) REFERENCES \`funnels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stages\` DROP FOREIGN KEY \`FK_ab66efa0d88b380cbcdaa6fbbf6\``);
        await queryRunner.query(`DROP TABLE \`stages\``);
    }

}
