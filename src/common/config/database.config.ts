import { registerAs } from '@nestjs/config';
import { DatabaseConfigInterface } from '../interfaces';

export default registerAs<DatabaseConfigInterface>('database', () => ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
}));
