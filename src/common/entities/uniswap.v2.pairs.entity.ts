import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class UniswapV2PairsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  created_at: Date;
  @Column()
  uniswapCreatedAtTimeStamp: Date;
  @Column()
  pairId: string;
  @Column()
  token0Id: string;
  @Column()
  token1Id: string;
}
