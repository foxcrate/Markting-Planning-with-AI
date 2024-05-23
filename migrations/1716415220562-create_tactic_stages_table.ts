import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTacticStagesTable1716415220562 implements MigrationInterface {
    name = 'CreateTacticStagesTable1716415220562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactic_step\` DROP FOREIGN KEY \`FK_2e132d65787b1660e7ac760ae4b\``);
        await queryRunner.query(`DROP INDEX \`IDX_d75da5a01f0518b5c4dc9cd0e5\` ON \`tactic_step\``);
        await queryRunner.query(`CREATE TABLE \`tactics_stages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`tacticId\` int NULL, \`stageId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` ADD CONSTRAINT \`FK_6f77646028e3600996c10d5b89a\` FOREIGN KEY (\`tacticId\`) REFERENCES \`tactics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tactics_stages\` ADD CONSTRAINT \`FK_39b9dd8dc0f3a90fa60e857032f\` FOREIGN KEY (\`tacticId\`) REFERENCES \`tactics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tactics_stages\` ADD CONSTRAINT \`FK_5cca96d95224bbb0261f7cb811f\` FOREIGN KEY (\`stageId\`) REFERENCES \`stages\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics_stages\` DROP FOREIGN KEY \`FK_5cca96d95224bbb0261f7cb811f\``);
        await queryRunner.query(`ALTER TABLE \`tactics_stages\` DROP FOREIGN KEY \`FK_39b9dd8dc0f3a90fa60e857032f\``);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` DROP FOREIGN KEY \`FK_6f77646028e3600996c10d5b89a\``);
        await queryRunner.query(`DROP TABLE \`tactics_stages\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d75da5a01f0518b5c4dc9cd0e5\` ON \`tactic_step\` (\`title\`)`);
        await queryRunner.query(`ALTER TABLE \`tactic_step\` ADD CONSTRAINT \`FK_2e132d65787b1660e7ac760ae4b\` FOREIGN KEY (\`tacticId\`) REFERENCES \`tactics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
