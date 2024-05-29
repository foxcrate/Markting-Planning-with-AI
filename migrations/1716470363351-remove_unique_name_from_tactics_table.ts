import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueNameFromTacticsTable1716470363351 implements MigrationInterface {
    name = 'RemoveUniqueNameFromTacticsTable1716470363351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_64bf93727cacd0bc795175392f\` ON \`tactics\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_64bf93727cacd0bc795175392f\` ON \`tactics\` (\`name\`)`);
    }

}
