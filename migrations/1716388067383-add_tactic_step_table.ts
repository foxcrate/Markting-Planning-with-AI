import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTacticStepTable1716388067383 implements MigrationInterface {
  name = 'AddTacticStepTable1716388067383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tactic_step\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`tacticId\` int NULL, UNIQUE INDEX \`IDX_d75da5a01f0518b5c4dc9cd0e5\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tactic_step\` ADD CONSTRAINT \`FK_2e132d65787b1660e7ac760ae4b\` FOREIGN KEY (\`tacticId\`) REFERENCES \`tactics\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tactic_step\` DROP FOREIGN KEY \`FK_2e132d65787b1660e7ac760ae4b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d75da5a01f0518b5c4dc9cd0e5\` ON \`tactic_step\``,
    );
    await queryRunner.query(`DROP TABLE \`tactic_step\``);
  }
}
