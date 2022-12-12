import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cronConfig, databaseConfig, uniswapConfig } from './common/config';
import { UniswapV2PairsEntity } from './common/entities/uniswap.v2.pairs.entity';
import { DatabaseConfigInterface } from './common/interfaces';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    JobsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [databaseConfig, cronConfig, uniswapConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfigInterface>('database');
        return {
          type: 'postgres' as const,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          entities: [UniswapV2PairsEntity],
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
