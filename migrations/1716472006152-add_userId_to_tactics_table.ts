import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToTacticsTable1716472006152 implements MigrationInterface {
    name = 'AddUserIdToTacticsTable1716472006152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tactics\` ADD CONSTRAINT \`FK_349d1fc39ccd6c58e6479139d79\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP FOREIGN KEY \`FK_349d1fc39ccd6c58e6479139d79\``);
        await queryRunner.query(`ALTER TABLE \`tactics\` DROP COLUMN \`userId\``);
    }

}
