import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGlobalStagesTable1716375964400 implements MigrationInterface {
    name = 'CreateGlobalStagesTable1716375964400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tactics\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`globalStageId\` int NULL, UNIQUE INDEX \`IDX_64bf93727cacd0bc795175392f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`global_stages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b3360fd368b80d1b65c19ed1ca\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD CONSTRAINT \`FK_ac598245979a228a3a65e7977a2\` FOREIGN KEY (\`globalStageId\`) REFERENCES \`global_stages\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP FOREIGN KEY \`FK_ac598245979a228a3a65e7977a2\``);
        await queryRunner.query(`DROP INDEX \`IDX_b3360fd368b80d1b65c19ed1ca\` ON \`global_stages\``);
        await queryRunner.query(`DROP TABLE \`global_stages\``);
        await queryRunner.query(`DROP INDEX \`IDX_64bf93727cacd0bc795175392f\` ON \`tactics\``);
        await queryRunner.query(`DROP TABLE \`tactics\``);
    }

}
