import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniswapV2PairsEntity } from 'src/common/entities/uniswap.v2.pairs.entity';
import { UniswapCronService } from './crons/query-uniswap.job';
import { JobsService } from './jobs.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UniswapV2PairsEntity])], // <-- here
  providers: [JobsService, UniswapCronService],
})
export class JobsModule {}
