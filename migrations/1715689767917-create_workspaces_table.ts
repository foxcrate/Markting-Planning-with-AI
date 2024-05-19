import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspacesTable1715689767917 implements MigrationInterface {
    name = 'CreateWorkspacesTable1715689767917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`goal\` longtext NULL, \`budget\` varchar(255) NULL, \`targetGroup\` varchar(255) NULL, \`marketingLevel\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD CONSTRAINT \`FK_dc53b3d0b16419a8f5f17458403\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_dc53b3d0b16419a8f5f17458403\``);
        await queryRunner.query(`DROP TABLE \`workspaces\``);
    }

}
