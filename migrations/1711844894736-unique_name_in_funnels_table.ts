import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueNameInFunnelsTable1711844894736 implements MigrationInterface {
    name = 'UniqueNameInFunnelsTable1711844894736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funnels\` ADD UNIQUE INDEX \`IDX_19e950e4a945bf2bbba04a1302\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`funnels\` DROP INDEX \`IDX_19e950e4a945bf2bbba04a1302\``);
    }

}
