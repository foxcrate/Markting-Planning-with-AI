import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFunnelsTableTable1711833243420 implements MigrationInterface {
    name = 'CreateFunnelsTableTable1711833243420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`funnels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`funnels\` ADD CONSTRAINT \`FK_de94f14b3b7bcb94ce3445c8fd8\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funnels\` DROP FOREIGN KEY \`FK_de94f14b3b7bcb94ce3445c8fd8\``);
        await queryRunner.query(`DROP TABLE \`funnels\``);
    }

}
