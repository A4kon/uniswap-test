import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronConfigInterface } from 'src/common/interfaces';
import { UniswapCronService } from './crons/query-uniswap.job';

@Injectable()
export class JobsService {
  private cronConfig: CronConfigInterface;
  private readonly logger = new Logger(JobsService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly uniswapQueryService: UniswapCronService,
  ) {
    const cronConfig = this.configService.get<CronConfigInterface>('cron');
    if (!cronConfig) {
      throw new NotFoundException('Cron Config Not Found');
    } else {
      this.cronConfig = cronConfig;
    }
  }
  async onModuleInit() {
    await this.declareUniswapCronService(
      'handleCronUniswapQuery',
      this.cronConfig.interval,
    );
  }
  async declareUniswapCronService(name: string, interval: string) {
    // Optionally fetch declared services and intervals from db and start the via for loop
    const job = new CronJob(interval, async () => {
      await this.uniswapQueryService.handleCronUniswapQuery();
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} with ${interval} scheduled!`);
  }
}
