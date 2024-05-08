import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTemplatesTable1713351299847 implements MigrationInterface {
    name = 'CreateTemplatesTable1713351299847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`templates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('onboarding', 'funnel', 'tactic', 'custom') NOT NULL DEFAULT 'custom', \`name\` varchar(255) NOT NULL, \`flow\` longtext NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`templates\``);
    }

}
