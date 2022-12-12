import {MigrationInterface, QueryRunner} from "typeorm";

export class init1670866429194 implements MigrationInterface {
    name = 'init1670866429194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uniswap_v2_pairs_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "uniswapCreatedAtTimeStamp" TIMESTAMP NOT NULL, "pairId" character varying NOT NULL, "token0Id" character varying NOT NULL, "token1Id" character varying NOT NULL, CONSTRAINT "PK_97077e1c349078ae6a9df70c858" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "uniswap_v2_pairs_entity"`);
    }

}
