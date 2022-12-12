import { registerAs } from '@nestjs/config';
import { CronConfigInterface } from '../interfaces';

export default registerAs<CronConfigInterface>('cron', () => ({
  interval: process.env.CRON_INTERVAL,
}));
